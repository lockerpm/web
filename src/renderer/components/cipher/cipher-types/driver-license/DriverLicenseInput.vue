<template>
  <div>
    <InputText
      v-model="driverLicense.idNO"
      :label="$t('data.ciphers.drive_license.no')"
      class="w-full"
      :disabled="isDeleted"
    />
    <InputText
      v-model="driverLicense.fullName"
      :label="$t('common.fullname')"
      class="w-full"
      :disabled="isDeleted"
    />
    <InputDate
      v-model="driverLicense.dob"
      :label="$t('common.dob')"
      class="w-full"
      :disabled="isDeleted"
    />
    <InputText
      v-model="driverLicense.address"
      :label="$t('common.address')"
      class="w-full"
      :disabled="isDeleted"
    />
    <InputText
      v-model="driverLicense.nationality"
      :label="$t('common.nationality')"
      class="w-full"
      :disabled="isDeleted"
    />
    <InputText
      v-model="driverLicense.class"
      :label="$t('data.ciphers.drive_license.class')"
      class="w-full"
      :disabled="isDeleted"
    />
    <InputDate
      v-model="driverLicense.validUntil"
      :label="$t('data.ciphers.drive_license.valid_until')"
      class="w-full"
      :disabled="isDeleted"
    />
    <InputText
      v-model="driverLicense.vehicleClass"
      :label="$t('data.ciphers.drive_license.vehicle_class')"
      class="w-full"
      :disabled="isDeleted"
    />
    <InputDate
      v-model="driverLicense.beginningDate"
      :label="$t('data.ciphers.drive_license.beginning_date')"
      class="w-full"
      :disabled="isDeleted"
    />
    <InputText
      v-model="driverLicense.issuedBy"
      :label="$t('data.ciphers.drive_license.issued_by')"
      class="w-full"
      :disabled="isDeleted"
    />
  </div>
</template>
<script>
import InputText from '../../../input/InputText'
import InputDate from '../../../input/InputDate'

export default {
  components: {
    InputText,
    InputDate
  },

  props: {
    isDeleted: {
      type: Boolean,
      default: () => false
    }
  },

  data () {
    return {
      driverLicense: {
        idNO: '',
        fullName: '',
        dob: '',
        address: '',
        nationality: '',
        class: '',
        validUntil: '',
        vehicleClass: '',
        beginningDate: '',
        issuedBy: ''
      }
    }
  },

  methods: {
    loadData (data) {
      this.driverLicense = { ...data }
    },

    getData () {
      return this.driverLicense
    }
  }
}
</script>
