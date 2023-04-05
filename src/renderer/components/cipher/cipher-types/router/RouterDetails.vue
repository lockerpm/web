<template>
  <div>
    <TextHaveCopy
      :label="$t('data.ciphers.router.device_name')"
      :text="router.deviceName"
    />
    <TextHaveCopy
      :label="$t('data.ciphers.router.router_ip_address')"
      :text="router.ipAddress"
    />
    <TextHaveCopy
      :label="$t('data.ciphers.router.admin_username')"
      :text="router.adminUsername"
    />
    <TextHaveCopy
      :label="$t('data.ciphers.router.admin_password')"
      :text="router.adminPassword"
      should-hide
    />
    <TextHaveCopy
      :label="$t('data.ciphers.router.wifi_ssid')"
      :text="router.wifiSSID"
    />
    <TextHaveCopy
      :label="$t('data.ciphers.router.wifi_pw')"
      :text="router.wifiPassword"
      should-hide
    />
    <TextHaveCopy
      :label="$t('data.ciphers.notes')"
      :text="router.notes"
      :text-area="true"
    />
  </div>
</template>
<script>
import { CipherView } from '../../../../core/models/view/cipherView'
import TextHaveCopy from '@/components/cipher/TextHaveCopy'

export default {
  components: {
    TextHaveCopy
  },

  props: {
    cipher: {
      type: [CipherView, Object],
      default: () => ({ router: {} })
    }
  },

  computed: {
    router () {
      const item = { ...this.cipher.router }
      return item
    }
  }
}
</script>
