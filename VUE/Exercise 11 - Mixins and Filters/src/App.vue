<template>
    <div class="container">
        <div class="row">
            <div class="col-xs-12 col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3">
                <h1>Filters & Mixins</h1>

                <input
                  v-model="text"
                />
                <br>
                reversed-local: {{ text | reverse }}
                <br>
                global: {{ text | global-count-it }}
                <br>
                Computed
                <br>
                reversed: {{ reverseComputed }}
                <br>
                count: {{ countComputed }}
                <!-- Exercise 3 -->
                <!-- Do the same as in Exercises 1 & 2, now with Computed Properties -->

                <!-- Exercise 4 -->
                <!-- Share the Computed Property rebuilding Exercise 2 via a Mixin -->
            </div>
        </div>
    </div>
</template>

<script>
    export default {
      data() {
        return {
          text: 'asdf'
        }
      },
      filters: {
        reverse(str) {
          return str.split('').reverse().join('');
        }
      },
      computed: {
        reverseComputed() {
          return this.text.split('').reverse().join('');
        },
        countComputed() {
          return `${this.text} (${this.text.length})`
        }
      }
    }
</script>

<style>
</style>
