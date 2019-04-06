<template>
  <form class="card" @submit.prevent="submit">
    <h4>Controlled Components</h4>

    <label for="email">Email</label>
    <input
      id="email"
      v-model="email"
      placeholder="you@example.com"
      type="text"
    />

    <label for="newsletter">REceive our Newsletter</label>
    <input id="newsletter" v-model="receiveNewsletter" type="checkbox" />

    <Pickdate v-model="date" />

    <button type="submit">Update Settings</button>
  </form>
</template>

<script>
import Pickdate from "~/components/Pickdate";

export default {
  name: "ControlledComponentGood",
  components: { Pickdate },
  data() {
    return {
      date: "2008-12-12",
      receiveNewsletter: false,
      email: ""
    };
  }
};
</script>

<style scoped></style>
