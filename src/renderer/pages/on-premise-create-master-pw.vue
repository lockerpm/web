<template>
  <div class="flex flex-grow flex-col items-center">
    <div class="mt-[3rem] mb-5">
      <img src="~assets/images/logo/logo_black.svg" alt="" class="h-[36px]">
    </div>
    <div
      class="md:w-[410px] md:mx-0 mx-5 border border-black-200 rounded py-[2.8125rem] px-6 text-center"
    >
      <div class="text-head-4 font-semibold mb-2.5">
        {{ $t('set_master_password.title') }}
      </div>
      <div class="text-base text-black-600 mb-4">
        {{ $t('set_master_password.subtitle') }}
      </div>
      <div class="inline-block mb-8 select-none">
        <div class="flex items-center">
          <div
            class="rounded-[21px] flex items-center bg-black-250 p-1 mx-auto"
          >
            <client-only>
              <img
                :src="currentUser.avatar"
                alt=""
                class="w-[28px] h-[28px] rounded-full mr-2"
              >
            </client-only>
            <div class="mr-2">{{ currentUser.email }}</div>
          </div>
          <button
            class="btn btn-sm btn-clean btn-primary !px-3 !font-normal"
            @click="logout"
          >
            {{ $t('set_master_password.logout') }}
          </button>
        </div>
      </div>
      <div class="text-left">
        <div class="form-group !mb-4">
          <label for="">{{
            $t('set_master_password.enter_master_password')
          }}</label>
          <div class="input-group mb-1.5">
            <input
              v-model="masterPassword"
              :type="showPassword ? 'text' : 'password'"
              class="form-control"
              :name="randomString()"
              autocomplete="new-password"
            >
            <div class="input-group-append !bg-white">
              <button
                class="btn btn-icon"
                type="button"
                tabindex="-1"
                @click="showPassword = !showPassword"
              >
                <i
                  class="far"
                  :class="{
                    'fa-eye': !showPassword,
                    'fa-eye-slash': showPassword
                  }"
                />
              </button>
            </div>
          </div>
          <PasswordStrengthBar
            v-if="masterPassword"
            :score="passwordStrength.score"
          />
        </div>
        <div class="form-group !mb-4">
          <label for="">{{
            $t('set_master_password.confirm_master_password')
          }}</label>
          <div
            class="input-group"
            :class="[errors.masterRePassword ? 'is-invalid' : '']"
          >
            <input
              v-model="masterRePassword"
              :type="showRePassword ? 'text' : 'password'"
              class="form-control"
              name="repassword"
              placeholder=""
            >
            <div class="input-group-append !bg-white">
              <button
                class="btn btn-icon"
                tabindex="-1"
                @click="showRePassword = !showRePassword"
              >
                <i
                  class="far"
                  :class="{
                    'fa-eye': !showRePassword,
                    'fa-eye-slash': showRePassword
                  }"
                />
              </button>
            </div>
          </div>
          <div class="invalid-feedback">
            {{ $t('errors.confirm_password') }}
          </div>
        </div>
        <div class="form-group !mb-8">
          <label for="">{{
            $t('set_master_password.master_password_hint')
          }}</label>
          <input
            v-model="masterPasswordHint"
            class="form-control"
            placeholder=""
            type="text"
          >
        </div>
      </div>
      <div class="form-group !mb-4">
        <button
          class="btn btn-primary w-full"
          :disabled="
            loading || !masterPassword || masterPassword !== masterRePassword
          "
          @click="confirmDialogVisible = true"
        >
          {{ $t('set_master_password.create_button') }}
        </button>
      </div>
      <div class="md:w-[320px] text-black-600 mx-auto">
        {{ $t('set_master_password.note') }}
      </div>
    </div>
    <el-dialog
      :show-close="false"
      :visible.sync="confirmDialogVisible"
      width="420px"
      :title="$t('set_master_password.confirm_nodal.title')"
      custom-class="no-pt-dialog"
      center
    >
      <img
        :src="require(`~/assets/images/landing/master-password/important.png`)"
        alt=""
        class="block"
        style="
          height: 120px;
          width: 120px;
          margin-left: auto;
          margin-right: auto;
        "
      >
      <p class="text-center">
        {{ $t('set_master_password.confirm_nodal.text1') }}
      </p>
      <p class="text-center">
        {{ $t('set_master_password.confirm_nodal.text2')
        }}<a
          href="https://locker.io/master-password"
          target="_blank"
          rel="noopener noreferrer"
        >{{ $t('set_master_password.confirm_nodal.link') }}</a>.
      </p>
      <div class="flex justify-center mt-4">
        <el-button
          class="flex w-full"
          type="primary"
          @click="confirmSetMasterPass"
        >
          {{ $t('set_master_password.confirm_nodal.btn_next') }}
        </el-button>
      </div>
      <div class="flex justify-center mt-2">
        <button
          class="btn btn-sm btn-clean btn-primary !px-3 !font-normal"
          @click="confirmDialogVisible = false"
        >
          {{ $t('set_master_password.confirm_nodal.btn_back') }}
        </button>
      </div>
    </el-dialog>
    <PasswordViolationDialog ref="passwordPolicyDialog" strict />
  </div>
