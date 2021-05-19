<template>
  <div class="flex flex-grow flex-col items-center">
    <div class="mt-[5.625rem] mb-5">
      <img src="~assets/images/logo/logo_black.svg" alt="" class="h-[1.875rem]">
    </div>
    <div class="md:w-[410px] md:mx-0 mx-5 border border-black-200 rounded py-[2.8125rem] px-6 text-center">
      <div class="text-head-4 font-semibold mb-2.5">Xác nhận tài khoản</div>
      <div class="text-base mb-[1.875rem]">
        Mật khẩu tổng là mật khẩu mở khóa dữ liệu của bạn. <br>
        Vui lòng không chia sẻ mật khẩu này với bất kì ai.
      </div>
      <div class="form-group !mb-4">
        <input v-model="masterPassword" class="form-control"
               placeholder="Nhập mật khẩu tổng"
               :name="randomString()" autocomplete="new-password"
               type="password"
        ></input>
      </div>
      <div class="form-group !mb-4">
        <input v-model="masterPasswordRe" class="form-control"
               placeholder="Nhập lại mật khẩu tổng"
               :class="[errors.masterPasswordRe ? 'is-invalid' :'']"
               type="password"
               name="repassword"
        ></input>
        <div class="invalid-feedback">{{ $t('errors.confirm_password') }}</div>
      </div>
      <div class="form-group !mb-8">
        <input v-model="masterPasswordHint" class="form-control"
               placeholder="Gợi ý mật khẩu tổng (tùy chọn)"
               type=""
        ></input>
      </div>
      <div class="form-group !mb-4">
        <button class="btn btn-primary w-full" :disabled="loading"
                @click="setMasterPass"
        >
          Tạo mật khẩu
        </button>
      </div>
      <div class="md:w-[320px] text-black-600 mx-auto">
        Lưu ý: CyStack không thể xem, không thể lưu trữ, cũng như không thể cấp lại mật khẩu tổng trong trường hợp bạn quên hoặc đánh mất.
      </div>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'blank',
  middleware: ['HaveAccountService'],
  data () {
    return {
      masterPassword: '',
      masterPasswordRe: '',
      masterPasswordHint: '',
      loading: false,
      errors: {
      }
    }
  },
  computed: {
  },
  watch: {
    masterPasswordRe (newValue) {
      if (this.masterPassword && newValue && this.masterPasswordRe !== newValue) {
        this.errors.masterPasswordRe = 1
      } else {
        this.errors.masterPasswordRe = 0
      }
    }
  },
  mounted () {
  },
  methods: {
    async setMasterPass () {
      this.loading = true
      try {
        const kdf = 0
        const kdfIterations = 100000
        const referenceData = ''
        const key = await this.$cryptoService.makeKey(this.masterPassword, this.currentUser.email, kdf, kdfIterations)
        const encKey = await this.$cryptoService.makeEncKey(key)
        const hashedPassword = await this.$cryptoService.hashPassword(this.masterPassword, key)
        const keys = await this.$cryptoService.makeKeyPair(encKey[0])

        // default org
        const shareKey = await this.$cryptoService.makeShareKey()
        const orgKey = shareKey[0].encryptedString
        const collection = await this.$cryptoService.encrypt('defaultCollection', shareKey[1])
        const collectionName = collection.encryptedString

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
          org_key: orgKey,
          collection_name: collectionName
        })
        this.notify(this.$t('master_password.create_success'), 'success')
        this.$store.commit('UPDATE_USER_PW', { ...this.$store.state.userPw, is_pwd_manager: true })
        await this.login()
      } catch (e) {
        this.notify(this.$t('master_password.create_failed'), 'warning')
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
