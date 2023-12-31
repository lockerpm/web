<template>
  <div>
    <TextHaveCopy
      label="Email / Username"
      :text="cipher.login.username"
      :should-hide="isPublic && hideAll"
    />
    <TextHaveCopy
      :label="$t('data.ciphers.password')"
      :text="cipher.login.password"
      :view-password="cipher.viewPassword"
      :should-hide="!isPublic || hideAll"
    />
    <OTPHaveCopy
      v-if="cipher.login.totp"
      :login-totp="cipher.login.totp"
      :should-hide="!isPublic || hideAll"
    />
    <div class="grid sm:grid-cols-6 cipher-item">
      <p class="!break-normal mr-4">
        {{ $t('data.ciphers.password_strength') }}
      </p>
      <div class="col-span-4 font-semibold mb-2 sm:mb-0">
        <PasswordStrength :score="passwordStrength.score" />
      </div>
    </div>
    <div
      v-for="(item, index) in cipher.login.uris"
      v-show="item.uri"
      :key="index"
      class="grid md:grid-cols-6 grid-cols-1 cipher-item"
    >
      <p class="!break-normal mr-4">{{ $t('data.ciphers.website_address') }}</p>
      <div class="col-span-4 font-semibold">
        {{ filterPassword(item.uri, !isPublic || !hideAll || showUri) }}
      </div>
      <div class="text-right">
        <button
          v-if="isPublic && hideAll"
          class="btn btn-icon btn-xs btn-action"
          @click="showUri = !showUri"
        >
          <i
            class="far"
            :class="{ 'fa-eye': !showUri, 'fa-eye-slash': showUri }"
          />
        </button>
        <button
          v-if="item.canLaunch"
          class="btn btn-icon btn-xs btn-action"
          :title="$t('common.go_to_website')"
          @click="openNewTab(item.uri)"
        >
          <i class="fas fa-external-link-square-alt" />
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import { CipherView } from '../../../../jslib/src/models/view/cipherView'
import OTPHaveCopy from '../../OTPHaveCopy.vue'
import TextHaveCopy from '@/components/cipher/TextHaveCopy'
import PasswordStrength from '@/components/password/PasswordStrength'

export default {
  components: {
    TextHaveCopy,
    PasswordStrength,
    OTPHaveCopy
  },

  props: {
    cipher: {
      type: [CipherView, Object],
      default: () => ({ login: {} })
    },
    isPublic: {
      type: Boolean,
      default: () => false
    },
    hideAll: {
      type: Boolean,
      default: () => false
    }
  },

  data () {
    return {
      showUri: false
    }
  },

  computed: {
    passwordStrength () {
      return (
        this.$passwordGenerationService.passwordStrength(
          this.cipher.login.password,
          ['cystack']
        ) || {}
      )
    }
  },

  watch: {
    hideAll (val) {
      if (val) {
        this.showUri = false
      }
    }
  }
}
</script>
