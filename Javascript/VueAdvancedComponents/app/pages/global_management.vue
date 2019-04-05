<template>
  <div>
    <button @click="() => (showModal = true)">Show Modal?</button>
    <Modal v-if="showModal" @close="() => (showModal = false)" />
    <div v-for="i in textLoop" :key="i">
      <br />
      <br />
      <br />
      Stuff {{ i }}
      <br />
      <br />
      <br />
      Stuff lines and lines of stuff
    </div>
  </div>
</template>

<script>
import Modal from "~/components/Modal";

export default {
  name: "GlobalManagement",
  components: {
    Modal
  },
  data() {
    return {
      showModal: false,
      textLoop: [1, 2, 3, 4, 5, 6]
    };
  }
};
</script>
