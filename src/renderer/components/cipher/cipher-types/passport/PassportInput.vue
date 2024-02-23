<template>
  <div>
    <InputText
      v-model="passport.passportID"
      :label="$t('data.ciphers.passport_type.passport_id')"
      class="w-full"
      :disabled="isDeleted"
    />
    <InputText
      v-model="passport.type"
      :label="$t('data.ciphers.passport_type.type')"
      class="w-full"
      :disabled="isDeleted"
    />
    <InputText
      v-model="passport.code"
      :label="$t('data.ciphers.passport_type.code')"
      class="w-full"
      :disabled="isDeleted"
    />
    <InputText
      v-model="passport.fullName"
      :label="$t('common.fullname')"
      class="w-full"
      :disabled="isDeleted"
    />
    <InputDate
      v-model="passport.dob"
      :label="$t('common.dob')"
      class="w-full"
      :disabled="isDeleted"
    />
    <InputSelect
      :label="$t('data.ciphers.passport_type.sex')"
      :initial-value="passport.sex"
      class="w-full"
      :disabled="isDeleted"
      :options="sexOptions"
      @change="val => (passport.sex = val)"
    />
    <InputText
      v-model="passport.nationality"
      :label="$t('common.nationality')"
      class="w-full"
      :disabled="isDeleted"
    />
    <InputText
      v-model="passport.idNumber"
      :label="$t('data.ciphers.passport_type.id_number')"
      class="w-full"
      :disabled="isDeleted"
    />
    <InputDate
      v-model="passport.dateOfIssue"
      :label="$t('data.ciphers.passport_type.date_of_issue')"
      class="w-full"
      :disabled="isDeleted"
    />
    <InputDate
      v-model="passport.dateOfExpiry"
      :label="$t('data.ciphers.passport_type.date_of_expiry')"
      class="w-full"
      :disabled="isDeleted"
    />
    <InputText
      v-model="passport.placeOfIssue"
      :label="$t('data.ciphers.passport_type.place_of_issue')"
      class="w-full"
      :disabled="isDeleted"
    />
  </div>
</template>
<script>
import InputText from '../../../input/InputText'
import InputDate from '../../../input/InputDate'
import InputSelect from '../../../input/InputSelect'

export default {
  components: {
    InputText,
    InputDate,
    InputSelect
  },

  props: {
    isDeleted: {
      type: Boolean,
      default: () => false
    }
  },

  data () {
    return {
      passport: {
        passportID: '',
        type: '',
        code: '',
        fullName: '',
        dob: '',
        sex: '',
        nationality: '',
        idNumber: '',
        dateOfIssue: '',
        dateOfExpiry: '',
        placeOfIssue: ''
      }
    }
  },

  methods: {
    // Methods to be called by ref

    loadData (data) {
      this.passport = { ...data }
    },

    getData () {
      return this.passport
    }
  }
}
</script>
