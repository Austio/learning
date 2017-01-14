<template>
    <div class="col-xs-12 col-sm-6">
        <p>Server Details are currently not updated</p>
        {{ name }} Server Selected
    </div>}
</template>

<script>
    export default({
      props: ['server'],
      computed: {
        name() {
          return this.server ? this.server.name : '';
        }
      }
    })
</script>

<style>

</style>
