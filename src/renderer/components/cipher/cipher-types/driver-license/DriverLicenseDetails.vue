<template>
  <div>
    <TextHaveCopy
      :label="$t('data.ciphers.drive_license.no')"
      :text="driverLicense.idNO"
      :should-hide="isPublic && hideAll"
    />
    <TextHaveCopy
      :label="$t('common.fullname')"
      :text="driverLicense.fullName"
      :should-hide="isPublic && hideAll"
    />
    <TextHaveCopy
      :label="$t('common.dob')"
      :text="driverLicense.dob"
      :should-hide="isPublic && hideAll"
    />
    <TextHaveCopy
      :label="$t('common.address')"
      :text="driverLicense.address"
      :should-hide="isPublic && hideAll"
    />
    <TextHaveCopy
      :label="$t('common.nationality')"
      :text="driverLicense.nationality"
      :should-hide="isPublic && hideAll"
    />
    <TextHaveCopy
      :label="$t('data.ciphers.drive_license.class')"
      :text="driverLicense.class"
      :should-hide="isPublic && hideAll"
    />
    <TextHaveCopy
      :label="$t('data.ciphers.drive_license.valid_until')"
      :text="driverLicense.validUntil"
      :should-hide="isPublic && hideAll"
    />
    <TextHaveCopy
      :label="$t('data.ciphers.drive_license.vehicle_class')"
      :text="driverLicense.vehicleClass"
      :should-hide="isPublic && hideAll"
    />
    <TextHaveCopy
      :label="$t('data.ciphers.drive_license.beginning_date')"
      :text="driverLicense.beginningDate"
      :should-hide="isPublic && hideAll"
    />
    <TextHaveCopy
      :label="$t('data.ciphers.drive_license.issued_by')"
      :text="driverLicense.issuedBy"
      :should-hide="isPublic && hideAll"
    />
    <TextHaveCopy
      :label="$t('data.ciphers.notes')"
      :text="filterPassword(driverLicense.notes, !isPublic || !hideAll)"
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
      default: () => ({ driverLicense: {} })
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
    driverLicense () {
      const item = { ...this.cipher.driverLicense }
      return item
    }
  }
}
</script>
