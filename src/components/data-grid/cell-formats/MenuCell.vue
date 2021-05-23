<template>
  <div class="menuCell">
    <svg
      id="menu-icon"
      class="xds-icon icon-large"
      @click="openModalSmall(dropdownOpen)"
    >
      <use xlink:href="#gravity-ui-lined-overflow-vertical-1-24" />
    </svg>
    <div class="dropdownMenu">
      <div
        v-show="dropdownOpen"
        class="absolute bg-white rounded shadow-heavy"
        :class="dropdownOpen ? 'dropDownMyClass' : ''"
      >
        <ul class="list-none m-0">
          <li
            :aria-label="unreadOption.buttonText"
            :class="unreadOption.buttonType"
            @click="markNotification(unreadOption.status)"
            class="whitespace-no-wrap my-6 mx-8"
            id="unread-button"
          >
            <a tabindex="0" data-test-id="MenuCellUnreadOption">{{
              unreadOption.buttonText
            }}</a>
          </li>
          <li
            :aria-label="deleteOption.buttonText"
            :class="deleteOption.buttonType"
            @click="openDeleteModal()"
            class="whitespace-no-wrap my-6 mx-8"
            id="delete-button"
          >
            <a tabindex="0">{{ deleteOption.buttonText }}</a>
          </li>
        </ul>
      </div>
    </div>
    <gwc-dialog
      ref="menuCellDialog"
      overlay="dark"
      :open="isModalVisible"
      @close="onClose"
      :type="'decision'"
    >
      <h1>{{ modal.title }}</h1>
      <div>
        <span>{{ modal.text }}</span>
      </div>
      <div slot="buttons">
        <gwc-button variant="text" @click="onClose">Close</gwc-button>
        <gwc-button
          @click="markNotification(modal.status)"
          variant="progressive"
          >{{ modal.title }}</gwc-button
        >
      </div>
    </gwc-dialog>
  </div>
</template>

<script>
import _ from 'lodash';
import { createNamespacedHelpers } from 'vuex';
import abstractCell from './AbstractCell';
import getActions from '../../../features/notifications/notification-actions';
import '@c1/gravity-wc/dist/button';
import '@c1/gravity-wc/dist/dialog';

const mapNotifications = createNamespacedHelpers('notifications');

export default {
  data() {
    return {
      notificationId: this.cellData,
      dropdownOpen: false,
      isModalVisible: false,
      modal: Object,
      dropdownElementsData: [],
      unreadOption: {
        title: 'Mark notification as unread',
        buttonText: 'Mark as unread',
        status: 'UNREAD'
      },
      deleteOption: {
        title: 'Delete notification',
        buttonText: 'Delete',
        status: 'DELETED'
      }
    };
  },
  mounted() {
    const allActions = getActions.bind(this);
    this.$options.actions = allActions();
    this.dropdownElementsData = this.dropdownElements;
  },
  computed: {
    dropdownElements() {
      return document.getElementsByClassName('dropDownMyClass');
    }
  },
  methods: {
    openModalSmall(val) {
      /* eslint-disable no-param-reassign */
      _.forEach(this.dropdownElements, (element) => {
        element.style.display = 'none';
      });
      this.dropdownOpen = !val;
    },
    markNotification(status) {
      this.isModalVisible = false;
      this.markNotificationItem({
        status,
        recipientEid: this.rowData.recipientEid,
        notificationId: this.rowData.notificationId
      });
      this.dropdownOpen = false;
      this.$refs.menuCellDialog.close();
    },
    ...mapNotifications.mapActions(['markNotificationItem']),
    openDeleteModal() {
      this.dropdownOpen = false;
      this.modal = {
        title: 'Delete notification',
        buttonText: 'Delete',
        text: 'Are you sure you would like to delete this notification?',
        performAction: 'markNotification',
        status: 'DELETED'
      };
      this.isModalVisible = true;
    },
    onClose() {
      this.isModalVisible = false;
    }
  },
  mixins: [abstractCell],
  name: 'menu-cell'
};
</script>
