<template>
  <div>
    <TextHaveCopy
      :label="$t('data.ciphers.passport_type.passport_id')"
      :text="passport.passportID"
    />
    <TextHaveCopy
      :label="$t('data.ciphers.passport_type.type')"
      :text="passport.type"
    />
    <TextHaveCopy
      :label="$t('data.ciphers.passport_type.code')"
      :text="passport.code"
    />
    <TextHaveCopy :label="$t('common.fullname')" :text="passport.fullName" />
    <TextHaveCopy :label="$t('common.dob')" :text="passport.dob" />
    <TextHaveCopy
      :label="$t('data.ciphers.passport_type.sex')"
      :text="getSex()"
    />
    <TextHaveCopy
      :label="$t('common.nationality')"
      :text="passport.nationality"
    />
    <TextHaveCopy
      :label="$t('data.ciphers.passport_type.id_number')"
      :text="passport.idNumber"
    />
    <TextHaveCopy
      :label="$t('data.ciphers.passport_type.date_of_issue')"
      :text="passport.dateOfIssue"
    />
    <TextHaveCopy
      :label="$t('data.ciphers.passport_type.date_of_expiry')"
      :text="passport.dateOfExpiry"
    />
    <TextHaveCopy
      :label="$t('data.ciphers.passport_type.place_of_issue')"
      :text="passport.placeOfIssue"
    />
    <TextHaveCopy
      :label="$t('data.ciphers.notes')"
      :text="passport.notes"
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
      default: () => ({ passport: {} })
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
