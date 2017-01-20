import Vue from 'vue'
import App from './App.vue'

Vue.filter('global-count-it', function(str) {
  return `${str} (${str.length})`;
});

Vue.mixin({
  created() {
      console.log('Global Mixin - Created Hook');
  },
  data() {
    return {
      text: 'asdf'
    }
  },
  filters: {
    reverse(str) {
      return str.split('').reverse().join('');
    }
  },
  computed: {
    reverseComputed() {
      return this.text.split('').reverse().join('');
    },
    countComputed() {
      return `${this.text} (${this.text.length})`
    }
  }
});

new Vue({
  el: '#app',
  render: h => h(App)
})

export { mixedFoo };
