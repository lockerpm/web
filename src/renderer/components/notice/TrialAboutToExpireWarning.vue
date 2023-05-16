<template>
  <div
    v-if="!!expireTimeText"
    class="w-full bg-warning text-center py-1 px-4 sticky top-0 z-10"
  >
    <p>
      {{ $t('data.enterprise.about_to_expire_warning.text', {time: expireTimeText}) }}
      <a
        :href="`${process.env.lockerEnterprise}/admin/billing/payment-method`"
        class="font-semibold text-info hover:text-info"
      >
        {{ $t('data.enterprise.about_to_expire_warning.link') }}
      </a>
    </p>
  </div>
</template>

<script>
export default {
  computed: {
    expireTimeText () {
      if (!this.currentOrg?.id || !this.currentOrg?.is_trialing || !this.currentOrg?.end_period) {
        return ''
      }
      const expiredTime = this.$moment(this.currentOrg.end_period * 1000)
      if (expiredTime.diff(this.$moment(), 'days') > 7) {
        return ''
      }
      return expiredTime.format('hh:mm:ss DD/MM/YYYY')
    }
  }
}
</script>

<style scoped>

</style>
