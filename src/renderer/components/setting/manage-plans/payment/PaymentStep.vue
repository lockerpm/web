<template>
  <div class="flex-column-fluid lg:px-28 py-6 px-10 mb-20">
    <!-- Left content -->
    <div>
      <!-- Step title -->
      <div class="flex flex-col mb-6">
        <h1 class="text-head-3 font-semibold mb-1">
          {{ $t('data.plans.payment') }}
        </h1>
        <div class="mb-3">{{ $t('data.plans.choose_payment_method') }}</div>
      </div>
      <!-- Step title end-->

      <div class="setting-wrapper p-8">
        <!-- Review plan -->
        <plan-review
          :selected-period="selectedPeriod"
          :switch-period="switchPeriod"
          :plans="plans"
          :selected-plan="selectedPlan"
          :switch-plan="switchPlan"
        />
        <!-- Review plan end -->

        <!-- Family members -->
        <family-members
          v-if="selectedPlan.alias === 'pm_family'"
          :members="familyMembers"
          :set-members="v => (familyMembers = v)"
        />
        <!-- Family members ended -->

        <hr class="my-8 border-black-100">

        <!-- Card select -->
        <card-select :set-card-id="val => (cardId = val)" />
        <!-- Card select end -->
      </div>
    </div>
    <!-- Left content end -->
  </div>
</template>
<script>
import PlanReview from './PlanReview.vue'
import FamilyMembers from './FamilyMembers.vue'
import CardSelect from './CardSelect.vue'

export default {
  components: {
    PlanReview,
    FamilyMembers,
    CardSelect
  },

  props: {
    selectedPeriod: {
      type: Object,
      default: () => ({})
    },
    switchPeriod: {
      type: Function,
      default: () => {}
    },
    plans: {
      type: Array,
      default: () => []
    },
    selectedPlan: {
      type: Object,
      default: () => ({})
    },
    switchPlan: {
      type: Function,
      default: () => {}
    }
  },

  data () {
    return {
      familyMembers: [],
      cardId: ''
    }
  }
}
</script>
