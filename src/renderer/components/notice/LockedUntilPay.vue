<template>
  <el-dialog
    :title="$t('common.warning')"
    :visible="showLocked"
    width="400px"
    custom-class="locker-dialog"
    @close="$store.commit('UPDATE_NOTICE', { showLocked: false })"
  >
    {{ $t('errors.locked_until_pay') }}

    <span slot="footer">
      <el-button
        type="primary"
        @click="goToLock"
      >
        {{ $t('common.ok') }}
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  computed: {
    showLocked () {
      return this.$store.state.notice.showLocked
    }
  },
  methods: {
    goToLock () {
      this.$store.commit('UPDATE_NOTICE', { showLocked: false })
      this.$router.push(this.localeRoute({ name: 'lock' }))
    }
  }
}
</script>

<style scoped>

</style>
