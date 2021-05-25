<template>
  <div class="container">
    <h2 data-test-id="page-header">Change History</h2>
    {{changeHistories}}
  </div>
</template>

<script>
import {getChangeHistories} from '../../services/change-history-service';

export default {
  name: 'ChangeHistory',
  props: {
    entityId: {
      type: String,
      required: true
    },
    entityType: {
      type: String,
      required: true
    },
    baseUrl: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      limit: 10,
      offset: 0,
      changeHistories: []
    }
  },
  mounted() {
    this.changeHistories = getChangeHistories(this.baseUrl,
        this.entityType,
        this.entityId,
        undefined,
        undefined,
        this.offset,
        this.limit);
  }
}
</script>