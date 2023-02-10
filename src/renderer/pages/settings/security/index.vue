<template>
  <div class="lg:w-2/3 mx-auto">
    <div class="text-head-5 font-semibold mb-2">
      {{ $t('data.settings.security') }}
    </div>
    <div class="text-lg text-black-600 mb-4">
      {{ $t('data.settings.security_desc') }}
    </div>

    <!-- Change Master PW -->
    <ChangeMasterPwSetting />
    <!-- Change Master PW end -->

    <!-- 2FA -->
    <TwoFactorSetting v-if="isOnPremise" />
    <!-- 2FA end -->

    <!-- Emergency access -->
    <EmergencyAccessSetting />
    <!-- Emergency access end -->
  </div>
</template>

<script>
import ChangeMasterPwSetting from '@/components/pages/settings/security/ChangeMasterPwSetting.vue'
import EmergencyAccessSetting from '@/components/pages/settings/security/EmergencyAccessSetting.vue'
import TwoFactorSetting from '@/components/pages/settings/security/2fa'

export default {
  components: {
    ChangeMasterPwSetting,
    EmergencyAccessSetting,
    TwoFactorSetting
  }
}
</script>
