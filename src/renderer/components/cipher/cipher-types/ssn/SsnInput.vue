<template>
  <div>
    <InputText
      v-model="ssn.fullName"
      :label="$t('common.fullname')"
      class="w-full"
      :disabled="isDeleted"
    />
    <InputText
      v-model="ssn.socialSecurityNumber"
      :label="$t('data.ciphers.ssn')"
      class="w-full"
      :disabled="isDeleted"
    />
    <InputDate
      v-model="ssn.dateOfIssue"
      :label="$t('data.ciphers.passport_type.date_of_issue')"
      class="w-full"
      :disabled="isDeleted"
    />
    <InputText
      v-model="ssn.contry"
      :label="$t('common.nationality')"
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
      ssn: {
        fullName: '',
        socialSecurityNumber: '',
        dateOfIssue: '',
        contry: ''
      }
    }
  },

  methods: {
    loadData (data) {
      this.ssn = { ...data }
    },

    getData () {
      return this.ssn
    }
  }
}
</script>
