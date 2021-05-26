<template>
  <el-dialog
    :visible.sync="dialogVisible"
    width="575px"
    destroy-on-close
    top="5vh"
    custom-class="locker-dialog"
    :close-on-click-modal="false"
  >
    <div slot="title">
      <div class="text-head-5 text-black-700 font-semibold truncate">
        Change Master Password
      </div>
    </div>
    <div class="text-left">
      <div class="form-group">
        <label for="">Nhập Master Key hiện tại</label>
        <input v-model="oldMasterPassword"
               :type="showPassword ? 'text' : 'password'"
               class="form-control"
               :name="randomString()" autocomplete="new-password"
        >
      </div>
      <div class="form-group">
        <label for="">Nhập Master Key mới</label>
        <input v-model="masterPassword"
               :type="showPassword ? 'text' : 'password'"
               class="form-control mb-2"
               :name="randomString()" autocomplete="new-password"
        >
        <PasswordStrengthBar v-if="masterPassword" :score="passwordStrength.score" />
      </div>
      <div class="form-group">
        <label for="">Xác nhận Master Key mới</label>
        <input v-model="masterRePassword"
               :type="showPassword ? 'text' : 'password'"
               class="form-control"
               name="repassword"
               placeholder=""
               :class="[errors.masterRePassword ? 'is-invalid' :'']"
        >
        <div class="invalid-feedback">{{ $t('errors.confirm_password') }}</div>
      </div>
    </div>
    <div slot="footer" class="dialog-footer flex items-center text-left">
      <div class="flex-grow">
        <button class="btn btn-clean !px-0" @click="showPassword = !showPassword">
          <i class="far"
             :class="{'fa-eye': !showPassword, 'fa-eye-slash': showPassword}"
          /> Show Passwords
        </button>
      </div>
      <div>
        <button class="btn btn-default"
                @click="dialogVisible = false"
        >
          Cancel
        </button>
        <button class="btn btn-primary"
                :disabled="loading || !oldMasterPassword || !masterRePassword || !masterPassword"
                @click="changePass"
        >
          Change Password
        </button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { FolderRequest } from '../../jslib/src/models/request'
import PasswordStrengthBar from '../password/PasswordStrengthBar'
export default {
  components: { PasswordStrengthBar },
  data () {
    return {
      folder: {},
      loading: false,
      dialogVisible: false,
      errors: {},
      redirect: false,
      shouldRedirect: false,
      writeableCollections: [],
      oldMasterPassword: '',
      masterPassword: '',
      masterRePassword: '',
      key: '',
      showPassword: false
    }
  },
  computed: {
    passwordStrength () {
      return this.$passwordGenerationService.passwordStrength(this.masterPassword, ['cystack']) || {}
    }
  },
  watch: {
    masterRePassword (newValue) {
      if (this.masterPassword && newValue && this.masterPassword !== newValue) {
        this.errors.masterRePassword = 1
      } else {
        this.errors.masterRePassword = 0
      }
    }
  },
  mounted () {
  },
  methods: {
    openDialog (folder = {}, shouldRedirect = false) {
      this.dialogVisible = true
      this.shouldRedirect = shouldRedirect
      this.folder = { ...folder }
    },
    closeDialog () {
      this.dialogVisible = false
    },
    async changePass () {
      try {
        this.loading = true
        const kdf = 0
        const kdfIterations = 100000
        const key = await this.$cryptoService.makeKey(this.masterPassword, this.currentUser.email,
          kdf, kdfIterations)
        const newMasterPasswordHash = await this.$cryptoService.hashPassword(this.masterPassword, key)
        console.log(1)
        let encKey = null
        const existingEncKey = await this.$cryptoService.getEncKey()
        if (existingEncKey == null) {
          encKey = await this.$cryptoService.makeEncKey(key)
        } else {
          encKey = await this.$cryptoService.remakeEncKey(key)
        }

        const masterPasswordHash = await this.$cryptoService.hashPassword(this.oldMasterPassword, null)
        console.log(2)
        await this.$axios.$post('cystack_platform/pm/users/me/password', {
          key: encKey[1].encryptedString,
          new_master_password_hash: newMasterPasswordHash,
          master_password_hash: masterPasswordHash
        })

        this.notify(this.$t('data.notifications.update_master_success'), 'success')
        this.closeDialog()
        await this.$userService.clear()
        await this.$messagingService.send('locked')
      } catch (e) {
        console.log(e)
        this.notify(this.$t('data.notifications.update_master_failed'), 'warning')
        this.errors = (e.response && e.response.data && e.response.data.details) || {}
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
