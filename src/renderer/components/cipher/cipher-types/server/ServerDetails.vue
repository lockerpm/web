<template>
  <div>
    <TextHaveCopy
      :label="$t('data.ciphers.server.host')"
      :text="server.host"
      :should-hide="isPublic && hideAll"
    />
    <TextHaveCopy
      :label="$t('data.ciphers.server.public_key')"
      :text="server.publicKey"
      :should-hide="isPublic && hideAll"
    />
    <TextHaveCopy
      :label="$t('data.ciphers.server.private_key')"
      :text="server.privateKey"
      :should-hide="!isPublic || hideAll"
    />
    <TextHaveCopy
      :label="$t('common.username')"
      :text="server.username"
      :should-hide="isPublic && hideAll"
    />
    <TextHaveCopy
      :label="$t('common.password')"
      :text="server.password"
      :should-hide="!isPublic || hideAll"
    />
    <div class="grid md:grid-cols-6 cipher-item">
      <p class="!break-normal mr-4">
        {{ $t('data.ciphers.password_strength') }}
      </p>
      <div class="col-span-4 font-semibold">
        <PasswordStrength :score="passwordStrength.score" />
      </div>
    </div>
    <TextHaveCopy
      :label="$t('data.ciphers.notes')"
      :text="server.notes"
      :text-area="true"
      :should-hide="isPublic && hideAll"
    />
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
      default: () => ({ server: {} })
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
    server () {
      const item = { ...this.cipher.server }
      return item
    },
    passwordStrength () {
      return (
        this.$passwordGenerationService.passwordStrength(
          this.server?.password,
          ['cystack']
        ) || {}
      )
    }
  }
}
</script>
