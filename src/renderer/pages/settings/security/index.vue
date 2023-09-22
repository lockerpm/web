<template>
  <div class="w-full">
    <div class="text-head-5 font-semibold mb-2">
      {{ $t('data.settings.security_control') }}
    </div>
    <div class="text-lg text-black-600 mb-4">
      {{ $t('data.settings.security_desc') }}
    </div>
    <ChangePassword v-if="!isOnPremise" />
    <ChangeMasterPassword />
    <TwoFactorAuthentication v-if="!isOnPremise" />
    <EmergencyAccess />
    <ManageSessions />
  </div>
</template>

<script>
import ChangePassword from '@/components/setting/ChangePassword.vue'
import ChangeMasterPassword from '@/components/setting/ChangeMasterPassword.vue'
import TwoFactorAuthentication from '@/components/setting/TwoFactorAuthentication.vue'
import EmergencyAccess from '@/components/setting/emergency-access/EmergencyAccess.vue'
import ManageSessions from '@/components/setting/ManageSessions.vue'

export default {
  components: {
    ChangePassword,
    ChangeMasterPassword,
    TwoFactorAuthentication,
    EmergencyAccess,
    ManageSessions
  },
  data () {
    return {}
  },
  computed: {},
  watch: {},
  async mounted () {},
  methods: {}
}
</script>
