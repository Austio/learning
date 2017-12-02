function Character(name, specialAttackMultiplier, strength, health) {
  this.specialAttackMultiplier = specialAttackMultiplier || 1;
  this.strength = strength || 5;
  this.health = health || 100;
  this.originalHealth = this.health;
  this.attackDamage = curriedNumberMultiplier(this.strength);
  this.name = name;
  
  this.heal = function() {
    var healAmount = curriedNumberMultiplier(this.strength)(2);
    
    this.health = this.health + healAmount;
    return healAmount;
  };
  
  this.alive = function() {
    return this.health > 0;
  };
  
  this.healthBar = function() {
    if (!this.alive()) {
      return 'red'
    };

    if (this.healthPercentLeft() < 0.5) {
      return 'orange'
    } else {
      return 'green'
    }
  }

  this.healthWithPercent = function() {
    return this.healthPercentLeft() * 100 + '%';
  }

  this.healthPercentLeft = function() {
    return this.health / this.originalHealth;
  }
}

function attack(attacker, attackee, multiplier) {
  var damage = attacker.attackDamage(multiplier);
  
  attackee.health = attackee.health - damage;
  return damage;
}

function attackWithLogging(vm, attacker, attackee, multipler) {
  var damage = attack(attacker, attackee, multipler);
  var logMessage = attacker.name + ' attacked ' + attackee.name + ' for ' + damage + ' damage.'
  
  vm.actions.unshift({character: attacker.name, activity: logMessage});
}

function curriedNumberMultiplier(strength) {
  return function(multiplier) {
    multiplier = multiplier || 1;
    
    return Math.floor(Math.random() * multiplier * strength);
  }
}

function attackRound(vm, multiplier) {
  // Player attack monster
  attackWithLogging(vm, vm.player, vm.monster, multiplier);
  
  // Monster attack player
  attackWithLogging(vm, vm.monster, vm.player, 1);
}

new Vue({
  el: '#app',
  data: {
    player: new Character('player', 1.5),
    monster: new Character('monster'),
    actions: [],
    stopGame: false,
  },
  methods: {
    startGame: function() {
      var vm = this;
      
      vm.actions = 0;
      vm.player.health = vm.player.originalHealth;
      vm.monster.health = vm.player.originalHealth;
    },
    attack: function() {
      var vm = this;
      
      attackRound(vm, 1)
    },
    specialAttack: function() {
      var vm = this;
  
      attackRound(vm, 2)
    },
    heal: function() {
      var vm = this;
      
      var healAmount = vm.player.heal();
      vm.actions.push({character: vm.player.name, activity: vm.player.name + " Healed " + healAmount});
      attackWithLogging(vm, vm.monster, vm.player, 1);
    },
    giveUp: function() {
      this.stopGame = true;
    }
  },
  computed: {
    gameIsOngoing: function() {
      var x = (this.monster.health > 0 && this.player.health > 0) && !this.stopGame;
      console.log(x, this);
      return x;
    },
  }
});
