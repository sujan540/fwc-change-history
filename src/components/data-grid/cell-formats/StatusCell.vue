<template>
  <status-tag :status="value" :title-field-name="`${this.column.entityName}StatusTitle`" :code-field-name="`${this.column.entityName}StatusCode`" />
</template>

<script>
import StatusTag from '@/components/StatusTag.vue';
import abstractCell from './AbstractCell';

export default {
  mixins: [abstractCell],
  components: { StatusTag },
  name: 'status-cell'
};
</script>
