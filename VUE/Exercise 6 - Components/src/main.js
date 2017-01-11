import Vue from 'vue'
import App from './App.vue'
// import Server from './components/Server.vue';

Vue.component('server', {
  template: '<div>Foo</div>'
});

new Vue({
  el: '#app',
  render: h => h(App)
})

