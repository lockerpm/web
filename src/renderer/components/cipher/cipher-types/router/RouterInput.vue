<template>
  <div>
    <InputText
      v-model="router.deviceName"
      :label="$t('data.ciphers.router.device_name')"
      class="w-full"
      :disabled="isDeleted"
    />
    <InputText
      v-model="router.ipAddress"
      :label="$t('data.ciphers.router.router_ip_address')"
      class="w-full"
      :disabled="isDeleted"
    />
    <InputText
      v-model="router.adminUsername"
      :label="$t('data.ciphers.router.admin_username')"
      class="w-full"
      :disabled="isDeleted"
    />
    <InputText
      v-model="router.adminPassword"
      :label="$t('data.ciphers.router.admin_password')"
      class="w-full"
      :disabled="isDeleted"
      is-password
    />
    <InputText
      v-model="router.wifiSSID"
      :label="$t('data.ciphers.router.wifi_ssid')"
      class="w-full"
      :disabled="isDeleted"
    />
    <InputText
      v-model="router.wifiPassword"
      :label="$t('data.ciphers.router.wifi_pw')"
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
      router: {
        deviceName: '',
        ipAddress: '',
        adminUsername: '',
        adminPassword: '',
        wifiSSID: '',
        wifiPassword: ''
      }
    }
  },

  methods: {
    loadData (data) {
      this.router = { ...data }
    },

    getData () {
      return this.router
    }
  }
}
</script>
