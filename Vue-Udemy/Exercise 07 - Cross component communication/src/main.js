import Vue from 'vue'
import App from './App.vue'

const eventBus = new Vue({});

new Vue({
  el: '#app',
  render: h => h(App)
});

export { eventBus };
