<template>
  <div class="modal-backdrop">
    <div class="modal">
      This is a modal
      <button>Close</button>
      <button>Confirm</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Modal"
};
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: auto;
  padding: 2rem;
  background-color: rgba(0, 0, 0, 0.5);
}
.modal {
  margin-left: auto;
  margin-right: auto;
  max-width: 30rem;
  margin-top: 2rem;
}
</style>
