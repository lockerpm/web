<template>
  <div>
    <TextHaveCopy
      :label="$t('data.ciphers.card_holder')"
      :text="cipher.card.cardholderName"
      :should-hide="isPublic && hideAll"
    />
    <TextHaveCopy
      :label="$t('data.ciphers.brand')"
      :text="cipher.card.brand"
      :should-hide="isPublic && hideAll"
    />
    <TextHaveCopy
      :label="$t('data.ciphers.card_number')"
      :text="cipher.card.number"
      :should-hide="isPublic && hideAll"
    />
    <TextHaveCopy
      :label="$t('data.ciphers.expiration_month')"
      :text="cipher.card.expMonth"
      :should-hide="isPublic && hideAll"
    />
    <TextHaveCopy
      :label="$t('data.ciphers.expiration_year')"
      :text="cipher.card.expYear"
      :should-hide="isPublic && hideAll"
    />
    <TextHaveCopy
      :label="$t('data.ciphers.cvv')"
      :text="cipher.card.code"
      :should-hide="!isPublic || hideAll"
      :view-password="cipher.viewPassword"
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
      default: () => ({ card: {} })
    },
    isPublic: {
      type: Boolean,
      default: () => false
    },
    hideAll: {
      type: Boolean,
      default: () => false
    }
  }
}
</script>
