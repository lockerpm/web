<template>
  <div>
    <TextHaveCopy
      :label="$t('data.ciphers.citizen_id.id_no')"
      :text="citizenId.idNo"
      :should-hide="isPublic && hideAll"
    />
    <TextHaveCopy
      :label="$t('common.fullname')"
      :text="citizenId.fullName"
      :should-hide="isPublic && hideAll"
    />
    <TextHaveCopy
      :label="$t('common.dob')"
      :text="citizenId.dob"
      :should-hide="isPublic && hideAll"
    />
    <TextHaveCopy
      :label="$t('data.ciphers.citizen_id.sex')"
      :text="getSex()"
      :should-hide="isPublic && hideAll"
    />
    <TextHaveCopy
      :label="$t('common.nationality')"
      :text="citizenId.nationality"
      :should-hide="isPublic && hideAll"
    />
    <TextHaveCopy
      :label="$t('data.ciphers.citizen_id.place_of_origin')"
      :text="citizenId.placeOfOrigin"
      :should-hide="isPublic && hideAll"
    />
    <TextHaveCopy
      :label="$t('data.ciphers.citizen_id.place_of_residence')"
      :text="citizenId.placeOfResidence"
      :should-hide="isPublic && hideAll"
    />
    <TextHaveCopy
      :label="$t('data.ciphers.citizen_id.expiry_date')"
      :text="citizenId.expiryDate"
      :should-hide="isPublic && hideAll"
    />
    <TextHaveCopy
      :label="$t('data.ciphers.citizen_id.personal_id')"
      :text="citizenId.personalId"
      :should-hide="isPublic && hideAll"
    />
    <TextHaveCopy
      :label="$t('data.ciphers.citizen_id.date_of_issue')"
      :text="citizenId.dateOfIssue"
      :should-hide="isPublic && hideAll"
    />
    <TextHaveCopy
      :label="$t('data.ciphers.citizen_id.issued_by')"
      :text="citizenId.issueBy"
      :should-hide="isPublic && hideAll"
    />
    <TextHaveCopy
      :label="$t('data.ciphers.notes')"
      :text="filterPassword(citizenId.notes, !isPublic || !hideAll)"
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
