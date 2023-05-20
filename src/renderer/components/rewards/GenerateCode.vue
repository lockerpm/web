<template>
  <div class="generate-code">
    <div class="mt-6">
      <el-progress
        :percentage="(availablePercent / totalPercent) * 100"
        :show-text="false"
        status="success"
        style="width: 260px;"
      />
      <p v-if="availablePercent > 0" class="mt-1">
        {{ $t('data.rewards.progress', { percent: availablePercent }) }}
      </p>
      <p v-else class="mt-1">
        {{ $t('data.rewards.no_discount', { percent: remainPercent }) }}
      </p>
    </div>
    <div v-if="availablePercent > 0" class="flex items-center mt-6">
      <el-button
        type="success"
        @click="openGetCodeConfirmDialog"
      >
        {{ $t('data.rewards.get_code.title') }}
      </el-button>
      <div v-html="$t('data.rewards.get_code.note', { percent: remainPercent })" class="ml-2"/>
    </div>
    <div v-if="promoCodes.length > 0" class="mt-3">
      <p class="mb-2 font-semibold">{{ $t('data.rewards.get_code.your_codes') }}</p>
      <el-card class="w-[300px]" shadow="never">
        <div class="flex items-center justify-between">
          <div class="font-bold flex">
            <span class="mr-2">ANV947NVWd732</span>
            <span
              v-clipboard:copy="'ANV947NVWd732'"
              v-clipboard:success="clipboardSuccessHandler"
              class="flex items-center cursor-pointer"
            >
              <i class="far fa-copy" />
            </span>
          </div>
          <p class="font-bold">EXPIRATION</p>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-warning">5% off code</span>
          <span class="text-black-500">Apr 30, 2023</span>
        </div>
      </el-card>
      <div class="mt-3 flex items-center text-green font-semibold">
        {{ $t('data.rewards.get_code.redeem_code') }}
        <i class="el-icon-right ml-2" />
      </div>
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
    claimStatus: {
      type: Object,
      default: () => {}
    },
    totalPercent: {
      type: Number,
      default: 20
    },
    availablePercent: {
      type: Number,
      default: 0
    },
    remainPercent: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      promoCodes: []
    }
  },
  computed: {
  },
  created () {
    this.getPromosCodes()
  },
  methods: {
    getPromosCodes () {
      this.$axios.$get('/cystack_platform/pm/reward/claim/promo_codes').then(res => {
        this.promoCodes = res
      }).catch(() => {
        this.promoCodes = []
      })
    },
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
