<template>
  <div style="opacity: .5;">
    <button @click="showModal = true">Show Modal</button>

    {{ date }}

    <Modal
      v-if="showModal"
      @close="showModal = false"
      @confirm="showModal = false">
      <Pickdate v-model="date"></Pickdate>
    </Modal>
  </div>
</template>

<script>
  import Modal from '~/components/Modal.vue';
  import Pickdate from '~/components/Pickdate.vue';

  export default {
    name: "portal_modal.vue",
    components: { Pickdate, Modal },
    data() {
      return {
        showModal: false,
        date: '',
      };
    },
  }
</script>

<style scoped>

</style>
