<template>
  <div>
    <TextHaveCopy
      :label="$t('common.fullname')"
      :text="ssn.fullName"
      :should-hide="isPublic && hideAll"
    />
    <TextHaveCopy
      :label="$t('data.ciphers.ssn')"
      :text="ssn.socialSecurityNumber"
      :should-hide="isPublic && hideAll"
    />
    <TextHaveCopy
      :label="$t('data.ciphers.passport_type.date_of_issue')"
      :text="ssn.dateOfIssue"
      :should-hide="isPublic && hideAll"
    />
    <TextHaveCopy
      :label="$t('common.nationality')"
      :text="ssn.contry"
      :should-hide="isPublic && hideAll"
    />
    <TextHaveCopy
      :label="$t('data.ciphers.notes')"
      :text="ssn.notes"
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
      default: () => ({ ssn: {} })
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
    ssn () {
      const item = { ...this.cipher.ssn }
      return item
    }
  }
}
</script>
