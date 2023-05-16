<template>
  <div>
    <el-dialog
      :visible.sync="dialogVisible"
      md:width="575px"
      destroy-on-close
      top="5vh"
      custom-class="locker-dialog"
    >
      <div slot="title">
        <div class="text-head-5 text-black-700 font-semibold truncate">
          {{ $t('master_password.change') }}
        </div>
      </div>
      <div class="text-left">
        <InputText
          v-model="oldMasterPassword"
          :label="$t('master_password.current_password')"
          class="w-full"
          :error-text="
            errors.oldMasterPassword && $t('errors.invalid_password')
          "
          is-password
          @change="errors = {}"
        />
        <InputText
          v-model="masterPassword"
          :label="$t('master_password.new_password')"
          class="w-full"
          :error-text="errors.masterPassword && $t('errors.confirm_password')"
          is-password
          @change="errors = {}"
        />
        <PasswordStrengthBar
          v-if="masterPassword"
          :score="passwordStrength.score"
          class="mb-4"
        />
        <InputText
          v-model="masterRePassword"
          :label="$t('master_password.re_password')"
          class="w-full"
          :error-text="errors.masterRePassword && $t('errors.confirm_password')"
          is-password
          @change="errors = {}"
        />
        <InputText
          v-model="masterPasswordHint"
          :label="$t('set_master_password.master_password_hint')"
          class="w-full"
        />
      </div>
      <div slot="footer" class="dialog-footer flex items-center text-left">
        <div class="flex-grow" />
        <div>
          <button
            class="btn btn-default mb-4 md:mb-0"
            @click="dialogVisible = false"
          >
            {{ $t('common.cancel') }}
          </button>
          <button
            class="btn btn-primary"
            :disabled="
              loading ||
                !oldMasterPassword ||
                !masterRePassword ||
                !masterPassword ||
                masterPassword !== masterRePassword
            "
            @click="preparePassword"
          >
            {{ $t('master_password.change_btn') }}
          </button>
        </div>
      </div>
    </el-dialog>
    <PasswordViolationDialog ref="passwordPolicyDialog" strict />
  </div>
</template>

<script>
import InputText from '../input/InputText'
import PasswordStrengthBar from '../password/PasswordStrengthBar'
import PasswordViolationDialog from '../cipher/PasswordViolationDialog'
import { CipherView } from '../../core/models/view/cipherView.ts'
import { CipherType } from '../../core/enums/cipherType.ts'
import { LoginView } from '../../jslib/src/models/view/loginView.ts'
import { LoginUriView } from '../../jslib/src/models/view/loginUriView.ts'
import { CipherRequest } from '../../jslib/src/models/request/cipherRequest.ts'
import { MIN_MASTER_PW_LEN } from '../../constants'

export default {
  components: { PasswordStrengthBar, InputText, PasswordViolationDialog },
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
      masterPasswordHint: '',
      key: '',
      showPassword: false
    }
  },
  computed: {
    passwordStrength () {
      return (
        this.$passwordGenerationService.passwordStrength(this.masterPassword, [
          'cystack'
        ]) || {}
      )
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
  mounted () {},
  methods: {
    openDialog (folder = {}, shouldRedirect = false) {
      this.dialogVisible = true
      this.shouldRedirect = shouldRedirect
      this.folder = { ...folder }
    },

    closeDialog () {
      this.dialogVisible = false
    },

    preparePassword () {
      const violationItems = this.checkPasswordPolicy(
        this.masterPassword || '',
        'master_password_requirement'
      )
      if (violationItems.length) {
        this.$refs.passwordPolicyDialog.openDialog(violationItems)
      } else {
        this.changePass()
      }
    },

    // Create master pw item
    async createMasterPwItem () {
      try {
        const cipher = new CipherView()
        cipher.type = CipherType.Login
        const loginData = new LoginView()
        loginData.username = 'locker.io'
        loginData.password = this.masterPassword
        const uriView = new LoginUriView()
        uriView.uri = 'https://locker.io'
        loginData.uris = [uriView]
        cipher.login = loginData
        cipher.name = 'Locker Master Password'
        const cipherEnc = await this.$cipherService.encrypt(cipher)
        const data = new CipherRequest(cipherEnc)
        data.type = CipherType.MasterPassword
        return data
      } catch (e) {
        return null
      }
    },

    async changePass () {
      if (this.masterPassword.length < MIN_MASTER_PW_LEN) {
        this.notify(
          this.$t('data.notifications.invalid_master_password'),
          'error'
        )
        return
      }
      try {
        this.loading = true
        const kdf = 0
        const kdfIterations = 100000
        const key = await this.$cryptoService.makeKey(
          this.masterPassword,
          this.currentUser.email,
          kdf,
          kdfIterations
        )
        const newMasterPasswordHash = await this.$cryptoService.hashPassword(
          this.masterPassword,
          key
        )
        let encKey = null
        const existingEncKey = await this.$cryptoService.getEncKey()
        if (existingEncKey == null) {
          encKey = await this.$cryptoService.makeEncKey(key)
        } else {
          encKey = await this.$cryptoService.remakeEncKey(key)
        }
        const storageKeyHash = await this.$cryptoService.getKeyHash()
        const masterPasswordHash = await this.$cryptoService.hashPassword(
          this.oldMasterPassword,
          null
        )
        if (storageKeyHash !== masterPasswordHash) {
          this.notify(
            this.$t('data.notifications.incorrect_current_master'),
            'warning'
          )
          return
        }

        const masterPwItem = await this.createMasterPwItem()

        await this.$axios.$post('cystack_platform/pm/users/me/password', {
          key: encKey[1].encryptedString,
          new_master_password_hash: newMasterPasswordHash,
          master_password_hash: masterPasswordHash,
          new_master_password_hint: this.masterPasswordHint,
          score: this.passwordStrength.score,
          master_password_cipher: masterPwItem || undefined
        })

        this.notify(
          this.$t('data.notifications.update_master_success'),
          'success'
        )
        this.closeDialog()
        await this.$userService.clear()
        await this.$messagingService.send('locked')
      } catch (e) {
        console.log(e)
        this.notify(
          this.$t('data.notifications.update_master_failed'),
          'warning'
        )
        this.errors = (e.response &&
          e.response.data &&
          e.response.data.details) || { oldMasterPassword: 1 }
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
