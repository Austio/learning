<template>
    <div class="container">
        <div class="row">
            <div class="col-xs-12 col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3">
                <h1>Directives Exercise</h1>
                <!-- Exercise -->
                <!-- Build a Custom Directive which works like v-on (Listen for Events) -->
               <div v-my-on:click="fooFunction">My Custom Directive!</div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
      directives: {
        'my-on': {
          bind(el, bindings, vnode){
            let listener = bindings.arg;
            let func = vnode.context[bindings.expression];

            el.addEventListener(listener, func)
          }
        }
      },
      data() {
        return {
          fooValue: 'Howdy',
        }
      },
      methods: {
        fooFunction() {
          alert(this.fooValue);
        }
      }
    }
</script>

<style>
</style>
