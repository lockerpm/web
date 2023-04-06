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
    <TextHaveCopy
      :label="$t('data.ciphers.database.default')"
      :text="database.default"
      :should-hide="isPublic && hideAll"
    />
    <TextHaveCopy
      :label="$t('data.ciphers.notes')"
      :text="filterPassword(database.notes, !isPublic || !hideAll)"
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
    }
  }
}
</script>
