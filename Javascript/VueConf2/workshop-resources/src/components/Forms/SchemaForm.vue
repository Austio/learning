<template>
  <form class="schema-form">
    <component
      v-for="(field, property) in schema"
      :key="property"
      :is="field.component"
      v-bind="{ ...field }"
      :value="value[property]"
      @input="update(property, $event)"
    />
    <slot/>
  </form>
</template>

<script>
import FormCheckbox from './FormCheckbox'
import FormText from './FormText'
import FormSelect from './FormSelect'

export default {
  components: {
    FormCheckbox,
    FormText,
    FormSelect,
  },
  props: {
    schema: {
      type: Object,
      required: true
    },
    value: {
      type: Object,
      required: true
    }
  },
  methods: {
    update (property, value) {
      this.$emit('input', {
        ...this.values,
        [property]: value
      })
    }
  }
}
</script>

<style lang="sass">
.schema-form
  width: 250px
  margin: 0 auto
  text-align: left

  label
    font-weight: bold
    font-size: 0.9rem
    display: block

  input
    padding: 8px 10px
    border-radius: 3px
    border: 1px solid #ccc
    margin-bottom: 1rem
    width: 100%
    font-size: 1rem

  input[type="checkbox"]
    width: auto
</style>
