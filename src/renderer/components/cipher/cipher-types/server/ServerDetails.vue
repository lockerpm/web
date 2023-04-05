<template>
  <div>
    <TextHaveCopy :label="$t('data.ciphers.server.host')" :text="server.host" />
    <TextHaveCopy
      :label="$t('data.ciphers.server.public_key')"
      :text="server.publicKey"
    />
    <TextHaveCopy
      :label="$t('data.ciphers.server.private_key')"
      :text="server.privateKey"
      should-hide
    />
    <TextHaveCopy :label="$t('common.username')" :text="server.username" />
    <TextHaveCopy
      :label="$t('common.password')"
      :text="server.password"
      should-hide
    />
    <TextHaveCopy
      :label="$t('data.ciphers.notes')"
      :text="server.notes"
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
