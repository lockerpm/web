<template>
  <div>
    <TextHaveCopy
      :label="$t('data.ciphers.drive_license.no')"
      :text="driverLicense.idNO"
    />
    <TextHaveCopy
      :label="$t('common.fullname')"
      :text="driverLicense.fullName"
    />
    <TextHaveCopy :label="$t('common.dob')" :text="driverLicense.dob" />
    <TextHaveCopy :label="$t('common.address')" :text="driverLicense.address" />
    <TextHaveCopy
      :label="$t('common.nationality')"
      :text="driverLicense.nationality"
    />
    <TextHaveCopy
      :label="$t('data.ciphers.drive_license.class')"
      :text="driverLicense.class"
    />
    <TextHaveCopy
      :label="$t('data.ciphers.drive_license.valid_until')"
      :text="driverLicense.validUntil"
    />
    <TextHaveCopy
      :label="$t('data.ciphers.drive_license.vehicle_class')"
      :text="driverLicense.vehicleClass"
    />
    <TextHaveCopy
      :label="$t('data.ciphers.drive_license.beginning_date')"
      :text="driverLicense.beginningDate"
    />
    <TextHaveCopy
      :label="$t('data.ciphers.drive_license.issued_by')"
      :text="driverLicense.issuedBy"
    />
    <TextHaveCopy
      :label="$t('data.ciphers.notes')"
      :text="driverLicense.notes"
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
