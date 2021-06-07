<template>
  <div>
    <el-dialog
      :visible.sync="dialogVisible"
      width="575px"
      destroy-on-close
      top="15vh"
      custom-class="locker-dialog"
      :close-on-click-modal="false"
    >
      <div slot="title">
        <div class="text-head-5 text-black-700 font-semibold truncate">
          {{ $t(`data.notifications.purge_team_title`) }}
        </div>
      </div>
      <div class="text-left">
        <div class="locker-callout locker-callout-danger mb-5">
          <div class="mb-2 font-semibold text-danger">
            {{ $t(`data.notifications.purge_team_title`) }}
          </div>
          <div>
            {{ $t(`data.notifications.purge_team_description`) }}
          </div>
        </div>
        <form @submit.prevent="confirmPassword">
          <div class="form-group">
            <label for="">Master Key</label>
            <div class="input-group" :class="errors.password ? 'is-invalid' : ''">
              <input v-model="password"
                     :type="showPassword ? 'text' : 'password'"
                     class="form-control mb-4"
                     autocomplete="new-password"
                     :disabled="loading"
                     @change="errors = {}"
              >
              <div class="input-group-append !bg-white">
                <button class="btn btn-icon" @click="showPassword = !showPassword">
                  <i class="far"
                     :class="{'fa-eye': !showPassword, 'fa-eye-slash': showPassword}"
                  />
                </button>
              </div>
            </div>
            <div class="invalid-feedback">
              {{ $t('errors.invalid_password') }}
            </div>
          </div>
        </form>
      </div>
      <div slot="footer" class="dialog-footer flex items-center text-left">
        <div class="flex-grow" />
        <div>
          <button class="btn btn-default"
                  @click="dialogVisible = false"
          >
            Cancel
          </button>
          <button class="btn btn-danger"
                  :disabled="loading || !password"
                  @click="confirmPassword"
          >
            {{ $t(`common.purge`) }}
          </button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      password: '',
      showPassword: false,
      dialogVisible: false,
      loading: false,
      count: 0,
      errors: {},
      type: 'purge'
    }
  },
  computed: {
  },
  mounted () {
  },
  methods: {
    async openDialog (type) {
      this.dialogVisible = true
      this.password = ''
      this.type = type
      this.count = 0
    },
    closeDialog () {
      this.dialogVisible = false
    },
    async confirmPassword () {
      this.loading = true
      this.errors = { }
      const keyHash = await this.$cryptoService.hashPassword(this.password, null)
      const storedKeyHash = await this.$cryptoService.getKeyHash()
      if (storedKeyHash != null && keyHash != null && storedKeyHash === keyHash) {
        await this.purgeAccount()
        this.closeDialog()
      } else {
        this.errors = { password: 1 }
        this.count++
        this.$emit('reject')
        if (this.count > 5) {
          this.lock()
        }
      }
      this.loading = false
    },
    async purgeAccount (hashedPassword) {
      try {
        await this.$post(`cystack_platform/pm/teams/${this.$route.params.teamId}/purge`, {
          master_password_hash: hashedPassword
        })
        this.closeDialog()
        this.notify(this.$t('data.notifications.purge_team_success'), 'success')
      } catch (e) {
        this.notify(this.$t('data.notifications.purge_team_failed'), 'warning')
      }
    }
  }
}
</script>
