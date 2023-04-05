<template>
  <div>
    <InputText
      v-model="citizenId.idNo"
      :label="$t('data.ciphers.citizen_id.id_no')"
      class="w-full"
      :disabled="isDeleted"
    />
    <InputText
      v-model="citizenId.fullName"
      :label="$t('common.fullname')"
      class="w-full"
      :disabled="isDeleted"
    />
    <InputDate
      v-model="citizenId.dob"
      :label="$t('common.dob')"
      class="w-full"
      :disabled="isDeleted"
    />
    <InputText
      v-model="citizenId.sex"
      :label="$t('data.ciphers.citizen_id.sex')"
      class="w-full"
      :disabled="isDeleted"
    />
    <InputText
      v-model="citizenId.nationality"
      :label="$t('common.nationality')"
      class="w-full"
      :disabled="isDeleted"
    />
    <InputText
      v-model="citizenId.placeOfOrigin"
      :label="$t('data.ciphers.citizen_id.place_of_origin')"
      class="w-full"
      :disabled="isDeleted"
    />
    <InputText
      v-model="citizenId.placeOfResidence"
      :label="$t('data.ciphers.citizen_id.place_of_residence')"
      class="w-full"
      :disabled="isDeleted"
    />
    <InputDate
      v-model="citizenId.expiryDate"
      :label="$t('data.ciphers.citizen_id.expiry_date')"
      class="w-full"
      :disabled="isDeleted"
    />
    <InputText
      v-model="citizenId.personalId"
      :label="$t('data.ciphers.citizen_id.personal_id')"
      class="w-full"
      :disabled="isDeleted"
    />
    <InputDate
      v-model="citizenId.dateOfIssue"
      :label="$t('data.ciphers.citizen_id.date_of_issue')"
      class="w-full"
      :disabled="isDeleted"
    />
    <InputText
      v-model="citizenId.issueBy"
      :label="$t('data.ciphers.citizen_id.issued_by')"
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
      citizenId: {
        idNo: '',
        fullName: '',
        dob: '',
        sex: '',
        nationality: '',
        placeOfOrigin: '',
        placeOfResidence: '',
        expiryDate: '',
        personalId: '',
        dateOfIssue: '',
        issueBy: ''
      }
    }
  },

  methods: {
    loadData (data) {
      this.citizenId = { ...data }
    },

    getData () {
      return this.citizenId
    }
  }
}
</script>
