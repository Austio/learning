<template>
  <div>
    <div>Value is {{ date }}</div>
    <Pickdate v-model="date" />
  </div>
</template>

<script>
import Pickdate from "~/components/Pickdate";

export default {
  name: "ControlledComponentGood",
  components: { Pickdate },
  data() {
    return {
      date: "2008-12-12"
    };
  }
};
</script>

<style scoped></style>
