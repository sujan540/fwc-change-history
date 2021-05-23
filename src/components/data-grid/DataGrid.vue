<template>
  <table :class="tableClass">
    <thead>
      <tr>
        <slot></slot>
      </tr>
    </thead>
    <tbody>
      <template v-for="(row, i) in rows">
        <tr
          :key="i"
          :class="{ hoverable: clickable, read: row.isRead }"
          @click="onClick(row, i)"
          v-if="!row.open"
        >
          <data-grid-cell
            ref="cell"
            v-for="(column, j) in columns"
            :key="j"
            :column="column"
            :row-data="row"
            @click.native="onClickCell(row, i, j)"
          />
        </tr>
        <tr :key="`${i}-accordion`" v-if="row.open">
          <slot name="accordion" :data="row"></slot>
        </tr>
      </template>
    </tbody>
  </table>
</template>

<script>
import DataGridCell from '@/components/data-grid/DataGridCell.vue';

export default {
  name: 'data-grid',
  components: {
    DataGridCell
  },
  props: {
    rowData: {
      // eslint-disable-next-line
      type: Array | Object
    },
    tableClass: {
      default: 'table'
    },
    clickable: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      columns: []
    };
  },
  computed: {
    rows() {
      return this.rowData || [];
    }
  },
  methods: {
    onClick(row, index) {
      if (this.clickable) {
        this.$emit('click-row', row, index);
      }
    },
    onClickCell(row, index, column) {
      if (this.clickable) {
        this.$emit('click-cell', row, index, column);
      }
    },
    registerColumn(column) {
      this.columns.push(column);
    }
  },
  provide() {
    return {
      registerColumn: this.registerColumn
    };
  }
};
</script>

<style lang="scss" scoped>
tr.hoverable {
  &:hover {
    @apply cursor-pointer;
    background: theme('colors.neutral-lighter');
  }
}

.read {
  background-color: theme('colors.grey-light');
}

.accordion thead,
.accordion thead > *,
.accordion tbody > * {
  border-top: none;
  border-bottom: none;
}
</style>
