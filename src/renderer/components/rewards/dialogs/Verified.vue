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
        <div v-if="dialogData.type === 'free_month'">
          <div class="mb-5" v-html="$t('data.rewards.verify_popup.congrats_desc', { action: dialogData.action })" />
          <el-button type="success" @click="() => dialogData = false">
            {{ $t('data.rewards.verify_popup.continue') }}
          </el-button>
          <a
            class="mt-3 flex items-center justify-center text-info cursor-pointer"
            href="/settings/plans-billing"
          >
            {{ $t('data.rewards.verify_popup.see_free_month') }}
            <i class="el-icon-right ml-2" />
          </a>
        </div>
        <div v-else-if="remainPercent > availablePercent">
          <div
            class="mb-5"
            v-html="$t('data.rewards.verify_popup.congrats_desc1', {
              action: dialogData.action,
              percent:  dialogData.percent,
              current_discount: availablePercent,
              remain_percent: remainPercent
            })"
          />
          <el-button type="success" @click="() => dialogData = false">
            {{ $t('data.rewards.verify_popup.continue') }}
          </el-button>
        </div>
        <div v-else>
          <div
            class="mb-5"
            v-html="$t('data.rewards.verify_popup.congrats_desc2', {
              action: dialogData.action,
              percent:  dialogData.percent,
              current_discount: availablePercent
            })"
          />
          <el-button type="success" @click="() => {}">
            {{ $t('data.rewards.get_code.title') }}
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
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
      dialogVisible: false,
      dialogData: {
        type: 'free_month',
        action: '',
        percent: 5
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
