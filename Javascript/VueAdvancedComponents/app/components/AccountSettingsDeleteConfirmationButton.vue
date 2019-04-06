<template>
  <button @click="() => this.showCancelConfirmModal = true">Close Account

    <portal to="modals" v-if="showCancelConfirmModal">
      <Modal @close="() => this.showCancelConfirmModal = false" />
    </portal>
  </button>
</template>

<script>
  import Pickdate from '~/components/Pickdate.vue';
  import Modal from '~/components/Modal.vue';

  export default {
    name: "AccountSettingsDeleteConfirmationButton",
    components: { Modal },
    data() {
      return {
        showCancelConfirmModal: false,
      };
    },
  }
</script>

<style scoped>

</style>
