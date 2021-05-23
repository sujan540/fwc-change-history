<template>
  <td class='data-grid-cell' :class='[column.columnClass, column.cellClass]'>
    <component
      :is="cellType"
      v-bind='properties'/>
  </td>
</template>

<script>
import { some } from 'lodash';
import formats from './cell-formats';

export default {
  name: 'data-grid-cell',
  components: formats,
  props: {
    column: {
      type: Object,
      required: true
    },
    format: {
      type: String
    },
    rowData: {
      type: Object
    }
  },
  computed: {
    properties() {
      return {
        column: this.column,
        rowData: this.rowData,
        cellData: this.cellData
      };
    },
    cellData() {
      if (this.rowData && this.column && this.column.fieldName) {
        return this.rowData[this.column.fieldName];
      }
      return undefined;
    },
    cellType() {
      if (this.column.slot) return 'slot-cell';
      if (!this.column.format) return 'default-cell';

      const { format } = this.column;
      const cellFormatExists = some(this.$options.components, component => component.name === `${format}-cell`);

      if (cellFormatExists) {
        return `${format}-cell`;
      }

      console.warn(`Could not find cell format '${format}-cell' using 'default-cell' instead`);
      return 'default-cell';
    }
  }
};
</script>
