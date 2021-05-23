<template>
  <div>
    <div class='primary-value'>
      {{ value }}
    </div>
    <div class='secondary-value'>
      {{ secondaryValue }}
    </div>
  </div>
</template>

<script>
import abstractCell from './AbstractCell';

export default {
  mixins: [abstractCell],
  name: 'tile-cell',
  computed: {
    secondaryValue() {
      return this.rowData[this.column.secondaryFieldName];
    }
  }
};
</script>

<style scoped>
  .primary-value {
    @apply font-bold;
  }
  .secondary-value {
    @apply text-xs;
  }
</style>
