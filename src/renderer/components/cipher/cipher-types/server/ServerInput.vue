<template>
  <div>
    <InputText
      v-model="server.host"
      :label="$t('data.ciphers.server.host')"
      class="w-full"
      :disabled="isDeleted"
    />
    <InputText
      v-model="server.publicKey"
      :label="$t('data.ciphers.server.public_key')"
      class="w-full"
      :disabled="isDeleted"
    />
    <InputText
      v-model="server.privateKey"
      :label="$t('data.ciphers.server.private_key')"
      class="w-full"
      :disabled="isDeleted"
      is-password
    />
    <InputText
      v-model="server.username"
      :label="$t('common.username')"
      class="w-full"
      :disabled="isDeleted"
    />
    <InputText
      v-model="server.password"
      :label="$t('common.password')"
      class="w-full"
      :disabled="isDeleted"
      is-password
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
      server: {
        host: '',
        publicKey: '',
        privateKey: '',
        username: '',
        password: '',
        notes: ''
      }
    }
  },

  methods: {
    loadData (data) {
      this.server = { ...data }
    },

    getData () {
      return this.server
    }
  }
}
</script>
