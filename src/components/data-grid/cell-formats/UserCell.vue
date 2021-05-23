<template>
  <Avatar v-if="value" :user="value" :eidProp="column.eidProp" :showEid="false"> </Avatar>
</template>

<script>
import Avatar from '@/components/Avatar.vue';
import abstractCell from './AbstractCell';

export default {
  name: 'user-cell',
  mixins: [abstractCell],
  components: { Avatar }
};
</script>
