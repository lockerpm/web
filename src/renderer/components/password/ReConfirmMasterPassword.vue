<template>
  <div>
    <el-dialog
      :visible.sync="dialogVisible"
      width="435px"
      destroy-on-close
      top="15vh"
      custom-class="locker-dialog"
      :close-on-click-modal="false"
    >
      <div slot="title">
        <div class="text-head-5 text-black-700 font-semibold truncate">
          Nhập Master Key
        </div>
      </div>
      <div class="text-left">
        <form @submit.prevent="confirmPassword">
          <div class="form-group">
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
          <button class="btn btn-primary"
                  :disabled="loading || !password"
                  @click="confirmPassword"
          >
            {{ $t('common.confirm') }}
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
      errors: {}
    }
  },
  computed: {
  },
  mounted () {
  },
  methods: {
    async openDialog () {
      this.dialogVisible = true
      this.password = ''
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
        this.$emit('done')
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
    }
  }
}
</script>
