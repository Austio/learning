<template>
    <div>
      Progress Bar
      {{ totalQuotes }} Quotes
    </div>
</template>
        <style>
</style>
<script>
  import { quoteStore } from '../main.js';

    export default{
      computed: {
        totalQuotes() {
          return quoteStore.totalQuotes;
        }
      }
    }
</script>
