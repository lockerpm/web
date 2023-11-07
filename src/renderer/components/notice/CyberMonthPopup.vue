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
          src="~/assets/images/cyber-month-2023.png"
          @click="upgradePlan"
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  computed: {
    dialogVisible () {
      return this.$store.state.notice.showCyberMonthPopup
    }
  },
  methods: {
    closeDialog () {
      this.$store.commit('UPDATE_NOTICE', { showCyberMonthPopup: false })
    },
    upgradePlan () {
      this.closeDialog()
      this.$router.push('/promo/cyber-month-2023')
    }
  }
}
</script>

<style lang="scss" scoped></style>
