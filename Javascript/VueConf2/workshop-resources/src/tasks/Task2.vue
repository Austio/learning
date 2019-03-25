<template>
  <div>
    <h1>Task 2: Reusable Component Composition</h1>
    <ol class="steps">
      <li>
        Create a ConfirmationModal.vue that uses AppModal to that accepts a question and contains two buttons: "Confirm" and "Cancel"
      </li>
      <li>
        Make the ConfirmationModal component emit a 'confirm' event when clicked on 'Confirm' button. And a 'close' event when clicking on 'Cancel'.
      </li>
      <li>
        Display the confirmation question before the button, similar to the example below.
      </li>
      <li>
        Make sure the ConfirmationModal looks like the example below, this includes the H3 styling and buttons positioning.
      </li>
    </ol>

    <AppButton
      @click="isModalOpen = true"
      type="danger"
    >
      Don’t push that there!
    </AppButton>

    <ConfirmationModal
      v-if="isModalOpen"
      message="Have you finished the task?"
      @confirm="confirm"
      @close="isModalOpen = false"
    />
  </div>
</template>

<script>
import ConfirmationModal from '@/components/ConfirmationModal';

export default {
  components: {
    ConfirmationModal,
  },
  data () {
    return {
      isModalOpen: false
    }
  },
  methods: {
    confirm () {
      alert('Why would you do that?')
      this.isModalOpen = false
    }
  }
}
</script>

<style lang="sass">
.buttons
  margin-top: 1rem
  text-align: left

  button
    margin-right: 1rem

.steps
  max-width: 30rem
  text-align: left
  margin: 0 auto 4rem
  line-height: 1.6
</style>
