<template>
  <div>
    <div class="mb-4 text-black-700 text-head-6 font-semibold">
      {{ $t('data.ciphers.login') }}
    </div>
    <InputText
      :value="username"
      label="Email / Username"
      class="w-full"
      :disabled="isDeleted"
      @input="val => $emit('update:username', val)"
    />
    <InputText
      :value="password"
      :label="$t('data.ciphers.password')"
      class="w-full"
      :disabled="isDeleted"
      is-password
      @input="val => $emit('update:password', val)"
    />
    <PasswordStrengthBar :score="passwordStrength.score" class="mt-2" />
    <div v-if="!isDeleted" class="text-right">
      <el-popover
        :placement="$store.state.tutorial.isActive ? 'top' : 'right'"
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
    <template v-for="(item, index) in uris">
      <InputText
        :key="index"
        :value="item.uri"
        :label="$t('data.ciphers.website_address')"
        class="w-full"
        :disabled="isDeleted"
        @onBlur="handleGenNameByUri"
        @input="val => handleUriInput(index, val)"
      />
    </template>
  </div>
</template>
<script>
import InputText from '../../../input/InputText'
import PasswordStrengthBar from '../../../password/PasswordStrengthBar'
import PasswordGenerator from '../../../password/PasswordGenerator'

export default {
  components: { InputText, PasswordStrengthBar, PasswordGenerator },

  props: {
    isDeleted: {
      type: Boolean,
      default: () => false
    },
    name: {
      type: String,
      default: () => ''
    },
    username: {
      type: String,
      default: () => ''
    },
    password: {
      type: String,
      default: () => ''
    },
    uris: {
      type: Array,
      default: () => []
    }
  },

  computed: {
    passwordStrength () {
      return (
        this.$passwordGenerationService.passwordStrength(this.password, [
          'cystack'
        ]) || {}
      )
    }
  },

  methods: {
    fillPassword (p) {
      this.$emit('update:password', p)
    },

    handleGenNameByUri () {
      if (!this.name && this.uris[0]?.uri) {
        this.$emit('update:name', this.uris[0].uri.replace('https://', ''))
      }
    },

    handleUriInput (index, value) {
      const newVal = [...this.uris]
      newVal[index].uri = value
      this.$emit('update:uri', newVal)
    }
  }
}
</script>
