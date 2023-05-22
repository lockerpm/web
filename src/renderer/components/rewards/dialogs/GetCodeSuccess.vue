<template>
  <div>
    <el-dialog
      :visible.sync="dialogVisible"
      width="430px"
      custom-class="locker-dialog"
      @closed="() => $emit('closed')"
    >
      <div class="flex items-center justify-center">
        <img :src="require('~/assets/images/icons/get-code-success.svg')">
      </div>
      <div class="flex justify-center">
        <div class="code-box text-black-600">
          <span class="flex">
            {{ dialogData.code }}
            <span class="flex items-center cursor-pointer ml-2">
              <img :src="require('~/assets/images/icons/copy.svg')">
            </span>
          </span>
        </div>
      </div>
      <div class="text-center mt-3">
        <div class="mb-4">
          {{ $t('data.rewards.get_code.popup.note1', { time: dialogData.currentTime }) }}:
        </div>
        <div v-html="$t('data.rewards.get_code.popup.redeem_note', { time: dialogData.currentTime })" />
        <div
          class="mt-6 flex items-center justify-center text-green font-semibold cursor-pointer"
          @click="$emit('redeemCode', dialogData.code)"
        >
          {{ $t('data.rewards.get_code.redeem_code') }}
          <i class="el-icon-right ml-2" />
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      dialogVisible: false,
      dialogData: {}
    }
  },
  methods: {
    openDialog (data) {
      this.dialogData = data
      this.dialogVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>
.code-box {
  width: max-content;
  padding: 8px 24px;
  border: 1px solid #072245;
  border-radius: 4px;
  font-weight: 600;
}
</style>
