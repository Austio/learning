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
             </div>
        </div>
    </div>
</template>

<script>
    export default {
    }
</script>

<style>
</style>
