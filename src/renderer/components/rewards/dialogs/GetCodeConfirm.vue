<template>
  <div>
    <el-dialog
      :visible.sync="dialogVisible"
      width="500px"
      custom-class="locker-dialog"
      @closed="() => $emit('closed')"
    >
      <div
        slot="title"
      >
        <div class="text-head-5 text-black-700 font-semibold truncate">
          {{ $t('data.rewards.get_code.popup.title', { percent: availablePercent }) }}
        </div>
      </div>
      <div class="text-center">
        <div class="mb-5">
          {{ $t('data.rewards.get_code.popup.desc', { percent: remainPercent }) }}:
        </div>
        <el-button
          type="success"
          :loading="callingAPi"
          @click="getCode"
        >
          {{ $t('data.rewards.get_code.title') }}
        </el-button>
        <div class="text-xs mt-5">
          {{ $t('data.rewards.get_code.popup.note', { time: currentTime }) }}:
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  props: {
    callingAPi: {
      type: Boolean,
      default: false
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
      dialogVisible: false,
      dialogData: {},
      currentTime: moment().add(7, 'days').format('MMMM Do YYYY')
    }
  },
  methods: {
    openDialog () {
      this.dialogVisible = true
    },
    closeDialog () {
      this.dialogVisible = false
    },
    getCode () {
      this.$emit('getCode')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
