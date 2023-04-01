<template>
  <div>
    <div class="mb-4 text-black-700 text-head-6 font-semibold">
      {{ $t('data.ciphers.personal') }}
    </div>
    <div class="grid grid-cols-2 gap-x-2 mb-4">
      <InputSelect
        :label="$t('data.ciphers.title')"
        :initial-value="title"
        class="w-full"
        :disabled="isDeleted"
        :options="identityTitleOptions"
        @change="v => $emit('update:title', v)"
      />
      <InputText
        :value="firstName"
        :label="$t('data.ciphers.first_name')"
        class="w-full"
        :disabled="isDeleted"
        @input="val => $emit('update:firstName', val)"
      />
      <InputText
        :value="lastName"
        :label="$t('data.ciphers.last_name')"
        class="w-full"
        :disabled="isDeleted"
        @input="val => $emit('update:lastName', val)"
      />
      <InputText
        :value="username"
        label="Username"
        class="w-full"
        :disabled="isDeleted"
        @input="val => $emit('update:username', val)"
      />
      <InputText
        :value="company"
        :label="$t('data.ciphers.company')"
        class="w-full"
        :disabled="isDeleted"
        @input="val => $emit('update:company', val)"
      />
      <InputText
        :value="email"
        label="Email"
        class="w-full"
        :disabled="isDeleted"
        @input="val => $emit('update:email', val)"
      />
      <InputText
        :value="phone"
        :label="$t('data.ciphers.phone')"
        class="w-full"
        :disabled="isDeleted"
        @input="val => $emit('update:phone', val)"
      />
      <InputText
        :value="ssn"
        :label="$t('data.ciphers.ssn')"
        class="w-full"
        :disabled="isDeleted"
        @input="val => $emit('update:ssn', val)"
      />
      <InputText
        :value="passportNumber"
        :label="$t('data.ciphers.passport')"
        class="w-full"
        :disabled="isDeleted"
        @input="val => $emit('update:passportNumber', val)"
      />
      <InputText
        :value="licenseNumber"
        :label="$t('data.ciphers.license')"
        class="w-full !mb-2"
        :disabled="isDeleted"
        @input="val => $emit('update:licenseNumber', val)"
      />
    </div>
    <div class="mb-4 text-black-700 text-head-6 font-semibold">
      {{ $t('data.ciphers.contact_info') }}
    </div>
    <div class="grid grid-cols-2 gap-x-2 mb-4">
      <InputText
        :value="address1"
        :label="$t('data.ciphers.address') + '1'"
        class="w-full col-span-2"
        :disabled="isDeleted"
        @input="val => $emit('update:address1', val)"
      />
      <InputText
        :value="address2"
        :label="$t('data.ciphers.address') + '2'"
        class="w-full col-span-2"
        :disabled="isDeleted"
        @input="val => $emit('update:address2', val)"
      />
      <InputText
        :value="city"
        :label="$t('data.ciphers.city_town')"
        class="w-full col-span-2"
        :disabled="isDeleted"
        @input="val => $emit('update:city', val)"
      />
      <InputText
        :value="state"
        :label="$t('data.ciphers.state_province')"
        class="w-full col-span-2"
        :disabled="isDeleted"
        @input="val => $emit('update:state', val)"
      />
      <InputText
        :value="postalCode"
        :label="$t('data.ciphers.zip')"
        class="w-full col-span-2"
        :disabled="isDeleted"
        @input="val => $emit('update:postalCode', val)"
      />
      <InputText
        :value="country"
        :label="$t('data.ciphers.country')"
        class="w-full col-span-2 !mb-2"
        :disabled="isDeleted"
        @input="val => $emit('update:country', val)"
      />
    </div>
  </div>
</template>
<script>
import InputText from '../../../input/InputText'
import InputSelect from '../../../input/InputSelect'

export default {
  components: { InputText, InputSelect },

  props: {
    isDeleted: {
      type: Boolean,
      default: () => false
    },
    title: {
      type: String,
      default: () => ''
    },
    firstName: {
      type: String,
      default: () => ''
    },
    lastName: {
      type: String,
      default: () => ''
    },
    username: {
      type: String,
      default: () => ''
    },
    company: {
      type: String,
      default: () => ''
    },
    email: {
      type: String,
      default: () => ''
    },
    phone: {
      type: String,
      default: () => ''
    },
    ssn: {
      type: String,
      default: () => ''
    },
    passportNumber: {
      type: String,
      default: () => ''
    },
    licenseNumber: {
      type: String,
      default: () => ''
    },
    address1: {
      type: String,
      default: () => ''
    },
    address2: {
      type: String,
      default: () => ''
    },
    city: {
      type: String,
      default: () => ''
    },
    state: {
      type: String,
      default: () => ''
    },
    postalCode: {
      type: String,
      default: () => ''
    },
    country: {
      type: String,
      default: () => ''
    }
  }
}
</script>
