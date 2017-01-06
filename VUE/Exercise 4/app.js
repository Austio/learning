new Vue({
  el: '#exercise',
  data: {
    applyEffect: true,
    highlightClass: 'highlight',
    unHighlightClass: 'unhighlight',
    userClass: '',
    userExtraClass: false,
    progressBar: ''
  },
  methods: {
    startEffect: function() {
      var vm = this;
      setInterval( function() {
        vm.applyEffect = !vm.applyEffect;
      }, 1500)
    },
    startProgress: function() {
      var vm = this;
  
      vm.progress = setInterval( function() {
        vm.progressBar = vm.progressBar + '-';
        
        if (vm.progress && vm.progressBar.length >= 10) {
          clearInterval(vm.progress);
        }
          
      }, 1500)
    
    }
  }
});
