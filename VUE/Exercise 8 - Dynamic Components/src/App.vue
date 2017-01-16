<template>
    <div class="container">
        <div class="row">
            <div class="col-xs-12">
                <br>
                <button class="btn btn-primary" @click="setComponent('app-blue')">Load Blue Template</button>
                <button class="btn btn-success" @click="setComponent('app-green')">Load Green Template</button>
                <button class="btn btn-danger" @click="setComponent('app-red')">Load Red Template</button>
                <hr>
                <component :is="selectedComponent">
                    <h1> This Title </h1>
                </component>
            </div>
        </div>
    </div>
</template>

<script>
    import Blue from './components/Blue.vue';
    import Green from './components/Green.vue';
    import Red from './components/Red.vue';

    export default {
        components: {
            appBlue: Blue,
            appGreen: Green,
            appRed: Red
        },
        methods: {
          setComponent(comp){
            this.selectedComponent = comp;
            return true;
          }
        },
        data() {
          return {
            selectedComponent: 'app-green',
          }
        }
    }
</script>

<style>
</style>
