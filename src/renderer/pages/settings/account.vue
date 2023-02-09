<template>
  <div class="lg:w-2/3 mx-auto">
    <div class="text-head-4 font-semibold mb-2">
      {{ $t('data.settings.account') }}
    </div>
    <div class="text-lg text-black-600 mb-4">
      {{ $t('data.settings.account_desc') }}
    </div>
    <div class="setting-wrapper">
      <div class="setting-section">
        <div class="setting-section-header">
          <div class="text-head-5 font-semibold">
            {{ $t('data.settings.your_profile') }}
          </div>
        </div>
      </div>
      <div class="setting-section">
        <div class="setting-section-header">
          <div class="flex items-center">
            <el-avatar :size="70" :src="currentUser.avatar" class="mr-4" />
            <div>
              <div class="setting-title">{{ currentUser.full_name }}</div>
              <div class="setting-description">
                {{ currentTeam ? currentTeam.name : currentPlan.name }}
              </div>
            </div>
          </div>
          <div>
            <button
              class="btn btn-default !text-warning mb-4 md:mb-0"
              @click="lock"
            >
              {{ $t('common.lock') }}
            </button>
            <button class="btn btn-default !text-danger" @click="logout">
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

        <!-- Edit in ID -->
        <div v-if="!isOnPremise" class="sm:flex">
          <a href="https://id.locker.io/" target="_blank" class="mr-4">
            <button class="btn btn-default mb-4 md:mb-0">
              <span>{{ $t('data.settings.edit_profile') }}
                <i
                  class="fas fa-external-link-alt"
                /></span>
            </button>
          </a>
          <a href="https://id.locker.io/security/password" target="_blank">
            <button class="btn btn-default mb-4 md:mb-0">
              <span>{{ $t('data.settings.change_password') }}
                <i
                  class="fas fa-external-link-alt"
                /></span>
            </button>
          </a>
        </div>
        <!-- Edit in ID end -->
      </div>
      <div class="setting-section">
        <div class="setting-section-header">
          <div>
            <div class="setting-title">
              {{ $t('data.settings.fingerprint') }}
            </div>
            <div class="setting-description !text-danger-400">
              {{ fingerprint }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="setting-wrapper">
      <div class="setting-section">
        <div class="setting-section-header">
          <div>
            <div class="setting-title">
              {{ $t('data.settings.manage_sessions') }}
            </div>
          </div>
        </div>
        <div>
          <template
            v-for="item in listDevices.filter(device => device.is_active)"
          >
            <div
              :key="item.device_identifier"
              class="flex justify-between items-center setting-section"
            >
              <div class="flex items-center">
                <div class="mr-10 text-head-3 w-10 text-center">
                  <i
                    class="fas"
                    :class="
                      item.client_id === 'web'
                        ? 'fa-laptop'
                        : item.client_id === 'browser'
                          ? 'fa-puzzle-piece'
                          : 'fa-mobile-alt'
                    "
                  />
                </div>
                <div>
                  <div v-if="item.os">
                    <span
                      class="font-semibold"
                    >{{ item.os.family }} {{ item.os.version }}</span>
                    &nbsp; &nbsp; {{ item.browser.family }}
                    {{ item.browser.version }}
                  </div>
                  <div class="text-black-600">
                    {{
                      item.client_id === 'browser'
                        ? 'Web Extension'
                        : item.client_id === 'mobile'
                          ? 'Mobile Application'
                          : 'Web Application'
                    }}
                  </div>
                </div>
              </div>
              <div>
                <span
                  class="h-2 w-2 bg-green-600 rounded-full inline-block mr-2"
                />Active
              </div>
            </div>
          </template>
        </div>
        <div>
          <button class="btn btn-default" @click="openDeauthorizeSessions()">
            {{ $t('data.settings.logout_all') }}
          </button>
        </div>
      </div>
    </div>
    <div class="text-head-5 font-semibold mb-4 text-danger">
      {{ $t('data.settings.danger_zone') }}
    </div>
    <div class="setting-wrapper" style="border-color: red">
      <div class="setting-section">
        <div>
          <div class="flex justify-between items-center">
            <div>
              <div class="setting-title">
                {{ $t('data.settings.delete_all_items') }}
              </div>
              <div class="setting-description mb-4">
                {{ $t('data.settings.delete_all_items_desc') }}
              </div>
            </div>
            <button
              class="btn btn-default !text-danger mt-2 md:mb-0 self-start"
              @click="openPurgeVault('purge')"
            >
              {{ $t('data.settings.delete_all_items') }}
            </button>
          </div>
          <div class="flex justify-between items-center">
            <div>
              <div class="setting-title">
                {{ $t('data.settings.delete_account') }}
              </div>
              <div class="setting-description mb-4">
                {{ $t('data.settings.delete_account_desc') }}
              </div>
            </div>
            <button
              class="btn btn-default !text-danger mt-2 md:mb-0 self-start"
              @click="openPurgeVault('delete_account')"
            >
              {{ $t('data.settings.delete_account') }}
            </button>
          </div>
          <!-- <button
            class="btn btn-default !text-danger mb-4 md:mb-0"
            @click="openDeauthorizeSessions()"
          >
            {{ $t('data.settings.deauthorize_sessions') }}
          </button> -->
        </div>
      </div>
    </div>
    <PurgeVault ref="purgeVault" />
    <DeauthorizeSessions ref="deauthorizeSessions" />
    <ReConfirmMasterPassword ref="reConfirmMasterPassword" @done="revokeAll" />
  </div>
</template>

<script>
import PurgeVault from '../../components/setting/PurgeVault'
import DeauthorizeSessions from '../../components/setting/DeauthorizeSessions'
import ReConfirmMasterPassword from '../../components/password/ReConfirmMasterPassword'
export default {
  components: {
    PurgeVault,
    DeauthorizeSessions,
    ReConfirmMasterPassword
  },
  data () {
    return {
      user: {},
      loading: false,
      collapsed: false,
      fingerprint: '',
      listDevices: []
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
      await Promise.all([this.getUser(), this.getListDevices()])
    }
  },
  asyncComputed: {
    fingerprint: {
      async get () {
        const fingerprint = await this.$cryptoService.getFingerprint(
          await this.$userService.getUserId()
        )
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
      const user = await this.$store.dispatch('LoadCurrentUserPw')
      this.user = { ...user }
    },
    async putUser () {
      try {
        this.loading = true
        await this.$axios.$put('cystack_platform/pm/users/me', this.user)
        this.$store.commit('UPDATE_USER_PW', this.user)
        this.$vaultTimeoutService.setVaultTimeoutOptions(
          this.user.timeout,
          this.user.timeout_action
        )
        this.notify(
          this.$t('data.notifications.update_settings_success'),
          'success'
        )
      } catch (e) {
        console.log(e)
        this.notify(
          this.$t('data.notifications.update_settings_failed'),
          'warning'
        )
      } finally {
        this.loading = false
      }
    },
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
    confirmMasterPassword () {
      this.$refs.reConfirmMasterPassword.openDialog()
    },
    async revokeAll (keyHash) {
      try {
        await this.$axios.$post(
          'cystack_platform/pm/users/session/revoke_all',
          {
            master_password_hash: keyHash
          }
        )
        this.getListDevices()
      } catch (error) {
        console.log(error)
      }
    },
    openPurgeVault (type) {
      this.$refs.purgeVault.openDialog(type)
    },
    openDeauthorizeSessions () {
      this.$refs.deauthorizeSessions.openDialog()
    }
  }
}
</script>
