<template>
  <div>
    <InputText
      v-model="database.host"
      :label="$t('data.ciphers.database.host')"
      class="w-full"
      :disabled="isDeleted"
    />
    <InputText
      v-model="database.port"
      :label="$t('data.ciphers.database.port')"
      class="w-full"
      :disabled="isDeleted"
    />
    <InputText
      v-model="database.username"
      :label="$t('common.username')"
      class="w-full"
      :disabled="isDeleted"
    />
    <InputText
      v-model="database.password"
      :label="$t('common.password')"
      class="w-full"
      :disabled="isDeleted"
      is-password
    />
    <InputText
      v-model="database.default"
      :label="$t('data.ciphers.database.default')"
      class="w-full"
      :disabled="isDeleted"
    />
  </div>
</template>
<script>
import InputText from '../../../input/InputText'

export default {
  components: {
    InputText
  },

  props: {
    isDeleted: {
      type: Boolean,
      default: () => false
    }
  },

  data () {
    return {
      database: {
        host: '',
        port: '',
        username: '',
        password: '',
        default: '',
        notes: ''
      }
    }
  },

  methods: {
    loadData (data) {
      this.database = { ...data }
    },

    getData () {
      return this.database
    }
  }
}
</script>
