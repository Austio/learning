<template>
  <div class="container">
    <AppMast />
    <article class="row">
      <nuxt />
    </article>

    <portal-target name="modals" />

  </div>
</template>

<script>
import AppMast from "../components/AppMast";

export default {
  components: { AppMast }
};
</script>

<style src="../assets/css/app.css"></style>
