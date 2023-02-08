<template>
  <div
    v-if="!!nextTime && isEnterpriseAdminOrOwner"
    class="w-full bg-warning text-center py-1 px-4 sticky top-0 z-10"
  >
    <p>
      {{ $t('data.enterprise.warning.text', { time: nextTimeText }) }}
      <a
        href="https://enterprise.locker.io/admin/billing/payment-method"
        class="font-semibold text-info hover:text-info"
      >
        {{ $t('data.enterprise.warning.link') }}
      </a>
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
    }
  },
  mounted () {
    this.checkNextTime()
  },
  methods: {
    async checkNextTime () {
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
