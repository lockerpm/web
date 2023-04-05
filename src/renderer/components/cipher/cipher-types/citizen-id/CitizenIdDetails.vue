<template>
  <div>
    <TextHaveCopy
      :label="$t('data.ciphers.citizen_id.id_no')"
      :text="citizenId.idNo"
    />
    <TextHaveCopy :label="$t('common.fullname')" :text="citizenId.fullName" />
    <TextHaveCopy :label="$t('common.dob')" :text="citizenId.dob" />
    <TextHaveCopy :label="$t('data.ciphers.citizen_id.sex')" :text="getSex()" />
    <TextHaveCopy
      :label="$t('common.nationality')"
      :text="citizenId.nationality"
    />
    <TextHaveCopy
      :label="$t('data.ciphers.citizen_id.place_of_origin')"
      :text="citizenId.placeOfOrigin"
    />
    <TextHaveCopy
      :label="$t('data.ciphers.citizen_id.place_of_residence')"
      :text="citizenId.placeOfResidence"
    />
    <TextHaveCopy
      :label="$t('data.ciphers.citizen_id.expiry_date')"
      :text="citizenId.expiryDate"
    />
    <TextHaveCopy
      :label="$t('data.ciphers.citizen_id.personal_id')"
      :text="citizenId.personalId"
    />
    <TextHaveCopy
      :label="$t('data.ciphers.citizen_id.date_of_issue')"
      :text="citizenId.dateOfIssue"
    />
    <TextHaveCopy
      :label="$t('data.ciphers.citizen_id.issued_by')"
      :text="citizenId.issueBy"
    />
    <TextHaveCopy
      :label="$t('data.ciphers.notes')"
      :text="citizenId.notes"
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
      default: () => ({ citizenId: {} })
    }
  },

  computed: {
    citizenId () {
      const item = { ...this.cipher.citizenId }
      return item
    }
  },

  methods: {
    getSex () {
      return (
        this.sexOptions.find(o => this.citizenId?.sex === o.value)?.label || ''
      )
    }
  }
}
</script>
