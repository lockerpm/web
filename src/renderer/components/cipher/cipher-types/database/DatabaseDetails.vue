<template>
  <div>
    <TextHaveCopy
      :label="$t('data.ciphers.database.host')"
      :text="database.host"
      :should-hide="isPublic && hideAll"
    />
    <TextHaveCopy
      :label="$t('data.ciphers.database.port')"
      :text="database.port"
      :should-hide="isPublic && hideAll"
    />
    <TextHaveCopy
      :label="$t('common.username')"
      :text="database.username"
      :should-hide="isPublic && hideAll"
    />
    <TextHaveCopy
      :label="$t('common.password')"
      :text="database.password"
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
      :label="$t('data.ciphers.database.default')"
      :text="database.default"
      :should-hide="isPublic && hideAll"
    />
    <TextHaveCopy
      :label="$t('data.ciphers.notes')"
      :text="database.notes"
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
      default: () => ({ database: {} })
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
    database () {
      const item = { ...this.cipher.database }
      return item
    },
    passwordStrength () {
      return (
        this.$passwordGenerationService.passwordStrength(
          this.database?.password,
          ['cystack']
        ) || {}
      )
    }
  }
}
</script>
