<template>
  <div>
    <svg v-if="value" v-on:click="openCommentPanelAndScroll(commentId)" class="xds-icon icon-small"><use xlink:href="#xds-icon-chat-filled" /></svg>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import abstractCell from './AbstractCell';

const mapComments = createNamespacedHelpers('comments');

export default {
  data() {
    return {
      commentId: this.cellData
    };
  },
  mixins: [abstractCell],
  name: 'comment-cell',
  methods: {
    ...mapComments.mapMutations(['openCommentPanelAndScroll'])
  }
};
</script>
