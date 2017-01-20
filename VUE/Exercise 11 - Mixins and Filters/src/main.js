import Vue from 'vue'
import App from './App.vue'

Vue.filter('global-count-it', function(str) {
  return `${str} (${str.length})`;
});


Vue.mixin({
    created() {
        console.log('Global Mixin - Created Hook');
    }
});

new Vue({
  el: '#app',
  render: h => h(App)
})
