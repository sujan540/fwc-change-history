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
  name: 'date-time-cell',
  computed: {
    formattedValue() {
      const dateFormat = this.column.dateFormat || 'M/D/YYYY h:mm A';
      return this.value ? moment(this.value).format(dateFormat) : '';
    }
  }
};
</script>
