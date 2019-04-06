<template>
  <div class="modal-backdrop">
    <div class="modal">
      <slot>
        <h1 class="text-center">This is a modal</h1>
        <p class="text-center">This is the content!</p>
        <button @click="() => this.$emit('close')" class="float-right">Close</button>
        <button @click="() => this.$emit('close')">Confirm</button>
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "Modal",
  data() {
    return {
      overflowOriginal: null,
    };
  },
  beforeMount() {
    this.overflowOriginal = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
  },
  mounted() {
    this.escapeHandler = (e) => {
      if (e.key === "Escape") {
        this.$emit('close');
      }
    };

    document.addEventListener('keydown', this.escapeHandler);
    this.$once('hook:destroyed', () => {
      document.removeEventListener('keydown', this.escapeHandler);
    })
  },
  beforeDestroy() {
    document.body.style.overflow = this.overflowOriginal;
  }
};
</script>

<style scoped>
.float-right {
  float: right;
}
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
  background-color: #fff;
  border-radius: 0.25rem;
  padding: 2rem;
  -webkit-box-shadow: 0 15px 30px 0 rgba(0, 0, 0, 0.11),
    0 5px 15px 0 rgba(0, 0, 0, 0.08);
  box-shadow: 0 15px 30px 0 rgba(0, 0, 0, 0.11),
    0 5px 15px 0 rgba(0, 0, 0, 0.08);
}
h1{font-size:2em;margin:0.67em 0;}
*,:after,:before{-webkit-box-sizing:inherit;box-sizing:inherit;}
h1{margin:0;}
*,:after,:before{border:0 solid #dae1e7;}
.text-center{text-align:center;}
</style>
