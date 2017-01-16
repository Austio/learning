<template>
    <div>
      <div v-for="quote in quotes">
        {{ quote.text }}
      </div>
    </div>
</template>
<style>
</style>
<script>
  import { quoteStore } from '../main.js';
  import { Quote } from './Quote.vue';
    export default{
        data(){
          return {
            quotes: quoteStore.quotes
          }
        },
        components: {
          Quote
        }
    }
</script>
