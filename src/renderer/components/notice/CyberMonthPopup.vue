<template>
  <div>
    <el-dialog
      :visible="dialogVisible"
      width="90%"
      custom-class="max-w-[550px]"
      class="premium-dialog header-no-padding body-no-padding"
      @close="close"
    >
      <div slot="title">
        <img
          v-if="locale === 'vi'"
          width="100%"
          src="~/assets/images/cyber-month-2023-vi.png"
          @click="upgradePlan"
        >
        <img
          v-else
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
    open () {
      this.$store.commit('UPDATE_NOTICE', { showCyberMonthPopup: true })
    },
    close () {
      this.$store.commit('UPDATE_NOTICE', { showCyberMonthPopup: false })
    },
    upgradePlan () {
      this.close()
      const path =
        '/promo/cyber-month-2023?utm_source=website&utm_medium=popup&utm_campaign=cybersale&utm_term=1'
      window.open(path, '_blank')
    }
  }
}
</script>

<style lang="scss" scoped></style>
