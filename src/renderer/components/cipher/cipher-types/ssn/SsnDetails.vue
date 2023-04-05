<template>
  <div>
    <TextHaveCopy :label="$t('common.fullname')" :text="ssn.fullName" />
    <TextHaveCopy
      :label="$t('data.ciphers.ssn')"
      :text="ssn.socialSecurityNumber"
    />
    <TextHaveCopy
      :label="$t('data.ciphers.passport_type.date_of_issue')"
      :text="ssn.dateOfIssue"
    />
    <TextHaveCopy :label="$t('common.nationality')" :text="ssn.contry" />
    <TextHaveCopy
      :label="$t('data.ciphers.notes')"
      :text="ssn.notes"
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
      default: () => ({ ssn: {} })
    }
  },

  computed: {
    ssn () {
      const item = { ...this.cipher.ssn }
      return item
    }
  }
}
</script>
