<template>
  <div class="flex-column-fluid lg:px-28 py-10 px-10 mb-20">
    <div class="flex mb-5">
      <div class="w-full">
        <!-- Step title -->
        <div class="mb-6">
          <div class="text-head-3 font-semibold mb-2">
            {{ $t('data.plans.payment') }}
          </div>
          <div class="mb-2">
            {{ $t('data.plans.choose_payment_method') }}
          </div>
        </div>
        <!-- Step title end-->

        <!-- Payment -->
        <div class="setting-wrapper !mb-3">
          <div class="setting-section">
            <div class="setting-section-header">
              <div class="text-[20px] font-semibold">
                {{ $t('data.plans.order_summary') }}
              </div>
            </div>
          </div>
          <div class="setting-section">
            <div class="setting-section-header">
              <div>
                <div class="setting-title">
                  {{ getPlanName(selectedPlan.name).name }}
                  <span v-if="!currentPlan.personal_trial_applied">({{ $t('data.plans.trial_included') }})</span>
                </div>
                <div class="setting-description">
                  {{ $t(`data.plans.price.${selectedPeriod.label}`) }}
                </div>
              </div>
              <div>
                <div class="font-semibold">
                  {{ result.price | formatNumber }} {{ result.currency }}
                </div>
              </div>
            </div>
            <div class="mt-4">
              <button
                v-if="!havePromoCode"
                class="btn btn-default md:mb-0"
                @click="havePromoCode = true"
              >
                {{ $t('data.plans.add_coupon') }}
              </button>
              <div v-if="havePromoCode" class="flex">
                <el-input v-model="promo_code" change="mr-2">
                  <el-button
                    slot="append"
                    :disabled="!promo_code"
                    @click="calcPrice"
                  >
                    {{ $t('common.apply') }}
                  </el-button>
                </el-input>
              </div>
              <div v-if="result.error_promo" class="text-danger">
                {{ result.error_promo.promo_code[0] }}
              </div>
            </div>
            <div
              v-if="result.discount !== 0"
              class="setting-section-header text-primary mt-4"
            >
              <div>
                <div class="setting-title">{{ $t('common.discount') }}</div>
              </div>
              <div>
                <div class="font-semibold">
                  -{{ result.discount | formatNumber }}
                  {{ result.currency }}
                </div>
              </div>
            </div>
          </div>
          <div class="setting-section text-head-5">
            <div class="setting-section-header">
              <div>
                <div class="setting-title">
                  {{ $t('data.billing.total') }}
                </div>
                <div class="setting-description" />
              </div>
              <div class="font-semibold">
                <span
                  v-if="!currentPlan.personal_trial_applied"
                  class="text-head-7 text-black-500 line-through"
                >{{
                   result.next_billing_payment
                     ? result.next_billing_payment
                     : result.price | formatNumber
                 }}
                  {{ result.currency }}</span>
                {{ result.immediate_payment | formatNumber }}
                {{ result.currency
                }}<span v-if="!currentPlan.personal_trial_applied">*</span>
              </div>
            </div>
          </div>
        </div>
        <div class="px-8 text-black-500 mb-6">
          <ul v-if="!currentPlan.personal_trial_applied">
            <li
              v-html="
                $t('data.billing.trial_summary[0]', {
                  duration: result.duration || 'yearly',
                  price: result.next_billing_payment
                    ? result.next_billing_payment
                    : result.price || 0,
                  currency: result.currency || 'USD',
                  next_bill: nextBill || ''
                })
              "
            />
            <li>{{ $t('data.billing.trial_summary[1]') }}</li>
          </ul>
          <ul v-else>
            <li
              v-html="
                $t('data.billing.plan_details[1]', {
                  duration: result.duration || 'yearly',
                  price: result.next_billing_payment
                    ? result.next_billing_payment
                    : result.price || 0,
                  currency: result.currency || 'USD',
                  next_bill: nextBill || ''
                })
              "
            />
            <li>{{ $t('data.billing.plan_details[2]') }}</li>
          </ul>
        </div>

        <!-- FAMILY: Add member -->
        <family-members v-if="selectedPlan.alias === 'pm_family'" />

        <!-- Select card -->
        <card-select />

        <div class="mt-8">
          <el-button
            :disabled="!selectedCard"
            :loading="loading"
            class="btn btn-primary w-full hover:!text-white"
            @click="confirmPlan()"
          >
            {{ $t('data.billing.pay_and_upgrade') }}
          </el-button>
        </div>
        <!-- Payment end -->
      </div>
    </div>
  </div>
