new Vue({
  el: '#exercise',
  data: {
    value: ''
  },
  methods: {
    showAlert: function() { alert('Howdy') },
    handleKeyDown: function(event) {
      this.value = event.target.value;
    }
  }
});
