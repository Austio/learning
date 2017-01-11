import Vue from 'vue'
import App from './App.vue'
// import Server from './components/Server.vue';

var Child = {
  template: '<div>A custom component!</div>'
}

new Vue({
  el: '#app',
  render: h => h(App)
})

