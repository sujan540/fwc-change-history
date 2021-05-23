<template>
  <th class='data-grid-header' :class='[headerClass, columnClass]'>
    <slot/>
    <slot v-if='false' name='cell'/>
  </th>
</template>

<script>
import { camelCase, mapKeys } from 'lodash';

export default {
  name: 'data-grid-column',
  inject: ['registerColumn'],
  props: {
    fieldName: {
      type: String
    },
    dataType: {
      type: String,
      default: 'string'
    },
    columnClass: {
      default: ''
    },
    headerClass: {
      default: ''
    },
    cellClass: {
      default: ''
    }
  },
  mounted() {
    const attributes = mapKeys(this.$attrs, (attribute, key) => camelCase(key));
    const column = { ...attributes, ...this.$props };
    if (this.$scopedSlots.cell) {
      column.slot = this.$scopedSlots.cell;
    }
    this.registerColumn(column);
  }
};
</script>
