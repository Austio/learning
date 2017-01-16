<template>
    <div class='wrapper'>
        <slot></slot>
    </div>
</template>
<style scope>
  .wrapper {
    float: left;
    border: 3px black;
    margin: 10px;
  }
  .quote-text {
    color: grey;
  }

</style>
<script>
    export default{
    }
</script>
