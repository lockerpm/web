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
    <PasswordStrengthBar :score="adminPasswordStrength.score" class="mt-2" />
    <div v-if="!isDeleted" class="text-right">
      <el-popover
        placement="right"
        width="280"
        trigger="click"
        popper-class="locker-pw-generator"
      >
        <PasswordGenerator @fill="fillAdminPassword" />

        <button slot="reference" class="btn btn-clean !text-primary">
          {{ $t('data.ciphers.generate_random_password') }}
        </button>
      </el-popover>
    </div>
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
    <PasswordStrengthBar :score="wifiPasswordStrength.score" class="mt-2" />
    <div v-if="!isDeleted" class="text-right">
      <el-popover
        placement="right"
        width="280"
        trigger="click"
        popper-class="locker-pw-generator"
      >
        <PasswordGenerator @fill="fillWifiPassword" />

        <button slot="reference" class="btn btn-clean !text-primary">
          {{ $t('data.ciphers.generate_random_password') }}
        </button>
      </el-popover>
    </div>
  </div>
</template>
<script>
import InputText from '../../../input/InputText'
import PasswordGenerator from '../../../password/PasswordGenerator'
import PasswordStrengthBar from '../../../password/PasswordStrengthBar'

export default {
  components: {
    InputText,
    PasswordGenerator,
    PasswordStrengthBar
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

  computed: {
    adminPasswordStrength () {
      return (
        this.$passwordGenerationService.passwordStrength(
          this.router.adminPassword,
          ['cystack']
        ) || {}
      )
    },
    wifiPasswordStrength () {
      return (
        this.$passwordGenerationService.passwordStrength(
          this.router.wifiPassword,
          ['cystack']
        ) || {}
      )
    }
  },

  methods: {
    fillAdminPassword (p) {
      this.router.adminPassword = p
    },
    fillWifiPassword (p) {
      this.router.wifiPassword = p
    },
    loadData (data) {
      this.router = { ...data }
    },

    getData () {
      return this.router
    }
  }
}
</script>
