new Vue({
        el: '#exercise',
        data: {
            value: 0
        },
        computed: {
          result: function() {
            return this.value === 37 ? "done" : "not there yet";
          }
        },
        watch: {
          value: function(val) {
            var vm = this;
            var newVal = val;
            setTimeout(function() {
              // var vmInside = vm;
              console.log(vm);
              // vm.value = 0;
            }, 1000)
          }
        }
    });
