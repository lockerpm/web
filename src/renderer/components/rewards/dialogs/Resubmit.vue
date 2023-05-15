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
        <div v-html="$t('data.rewards.verify_popup.resubmit.desc')" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      dialogVisible: false
    }
  },
  methods: {
    openDialog () {
      this.dialogVisible = true
    },
    closeDialog () {
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
