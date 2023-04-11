<template>
  <div>
    <InputText
      v-model="server.host"
      :label="$t('data.ciphers.server.host')"
      class="w-full"
      :disabled="isDeleted"
    />
    <InputText
      v-model="server.publicKey"
      :label="$t('data.ciphers.server.public_key')"
      class="w-full"
      :disabled="isDeleted"
    />
    <InputText
      v-model="server.privateKey"
      :label="$t('data.ciphers.server.private_key')"
      class="w-full"
      :disabled="isDeleted"
      is-password
    />
    <InputText
      v-model="server.username"
      :label="$t('common.username')"
      class="w-full"
      :disabled="isDeleted"
    />
    <InputText
      v-model="server.password"
      :label="$t('common.password')"
      class="w-full"
      :disabled="isDeleted"
      is-password
    />
    <PasswordStrengthBar :score="passwordStrength.score" class="mt-2" />
    <div v-if="!isDeleted" class="text-right">
      <el-popover
        placement="right"
        width="280"
        trigger="click"
        popper-class="locker-pw-generator"
      >
        <PasswordGenerator @fill="fillPassword" />

        <button slot="reference" class="btn btn-clean !text-primary">
          {{ $t('data.ciphers.generate_random_password') }}
        </button>
      </el-popover>
    </div>
  </div>
</template>
<script>
import InputText from '../../../input/InputText'
import PasswordGenerator from '../../../password/PasswordGenerator'
import PasswordStrengthBar from '../../../password/PasswordStrengthBar'

export default {
  components: {
    InputText,
    PasswordGenerator,
    PasswordStrengthBar
  },

  props: {
    isDeleted: {
      type: Boolean,
      default: () => false
    }
  },

  data () {
    return {
      server: {
        host: '',
        publicKey: '',
        privateKey: '',
        username: '',
        password: '',
        notes: ''
      }
    }
  },

  computed: {
    passwordStrength () {
      return (
        this.$passwordGenerationService.passwordStrength(this.server.password, [
          'cystack'
        ]) || {}
      )
    }
  },

  methods: {
    fillPassword (p) {
      this.server.password = p
    },

    loadData (data) {
      this.server = { ...data }
    },

    getData () {
      return this.server
    }
  }
}
</script>
