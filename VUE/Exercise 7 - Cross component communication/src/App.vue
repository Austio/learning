<template>
    <div class="container">
        <app-header></app-header>
        <hr>
        <div class="row">
            <servers :serversList='serversList' :selectedServer='selectedServer' :selectServer='selectServer'></servers>
            <app-server-details :server='currentlySelectedServer'></app-server-details>
        </div>
        <hr>
        <app-footer></app-footer>
    </div>
</template>

<script>
    import Header from './components/Shared/Header.vue';
    import Footer from './components/Shared/Footer.vue';
    import Servers from './components/Server/Servers.vue';
    import ServerDetails from './components/Server/ServerDetails.vue';

    export default {
        components: {
            appHeader: Header,
            Servers,
            'app-server-details': ServerDetails,
            'app-footer': Footer
        },
        data() {
          return {
           selectedServer: 1,
           serversList: [
             { name: 'John', id: 1 },
             { name: 'Tywin', id: 2 },
             { name: 'Tyrion', id: 3 },
             { name: 'Magnar', id: 4 },
             { name: 'Hank', id: 5 }
           ]
        }
      },
      methods: {
        selectServer(id) {
          this.selectedServer = id;
        }
      },
      computed: {
        currentlySelectedServer() {
          return this.serversList.find(s => s.id === this.selectedServer)
        }
      }
    }
</script>

<style>

</style>
