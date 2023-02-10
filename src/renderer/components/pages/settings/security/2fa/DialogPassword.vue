<template>
  <div>
    <el-dialog
      :visible.sync="dialogPasswordVisible"
      width="420px"
      custom-class="modal-no-padding"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div slot="title">
        <h3 class="markdown-body my-0">
          Please enter your password to continue
        </h3>
      </div>
      <div>
        <p>
          The action you are trying to do requires that you re-enter your
          password.
        </p>
        <div
          :class="[
            bugs.password ? 'has-danger' : '',
            'form-group m-form__group'
          ]"
        >
          <el-input
            v-model="password"
            placeholder="Enter your password"
            show-password
            size="small"
          />
          <div v-if="bugs.password" class="form-control-feedback">
            {{ bugs.password[0] }}
          </div>
        </div>
      </div>
      <div slot="footer">
        <div class="text-right">
          <button class="btn btn-sm btn-primary" @click="confirmDialog">
            {{ $t('common.confirm') }}
          </button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    action: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      dialogPasswordVisible: false,
      password: '',
      bugs: {},
      data: {}
    }
  },
  methods: {
    openDialog (data) {
      this.$emit('result', true)
      this.data = data
      this.dialogPasswordVisible = true
    },
    closeDialog () {
      this.dialogPasswordVisible = false
      this.$emit('updateResult', false)
    },
    changeRecoverEmail () {
      this.bugs = {}
      const url = '/sso/me/account_recovery'
      this.$axios
        .$put(url, { ...this.data, password: this.password })
        .then(() => {
          this.dialogPasswordVisible = false
          this.notify(this.$t('data.profile.setting_success'), 'success')
        })
        .catch(e => {
          if (e.response) {
            if (e.response.data.code === '0004') {
              this.bugs = e.response.data.details
            } else {
              this.notify(this.$t('data.profile.setting_failed'), 'warning')
            }
          }
        })
        .then(() => {
          this.password = ''
        })
    },
    turnOff2Factor () {
      this.$axios
        .$post('/sso/me/factor2/activate', { password: this.password })
        .then(() => {
          this.$emit('result', true)
          this.dialogPasswordVisible = false
          this.notify(this.$t('data.profile.setting_success'), 'success')
        })
        .catch(e => {
          if (e.response) {
            if (e.response.data.code === '0004') {
              this.bugs = e.response.data.details
            } else {
              this.notify(this.$t('data.profile.setting_failed'), 'warning')
            }
          }
          this.notify(this.$t('data.profile.setting_failed'), 'warning')
        })
        .then(() => {
          this.password = ''
        })
    },
    confirmDialog () {
      switch (this.action) {
      case 'recovery_email':
        this.changeRecoverEmail()
        break
      case '2factor':
        this.turnOff2Factor()
        break
      case 'delete_user':
        this.deleteUser()
        break
      default:
        break
      }
    },
    deleteUser () {
      this.$axios
        .$post('/sso/me', { password: this.password })
        .then(async () => {
          await this.$auth.setUser({})
          await this.$auth.setUserToken(false)
          await this.$axios.setToken(false)
          await this.$auth.$storage.setUniversal('loggedIn', false)

          window.Intercom('shutdown')
          window.intercomSettings = {
            app_id: this.intercomAppId,
            api_base: `https://${this.intercomAppId}.intercom-messenger.com`
          }
          window.Intercom('boot', { app_id: this.intercomAppId })
          this.$router.push({ name: 'login' })
        })
        .catch(e => {
          if (e.response) {
            if (e.response.data.code === '0004') {
              this.bugs = e.response.data.details
            }
          }
        })
    }
  }
}
</script>
