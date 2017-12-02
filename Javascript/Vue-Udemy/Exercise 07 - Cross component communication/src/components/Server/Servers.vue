<template>
    <div class="col-xs-12 col-sm-6">
        <ul class="list-group">
            <li
                    class="list-group-item"
                    v-for="server in serversList"
                    :class="{selected: (server.id === selectedServer) }"
                    @click="setServer(server.id)"
            >
                Server {{ server.name }}
            </li>
        </ul>
    </div>
</template>

<script>
  import { eventBus } from '../../main.js';
  export default ({
    props: ['serversList', 'selectedServer'],
    computed: {
      isSelected() {
        return this.server ? (this.server.id === this.selectedServer) : false;
      }
    },
    methods: {
      setServer(sid) {
        eventBus.$emit('serverSelected', sid)
      }
    }
  });
</script>

<style scoped>
  .selected {
    background-color: #ece8e8
  }
</style>
