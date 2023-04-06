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
    <div class="grid md:grid-cols-6 cipher-item">
      <div class="">{{ $t('data.ciphers.password_security') }}</div>
      <div class="col-span-4 font-semibold">
        <PasswordStrength :score="passwordStrength.score" />
      </div>
    </div>
    <div
      v-for="(item, index) in cipher.login.uris"
      v-show="item.uri"
      :key="index"
      class="grid md:grid-cols-6 cipher-item"
    >
      <div class="">{{ $t('data.ciphers.website_address') }}</div>
      <div class="col-span-4 font-semibold">
        {{ filterPassword(item.uri, !isPublic || !hideAll) }}
      </div>
      <div class="text-right">
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
import { CipherView } from '../../../../core/models/view/cipherView'
import TextHaveCopy from '@/components/cipher/TextHaveCopy'
import PasswordStrength from '@/components/password/PasswordStrength'

export default {
  components: {
    TextHaveCopy,
    PasswordStrength
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

  computed: {
    passwordStrength () {
      return (
        this.$passwordGenerationService.passwordStrength(
          this.cipher.login.password,
          ['cystack']
        ) || {}
      )
    }
  }
}
</script>
