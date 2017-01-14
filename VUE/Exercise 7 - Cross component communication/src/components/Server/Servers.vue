<template>
    <div class="col-xs-12 col-sm-6">
        <ul class="list-group">
            <li
                    class="list-group-item"
                    v-for="server in serversList"
                    :class="{ selected: server.id === selectedServer }"
            >
                Server {{ server.name }}
            </li>
        </ul>
    </div>
</template>

<script>
  export default ({
    props: ['serversList', 'selectedServer']
  });
</script>

<style scoped>
  .selected {
    background-color: #ece8e8
  }
</style>
