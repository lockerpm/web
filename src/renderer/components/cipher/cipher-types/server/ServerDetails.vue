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
    <TextHaveCopy
      :label="$t('data.ciphers.notes')"
      :text="filterPassword(server.notes, !isPublic || !hideAll)"
      :text-area="true"
    />
  </div>
</template>
<script>
import { CipherView } from '../../../../core/models/view/cipherView'
import TextHaveCopy from '@/components/cipher/TextHaveCopy'

export default {
  components: {
    TextHaveCopy
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
    }
  }
}
</script>
