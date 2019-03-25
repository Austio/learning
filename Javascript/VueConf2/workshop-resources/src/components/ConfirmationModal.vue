<template>
  <!-- TASK BEGINS HERE -->
  <AppModal>
    <h3 class="confirmation-message">
      {{ message }}
    </h3>
    <div class="buttons">
      <AppButton @click="$emit('confirm')">
        Confirm
      </AppButton>
      <AppButton type="secondary" @click="$emit('cancel')">
        Cancel
      </AppButton>
    </div>
  </AppModal>
</template>

<script>
  import AppModal from '@/components/AppModal';
  export default {
    name: "ConfirmationModal",
  components: { AppModal },
    props: {
      message: String,
    },
}
</script>

<style lang="sass" scoped>
  .confirmation-message
    text-align: left
    margin: 0

</style>
