<template>
  <div>
    <el-dialog
      :visible.sync="dialogVisible"
      width="430px"
      custom-class="locker-dialog"
      @closed="() => $emit('closed')"
    >
      <div class="flex items-center justify-center">
        <img :src="require('~/assets/images/icons/resubmit.svg')">
      </div>
      <div class="text-center mt-5">
        <div class="text-head-5 font-semibold mb-5">
          {{ $t('data.rewards.verify_popup.resubmit.title') }}
        </div>
        <div v-if="dialogData.type === 'free_month' || !dialogData.store">
          <div v-html="$t('data.rewards.verify_popup.resubmit.desc1', { action: dialogData.action })" />
          <div class="mt-m" v-html="$t('data.rewards.verify_popup.resubmit.desc2')" />
        </div>
        <div v-else-if="dialogData.store === 'desktop'">
          <div v-html="dialogData.message" />
        </div>
        <div v-else
          v-html="$t('data.rewards.verify_popup.resubmit.desc', {
            action: dialogData.action,
            store: dialogData.store
          })"
        />
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      dialogVisible: false,
      dialogData: {
        type: 'free_month',
        action: '',
        store: ''
      }
    }
  },
  methods: {
    openDialog (data) {
      this.$emit('reload')
      this.dialogData = data
      this.dialogVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