</template>

<script>
import _ from 'lodash'
import PasswordStrengthBar from '../components/password/PasswordStrengthBar'
import PasswordViolationDialog from '../components/cipher/PasswordViolationDialog'
import { MIN_MASTER_PW_LEN } from '../constants'

export default {
  components: { PasswordStrengthBar, PasswordViolationDialog },
  layout: 'authenticate',

  data () {
    return {
      masterPassword: '',
      masterRePassword: '',
      masterPasswordHint: '',
      loading: false,
      confirmDialogVisible: false,
      errors: {},
      showPassword: false,
      showRePassword: false
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

  mounted () {
    const { email, token, host } = this.$route.query
    this.validateOnPremiseBaseApi(host)
    this.$store.commit('UPDATE_IS_LOGGEDIN', true)
    this.$store.commit('UPDATE_IS_LOGGEDIN_ON_PREMISE', false)
    this.$store.commit('UPDATE_USER', { email })
    this.$store.commit('UPDATE_ON_PREMISE_INFO', {
      baseApi: host + '/v3'
    })
    this.$axios.setToken(token, 'Bearer')
    this.$store.dispatch('LoadTeams')
  },

  methods: {
    // Check policy before submit
    async preparePassword () {
      if (!this.currentOrg?.id) {
        this.setMasterPass()
        return
      }
      try {
        this.loading = true
        const res = await this.$axios.$get(
          `/cystack_platform/pm/enterprises/${this.currentOrg.id}/policy/master_password_requirement`
        )
        res.config = _.mapKeys(res.config, (_value, key) => _.camelCase(key))
        const violationItems = this.checkPasswordPolicy(
          this.masterPassword || '',
          'master_password_requirement',
          {
            master_password_requirement: res
          }
        )
        if (violationItems.length) {
          this.$refs.passwordPolicyDialog.openDialog(violationItems)
          this.loading = false
        } else {
          this.setMasterPass()
        }
      } catch (e) {
        // TODO: remove this code later
        this.setMasterPass()
      }
    },

    confirmSetMasterPass () {
      this.confirmDialogVisible = false
      this.preparePassword()
    },

    // Submit master pw
    async setMasterPass () {
      await this.clearKeys()
      if (
        !this.isDevOrStaging &&
        this.masterPassword.length < MIN_MASTER_PW_LEN
      ) {
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
        const referenceData = ''
        const key = await this.$cryptoService.makeKey(
          this.masterPassword,
          this.currentUser.email,
          kdf,
          kdfIterations
        )
        const encKey = await this.$cryptoService.makeEncKey(key)
        const hashedPassword = await this.$cryptoService.hashPassword(
          this.masterPassword,
          key
        )
        const keys = await this.$cryptoService.makeKeyPair(encKey[0])
        await this.$cryptoService.setKey(key)
        await this.$cryptoService.setKeyHash(hashedPassword)
        await this.$cryptoService.setEncKey(encKey[1].encryptedString)
        await this.$cryptoService.setEncPrivateKey(keys[1].encryptedString)
        await this.$axios.$post('cystack_platform/pm/users/register', {
          name: this.currentUser.full_name,
          email: this.currentUser.email,
          master_password_hash: hashedPassword,
          master_password_hint: this.masterPasswordHint,
          key: encKey[1].encryptedString,
          kdf,
          kdf_iterations: kdfIterations,
          reference_data: referenceData,
          keys: {
            public_key: keys[0],
            encrypted_private_key: keys[1].encryptedString
          },
          score: this.passwordStrength.score
        })
        this.notify(this.$t('master_password.create_success'), 'success')
        this.$store.commit('UPDATE_USER_PW', {
          ...this.$store.state.userPw,
          is_pwd_manager: true
        })
        window.open(process.env.extensionLink, '_blank')
        await this.login()
      } catch (e) {
        if (e.response?.status === 401) {
          this.notify('This link is not valid', 'warning')
        } else {
          console.log(e)
          this.notify(this.$t('master_password.create_failed'), 'warning')
        }
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style>
.no-pt-dialog .el-dialog__body {
  padding-top: 0 !important;
}
</style>
