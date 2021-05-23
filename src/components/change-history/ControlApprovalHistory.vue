<template>
  <div>
    <div class="container">
      <h2 data-test-id="page-header">Approval History</h2>
      <data-grid
        data-test-id="approval-history"
        :row-data="items"
        class="w-full"
        v-if="items.length > 0"
      >
        <data-grid-column
          field-name="workflowActionTimestamp"
          format="date-time"
        >
          Date
          <template v-slot:cell="data">
            <span
              class="pl12"
              :data-test-id="camelCase(`date-${data.row.index}`)"
            >
              {{ data.row.date.slice(0, -1) | formatDate(true) }}
            </span>
          </template>
        </data-grid-column>
        <data-grid-column
          format="user"
          field-name="workflowActionPerformer"
          eid-prop="workflowActionPerformerEid"
        >
          Approver
          <template v-slot:cell="data">
            <avatar
              class="avatar"
              :data-test-id="camelCase(`approvedBy-${data.row.index}`)"
              :user="data.row.user"
              :showEid="false"
              :size="'medium'"
            />
          </template>
        </data-grid-column>
        <data-grid-column format="comment" field-name="commentId">
        </data-grid-column>
      </data-grid>
      <div class="no-approval-history" v-else>
        <div
          v-if="items && items.length == 0 && !serverError.show && !errorPage"
          data-test-id="recordNotApproved"
        >
          {{ noRecordMessage }}
        </div>
        <div v-if="serverError.show">
          <server-error-page
            v-if="serverError.errorCode && serverError.errorCode > 500"
            :title="serverError.title"
            :error-code="serverError.errorCode"
            :message="serverError.message"
          />
          <server-error-page v-else />
        </div>
        <div v-if="errorPage">
          <error-page />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import { filter, first } from 'rxjs/operators';
import Avatar from '@/components/Avatar.vue';
import { camelCase } from 'lodash';
import DataGrid from '@/components/data-grid/DataGrid.vue';
import DataGridColumn from '@/components/data-grid/DataGridColumn.vue';
import ErrorPage from '@/features/error/ErrorPage.vue';
import { getFeatureToggle } from '@/services/feature-toggle-service';
import { getControlChangeHistory } from '@/services/change-history-service';
import { getUserByEid } from '@/services/users-service';
import ServerErrorPage from '@/features/error/ServerErrorPage.vue';
import { completeReview, publishControl } from '@/services/controls-service';
import getControlActions from '../../control-actions';
import getPlanActions from '../../plan-actions';
import { getAuthorizedActionsForUser } from '../../../../utils/auth-utils';

const { mapState, mapMutations } = createNamespacedHelpers('controls');

