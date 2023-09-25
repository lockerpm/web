<template>
  <div>
    <TextHaveCopy
      :label="$t('data.ciphers.api.url')"
      :text="api.url"
      :should-hide="isPublic && hideAll"
    />
    <TextHaveCopy
      :label="$t('data.ciphers.api.method')"
      :text="getMethod()"
      :should-hide="isPublic && hideAll"
    />
    <TextHaveCopy
      :label="$t('data.ciphers.api.header')"
      :text="api.header"
      :should-hide="isPublic && hideAll"
    />
    <TextHaveCopy
      :label="$t('data.ciphers.api.body_data')"
      :text="api.bodyData"
      :should-hide="isPublic && hideAll"
    />
    <TextHaveCopy
      :label="$t('data.ciphers.api.response')"
      :text="api.response"
      :should-hide="isPublic && hideAll"
    />
    <TextHaveCopy
      :label="$t('data.ciphers.notes')"
      :text="api.notes"
      :text-area="true"
      :should-hide="isPublic && hideAll"
    />
  </div>
</template>
<script>
import { CipherView } from '../../../../jslib/src/models/view/cipherView'
import TextHaveCopy from '@/components/cipher/TextHaveCopy'

export default {
  components: {
    TextHaveCopy
  },

  props: {
    cipher: {
      type: [CipherView, Object],
      default: () => ({ api: {} })
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
    api () {
      const item = { ...this.cipher.api }
      return item
    }
  },

  methods: {
    getMethod () {
      return (
        this.apiMethodOptions.find(o => this.api?.method === o.value)?.label ||
        ''
      )
    }
  }
}
</script>
