<template>
    <div>
      <input v-model="quoteText">
      <button @click='submitQuote' :disabled='canSubmit' :style="{disabled: canSubmit}">Submit</button>
    </div>
</template>
<style scoped>
  .disabled {
    opacity: 0.2;
    color: red;
  }
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
          quoteStore.addQuote(this.quoteText);
          this.quoteText = '';
        }
      },
      computed: {
        canSubmit() {
          return this.quoteText === '';
        }
      }
    }
</script>
