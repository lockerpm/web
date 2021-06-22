<template>
  <div>
    <div class="text-head-5 font-semibold mb-4">
      {{ $t('settings.account') }}
    </div>
    <div class="setting-wrapper">
      <div class="setting-section">
        <div class="setting-section-header">
          <div>
            <div class="setting-title">Email</div>
            <div class="setting-description">{{ currentUser.email }}</div>
          </div>
          <div>
            <button class="btn btn-default !text-warning"
                    @click="lock"
            >
              {{ $t('common.lock') }}
            </button>
            <button class="btn btn-default !text-danger"
                    @click="logout"
            >
              {{ $t('common.logout') }}
            </button>
          </div>
        </div>
      </div>
      <div class="setting-section">
        <div class="setting-section-header">
          <div>
            <div class="setting-title">{{ $t('settings.fingerprint') }}</div>
            <div class="setting-description !text-danger-400">{{ fingerprint }}</div>
          </div>
        </div>
      </div>
      <div class="setting-section">
        <div class="setting-section-header">
          <div>
            <div class="setting-title">{{ $t('settings.plan') }}</div>
            <div class="setting-description">{{ currentPlan.name }}</div>
          </div>
          <div>
            <nuxt-link tag="button"
                       :to="localeRoute({name: 'upgrade'})"
                       class="btn btn-primary"
            >
              {{ $t('settings.manage_plan') }}
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>
    <div class="text-head-5 font-semibold mb-4">{{ $t('settings.options') }}</div>
    <div class="setting-wrapper">
      <div class="setting-section">
        <div class="setting-section-header">
          <div>
            <div class="setting-title">
              {{ $t('settings.timeout') }}
            </div>
            <div class="setting-description">
              {{ $t('settings.timeout_desc') }}
            </div>
          </div>
          <div>
            <el-select v-model="user.timeout"
                       placeholder=""
                       :disabled="loading"
                       @change="putUser"
            >
              <el-option
                v-for="item in vaultTimeouts"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
        </div>
      </div>
      <div class="setting-section">
        <div class="setting-section-header">
          <div>
            <div class="setting-title">
              {{ $t('settings.timeout_action') }}
            </div>
            <div class="setting-description">
              {{ $t('settings.timeout_action_1') }}
            </div>
            <div class="setting-description">
              {{ $t('settings.timeout_action_2') }}
            </div>
          </div>
          <div>
            <el-select v-model="user.timeout_action"
                       placeholder=""
                       :disabled="loading"
                       @change="putUser"
            >
              <el-option
                v-for="item in vaultTimeoutActions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
        </div>
      </div>
    </div>
    <div class="text-head-5 font-semibold mb-4">
      {{ $t('settings.security') }}
    </div>
    <div class="setting-wrapper">
      <div class="setting-section">
        <div class="setting-section-header">
          <div>
            <div class="setting-title">
              {{ $t('settings.change_master_password') }}
            </div>
          </div>
          <div>
            <button class="btn btn-icon !text-black-600"
                    @click="changeMasterPassword"
            >
              <i class="fa fa-chevron-right" />
            </button>
          </div>
        </div>
      </div>
      <div class="setting-section">
        <div class="setting-section-header">
          <div>
            <div class="setting-title">
              {{ $t('settings.emergency_access') }}
            </div>
            <div class="setting-description" />
          </div>
          <div>
            <button class="btn btn-icon !text-black-600">
              <i class="fa fa-chevron-right" />
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="text-head-5 font-semibold mb-4 text-danger">
      {{ $t('settings.danger_zone') }}
    </div>
    <div class="setting-wrapper">
      <div class="setting-section">
        <div class="setting-section-header">
          <div>
            <div class="setting-description mb-4">
              {{ $t('settings.danger_zone_note') }}
            </div>
            <div>
              <button class="btn btn-default !text-danger"
                      @click="openPurgeVault('purge')"
              >
                {{ $t('settings.delete_all_items') }}
              </button>
              <button class="btn btn-default !text-danger"
                      @click="openPurgeVault('delete_account')"
              >
                {{ $t('settings.delete_account') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <ChangeMasterPassword ref="changeMasterPassword" />
    <PurgeVault ref="purgeVault" />
  </div>
</template>

<script>
import ChangeMasterPassword from '../../components/user/ChangeMasterPassword'
import PurgeVault from '../../components/setting/PurgeVault'
export default {
  components: {
    ChangeMasterPassword, PurgeVault
  },
  data () {
    return {
      user: {},
      loading: false,
      collapsed: false,
      fingerprint: ''
    }
  },
  computed: {
    vaultTimeouts () {
      return [
        { label: this.$t('data.timeouts.oneMinute'), value: 1 },
        { label: this.$t('data.timeouts.fiveMinutes'), value: 5 },
        { label: this.$t('data.timeouts.fifteenMinutes'), value: 15 },
        { label: this.$t('data.timeouts.thirtyMinutes'), value: 30 },
        { label: this.$t('data.timeouts.oneHour'), value: 60 },
        { label: this.$t('data.timeouts.fourHours'), value: 240 },
        { label: this.$t('data.timeouts.onRefresh'), value: -1 }
      ]
    },
    vaultTimeoutActions () {
      return [
        { label: this.$t('common.lock'), value: 'lock' },
        { label: this.$t('common.logout'), value: 'logOut' }
      ]
    },
    currentPlan () {
      return this.$store.state.currentPlan
    }
  },
  mounted () {
    this.getUser()
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
      const user = await this.$store.dispatch('LoadCurrentUserPw')
      this.user = { ...user }
    },
    async putUser () {
      try {
        this.loading = true
        await this.$axios.$put('cystack_platform/pm/users/me', this.user)
        this.$store.commit('UPDATE_USER_PW', this.user)
        this.$vaultTimeoutService.setVaultTimeoutOptions(this.user.timeout, this.user.timeout_action)
        this.notify(this.$t('data.notifications.update_settings_success'), 'success')
      } catch (e) {
        console.log(e)
        this.notify(this.$t('data.notifications.update_settings_failed'), 'warning')
      } finally {
        this.loading = false
      }
    },
    async upgradeTeam () {
      // default org
      const shareKey = await this.$cryptoService.makeShareKey()
      const orgKey = shareKey[0].encryptedString
      const collection = await this.$cryptoService.encrypt('defaultCollection' + this.currentUser.email, shareKey[1])
      const collectionName = collection.encryptedString
      this.$axios.$post('/cystack_platform/pm/teams', {
        name: this.currentUser.email + ' team',
        key: orgKey,
        collection_name: collectionName
      })
    },
    changeMasterPassword () {
      this.$refs.changeMasterPassword.openDialog()
    },
    openPurgeVault (type) {
      this.$refs.purgeVault.openDialog(type)
    }
  }
}
</script>
