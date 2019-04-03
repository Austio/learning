<template>
  <div>
    <label>Select a Date</label>
    <input ref="pickdate" :value="value" />
  </div>
</template>

<script>
let Pikaday;
if (process.client) {
  Pikaday = require("pikaday");
}

export default {
  name: "PickdateVue",
  props: {
    value: {
      type: String,
      required: true
    },
    format: {
      type: String,
      default: "YYYY-MM-DD"
    }
  },
  data() {
    return {
      pikaday: null
    };
  },
  mounted() {
    this.pikaday = new Pikaday({
      format: this.format,
      field: this.$refs.pickdate
    });
  }
};
</script>

<style scoped></style>
