<template>
  <div class="generate-code">
    <div class="flex items-center">
      <el-button type="success" @click="openGetCodeConfirmDialog">
        {{ $t('data.rewards.get_code.title') }}
      </el-button>
      <div v-html="$t('data.rewards.get_code.note', { percent: percent })" class="ml-2"/>
    </div>
    <div class="mt-3">
      <p class="mb-2 font-semibold">{{ $t('data.rewards.get_code.your_codes') }}</p>
      <el-card class="w-[300px]" shadow="never">
        <div class="flex items-center justify-between">
          <div class="font-bold flex">
            <span class="mr-2">ANV947NVWd732</span>
            <span class="flex items-center cursor-pointer">
              <img :src="require('~/assets/images/icons/copy.svg')">
            </span>
          </div>
          <p class="font-bold">EXPIRATION</p>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-warning">5% off code</span>
          <span class="text-black-500">Apr 30, 2023</span>
        </div>
      </el-card>
    </div>
    <div class="mt-4 flex items-center text-green font-semibold">
      {{ $t('data.rewards.get_code.redeem_code') }}
      <i class="el-icon-right ml-2" />
    </div>
    <GetCodeConfirmDialog
      ref="getCodeConfirmDialog"
      @getCode="handleGetCode"
    />
    <GetCodeSuccessDialog
      ref="getCodeSuccessDialog"
      @redeemCOde="handleRedeemCode"
    />
  </div>
</template>

<script>
import GetCodeConfirmDialog from './dialogs/GetCodeConfirm.vue'
import GetCodeSuccessDialog from './dialogs/GetCodeSuccess.vue'

export default {
  components: {
    GetCodeConfirmDialog,
    GetCodeSuccessDialog
  },
  props: {
  },
  data () {
    return {
      percent: 20
    }
  },
  computed: {
  },
  methods: {
    handleGetCode () {
      this.openGetCodeSuccessDialog()
    },
    openGetCodeConfirmDialog () {
      this.$refs.getCodeConfirmDialog.openDialog(true)
    },
    openGetCodeSuccessDialog () {
      this.$refs.getCodeSuccessDialog.openDialog(true)
    },
    handleRedeemCode () {}
  }
}
</script>
<style lang="scss">
.generate-code {
  .el-card {
    border: none !important;
  }
}
</style>
