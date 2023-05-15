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
          {{ $t('data.rewards.get_code.popup.title', { percent }) }}
        </div>
      </div>
      <div class="text-center">
        <div class="mb-5">
          {{ $t('data.rewards.get_code.popup.desc') }}:
        </div>
        <el-button type="success" @click="getCode">
          {{ $t('data.rewards.get_code.title') }}
        </el-button>
        <div class="text-xs mt-5">
          {{ $t('data.rewards.get_code.popup.note') }}:
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
      percent: 20
    }
  },
  methods: {
    openDialog () {
      this.dialogVisible = true
    },
    getCode () {
      this.dialogVisible = false
      this.$emit('getCode')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
