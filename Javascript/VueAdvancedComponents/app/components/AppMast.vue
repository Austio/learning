<template>
  <header class="Header">
    <nuxt-link class="Header__Logo" to="/">
      <h1 class="Header__Logo__Text">link</h1>
    </nuxt-link>

    <div class="Header__Menu">
      <ul class="Menu">
        <li class="Menu__Item">
          <nuxt-link class="Menu__Item__Link" to="/controlled_component">
            Controlled Component - 3rd Party
          </nuxt-link>
        </li>
      </ul>
    </div>
  </header>
</template>

<script>
export default {
  name: "AppMast"
};
</script>

<style scoped></style>
