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
        :type="!(availablePercent - gennedPercent) ? '' : 'success'"
        :disabled="!(availablePercent - gennedPercent)"
        @click="$emit('getCode')"
      >
        {{ $t('data.rewards.get_code.title') }}
      </el-button>
      <div v-html="$t('data.rewards.get_code.note', { percent: remainPercent })" class="ml-2"/>
    </div>
    <div v-if="promoCodes.length > 0" class="mt-3">
      <p class="mb-2 font-semibold">{{ $t('data.rewards.get_code.your_codes') }}</p>
      <div
        v-for="code in promoCodes"
        :key="code.id"
      >
        <el-card
          class="w-[300px]"
          shadow="never"
        >
          <div class="flex items-center justify-between">
            <div class="font-bold flex">
              <span class="mr-2">{{ code.code }}</span>
              <span
                v-clipboard:copy="code.code"
                v-clipboard:success="clipboardSuccessHandler"
                class="flex items-center cursor-pointer"
              >
                <i class="far fa-copy" />
              </span>
            </div>
            <p class="font-bold">{{ $t('data.billing.expiration').toUpperCase() }}</p>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-warning">{{ $t('data.rewards.note2', { percent: code.value }) }}</span>
            <span class="text-black-500">{{ $moment(code.expired_time * 1000).format('MMMM Do YYYY') }}</span>
          </div>
        </el-card>
        <div
          class="mt-3 flex items-center text-green font-semibold cursor-pointer"
          @click="$emit('redeemCode', code.code)"
        >
          {{ $t('data.rewards.get_code.redeem_code') }}
          <i class="el-icon-right ml-2" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
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
    },
    gennedPercent: {
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
