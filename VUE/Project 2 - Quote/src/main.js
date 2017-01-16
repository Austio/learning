import Vue from 'vue'
import App from './App.vue'

const quoteStore = new Vue({
  data: {
    quotes: []
  },
  methods: {
    addQuote(data) {
      this.quotes.push({ text: data })
    },
    removeQuote(index) {
      this.quotes.splice(index, 1);
    }
  },
  computed: {
    totalQuotes() {
      return this.quotes.length;
    }
  }
});

new Vue({
  el: '#app',
  render: h => h(App)
})

export { quoteStore };
