<template>
  <div>
    <TextHaveCopy :label="$t('data.ciphers.api.url')" :text="api.url" />
    <TextHaveCopy :label="$t('data.ciphers.api.method')" :text="getMethod()" />
    <TextHaveCopy :label="$t('data.ciphers.api.header')" :text="api.header" />
    <TextHaveCopy
      :label="$t('data.ciphers.api.body_data')"
      :text="api.bodyData"
    />
    <TextHaveCopy
      :label="$t('data.ciphers.api.response')"
      :text="api.response"
    />
    <TextHaveCopy
      :label="$t('data.ciphers.notes')"
      :text="api.notes"
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
      default: () => ({ api: {} })
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
