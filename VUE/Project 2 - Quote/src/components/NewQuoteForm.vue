<template>
    <div>
      <input v-model="quoteText">
      <button @click='submitQuote'>Submit</button>
    </div>
</template>
<style>
</style>
<script>
  import { quoteStore } from '../main.js';
    export default{
      data() {
        return {
          quoteText: '',
        }
      },
      methods: {
        submitQuote() {
          var vm = this;

          quoteStore.addQuote(vm.quoteText);
          vm.quoteText = '';
        }
      }
    }
</script>
