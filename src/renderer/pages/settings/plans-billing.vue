<template>
  <div class="lg:w-3/4">
    <div class="text-head-5 font-semibold mb-2">
      {{ $t('data.settings.plans_billing') }}
    </div>
    <div class="text-lg text-black-600 mb-8">
      {{ $t('data.settings.plans_billing_desc') }}
    </div>

    <!-- SECTION 1: USER's PLAN -->
    <plan-info />

    <!-- SECTION 2: PAYMENT METHODS -->
    <payment-method />

    <!-- SECTION 3: INVOICES -->
    <invoices />
  </div>
</template>

<script>
import PlanInfo from '../../components/setting/plans-billing/PlanInfo.vue'
import PaymentMethod from '../../components/setting/plans-billing/PaymentMethod.vue'
import Invoices from '../../components/setting/plans-billing/Invoices.vue'

export default {
  components: {
    PlanInfo,
    PaymentMethod,
    Invoices
  },
  middleware: ['BlockEnterpriseMember'],
  mounted () {
    this.$store.dispatch('LoadCurrentPlan')
  }
}
</script>
