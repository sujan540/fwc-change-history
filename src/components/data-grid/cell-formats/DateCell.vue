<template>
  <div>
    {{ formattedValue }}
  </div>
</template>

<script>
import moment from 'moment';
import abstractCell from './AbstractCell';

export default {
  mixins: [abstractCell],
  name: 'date-cell',
  computed: {
    formattedValue() {
      const dateFormat = this.column.dateFormat || 'M/D/YYYY';
      return this.value ? moment(this.value).format(dateFormat) : '';
    }
  }
};
</script>
