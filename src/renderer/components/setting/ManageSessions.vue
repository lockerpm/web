<template>
  <div class="setting-wrapper">
    <!-- Header -->
    <div class="setting-section">
      <div
        class="setting-section-header cursor-pointer"
        @click="collapsed = !collapsed"
      >
        <div class="text-head-5 font-semibold">
          {{ $t('data.settings.manage_sessions') }}
        </div>
        <i v-if="!collapsed" class="el-icon-arrow-right" />
        <i v-else class="el-icon-arrow-down" />
      </div>
    </div>
    <!-- Header end -->

    <!-- Body -->
    <div v-if="collapsed" class="setting-section">
      <!-- Sessions -->
      <div
        v-for="item in listDevices.filter(device => device.is_active)"
        :key="item.device_identifier"
      >
        <div class="flex justify-between items-center setting-section">
          <!-- Info -->
          <div class="flex items-center flex-1">
            <div class="mr-10 text-head-3 w-10 text-center">
              <i class="fas" :class="getClientInfo(item).icon" />
            </div>
            <div>
              <div v-if="item.os">
                <span class="font-semibold">{{ item.os.family }} {{ item.os.version }}</span>
                &nbsp; &nbsp; {{ item.browser.family }}
                {{ item.browser.version }}
              </div>
              <div class="text-black-600">
                {{ getClientInfo(item).name }}
              </div>
              <p v-if="item.device_identifier === currentDevice">
                ({{ $t('data.settings.current_device') }})
              </p>
            </div>
          </div>
          <!-- Info -->

          <!-- Status -->
          <div class="mr-4">
            <span
              class="h-2 w-2 bg-green-600 rounded-full inline-block mr-2"
            />{{ $t('common.active') }}
          </div>
          <!-- Status end -->

          <!-- Deactivate -->
          <el-button type="danger" @click="openDeauthorizeSessions(item)">
            {{ $t('common.logout') }}
          </el-button>
          <!-- Deactivate end -->
        </div>
      </div>
      <!-- Sessions end-->

      <div>
        <button
          class="btn btn-outline-primary"
          @click="openDeauthorizeSessions()"
        >
          {{ $t('data.settings.logout_all') }}
        </button>
      </div>

      <DeauthorizeSessions
        ref="deauthorizeSessions"
        :device="selectedDevice"
        @device-deleted="onDeviceDeleted"
      />
    </div>
    <!-- Body end -->
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
      listDevices: [],
      selectedDevice: {},
      currentDevice: ''
    }
  },
  computed: {},
  async mounted () {
    this.currentDevice = this.$cookies.get('device_id')
    const locked = await this.$vaultTimeoutService.isLocked()
    if (!locked) {
      await Promise.all([this.getListDevices()])
    }
  },
  methods: {
    async getListDevices () {
      try {
        this.loading = true
        this.listDevices = await this.$axios.$get(
          'cystack_platform/pm/users/me/devices'
        )
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    },

    getClientInfo (device) {
      switch (device.client_id) {
      case 'web':
        return {
          icon: 'fa-laptop',
          name: 'Web Application'
        }
      case 'browser':
        return {
          icon: 'fa-puzzle-piece',
          name: 'Web Extension'
        }
      case 'mobile':
        return {
          icon: 'fa-mobile-alt',
          name: 'Mobile Application'
        }
      case 'desktop':
        return {
          icon: 'fa-desktop',
          name: 'Desktop Application'
        }
      default:
        return {
          icon: 'fa-puzzle-piece',
          name: 'Other Application'
        }
      }
    },

    openDeauthorizeSessions (device) {
      this.selectedDevice = device
      this.$refs.deauthorizeSessions.openDialog()
    },

    onDeviceDeleted (deviceId) {
      this.selectedDevice = {}
      this.listDevices = this.listDevices.filter(
        d => d.device_identifier !== deviceId
      )
      if (deviceId === this.currentDevice) {
        this.getListDevices()
      }
    }
  }
}
</script>