export default {
  name: 'ControlApprovalHistory',
  components: {
    Avatar,
    DataGrid,
    DataGridColumn,
    ErrorPage,
    ServerErrorPage
  },
  data() {
    return {
      noRecordMessage: '',
      items: [],
      errorPage: false,
      pageType: 'control',
      serverError: {
        show: false,
        statusCode: {
          501: {
            title: 'Approval History is unavailable.'
          },
          502: {
            title: 'Approval History is unavailable.'
          },
          503: {
            title: 'The Approval History service is down.'
          },
          504: {
            title: 'Your Approval History request timed out.'
          }
        }
      },
      retireFeature: false
    };
  },
  computed: {
    ...mapState({
      control: state => state.currentControl,
      plan: state => state.currentPlan
    })
  },
  async mounted() {
    const {
      controlId,
      controlVersionId,
      planId,
      planVersionId,
      resultId,
      isApproved = true
    } = this.$route.params;
    let entityType = 'control';
    let entityId = controlId;
    let version = controlVersionId;
    if (resultId && resultId !== 'new') {
      entityType = 'result';
      entityId = resultId;
      version = '';
    } else if (planId && planVersionId) {
      entityType = 'plan';
      entityId = planId;
      version = planVersionId;
      this.pageType = 'plan';
    }
    this.updateHeader();
    getControlChangeHistory({
      entityType,
      entityId,
      version,
      isApproved
    })
      .then((response) => {
        this.serverError.show = false;
        this.errorPage = false;
        this.prepareTableData(response.data.histories);
      })
      .catch((err) => {
        if (
          err
          && err.response
          && err.response.status
          && err.response.status > 500
        ) {
          this.serverError.show = true;
          this.serverError.errorCode = err.response.status;
          this.serverError.title = this.serverError.statusCode[
            this.serverError.errorCode
          ].title;
          this.serverError.message = "We're working quickly to resolve this. Please check back later to see the changes.";
        } else {
          this.errorPage = true;
        }
      });
    this.$auth
      .getUser()
      .pipe(filter(user => user !== undefined))
      .pipe(first())
      .subscribe((user) => {
        this.user = user;
      });
    this.retireFeature = await getFeatureToggle('controlRetirement');
    this.initializeActions();
    if (this.pageType === 'control') {
      this.setActions(this.control, 'read', this.user);
    } else {
      this.setPlanActions(this.plan, 'read', this.user);
    }
  },
  watch: {
    control() {
      this.initializeActions();
    },
    plan() {
      this.initializeActions();
    }
  },
  methods: {
    camelCase,
    ...mapMutations({
      setControlInStore: 'setControl'
    }),
    async prepareTableData(data) {
      let index = 0;
      for (const row of data) {
        const { date, modifiedBy } = row;
        /* eslint-disable no-await-in-loop */
        const user = await getUserByEid(modifiedBy);
        index += 1;
        this.items.push({
          index,
          date,
          user,
          modifiedBy
        });
      }
      if (data.length === 0) {
        this.noRecordMessage = 'This record has not been approved in Fuse.';
      }
    },
    initializeActions() {
      let allActions;
      if (this.pageType === 'control') {
        allActions = getControlActions.bind(this);
      } else {
        allActions = getPlanActions.bind(this);
      }
      this.$options.actions = allActions();
    },
    verifyControlStatus() {
      if (
        typeof this.control !== 'undefined'
        && this.control.controlStatus != null
        && this.control.controlStatus.controlStatusCode !== 'Retired'
        && this.control.controlStatus.controlStatusCode !== 'AwaitingRetirement'
      ) {
        return true;
      }

      return false;
    },
    setActions(control, mode, user) {
      if (control && control.controlStatus && mode) {
        this.actions = this.$options.actions.filter(action => action.condition(
          control.controlStatus.controlStatusCode,
          mode,
          control,
          user
        ));
        this.actions = getAuthorizedActionsForUser(
          user.userId,
          control,
          this.actions
        );
      } else {
        this.actions = this.$options.actions.filter(action => action.condition(undefined, mode, control, user));
      }
      this.$emit('update:actions', this.actions);
    },
    setPlanActions(plan, mode, user) {
      let actions;
      if (plan && plan.planStatus && mode) {
        actions = this.$options.actions.filter(action => action.condition(plan, mode, user));
        // additional filter for auth, applicable only for plans saved at least once
        this.actions = getAuthorizedActionsForUser(
          this.user.userId,
          plan,
          actions
        );
      } else {
        // means new plan going to be created
        const undefinedPlan = {
          planStatus: 'undefinedStatus'
        };
        this.actions = this.$options.actions.filter(action => action.condition(undefinedPlan, mode, user));
      }
      if (this.verifyControlStatus()) {
        this.$parent.$emit('update:actions', actions);
      }
    },
    goToEditMode() {
      if (this.pageType === 'control') {
        this.$router.replace({
          name: 'control-details',
          params: {
            controlId: this.control.controlId
          },
          query: {
            action: 'edit'
          }
        });
      } else {
        this.$router.replace({
          name: 'plan-edit',
          params: {
            controlId: this.control.controlId,
            planId: this.plan.planId,
            planVersionId: this.plan.versionId,
            mode: 'edit'
          }
        });
      }
    },
    createCommentForSubmitApproval() {
      this.$router.push({
        name: 'control-details',
        params: {
          controlId: this.control.controlId
        },
        query: {
          action: 'submitforapproval'
        }
      });
    },
    delete() {
      this.$router.push({
        name: 'control-details',
        params: {
          controlId: this.control.controlId
        },
        query: {
          action: 'delete'
        }
      });
    },
    editApprovedControl() {
      this.$router.push({
        name: 'control-details',
        params: {
          controlId: this.control.controlId
        },
        query: {
          action: 'editapprovedctrl'
        }
      });
    },
    createCommentForApprove() {
      this.$router.push({
        name: 'control-details',
        params: {
          controlId: this.control.controlId
        },
        query: {
          action: 'approve'
        }
      });
    },
    createCommentForRevisit() {
      this.$router.push({
        name: 'control-details',
        params: {
          controlId: this.control.controlId
        },
        query: {
          action: 'revisit'
        }
      });
    },
    revertToDraft() {
      this.$router.push({
        name: 'control-details',
        params: {
          controlId: this.control.controlId
        },
        query: {
          action: 'reverttodraft'
        }
      });
    },
    async publishControl() {
      this.setControlInStore(await publishControl(this.control));
      this.goToConfirmationPage();
    },
    submitForReview() {
      this.$router.push({
        name: 'control-details',
        params: {
          controlId: this.control.controlId
        },
        query: {
          action: 'submitforreview'
        }
      });
    },
    goToConfirmationPage() {
      this.$router.replace({
        name: 'control-confirmation',
        params: {
          controlId: this.control.controlId
        }
      });
    },
    async completeReview() {
      this.setControlInStore(await completeReview(this.control));
      this.goToConfirmationPage();
    },
    showCommentModalForSubmitApproval() {
      this.$router.replace({
        name: 'plan-details',
        params: {
          controlId: this.control.controlId,
          planId: this.plan.planId,
          planVersionId: this.plan.versionId
        },
        query: {
          action: 'submitforapproval'
        }
      });
    },
    showConfirmationModalForDelete() {
      this.$router.replace({
        name: 'plan-details',
        params: {
          controlId: this.control.controlId,
          planId: this.plan.planId,
          planVersionId: this.plan.versionId
        },
        query: {
          action: 'delete'
        }
      });
    },
    showCommentModalForPublish() {
      this.$router.replace({
        name: 'plan-details',
        params: {
          controlId: this.control.controlId,
          planId: this.plan.planId,
          planVersionId: this.plan.versionId
        },
        query: {
          action: 'publish'
        }
      });
    },
    editApprovedPlan() {
      this.$router.replace({
        name: 'plan-details',
        params: {
          controlId: this.control.controlId,
          planId: this.plan.planId,
          planVersionId: this.plan.versionId
        },
        query: {
          action: 'editapproved'
        }
      });
    },
    showCommentModalRevisit() {
      this.$router.replace({
        name: 'plan-details',
        params: {
          controlId: this.control.controlId,
          planId: this.plan.planId,
          planVersionId: this.plan.versionId
        },
        query: {
          action: 'revisit'
        }
      });
    },
    changeStatusToDraft() {
      this.$router.replace({
        name: 'plan-details',
        params: {
          controlId: this.control.controlId,
          planId: this.plan.planId,
          planVersionId: this.plan.versionId
        },
        query: {
          action: 'changestatustodraft'
        }
      });
    },
    createCommentForRetire() {
      this.$router.push({
        name: 'control-details',
        params: {
          controlId: this.control.controlId
        },
        query: {
          action: 'createcommentforretire'
        }
      });
    },
    createCommentForSubmitForRetirement() {
      this.$router.push({
        name: 'control-details',
        params: {
          controlId: this.control.controlId
        },
        query: {
          action: 'createcommentforsubmitforretirement'
        }
      });
    },
    createCommentForRevert() {
      this.$router.push({
        name: 'control-details',
        params: {
          controlId: this.control.controlId
        },
        query: {
          action: 'createcommentForrevert'
        }
      });
    },
    updateHeader() {
      if (this.planIsNew(this.plan)) {
        this.header = {
          title: 'Untitled Test Plan'
        };
      } else {
        this.header = {
          title: this.plan.planTitle,
          secondaryTitle: this.plan.planEvaluationFrequency
            ? `${this.plan.planNumber}`
            : `${this.plan.planNumber}`,
          status: () => {
            if (this.control.controlStatus.controlStatusCode === 'Retired') {
              return {
                statusCode: 'Retired',
                statusTitle: 'Retired'
              };
            }
            if (!this.plan.planStatus) return undefined;
            return {
              statusCode: this.plan.planStatus.planStatusCode,
              statusTitle: this.plan.planStatus.planStatusTitle
            };
          }
        };
      }
      this.$parent.$emit('update:header', this.header);
    },
    planIsNew(plan) {
      return !plan.planId;
    }
  }
};
</script>

<style scoped>
@import '../../../../../src/assets/style/color.css';

.container >>> tbody tr td {
  padding-top: 0.5%;
  vertical-align: top;
}

.avatar >>> .name {
  display: inline-block;
  font-weight: 500;
  padding-top: 10px;
}

.avatar >>> img {
  border-width: 1px !important;
}

.avatar >>> .info-groups {
  width: auto;
}

.no-approval-history {
  color: var(--disable-text-gray-color);
  font-size: 12px;
  font-style: italic;
}
</style>
