<template>
  <div class="flex-column-fluid lg:px-28 py-10 px-10 mb-20">
    <!-- Confirmation -->
    <div class="setting-wrapper p-8 !mb-8 text-center">
      <img src="~/assets/images/icons/CheckCircle.svg" class="mx-auto">
      <h1 class="text-black font-semibold text-head-4 mt-6">
        {{ $t('data.billing.payment_success') }}
      </h1>
      <p class="mt-6" v-html="$t('data.billing.thankyou')" />
      <div class="mt-6">
        <el-button
          type="primary"
          plain
          @click="$router.push(localeRoute({ name: 'vault' }))"
        >
          {{ $t('data.billing.back_to_home') }}
        </el-button>
      </div>
    </div>
    <div class="setting-wrapper">
      <div class="setting-section">
        <div class="setting-section-header">
          <h2 class="text-[18px] font-semibold">
            {{ $t('data.plans.order_summary') }}
          </h2>
        </div>
      </div>
      <div class="setting-section">
        <div class="setting-section-header text-black-600">
          <div>
            <p>
              {{ selectedPlan.name }}
              <span v-if="currentPlan.personal_trial_applied === false">({{ $t('data.plans.trial_included') }})</span>
            </p>
            <p>({{ $t(`data.plans.price.${selectedPeriod.label}`) }})</p>
          </div>
          <div>
            <p>{{ result.price | formatNumber }} {{ result.currency }}</p>
          </div>
        </div>
        <div
          v-if="result.discount !== 0"
          class="setting-section-header text-warning mt-3"
        >
          <p>{{ $t('common.discount') }} -{{ discountPercentage }}%</p>
          <p>
            -{{ result.discount | formatNumber }}
            {{ result.currency }}
          </p>
        </div>
      </div>

      <div class="setting-section">
        <div class="setting-section-header">
          <div>
            <p class="setting-title">
              {{ $t('data.billing.total') }}
            </p>
            <p class="text-black-600">
              {{ $t('data.plans.next_billing_on') }} {{ nextBill }}
            </p>
          </div>
          <div class="font-semibold">
            {{ result.immediate_payment | formatNumber }}
            {{ result.currency }}
          </div>
        </div>
      </div>
    </div>

    <div class="setting-wrapper">
      <div class="setting-section">
        <div class="setting-section-header">
          <h2 class="text-[18px] font-semibold">
            {{ $t('data.billing.billing_contact') }}
          </h2>
        </div>
      </div>

      <div class="setting-section">
        <div>
          <div class="setting-title">{{ $t('common.name') }}</div>
          <div class="setting-description">{{ selectedCard.name }}</div>
        </div>
        <div v-if="selectedCard.email" class="mt-4">
          <div class="setting-title">{{ $t('common.email') }}</div>
          <div class="setting-description">{{ selectedCard.email }}</div>
        </div>
        <div v-if="selectedCard.company" class="mt-4">
          <div class="setting-title">{{ $t('common.name') }}</div>
          <div class="setting-description">{{ selectedCard.company }}</div>
        </div>
      </div>
    </div>

    <div v-if="selectedCard.address" class="setting-wrapper">
      <div class="setting-section">
        <div class="setting-section-header">
          <h2 class="text-[18px] font-semibold">
            {{ $t('data.billing.billing_address') }}
          </h2>
        </div>
      </div>
      <div class="setting-section">
        <div v-if="selectedCard.address">
          <div class="setting-title">{{ $t('common.address') }}</div>
          <div class="setting-description">{{ selectedCard.address }}</div>
        </div>
        <div v-if="selectedCard.address_city" class="mt-4">
          <div class="setting-title">{{ $t('common.city') }}</div>
          <div class="setting-description">
            {{ selectedCard.address_city }}
          </div>
        </div>
        <div v-if="selectedCard.address_country" class="mt-4">
          <div class="setting-title">{{ $t('common.country') }}</div>
          <div class="setting-description">
            {{ selectedCard.address_country }}
          </div>
        </div>
        <div v-if="selectedCard.address_zip" class="mt-4">
          <div class="setting-title">{{ $t('common.zip') }}</div>
          <div class="setting-description">
            {{ selectedCard.address_zip }}
          </div>
        </div>
      </div>
    </div>
    <!-- Confirmation end -->
  </div>
</template>
<script>
export default {
  props: {
    selectedPeriod: {
      type: Object,
      default: () => ({})
    },
    selectedPlan: {
      type: Object,
      default: () => ({})
    },
    result: {
      type: Object,
      default: () => ({})
    },
    selectedCard: {
      type: Object,
      default: () => ({})
    }
  },

  computed: {
    discountPercentage () {
      const discountPercentage =
        (this.result.discount * 100) / this.result.total_price
      if (!Number.isNaN(discountPercentage)) {
        return Math.ceil(discountPercentage)
      }
      return 0
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
  }
}
</script>
