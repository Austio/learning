<template>
    <div class="container">
        <server-header></server-header>

        <hr>
        <div class="row">
            <div class="col-xs-12 col-sm-6">
                <ul class="list-group">
                    <server-details v-for="s in 5"></server-details>
                </ul>
            </div>
        </div>

        <server-status></server-status>
        <hr>
        <server-footer></server-footer>
    </div>
</template>

<script>
    import LocalServerStatus from './components/ServerStatus.vue';
    import ServerHeader from './components/ServerHeader.vue';
    import ServerFooter from './components/ServerFooter.vue';
    import ServerDetails from './components/ServerDetails.vue';

    export default {
      components: {
        'server-status': LocalServerStatus,
        'server-header': ServerHeader,
        'server-footer': ServerFooter,
        'server-details': ServerDetails
      }
    }
</script>
