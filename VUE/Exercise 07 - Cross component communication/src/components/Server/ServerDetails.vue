<template>
    <div class="col-xs-12 col-sm-6">
        <p>Server Details are currently not updated</p>
        {{ server.name }} Server Selected
    </div>}
</template>

<script>
    export default({
      props: {
        'server': {
          required: true
        }
      }
    })
</script>

<style>

</style>
