<template>
  <div style="opacity: .5;">
    <button @click="showModal = true">Show Account Form Modal</button>

    {{ date }}

    <Modal v-if="showModal">
      <AccountSettings @close="showModal = false"/>
    </Modal>
  </div>
</template>

<script>
  import Modal from '~/components/Modal.vue';
  import AccountSettings from "~/components/AccountSettings";

  export default {
    name: "portal_modal.vue",
    components: { AccountSettings, Modal },
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
