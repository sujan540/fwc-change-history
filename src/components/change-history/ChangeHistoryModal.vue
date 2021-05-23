<template>
  <modal
    :data-test-id="dataTestId"
    :is-active="isActive"
    :size="size"
    :title="title"
    :actions="[]"
    @close="$emit('close')"
    closeButtonText="Close"
  >
    <div slot="body">
      <div class="before-text">
        <strong>Before</strong>
      </div>
      <div class="after-text">
        <strong>After</strong>
      </div>
      <div class="popup-modal flex">
        <div class="pull-left overflow-clip flex">
          <div
            :class="{ scrollable: isScrollable }"
            :data-test-id="`${dataTestId}Left`"
          >
            <slot name="left" />
          </div>
        </div>
        <div class="pull-middle flex">
          <svg class="arrow-forward">
            <use xlink:href="#xds-icon-arrow-forward" />
          </svg>
        </div>
        <div class="pull-right overflow-clip flex">
          <div
            :class="{ scrollable: isScrollable }"
            :data-test-id="`${dataTestId}Right`"
          >
            <slot name="right" />
          </div>
        </div>
      </div>
    </div>
  </modal>
</template>

<script>
import Modal from '@/components/Modal.vue';
import { SectionLabel } from './ChangeHistoryConstant';

export default {
  name: 'ControlChangeModal',
  components: {
    Modal
  },
  props: {
    dataTestId: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      required: true
    },
    isActive: {
      type: Boolean,
      default: false
    },
    isScrollable: {
      type: Boolean,
      default: true
    },
    size: {
      type: String,
      default: 'xlarge'
    }
  },
  data() {
    return {
      SectionLabel
    };
  }
};
</script>

<style scoped>
@import '../../../../../src/assets/style/color.css';
.before-text {
  width: 53%;
  padding: 5px;
  float: left;
}

.after-text {
  padding: 5px;
}

.scrollable {
  background-color: var(--gray-color);
  border-radius: 5px;
  border: 1px solid var(--gray-color);
  overflow: scroll;
  max-height: 500px;
  width: 100%;
}

.pull-left {
  float: left;
  width: 47%;
}

.pull-middle {
  margin-top: auto;
  margin-bottom: auto;
  top: 0;
  bottom: 0;
  width: 6%;
  float: left;
}

.pull-right {
  float: left;
  width: 47%;
}

::-webkit-scrollbar {
  -webkit-appearance: none;
  width: 10px;
  height: 100%;
}

::-webkit-scrollbar-thumb {
  border-radius: 5px;
  background-color: rgba(0, 0, 0, 0.5);
  -webkit-box-shadow: 0 0 1px rgba(255, 255, 255, 0.5);
}

/deep/ .xds-button {
  width: 60px;
  float: right;
}

/deep/ button:hover {
  background-color: var(--white-color);
}
</style>
