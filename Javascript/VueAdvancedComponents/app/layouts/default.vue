<template>
  <div class="continer">
    <AppMast />
    <article class="row">
      <nuxt />
    </article>
  </div>
</template>

<script>
import AppMast from "../components/AppMast";

export default {
  components: { AppMast }
};
</script>

<style src="../assets/css/app.css"></style>
