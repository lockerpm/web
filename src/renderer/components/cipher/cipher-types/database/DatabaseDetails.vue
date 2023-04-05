<template>
  <div>
    <TextHaveCopy
      :label="$t('data.ciphers.database.host')"
      :text="database.host"
    />
    <TextHaveCopy
      :label="$t('data.ciphers.database.port')"
      :text="database.port"
    />
    <TextHaveCopy :label="$t('common.username')" :text="database.username" />
    <TextHaveCopy
      :label="$t('common.password')"
      :text="database.password"
      should-hide
    />
    <TextHaveCopy
      :label="$t('data.ciphers.database.default')"
      :text="database.default"
    />
    <TextHaveCopy
      :label="$t('data.ciphers.notes')"
      :text="database.notes"
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
      default: () => ({ database: {} })
    }
  },

  computed: {
    database () {
      const item = { ...this.cipher.database }
      return item
    }
  }
}
</script>
