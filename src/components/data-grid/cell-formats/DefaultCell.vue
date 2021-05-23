<template>
  <div>{{ cellData }}</div>
</template>

<script>
import abstractCell from './AbstractCell';

export default {
  mixins: [abstractCell]
};
</script>
