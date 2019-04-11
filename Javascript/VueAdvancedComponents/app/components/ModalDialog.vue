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
  <AccountSettingsDeleteConfirmationButton />
  <button @click="handleSave">Save</button>
  <button @click="() => this.$emit('close')">Close</button>
</div>
</template>

<script>
  import AccountSettingsDeleteConfirmationButton from '~/components/AccountSettingsDeleteConfirmationButton';
  import Pickdate from '~/components/Pickdate.vue';

  export default {
    name: "AccountSettings",
    components: { AccountSettingsDeleteConfirmationButton, Pickdate },
    data() {
      return {
        email: '',
        receiveNewsletter: false,
        date: '',
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
