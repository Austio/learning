<template>
<div>
  <label for="email">Email</label>
  <input
    id="email"
    v-model="email"
    placeholder="you@example.com"
    type="text"
  />

  <label for="newsletter">Receive our Newsletter</label>
  <input id="newsletter" v-model="receiveNewsletter" type="checkbox" />

  <Pickdate v-model="date" />
  <button @click="() => this.showCancelConfirmModal = true">Close Account</button>
  <button @click="handleSave">Save</button>
  <button @click="() => this.$emit('close')">Close</button>


  <Modal v-if="showCancelConfirmModal" @close="() => this.showCancelConfirmModal = false" />
</div>
</template>

<script>
  import Pickdate from '~/components/Pickdate.vue';
  import Modal from '~/components/Modal.vue';

  export default {
    name: "AccountSettings",
    components: { Pickdate, Modal },
    data() {
      return {
        email: '',
        receiveNewsletter: false,
        date: '',
        showCancelConfirmModal: false,
      };
    },
    methods: {
      handleSave() {
        console.log({ email: this.email, receive: this.receiveNewsletter, date: this.date });
      }
    }
  }
</script>

<style scoped>

</style>
