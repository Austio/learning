<template>
    <div>
        <input
                id="firstname"
                type="firstname"
                class="form-control"
                v-model="firstname"
                @input="emitData"
        />
        <label for="firstname">First Name</label>
        <input
                id="lastname"
                type="lastname"
                class="form-control"
                v-model="lastname"
                @input="emitData"
        />
        <label for="lastname">Last Name</label>
    </div>
</template>
<style>
</style>
<script>
    export default{
      props: ['fullname'],
      data() {
        return {
          firstname: '',
          lastname: ''
        }
      },
      methods: {
        emitData() {
          this.$emit('input', `${this.firstname} ${this.lastname}`.trim())
        }
      }
    }
</script>
