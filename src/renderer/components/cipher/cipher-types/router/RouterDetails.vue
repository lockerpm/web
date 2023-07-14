<template>
  <div>
    <TextHaveCopy
      :label="$t('data.ciphers.router.device_name')"
      :text="router.deviceName"
      :should-hide="isPublic && hideAll"
    />
    <TextHaveCopy
      :label="$t('data.ciphers.router.router_ip_address')"
      :text="router.ipAddress"
      :should-hide="isPublic && hideAll"
    />
    <TextHaveCopy
      :label="$t('data.ciphers.router.admin_username')"
      :text="router.adminUsername"
      :should-hide="isPublic && hideAll"
    />
    <TextHaveCopy
      :label="$t('data.ciphers.router.admin_password')"
      :text="router.adminPassword"
      :should-hide="!isPublic || hideAll"
    />
    <div class="grid md:grid-cols-6 cipher-item">
      <p class="!break-normal mr-4">
        {{ $t('data.ciphers.password_strength') }}
      </p>
      <div class="col-span-4 font-semibold">
        <PasswordStrength :score="adminPasswordStrength.score" />
      </div>
    </div>
    <TextHaveCopy
      :label="$t('data.ciphers.router.wifi_ssid')"
      :text="router.wifiSSID"
      :should-hide="isPublic && hideAll"
    />
    <TextHaveCopy
      :label="$t('data.ciphers.router.wifi_pw')"
      :text="router.wifiPassword"
      :should-hide="!isPublic || hideAll"
    />
    <div class="grid md:grid-cols-6 cipher-item">
      <p class="!break-normal mr-4">
        {{ $t('data.ciphers.password_strength') }}
      </p>
      <div class="col-span-4 font-semibold">
        <PasswordStrength :score="wifiPasswordStrength.score" />
      </div>
    </div>
    <TextHaveCopy
      :label="$t('data.ciphers.notes')"
      :text="router.notes"
      :text-area="true"
      :should-hide="isPublic && hideAll"
    />
  </div>
</template>
<script>
import { CipherView } from '../../../../core/models/view/cipherView'
import TextHaveCopy from '@/components/cipher/TextHaveCopy'
import PasswordStrength from '@/components/password/PasswordStrength'

export default {
  components: {
    TextHaveCopy,
    PasswordStrength
  },

  props: {
    cipher: {
      type: [CipherView, Object],
      default: () => ({ router: {} })
    },
    isPublic: {
      type: Boolean,
      default: () => false
    },
    hideAll: {
      type: Boolean,
      default: () => false
    }
  },

  computed: {
    router () {
      const item = { ...this.cipher.router }
      return item
    },
    adminPasswordStrength () {
      return (
        this.$passwordGenerationService.passwordStrength(
          this.router?.adminPassword,
          ['cystack']
        ) || {}
      )
    },
    wifiPasswordStrength () {
      return (
        this.$passwordGenerationService.passwordStrength(
          this.router?.wifiPassword,
          ['cystack']
        ) || {}
      )
    }
  }
}
</script>
