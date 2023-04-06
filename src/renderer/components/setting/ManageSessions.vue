<template>
  <div class="setting-wrapper">
    <div class="setting-section">
      <div class="setting-section-header cursor-pointer" @click="collapsed = !collapsed">
        <div class="text-head-5 font-semibold">
          {{ $t('data.settings.manage_sessions') }}
        </div>
        <i v-if="!collapsed" class="el-icon-arrow-right" />
        <i v-else class="el-icon-arrow-down" />
      </div>
    </div>
    <div v-if="collapsed" class="setting-section">
      <div v-for="item in listDevices.filter(device => device.is_active)" :key="item.device_identifier">
        <div  class="flex justify-between items-center setting-section">
          <div class="flex items-center">
            <div class="mr-10 text-head-3 w-10 text-center">
              <i class="fas" :class="item.client_id === 'web'?'fa-laptop': item.client_id==='browser'?'fa-puzzle-piece':'fa-mobile-alt'" />
            </div>
            <div>
              <div v-if="item.os"><span class="font-semibold">{{ item.os.family }} {{ item.os.version }}</span> &nbsp; &nbsp; {{ item.browser.family }} {{ item.browser.version }}</div>
              <div class="text-black-600">
                {{ item.client_id === 'browser' ? 'Web Extension' : item.client_id === 'mobile'?'Mobile Application':'Web Application' }}
              </div>
            </div>
          </div>
          <div>
            <span class="h-2 w-2 bg-green-600 rounded-full inline-block mr-2" />{{ $t('common.active') }}
          </div>
        </div>
      </div>
      <div>
        <button class="btn btn-outline-primary" @click="openDeauthorizeSessions()">
          {{ $t('data.settings.logout_all') }}
        </button>
      </div>
      <DeauthorizeSessions ref="deauthorizeSessions" />
    </div>
  </div>
</template>

<script>

import DeauthorizeSessions from './DeauthorizeSessions.vue'
export default {
  components: {
    DeauthorizeSessions
  },
  data () {
    return {
      loading: false,
      collapsed: false,
      listDevices: []
    }
  },
  computed: {
  },
  async mounted () {
    const locked = await this.$vaultTimeoutService.isLocked()
    if (!locked) {
      await Promise.all([
        this.getListDevices()
      ])
    }
  },
  methods: {
    async getListDevices () {
      try {
        this.loading = true
        this.listDevices = await this.$axios.$get('cystack_platform/pm/users/me/devices')
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    },
    openDeauthorizeSessions () {
      this.$refs.deauthorizeSessions.openDialog()
    }
  }
}
</script>
