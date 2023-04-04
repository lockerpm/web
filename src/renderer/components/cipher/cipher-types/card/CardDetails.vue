<template>
  <div>
    <TextHaveCopy
      :label="$t('data.ciphers.card_holder')"
      :text="cipher.card.cardholderName"
    />
    <TextHaveCopy :label="$t('data.ciphers.brand')" :text="cipher.card.brand" />
    <TextHaveCopy
      :label="$t('data.ciphers.card_number')"
      :text="cipher.card.number"
    />
    <TextHaveCopy
      :label="$t('data.ciphers.expiration_month')"
      :text="cipher.card.expMonth"
    />
    <TextHaveCopy
      :label="$t('data.ciphers.expiration_year')"
      :text="cipher.card.expYear"
    />
    <TextHaveCopy
      :label="$t('data.ciphers.cvv')"
      :text="cipher.card.code"
      should-hide
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
    }
  }
}
</script>
