<template>
    <div>
      <div v-for="(quote, i) in quotes">
        <Quote>
          <p class='quote-text' @click='removeQuote(i)'>
            {{ quote.text }}
          </p>
        </Quote>
      </div>
    </div>
</template>
<style>
</style>
<script>
  import { quoteStore } from '../main.js';
  import Quote from './Quote.vue';
    export default{
        data(){
          return {
            quotes: quoteStore.quotes
          }
        },
        components: {
          Quote
        },
        methods: {
          removeQuote(index) {
            quoteStore.removeQuote(index)
          }
        }
    }
</script>
