<template>
  <div>
    <TextHaveCopy
      :label="$t('data.ciphers.passport_type.passport_id')"
      :text="passport.passportID"
      :should-hide="!isPublic || hideAll"
    />
    <TextHaveCopy
      :label="$t('data.ciphers.passport_type.type')"
      :text="passport.type"
      :should-hide="!isPublic || hideAll"
    />
    <TextHaveCopy
      :label="$t('data.ciphers.passport_type.code')"
      :text="passport.code"
      :should-hide="!isPublic || hideAll"
    />
    <TextHaveCopy
      :label="$t('common.fullname')"
      :text="passport.fullName"
      :should-hide="!isPublic || hideAll"
    />
    <TextHaveCopy
      :label="$t('common.dob')"
      :text="passport.dob"
      :should-hide="!isPublic || hideAll"
    />
    <TextHaveCopy
      :label="$t('data.ciphers.passport_type.sex')"
      :text="getSex()"
      :should-hide="!isPublic || hideAll"
    />
    <TextHaveCopy
      :label="$t('common.nationality')"
      :text="passport.nationality"
      :should-hide="!isPublic || hideAll"
    />
    <TextHaveCopy
      :label="$t('data.ciphers.passport_type.id_number')"
      :text="passport.idNumber"
      :should-hide="!isPublic || hideAll"
    />
    <TextHaveCopy
      :label="$t('data.ciphers.passport_type.date_of_issue')"
      :text="passport.dateOfIssue"
      :should-hide="!isPublic || hideAll"
    />
    <TextHaveCopy
      :label="$t('data.ciphers.passport_type.date_of_expiry')"
      :text="passport.dateOfExpiry"
      :should-hide="!isPublic || hideAll"
    />
    <TextHaveCopy
      :label="$t('data.ciphers.passport_type.place_of_issue')"
      :text="passport.placeOfIssue"
      :should-hide="!isPublic || hideAll"
    />
    <TextHaveCopy
      :label="$t('data.ciphers.notes')"
      :text="passport.notes"
      :text-area="true"
      :should-hide="!isPublic || hideAll"
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
      default: () => ({ passport: {} })
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
    passport () {
      const item = { ...this.cipher.passport }
      return item
    }
  },

  methods: {
    getSex () {
      return (
        this.sexOptions.find(o => this.passport?.sex === o.value)?.label || ''
      )
    }
  }
}
</script>
