<template>
  <div class="setting-wrapper">
    <div class="setting-section">
      <div class="setting-section-header cursor-pointer" @click="collapsed = !collapsed">
        <div class="text-head-5 font-semibold">
          {{ $t('data.settings.your_profile') }}
        </div>
        <i v-if="!collapsed" class="el-icon-arrow-right"></i>
        <i v-else class="el-icon-arrow-down"></i>
      </div>
    </div>
    <div v-if="collapsed">
      <div class="setting-section">
        <div class="setting-section-header">
          <div class="flex items-center">
            <el-avatar :size="70" :src="currentUser.avatar" class="mr-4" />
            <div>
              <div class="setting-title">{{ currentUser.full_name }}</div>
              <div class="setting-description">{{ currentTeam ? currentTeam.name : currentPlan.name }}</div>
            </div>
          </div>
          <div>
            <button
              class="btn btn-default !text-warning mb-4 md:mb-0"
              @click="lock"
            >
              {{ $t('common.lock') }}
            </button>
            <button
              class="btn btn-default !text-danger"
              @click="logout"
            >
              {{ $t('common.logout') }}
            </button>
          </div>
        </div>
      </div>
      <div class="setting-section">
        <div v-if="currentUser.email" class="text-black mb-3">
          <div>{{ $t('common.email') }}</div>
          <div class="font-semibold">{{ currentUser.email }}</div>
        </div>
        <div v-if="currentUser.organization" class="text-black mb-3">
          <div>{{ $t('common.organization') }}</div>
          <div class="font-semibold">{{ currentUser.organization }}</div>
        </div>
        <div v-if="currentUser.country" class="text-black mb-3">
          <div>{{ $t('common.country') }}</div>
          <div class="font-semibold">{{ currentUser.country }}</div>
        </div>
        <div class="sm:flex">
          <a href="https://id.locker.io/" target="_blank" class="mr-4">
            <button
              class="btn btn-default mb-4 md:mb-0"
            >
              <span>{{ $t('data.settings.edit_profile') }} <i class="fas fa-external-link-alt" /></span>
            </button>
          </a>
          <a href="https://id.locker.io/security/password" target="_blank">
            <button
              class="btn btn-default mb-4 md:mb-0"
            >
              <span>{{ $t('data.settings.change_password') }} <i class="fas fa-external-link-alt" /></span>
            </button>
          </a>
        </div>
      </div>
      <div class="setting-section">
        <div class="setting-section-header">
          <div>
            <div class="setting-title">{{ $t('data.settings.fingerprint') }}</div>
            <div class="setting-description !text-danger-400">{{ fingerprint }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data () {
    return {
      collapsed: false,
      fingerprint: ''
    }
  },
  computed: {
    currentPlan () {
      return this.$store.state.currentPlan
    },
    currentTeam () {
      return this.teams[0]
    }
  },
  async mounted () {
    const locked = await this.$vaultTimeoutService.isLocked()
    if (!locked) {
      await Promise.all([
        this.getUser()
      ])
    }
  },
  asyncComputed: {
    fingerprint: {
      async get () {
        const fingerprint = await this.$cryptoService.getFingerprint(await this.$userService.getUserId())
        if (fingerprint != null) {
          return fingerprint.join('-')
        }
        return ''
      },
      watch: ['$store.state.syncedCiphersToggle']
    }
  },
  methods: {
    async getUser () {
      await this.$store.dispatch('LoadCurrentUserPw')
    }
  }
}
</script>
