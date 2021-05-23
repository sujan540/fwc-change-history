<template>
  <div class="container">
    <h2 data-test-id="page-header">Change History</h2>
    <data-grid
      data-test-id="change-history"
      :row-data="items"
      class="table"
      table-class="change-history-table"
      v-if="items.length > 0"
    >
      <data-grid-column
        field-name="workflowActionTimestamp"
        format="date-time"
        header-class="column-first"
      >
        DATE
        <template v-slot:cell="data">
          <span :data-test-id="camelCase(`date-${data.row.index}`)">
            {{ data.row.date.slice(0, -1) | formatDate(true) }}
          </span>
        </template>
      </data-grid-column>
      <data-grid-column header-class="column-second">
        SUMMARY OF CHANGES
        <template v-slot:cell="data">
          <div
            class="flex column"
            v-if="
              data.row.errors != null && Object.keys(data.row.errors).length > 0
            "
          >
            <div>
              <div class="pull-left">
                <span class="error-message-close">x</span>
              </div>
              <div class="pull-right error-message">
                <span>
                  An error occurred and change history was unable to be
                  captured. This may also impact the Approval History.
                </span>
              </div>
            </div>
          </div>
          <div
            class="flex column"
            v-else-if="Object.keys(data.row.changeHistory).length > 0"
          >
            <div v-for="(val, key) of data.row.changeHistory" :key="key">
              <div class="flex justify-start item" v-if="key === 'Status'">
                <span
                  :data-test-id="camelCase(`status-label-${data.row.index}`)"
                  class="field-label"
                >
                  {{ key }}:
                </span>
                <div class="flex justify-between">
                  <status-tag
                    :data-test-id="camelCase(`status-tag-${data.row.index}`)"
                    :status="val[0]"
                    titleFieldName="newValue"
                    codeFieldName="newValue"
                  />
                </div>
              </div>
              <div class="flex item" v-else>
                <span
                  :data-test-id="camelCase(`${key}-label-${data.row.index}`)"
                  class="field-label overflow-clip"
                  >{{ key || defaultLabel }}:
                </span>
                <span
                  :data-test-id="
                    camelCase(`${key}-description-${data.row.index}`)
                  "
                  class="field-value"
                  >{{ getDescriptions(val) }}</span
                >
              </div>
            </div>
          </div>
          <div
            :data-test-id="camelCase(`noChangeHistory${data.row.index}`)"
            class="flex column no-change-history"
            v-else
          >
            No changes were made.
          </div>
        </template>
      </data-grid-column>
      <data-grid-column
        format="user"
        field-name="workflowActionPerformer"
        eid-prop="workflowActionPerformerEid"
        header-class="column-third"
      >
        MODIFIED BY
        <template v-slot:cell="data">
          <avatar
            class="avatar"
            :data-test-id="camelCase(`modifiedBy-${data.row.index}`)"
            :user="data.row.user"
            :showEid="false"
            size="medium"
          />
        </template>
      </data-grid-column>
      <data-grid-column header-class="column-forth">
        <template v-slot:cell="data">
          <button
            :data-test-id="camelCase(`expand-${data.row.index}`)"
            v-if="
              data.row.errors == null ||
                Object.keys(data.row.errors).length == 0
            "
            class="remove-pad"
            v-on="
              Object.keys(data.row.changeHistory).length > 0
                ? { click: () => toggleAccorrdion(data.row) }
                : {}
            "
            :class="
              Object.keys(data.row.changeHistory).length > 0
                ? 'enabled'
                : 'disabled'
            "
          >
            EXPAND
            <svg
              class="xds-icon icon-small"
              :class="
                Object.keys(data.row.changeHistory).length > 0
                  ? 'enabled'
                  : 'disabled'
              "
            >
              <use xlink:href="#xds-icon-plus" />
            </svg>
          </button>
        </template>
      </data-grid-column>
      <template v-slot:accordion="accordionData">
        <td colspan="4" class="remove-pad">
          <data-grid
            :row-data="getAccordionData(accordionData.data.changeHistory)"
            class="accordion"
          >
            <data-grid-column
              header-class="column-first"
              column-class="column-detail-first vertical-align-top"
            >
              FIELD NAME
              <template v-slot:cell="data">
                <span
                  :data-test-id="
                    camelCase(
                      `${getFieldName(data.row)}-${accordionData.data.index}`
                    )
                  "
                >
                  {{ getFieldName(data.row) }}
                </span>
              </template>
            </data-grid-column>
            <data-grid-column
              header-class="column-second"
              column-class="vertical-align-top"
            >
              DETAILED CHANGES
              <template v-slot:cell="data">
                <div v-if="!data.row.isAssociation">
                  <div v-if="data.row.fieldLabel === 'Status'">
                    <status-tag
                      :data-test-id="
                        camelCase(
                          `detailChangeStatusTag-${accordionData.data.index}`
                        )
                      "
                      :status="data.row"
                      :titleFieldName="'newValue'"
                      :codeFieldName="'newValue'"
                    />
                  </div>
                  <div
                    class="control-desc overflow-clip"
                    style="-webkit-box-shadow: 0 0 0px 1000px color: #f6f6f6; inset;"
                    v-else-if="data.row.fieldType === 'textarea'"
                  >
                    <span
                      :data-test-id="
                        camelCase(
                          `detailChange${getFieldName(data.row)}-${
                            accordionData.data.index
                          }`
                        )
                      "
                      v-if="!data.row.oldValue || data.row.justificationType"
                    >
                      {{ getValue(data.row.newValue) }}
                    </span>
                    <span
                      :data-test-id="
                        camelCase(
                          `detailChange${getFieldName(data.row)}-${
                            accordionData.data.index
                          }`
                        )
                      "
                      v-else
                      v-html="getDiffHTML(data.row.oldValue, data.row.newValue)"
                    />
                  </div>
                  <div
                    class="flex justify-between text-left"
                    v-else-if="
                      ['text', 'singleselect', 'date'].includes(
                        data.row.fieldType
                      )
                    "
                  >
                    <div class="flex1 overflow-clip">
                      <span
                        :data-test-id="
                          camelCase(
                            `oldValue${getFieldName(data.row)}-${
                              accordionData.data.index
                            }`
                          )
                        "
                        v-if="data.row.fieldType === 'date'"
                      >
                        {{ getFormattedDate(data.row.oldValue) }}
                      </span>
                      <span
                        :data-test-id="
                          camelCase(
                            `oldValue${getFieldName(data.row)}-${
                              accordionData.data.index
                            }`
                          )
                        "
                        v-else
                      >
                        {{ getValue(data.row.oldValue) }}
                      </span>
                    </div>
                    <div class="flex1">
                      <svg class="arrow-forward">
                        <use xlink:href="#xds-icon-arrow-forward" />
                      </svg>
                    </div>
                    <div class="text-left flex1 overflow-clip">
                      <span
                        :data-test-id="
                          camelCase(
                            `newValue${getFieldName(data.row)}-${
                              accordionData.data.index
                            }`
                          )
                        "
                        v-if="data.row.fieldType === 'date'"
                      >
                        {{ getFormattedDate(data.row.newValue) }}
                      </span>
                      <span
                        :data-test-id="
                          camelCase(
                            `newValue${getFieldName(data.row)}-${
                              accordionData.data.index
                            }`
                          )
                        "
                        v-else
                      >
                        {{ getValue(data.row.newValue) }}
                      </span>
                    </div>
                  </div>
                  <div
                    class="flex justify-between align-center"
                    v-else-if="data.row.fieldType === FieldType.ARRAY"
                  >
                    <a
                      @click="
                        showChangeHistoryModal(
                          data.row,
                          accordionData.data.index
                        )
                      "
                    >
                      <span
                        :data-test-id="
                          `changeHistoryModal${accordionData.data.index}`
                        "
                      >
                        View change here
                      </span>
                    </a>
                  </div>
                  <div
                    class="flex justify-between align-center"
                    v-else-if="data.row.fieldType === 'multiselect'"
                  >
                    <div class="text-left flex1 overflow-clip">
                      <span
                        :data-test-id="
                          camelCase(
                            `oldValue${getFieldName(data.row)}-${
                              accordionData.data.index
                            }`
                          )
                        "
                      >
                        {{ getValue(data.row.oldValue) }}
                      </span>
                    </div>
                    <div class="flex1">
                      <svg class="arrow-forward">
                        <use xlink:href="#xds-icon-arrow-forward" />
                      </svg>
                    </div>
                    <div class="text-left flex1 overflow-clip">
                      <span
                        :data-test-id="
                          camelCase(
                            `newValue${getFieldName(data.row)}-${
                              accordionData.data.index
                            }`
                          )
                        "
                      >
                        {{ getValue(data.row.newValue) }}
                      </span>
                    </div>
                  </div>
                </div>
                <div v-else>
                  <div class="flex association-items">
                    <span
                      v-for="(val, index) in data.row.associations"
                      :key="val.entityName + index"
                      :data-test-id="
                        camelCase(
                          `${getFieldName(data.row)}-${
                            accordionData.data.index
                          }-${index}`
                        )
                      "
                      v-html="
                        val.operation === 'remove'
                          ? val.entityName.strike()
                          : val.entityName
                      "
                    />
                  </div>
                </div>
              </template>
            </data-grid-column>
            <data-grid-column
              header-class="column-third"
              column-class="vertical-align-top"
            >
              <avatar
                class="avatar"
                :data-test-id="
                  camelCase(
                    `detailChangeModifiedBy-${accordionData.data.index}`
                  )
                "
                :user="accordionData.data.user"
                :showEid="false"
                :size="'medium'"
              />
            </data-grid-column>
            <data-grid-column
              class="text-left"
              header-class="column-forth"
              column-class="vertical-align-top"
            >
              <template>
                <button
                  :data-test-id="
                    camelCase(`collapse-${accordionData.data.index}`)
                  "
                  class="enabled remove-pad"
                  @click="toggleAccorrdion(accordionData.data)"
                >
                  COLLAPSE
                  <svg class="xds-icon enabled">
                    <use xlink:href="#xds-icon-minus" />
                  </svg>
                </button>
              </template>
            </data-grid-column>
          </data-grid>
        </td>
      </template>
    </data-grid>
    <div class="no-change-history" v-else>
      <div
        v-if="items && items.length == 0 && !serverError.show && !errorPage"
        data-test-id="recordNotUpdated"
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
    <div class="flex show-more-records">
      <button
        id="showMoreRecords"
        ref="load-button"
        @click.self="getControlChangeHistory"
        v-if="items.length < count"
      >
        {{ showMoreRecordText }}
      </button>
    </div>
    <change-history-modal
      :data-test-id="planProcedure.dataTestId"
      :is-active="planProcedure.show"
      :title="planProcedure.title"
      @close="closeChangeHistoryModal()"
    >
      <div slot="left">
        <div
          v-if="
            planProcedure.field.oldValue &&
              planProcedure.field.oldValue.length > 0
          "
        >
          <div
            v-for="(planStep, index) in planProcedure.field.oldValue"
            :key="computeKey(planStep, index, 'oldValue')"
            class="plan-step"
          >
            <label>Step Text</label>
            <label class="step-text">{{ planStep.stepText }}</label>
            <label>Performer Guidance</label>
            <label class="step-hint">{{ planStep.stepHint }}</label>
          </div>
        </div>
        <div v-else>
          <label class="plan-step italic">The field(s) were blank</label>
        </div>
      </div>
      <div slot="right">
        <div
          v-if="
            planProcedure.field.newValue &&
              planProcedure.field.newValue.length > 0
          "
        >
          <div
            v-for="(planStep, index) in planProcedure.field.newValue"
            :key="computeKey(planStep, index, 'newValue')"
            class="plan-step"
          >
            <label>Step Text</label>
            <label class="step-text">{{ planStep.stepText }}</label>
            <label>Performer Guidance</label>
            <label class="step-hint">{{ planStep.stepHint }}</label>
          </div>
        </div>
        <div v-else>
          <label class="plan-step italic">The field(s) have been cleared</label>
        </div>
      </div>
    </change-history-modal>
    <change-history-modal
      :data-test-id="resultResponses.dataTestId"
      :is-active="resultResponses.show"
      :title="resultResponses.title"
      @close="closeChangeHistoryModal()"
    >
      <div slot="left">
        <div
          v-if="
            resultResponses.field.oldValue &&
              resultResponses.field.oldValue.length > 0
          "
        >
          <div
            v-for="(response, index) in resultResponses.field.oldValue"
            :key="computeKey(response, index, 'oldValue')"
            class="plan-step"
          >
            <label>Step</label>
            <label class="step-text">{{ response.question }}</label>
            <label>Response</label>
            <label class="step-hint">{{ response.answer }}</label>
          </div>
        </div>
        <div v-else>
          <label class="plan-step italic">The field(s) were blank</label>
        </div>
      </div>
      <div slot="right">
        <div
          v-if="
            resultResponses.field.newValue &&
              resultResponses.field.newValue.length > 0
          "
        >
          <div
            v-for="(response, index) in resultResponses.field.newValue"
            :key="computeKey(response, index, 'newValue')"
            class="plan-step"
          >
            <label>Step</label>
            <label class="step-text">{{ response.question }}</label>
            <label>Response</label>
            <label class="step-hint">{{ response.answer }}</label>
          </div>
        </div>
        <div v-else>
          <label class="plan-step italic">The field(s) have been cleared</label>
        </div>
      </div>
    </change-history-modal>
    <div v-if="isLoading" class="spinner-container">
      <div class="associations-spinner grv-spinner grv-spinner--active"></div>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import { filter, first } from 'rxjs/operators';
