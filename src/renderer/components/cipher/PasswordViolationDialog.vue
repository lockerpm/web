<template>
  <div>
    <el-dialog
      :visible.sync="dialogVisible"
      width="400px"
      custom-class="locker-dialog"
      @closed="() => $emit('closed')"
    >
      <div slot="title">
        <div class="text-head-5 text-black-700 font-semibold truncate">
          {{ $t('data.password_policies.password_violated') }}
        </div>
      </div>
      <div class="text-left">
        <div>
          {{
            $t('data.password_policies.password_violated_desc', {
              team: teams.length && teams[0].name
            })
          }}:
        </div>
        <div
          v-for="(item, index) in violations"
          :key="index"
          class="font-semibold"
        >
          - {{ item }}
        </div>
      </div>
      <div slot="footer" class="dialog-footer flex justify-center">
        <el-button type="primary" class="w-full" @click="confirmPw">
          {{ strict ? 'OK' : $t('data.password_policies.confirm_violation') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    strict: {
      type: Boolean,
      default: () => false
    }
  },
  data () {
    return {
      dialogVisible: false,
      violations: []
    }
  },
  methods: {
    openDialog (violations = []) {
      this.dialogVisible = true
      this.violations = { ...violations }
    },
    confirmPw () {
      this.dialogVisible = false
      this.$emit('confirm')
    }
  }
}
</script>

<style lang="scss" scoped></style>
