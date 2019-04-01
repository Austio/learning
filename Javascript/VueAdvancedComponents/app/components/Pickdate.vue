<template>
  <div>
    <label>Select a Date</label>
    <input ref="pickdate" :value="data" />
  </div>
</template>

<script>
// import Pikaday from "~/plugins/pikaday.client";

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
    // this.pikaday = new Pikaday({
    //   format: this.format,
    //   field: this.$refs.pickdate
    // });
  }
};
</script>

<style scoped></style>
