function Character(name, specialAttackMultiplier, strength, health) {
  this.specialAttackMultiplier = specialAttackMultiplier || 1;
  this.strength = strength || 5;
  this.health = health || 100;
  this.attackDamage = curriedNumberMultiplier(this.strength);
  this.name = name;
  
  this.heal = function() {
    var healAmount = curriedNumberMultiplier(this.strength)(2);
    
    this.health = this.health + healAmount;
    return healAmount;
  }
}


function setupGame() {
  player = new Character('player', 1.5);
  monster = new Character('monster');
}

function attack(attacker, attackee, multiplier) {
  var damage = attacker.attackDamage(multiplier);
  
  attackee.health = attackee.health - damage;
  return damage;
}

function attackWithLogging(vm, attacker, attackee, multipler) {
  var damage = attack(attacker, attackee, multipler);
  var logMessage = attacker.name + ' attacked ' + attackee.name + ' for ' + damage + ' damage.'
  
  vm.actions.push({character: attacker.name, activity: logMessage});
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
    actions: [{character: 'player', activity: 'stuff'}]
  },
  methods: {
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
      console.log('i give')
    }
  }
});
