<template>
  <div>
    <el-dialog
      :visible.sync="dialogVisible"
      width="430px"
      custom-class="locker-dialog"
      @closed="() => $emit('closed')"
    >
      <div class="flex items-center justify-center">
        <img :src="require('~/assets/images/icons/congrats.svg')">
      </div>
      <div class="text-center mt-5">
        <div class="text-head-5 font-semibold mb-5">
          {{ $t('data.rewards.verify_popup.congrats') }}
        </div>
        <div class="mb-5" v-html="$t('data.rewards.verify_popup.congrats_desc')" />
        <el-button type="success" @click="getCode">
          {{ $t('data.rewards.verify_popup.continue') }}
        </el-button>
        <a class="mt-3 flex items-center justify-center text-info cursor-pointer">
          {{ $t('data.rewards.verify_popup.see_free_month') }}
          <i class="el-icon-right ml-2" />
        </a>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      dialogVisible: false,
      percent: 20
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
