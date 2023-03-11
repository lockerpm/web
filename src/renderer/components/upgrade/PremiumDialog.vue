<template>
  <div>
    <el-dialog
      :visible="dialogVisible"
      width="60%"
      class="premium-dialog header-no-padding body-no-padding"
      @close="closeDialog"
    >
      <div slot="title">
        <img
          width="100%"
          src="~/assets/images/upgrade_premium.png"
          @click="closeDialog"
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      bg: '/upgrade_premium.png'
    }
  },
  computed: {
    dialogVisible () {
      return this.$store.state.notice.showPleaseUpgrade
    }
  },
  methods: {
    closeDialog () {
      this.$store.commit('UPDATE_NOTICE', { showPleaseUpgrade: false })
    },
    upgradePlan () {
      this.closeDialog()
      this.$router.push(this.localeRoute({ name: 'manage-plans' }))
    }
  }
}
</script>

<style lang="scss" scoped></style>
