<template>
  <div>
    <InputText
      v-model="database.host"
      :label="$t('data.ciphers.database.host')"
      class="w-full"
      :disabled="isDeleted"
    />
    <InputText
      v-model="database.port"
      :label="$t('data.ciphers.database.port')"
      class="w-full"
      :disabled="isDeleted"
    />
    <InputText
      v-model="database.username"
      :label="$t('common.username')"
      class="w-full"
      :disabled="isDeleted"
    />
    <InputText
      v-model="database.password"
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
    <InputText
      v-model="database.default"
      :label="$t('data.ciphers.database.default')"
      class="w-full"
      :disabled="isDeleted"
    />
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
      database: {
        host: '',
        port: '',
        username: '',
        password: '',
        default: '',
        notes: ''
      }
    }
  },

  computed: {
    passwordStrength () {
      return (
        this.$passwordGenerationService.passwordStrength(
          this.database.password,
          ['cystack']
        ) || {}
      )
    }
  },

  methods: {
    fillPassword (p) {
      this.database.password = p
    },

    // Methods to be called by ref

    loadData (data) {
      this.database = { ...data }
    },

    getData () {
      return this.database
    }
  }
}
</script>
