<template>
  <div
    v-if="isVisible"
    class="w-full bg-warning text-center py-1 px-4 sticky top-0 z-10"
  >
    <p v-if="isEnterprisePayment">
      {{ $t('data.enterprise.warning.text', { time: nextTimeText }) }}
      <a
        :href="enterprisePaymentUrl"
        class="font-semibold text-info hover:text-info"
      >
        {{ $t('data.enterprise.warning.link') }}
      </a>
    </p>

    <p v-else>
      {{
        $t('data.billing.update_payment_or_downgrade', { time: nextTimeText })
      }}
      <nuxt-link
        to="/settings/plans-billing"
        class="font-semibold text-info hover:text-info"
      >
        {{ $t('data.enterprise.warning.link') }}
      </nuxt-link>
    </p>
  </div>
</template>

<script>
export default {
  data () {
    return {
      nextTime: null
    }
  },

  computed: {
    nextTimeText () {
      return this.$moment(this.nextTime).format('hh:mm:ss DD/MM/YYYY')
    },
    enterprisePaymentUrl () {
      return `${process?.env?.lockerEnterprise}/admin/billing/payment-method`
    },
    isEnterprisePayment () {
      return !!this.currentOrg?.id
    },
    isVisible () {
      if (!this.nextTime) {
        return false
      }
      if (this.isEnterprisePayment) {
        return this.isEnterpriseAdminOrOwner
      }
      return true
    }
  },

  mounted () {
    if (this.isEnterprisePayment) {
      this.checkEnterpriseNextTime()
    } else {
      this.checkPersonalNextTime()
    }
  },

  methods: {
    async checkPersonalNextTime () {
      if (this.currentPlan?.alias === 'pm_free') {
        return
      }
      try {
        const res = await this.$axios.$get(
          'cystack_platform/pm/payments/next_attempt'
        )
        this.nextTime = res.next_payment_attempt * 1000
      } catch (e) {
        //
      }
    },

    async checkEnterpriseNextTime () {
      if (!this.currentOrg?.id || this.isOnPremise) {
        return
      }
      try {
        const res = await this.$axios.$get(
          `cystack_platform/pm/enterprises/${this.currentOrg.id}/payments/next_attempt`
        )
        this.nextTime = res.next_payment_attempt * 1000
      } catch (e) {
        //
      }
    }
  }
}
</script>

<style scoped></style>