</template>
<script>
import CardSelect from './CardSelect.vue'
import FamilyMembers from './FamilyMembers.vue'

export default {
  components: { FamilyMembers, CardSelect },
  props: {
    selectedPlan: {
      type: Object,
      default: () => ({})
    },
    selectedPeriod: {
      type: Object,
      default: () => ({})
    }
  },

  data () {
    return {
      result: {},
      havePromoCode: false,
      promo_code: '',
      loading: false,
      selectedCard: ''
    }
  },

  computed: {
    currentPlan () {
      return this.$store.state.currentPlan
    },
    nextBill () {
      const now = new Date().getTime()
      const nextBill = this.result.next_billing_time
        ? this.$moment(this.result.next_billing_time * 1000).format(
          'DD MMM YYYY'
        )
        : this.result.duration === 'yearly'
          ? this.$moment(now).add(1, 'years').format('DD MMM YYYY')
          : this.$moment(now).add(1, 'months').format('DD MMM YYYY')
      return nextBill
    }
  },

  methods: {
    getPlanName (text) {
      if (text) {
        const [name, tag] = text.split(' ')
        return { name, tag }
      }
      return { name: '', tag: '' }
    },

    async confirmPlan () {
      try {
        this.loading = true
        const shareKey = await this.$cryptoService.makeShareKey()
        const orgKey = shareKey[0].encryptedString
        const collection = await this.$cryptoService.encrypt(
          'defaultCollection',
          shareKey[1]
        )
        const collectionName = collection.encryptedString
        this.family_members =
          this.selectedPlan.alias === 'pm_family' ? this.family_members : []
        await this.$axios.$post('cystack_platform/pm/payments/plan', {
          plan_alias: this.selectedPlan.alias,
          duration: this.selectedPeriod.duration,
          payment_method: this.paymentMethod,
          id_card: this.selectedCard,
          promo_code: this.promo_code,
          number_members: this.number_members,
          key: orgKey,
          collection_name: collectionName,
          family_members: this.family_members
        })
        this.$store.dispatch('LoadCurrentPlan')
        this.step = 3
        this.notify(this.$t('data.notifications.upgrade_success'), 'success')
      } catch {
        this.notify(this.$t('data.notifications.error_occurred'), 'warning')
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.input-tags .el-input-group__prepend {
  @apply p-0 bg-white;
}
.cs-field {
  //width: 100%;
  min-height: 40px;
  display: flex;
  padding-left: 12px;
  position: relative;
  border-radius: 2px;
  border: solid 1px #e6e8f4;
  &.is-hover,
  &.is-focus {
    @apply border-primary bg-white;
    label {
      @apply text-primary;
    }
  }
  &.is-error {
    @apply border-danger mb-8 last:mb-8 #{!important};
    label,
    .cs-helper-text {
      @apply text-danger;
    }
  }
  &.is-password.is-focus,
  &.is-password.have-value {
    button.btn {
      @apply absolute p-0.5;
      top: 19px;
      right: 13px;
    }
    .cs-input {
      padding-right: 48px;
    }
  }
  &.is-focus label,
  &.have-value label {
    font-size: 12px;
    line-height: 19px;
    top: 5px;
    left: 11px;
  }
  &.is-focus .cs-textarea,
  &.have-value .cs-textarea {
    padding-top: 8px;
    margin-top: 8px;
  }
  &.is-disabled {
    cursor: not-allowed;
    input,
    button,
    input:hover,
    button:hover {
      cursor: not-allowed !important;
      user-select: none;
    }
  }
  .cs-input,
  .cs-textarea {
    align-self: center;
    padding-left: 2px !important;
    width: 100%;
    padding-bottom: 0px;
    padding-top: 0px;
    font-size: 14px;
    line-height: 19px;
    border: none;
    flex: 1;
    color: #161922;
    height: 32px;
    background-color: inherit;
    min-width: 150px;
  }
  .input-tags {
    flex-grow: 1;
    display: flex;
    flex-wrap: wrap;
    align-self: center;
    gap: 2px;
    padding: 2px 0px;
  }
}
</style>
