<template>
  <div>
    <label :for="label">
      {{ label }}
    </label>
    <AppSelect :options="config.options" v-model="selected">
      <template v-slot:option="{ option }">
        <li>{{ option.display }}</li>
      </template>
      <template v-slot:selected>
        <template v-if="selected">
          {{ option.display }}
        </template>
        <template v-else>
          Select An Element
        </template>
      </template>
    </AppSelect>
  </div>
</template>

<script>
import FormMixin from './FormMixin'
import AppSelect from '../AppSelect'

export default {
  name: 'FormSelect',
  components: { AppSelect },
  mixins: [ FormMixin ],
  data: () => ({
    selected: null
  }),
  props: {
    config: {
      type: Object,
      default: () => ({ type: 'text' })
    }
  }
}
</script>
