<template>
  <component :is="newsType" />
</template>

<script>
  export default {
    name: "NewsEvent",
    props:  {
      news: {
        type: Object,
        required: true
      }
    }
  }
</script>