import { camelCase, capitalize, isEmpty } from 'lodash';
import { diffWords } from 'diff';
import DataGrid from '@/components/data-grid/DataGrid.vue';
import DataGridColumn from '@/components/data-grid/DataGridColumn.vue';
import ErrorPage from '@/features/error/ErrorPage.vue';
import { getFeatureToggle } from '@/services/feature-toggle-service';
import { getControlChangeHistory } from '@/services/change-history-service';
import { getMultipleUsers } from '@/services/users-service';
import ServerErrorPage from '@/features/error/ServerErrorPage.vue';
import StatusTag from '@/components/StatusTag.vue';
import Avatar from '@/components/Avatar.vue';
import moment from 'moment';
import { completeReview, publishControl } from '@/services/controls-service';
import {
  AssociationEntityType,
  FieldName,
  FieldType,
  SectionLabel
} from './ChangeHistoryConstant';
import ChangeHistoryModal from './ChangeHistoryModal.vue';
import getControlActions from '../../control-actions';
import getPlanActions from '../../plan-actions';
import getResultActions from '../../result-actions';
import { getAuthorizedActionsForUser } from '../../../../utils/auth-utils';

const { mapState, mapMutations } = createNamespacedHelpers('controls');

export default {
  name: 'ControlChangeHistory',
  components: {
    Avatar,
    ChangeHistoryModal,
    DataGrid,
    DataGridColumn,
    ErrorPage,
    ServerErrorPage,
    StatusTag
  },
  data() {
    return {
      noRecordMessage: '',
      showMoreRecordText: '',
      defaultLabel: 'Field Label',
      pageType: 'control',
      items: [],
      limit: 10,
      count: 0,
      offset: 0,
      isLoading: false,
      errorPage: false,
      serverError: {
        show: false,
        statusCode: {
          501: {
            title: 'Change History is unavailable.'
          },
          502: {
            title: 'Change History is unavailable.'
          },
          503: {
            title: 'The Change History service is down.'
          },
          504: {
            title: 'Your Change History request timed out.'
          }
        }
      },
      SectionLabel,
      FieldType,
      planProcedure: {
        dataTestId: 'planProcedureModal',
        show: false,
        title: 'Plan Procedure',
        field: {}
      },
      retireFeature: false,
      resultResponses: {
        dataTestId: 'resultResponseModal',
        show: false,
        title: 'Response',
        field: {}
      }
    };
  },
  async mounted() {
    this.getControlChangeHistory();
    let allActions;
    this.$auth
      .getUser()
      .pipe(filter(user => user !== undefined))
      .pipe(first())
      .subscribe((user) => {
        this.user = user;
        this.updateHeader();
      });

    this.retireFeature = await getFeatureToggle('controlRetirement');
    if (this.pageType === 'control') {
      allActions = getControlActions.bind(this);
    } else if (this.pageType === 'plan') {
      allActions = getPlanActions.bind(this);
    } else {
      allActions = getResultActions.bind(this);
    }
    this.$options.actions = allActions();
    if (this.pageType === 'control') {
      this.setActions(this.control, 'read', this.user);
    } else if (this.pageType === 'plan') {
      this.setPlanActions(this.plan, 'read', this.user);
    } else {
      this.setResultActions(this.result, 'read');
    }
  },
  computed: {
    ...mapState({
      control: state => state.currentControl,
      plan: state => state.currentPlan,
      result: state => state.currentResult
    })
  },
  methods: {
    ...mapMutations({
      setControlInStore: 'setControl'
    }),
    // initializeActions() {
    //   const allActions = getActions.bind(this);
    //   this.$options.actions = allActions();
    // },
    camelCase,
    /* eslint-disable no-param-reassign */
    toggleAccorrdion(row) {
      row.open = !row.open;
    },
    computeKey(value, index, identifier) {
      return `${value}${index}${identifier}`;
    },
    closeChangeHistoryModal() {
      this.planProcedure.show = false;
      this.resultResponses.show = false;
    },
    showChangeHistoryModal(field, index) {
      if (field.sectionLabel === SectionLabel.PlanDetails) {
        this.planProcedure.field = field;
        this.planProcedure.dataTestId = `planProcedureModal${index}`;
        if (!isEmpty(field.oldValue)) {
          this.planProcedure.field.oldValue = field.oldValue.filter(
            value => !isEmpty(value)
          );
        }
        if (!isEmpty(field.newValue)) {
          this.planProcedure.field.newValue = field.newValue.filter(
            value => !isEmpty(value)
          );
        }
        if (
          (this.planProcedure.field.oldValue
            && this.planProcedure.field.oldValue.length > 0)
          || (this.planProcedure.field.newValue
            && this.planProcedure.field.newValue.length > 0)
        ) {
          this.planProcedure.show = true;
        }
      }
      if (field.sectionLabel === SectionLabel.ResultDetails) {
        this.resultResponses.field = field;
        this.resultResponses.dataTestId = `resultResponseModal${index}`;
        if (!isEmpty(field.oldValue)) {
          this.resultResponses.field.oldValue = field.oldValue.filter(
            value => !isEmpty(value)
              && !isEmpty(value.question)
              && !isEmpty(value.answer)
          );
        }
        if (!isEmpty(field.newValue)) {
          this.resultResponses.field.newValue = field.newValue.filter(
            value => !isEmpty(value)
              && !isEmpty(value.question)
              && !isEmpty(value.answer)
          );
        }
        if (
          (this.resultResponses.field.oldValue
            && this.resultResponses.field.oldValue.length > 0)
          || (this.resultResponses.field.newValue
            && this.resultResponses.field.newValue.length > 0)
        ) {
          this.resultResponses.show = true;
        }
      }
    },
    getFieldName(row) {
      return `${row.fieldLabel || this.defaultLabel} ${
        row.justificationTypeLabel ? `(${row.justificationTypeLabel})` : ''
      }`;
    },
    getValue(value) {
      return isEmpty(value) ? '--' : value;
    },
    getDiffHTML(oldString, newString) {
      const diff = diffWords(oldString, newString);
      if (diff.length) {
        const div = document.createElement('div');
        for (const part of diff) {
          let color = '#f6f6f6';
          let { value } = part;
          if (part.removed) {
            color = '#f7dedf';
            value = value.strike();
          }
          if (part.added) color = '#d9ece2';
          const span = document.createElement('span');
          span.style.backgroundColor = color;
          span.innerHTML = `${value} `;
          div.appendChild(span);
        }
        return div.innerHTML;
      }
      return null;
    },
    getControlChangeHistory() {
      const {
        controlId,
        controlVersionId,
        planId,
        planVersionId,
        resultId
      } = this.$route.params;
      let entityType = 'control';
      let entityId = controlId;
      let version = controlVersionId;
      if (resultId && resultId !== 'new') {
        entityType = 'result';
        entityId = resultId;
        version = '';
        this.pageType = 'result';
      } else if (planId && planVersionId) {
        entityType = 'plan';
        entityId = planId;
        version = planVersionId;
        this.pageType = 'plan';
      }
      getControlChangeHistory({
        entityType,
        entityId,
        version,
        limit: this.limit,
        offset: this.offset
      })
        .then((response) => {
          this.serverError.show = false;
          this.errorPage = false;
          this.isLoading = true;
          this.prepareTableData(response.data.histories);
          this.offset += this.limit;
          this.count = response.data.count;
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
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    getUserEids(records) {
      let eids = [];
      for (const record of records) {
        if (!isEmpty(record.modifiedBy)) {
          eids.push(record.modifiedBy.trim());
        }
        for (const field of record.fields) {
          if (
            field.sectionLabel
            && field.sectionLabel.toLowerCase() === SectionLabel.StakeHolders
          ) {
            if (!isEmpty(field.newValue)) {
              if (field.fieldType === 'array') eids = eids.concat(field.newValue.map(val => val.trim()));
              else eids.push(field.newValue.trim());
            }
            if (!isEmpty(field.oldValue)) {
              if (field.fieldType === 'array') eids = eids.concat(field.oldValue.map(val => val.trim()));
              else eids.push(field.oldValue.trim());
            }
          }
        }
      }
      return new Set(eids);
    },
    async prepareTableData(data = []) {
      const { users } = await getMultipleUsers(this.getUserEids(data), true);
      let index = 0;
      for (const row of data) {
        const {
          date, fields, modifiedBy, associations, error
        } = row;
        let { businessJustifications } = row;
        for (const field of fields) {
          if (
            field.sectionLabel
            && field.sectionLabel.toLowerCase() === SectionLabel.StakeHolders
          ) {
            const stackHolderNewValue = users.find(user => user.eid === field.newValue) || {};
            const stackHolderOldValue = users.find(user => user.eid === field.oldValue) || {};
            const oldFullName = stackHolderNewValue.firstName && stackHolderNewValue.lastName
              ? `${stackHolderNewValue.firstName} ${stackHolderNewValue.lastName}`
              : '';
            const newFullName = stackHolderOldValue.firstName && stackHolderOldValue.lastName
              ? `${stackHolderOldValue.firstName} ${stackHolderOldValue.lastName}`
              : '';
            field.newValue = oldFullName;
            field.oldValue = newFullName;
            if (!isEmpty(businessJustifications)) {
              businessJustifications = businessJustifications.map(
                businessJustification => ({
                  ...businessJustification,
                  newValue: !isEmpty(businessJustification.newValue)
                    ? businessJustification.newValue
                    : ' The Business Justification field was cleared',
                  fieldDefined:
                    businessJustification.fieldDefined
                    || businessJustification.fieldName === field.fieldName
                })
              );
              const businessJustificationsFieldMap = businessJustifications.filter(
                businessJustification => businessJustification.fieldName === field.fieldName
              );
              field.businessJustifications = businessJustificationsFieldMap;
            }
          }
        }

        index += 1;
        this.items.push({
          index,
          open: false,
          date,
          errors: error,
          changeHistory: this.groupByFields({
            fields,
            associations,
            businessJustifications
          }),
          user: users.find(user => user.eid === modifiedBy)
        });
      }
      if (data.length === 0) {
        this.noRecordMessage = 'This record has not been updated in Fuse.';
      }
      if (this.items.length < this.count) {
        this.showMoreRecordText = 'Show More Change History';
      }
    },
    groupByFields({ fields, associations, businessJustifications }) {
      let mappedFields = {};
      let statusObject;
      const mappedAssociations = associations.map(
        ({ entityName, entityType, operation }) => ({
          isAssociation: true,
          fieldLabel: entityType,
          entityType,
          sectionLabel: 'Associations',
          operation,
          entityName
        })
      );
      for (const field of [...fields, ...mappedAssociations]) {
        const {
          sectionLabel,
          oldValue,
          newValue,
          fieldType,
          fieldName
        } = field;
        if (sectionLabel) {
          if (sectionLabel === 'Status') {
            statusObject = field;
          } else {
            if (!mappedFields[sectionLabel]) {
              mappedFields[sectionLabel] = [];
            }
            if (
              field.sectionLabel
              && field.sectionLabel.toLowerCase() === SectionLabel.StakeHolders
              && field.businessJustifications
            ) {
              mappedFields[sectionLabel].push(field);
              let busJustifications = field.businessJustifications;
              if (isEmpty(field.newValue)) {
                busJustifications = field.businessJustifications.map(bj => ({
                  ...bj,
                  newValue: 'The Business Justification field was cleared'
                }));
              }
              mappedFields[sectionLabel] = mappedFields[sectionLabel].concat(
                busJustifications
              );
            } else if (
              sectionLabel === SectionLabel.PlanDetails
              || sectionLabel === SectionLabel.ResultDetails
            ) {
              if (fieldType === FieldType.ARRAY) {
                if (
                  !(
                    (oldValue === null || oldValue.length === 0)
                    && (newValue === null || newValue.length === 0)
                  )
                ) {
                  mappedFields[sectionLabel].push(field);
                }
              } else if (
                fieldName !== FieldName.PLAN_PROCEDURES
                && fieldName !== FieldName.RESULT_RESPONSES
              ) {
                mappedFields[sectionLabel].push(field);
              }
            } else {
              mappedFields[sectionLabel].push(field);
            }
          }
        }
      }
      if (!isEmpty(businessJustifications)) {
        businessJustifications
          .filter(businessJustification => !businessJustification.fieldDefined)
          .forEach((businessJustification) => {
            if (!mappedFields.Stakeholders) {
              mappedFields.Stakeholders = [];
            }
            mappedFields.Stakeholders.push(businessJustification);
          });
      }
      if (statusObject) {
        mappedFields = {
          Status: [statusObject],
          ...mappedFields
        };
      }
      for (const [key, value] of Object.entries(mappedFields)) {
        if (value.length === 0) {
          delete mappedFields[key];
        }
      }
      return mappedFields;
    },
    getDescriptions(fields) {
      const values = [...new Set(fields.map(v => v.fieldLabel))].filter(
        Boolean
      );
      return values.length ? values.join(', ') : 'N/A';
    },
    getAccordionData(changeHistory) {
      let flattenList = Object.keys(changeHistory).map(
        key => changeHistory[key]
      );
      flattenList = Array.prototype.concat.apply([], flattenList);
      // grouping associations
      const risks = flattenList.filter(
        data => data.isAssociation
          && data.entityType.toLowerCase() === AssociationEntityType.RISKS
      );
      const applicabilities = flattenList.filter(
        data => data.isAssociation
          && data.entityType.toLowerCase()
            === AssociationEntityType.APPLICABILITIES
      );
      flattenList = flattenList.filter(row => !row.isAssociation);
      if (risks && risks.length > 0) {
        flattenList.push({
          isAssociation: true,
          associations: risks,
          fieldLabel: capitalize(AssociationEntityType.RISKS)
        });
      }
      if (applicabilities && applicabilities.length > 0) {
        flattenList.push({
          isAssociation: true,
          associations: applicabilities,
          fieldLabel: capitalize(AssociationEntityType.APPLICABILITIES)
        });
      }
      return flattenList;
    },
    getFormattedDate(date) {
      if (date) {
        return moment.utc(date).format('MM/DD/YYYY');
      }
      return '--';
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

      if (
        typeof this.control !== 'undefined'
        && this.control.controlStatus != null
        && this.control.controlStatus.controlStatusCode !== 'Retired'
        && this.control.controlStatus.controlStatusCode !== 'AwaitingRetirement'
      ) {
        this.$parent.$emit('update:actions', actions);
      }
    },
    setResultActions(result, mode) {
      let actions;
      if (result && result.resultStatus && mode) {
        actions = this.$options.actions.filter(action => action.condition(result, mode));
        actions = getAuthorizedActionsForUser(
          this.user.userId,
          result,
          actions
        );
      } else {
        const undefinedResult = {
          resultStatus: 'undefinedStatus'
        };
        actions = this.$options.actions.filter(action => action.condition(undefinedResult, mode));
      }
      this.$parent.$parent.$emit('update:actions', actions);
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
      } else if (this.pageType === 'plan') {
        this.$router.replace({
          name: 'plan-edit',
          params: {
            controlId: this.control.controlId,
            planId: this.plan.planId,
            planVersionId: this.plan.versionId,
            mode: 'edit'
          }
        });
      } else {
        this.$router.replace({
          name: 'result-edit',
          params: {
            controlId: this.control.controlId,
            planId: this.plan.planId,
            planVersionId: this.plan.versionId,
            resultId: this.result.resultId,
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
      if (this.pageType === 'control') {
        this.$router.replace({
          name: 'control-details',
          params: {
            controlId: this.control.controlId
          },
          query: {
            action: 'submitforreview'
          }
        });
      } else {
        this.$router.replace({
          name: 'result-details',
          params: {
            controlId: this.control.controlId,
            planId: this.plan.planId,
            planVersionId: this.plan.versionId,
            resultId: this.result.resultId
          },
          query: {
            action: 'submitforreview'
          }
        });
      }
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
      if (this.pageType === 'control') {
        this.setControlInStore(await completeReview(this.control));
        this.goToConfirmationPage();
      } else {
        this.$router.replace({
          name: 'result-details',
          params: {
            controlId: this.control.controlId,
            planId: this.plan.planId,
            planVersionId: this.plan.versionId,
            resultId: this.result.resultId
          },
          query: {
            action: 'completereview'
          }
        });
      }
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
    publish() {
      this.$router.replace({
        name: 'result-details',
        params: {
          controlId: this.control.controlId,
          planId: this.plan.planId,
          planVersionId: this.plan.versionId,
          resultId: this.result.resultId
        },
        query: {
          action: 'publish'
        }
      });
    },
    submitForApproval() {
      this.$router.replace({
        name: 'result-details',
        params: {
          controlId: this.control.controlId,
          planId: this.plan.planId,
          planVersionId: this.plan.versionId,
          resultId: this.result.resultId
        },
        query: {
          action: 'submitforapproval'
        }
      });
    },
    showCommentModalForRevisit() {
      this.$router.replace({
        name: 'result-details',
        params: {
          controlId: this.control.controlId,
          planId: this.plan.planId,
          planVersionId: this.plan.versionId,
          resultId: this.result.resultId
        },
        query: {
          action: 'revisit'
        }
      });
    },
    approve() {
      this.$router.replace({
        name: 'result-details',
        params: {
          controlId: this.control.controlId,
          planId: this.plan.planId,
          planVersionId: this.plan.versionId,
          resultId: this.result.resultId
        },
        query: {
          action: 'approve'
        }
      });
    },
    editResult() {
      this.$router.push({
        name: 'result-details',
        params: {
          controlId: this.control.controlId,
          planId: this.plan.planId,
          planVersionId: this.plan.versionId,
          resultId: this.result.resultId
        },
        query: {
          action: 'editresult'
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
    resultIsNew(result) {
      return !result.resultId;
    },
    updateHeader() {
      if (this.result.resultStatus) {
        this.resultUpdateHeader();
        this.$parent.$parent.$emit('update:header', this.header);
      } else {
        this.planUpdateHeader();
        this.$parent.$emit('update:header', this.header);
      }
    },
    resultUpdateHeader() {
      if (this.resultIsNew(this.result)) {
        this.header = {
          title: 'Untitled Evaluation Result'
        };
      } else {
        this.header = {
          title: this.result.resultTitle,
          secondaryTitle: this.result.resultNumber,
          status: () => {
            if (
              this.control
              && this.control.controlStatus
              && this.control.controlStatus.controlStatusCode === 'Retired'
            ) {
              return {
                statusCode: 'Retired',
                statusTitle: 'Retired'
              };
            }
            if (!this.result.resultStatus) return undefined;
            return {
              statusCode: this.result.resultStatus.resultStatusCode,
              statusTitle: this.result.resultStatus.resultStatusTitle
            };
          }
        };
      }

      // this.$parent.$parent.$emit('update:header', this.header);
    },
    planUpdateHeader() {
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
.change-history-table {
  width: 60vw;
}

.pull-left {
  min-width: 20px;
  float: left;
  width: 5%;
}

.pull-right {
  float: right;
  width: 95%;
}

.error-message {
  color: var(--error-text-red-color);
}

.error-message-close {
  background-color: var(--black-color);
  float: left;
  width: 20px;
  color: white;
  padding-left: 7px;
  padding-right: 1px;
  border-radius: 10px;
  margin-right: 8px;
}

.avatar >>> .info-groups {
  width: auto;
}

.avatar >>> .name {
  display: inline-block;
  font-weight: 500;
  padding-top: 10px;
}

.avatar >>> img {
  border-width: 1px !important;
}

.field-label {
  min-width: 22%;
}

.field-value {
  color: var(--href-blue-color);
  text-transform: capitalize;
}

.item {
  margin-bottom: 18px;
}

.no-change-history {
  color: var(--disable-text-gray-color);
  font-style: italic;
  font-size: 12px;
}

.italic {
  font-style: italic;
  font-weight: normal;
}

.enabled {
  color: var(--href-blue-color);
}

.disabled {
  color: var(--disable-text-gray-color);
}

.remove-pad {
  padding: unset;
}

button {
  font-size: 0.875rem;
}

button:focus {
  outline: 0;
}

.flex1 {
  flex: 1;
}

.column {
  flex-direction: column;
}

.accordion >>> tbody {
  background-color: var(--gray-color);
}

.accordion {
  width: 100%;
  margin-top: -5px;
  margin-bottom: 0px;
  background-color: var(--gray-color);
}

.align-center {
  align-items: center;
}

.container >>> tbody tr td {
  padding-top: 0.5%;
  vertical-align: top;
}

.association-items {
  flex-wrap: wrap;
}

.association-items span {
  min-width: 30%;
  margin-right: 10px;
  margin-top: 1px;
  border: 0.1rem solid var(--dark-gray-color);
  border-radius: 0.5rem;
  text-align: center;
}

.justify-start {
  justify-content: flex-start;
}

.text-left {
  text-align: left;
}

.spinner-container {
  position: relative;
  min-height: 32px;
  max-width: 32px;
  float: right;
  right: 15rem;
}

.vertical-align-top {
  vertical-align: top;
}

/deep/ table.table th {
  padding-top: 5px;
}

.column-first {
  width: 20%;
  min-width: 140px;
}

/deep/ .column-detail-first {
  text-align: right;
  padding-right: 15px;
}

.column-second {
  width: 50%;
}

.column-third {
  width: 20%;
}

.column-forth {
  width: 10%;
}

/deep/ .overflow-clip {
  text-overflow: clip;
  white-space: normal;
  word-break: break-all;
}

.show-more-records {
  float: right;
}

.step-text,
.step-hint {
  font-weight: normal;
}

.plan-step {
  text-align: left;
  margin: 10px 10px 15px 10px;
  padding: 5px;
}

/deep/ .arrow-forward {
  margin-left: 33%;
  width: 20px;
  height: 20px;
}
</style>
