<template>
  <div>
    <InputText
      v-model="api.url"
      :label="$t('data.ciphers.api.url')"
      class="w-full"
      :disabled="isDeleted"
    />
    <InputSelect
      :label="$t('data.ciphers.api.method')"
      :initial-value="api.method"
      class="w-full"
      :disabled="isDeleted"
      :options="apiMethodOptions"
      @change="val => (api.method = val)"
    />
    <InputText
      v-model="api.header"
      :label="$t('data.ciphers.api.header')"
      class="w-full"
      :disabled="isDeleted"
    />
    <InputText
      v-model="api.bodyData"
      :label="$t('data.ciphers.api.body_data')"
      class="w-full"
      :disabled="isDeleted"
    />
    <InputText
      v-model="api.response"
      :label="$t('data.ciphers.api.response')"
      class="w-full"
      :disabled="isDeleted"
    />
  </div>
</template>
<script>
import InputText from '../../../input/InputText'
import { API_METHODS } from '../../../../utils/new-types/api'
import InputSelect from '../../../input/InputSelect'

export default {
  components: {
    InputText,
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
      api: {
        url: '',
        method: API_METHODS.GET,
        header: '',
        bodyData: '',
        response: '',
        notes: ''
      }
    }
  },

  methods: {
    // Methods to be called by ref

    loadData (data) {
      this.api = { ...data }
    },

    getData () {
      return this.api
    }
  }
}
</script>
