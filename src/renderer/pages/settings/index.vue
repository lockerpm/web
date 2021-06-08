<template>
  <div>
    <div class="text-head-5 font-semibold mb-4">Account</div>
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
              Lock
            </button>
            <button class="btn btn-default !text-danger"
                    @click="logout"
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
      <div class="setting-section">
        <div class="setting-section-header">
          <div>
            <div class="setting-title">Fingerprint</div>
            <div class="setting-description !text-danger-400">{{ fingerprint }}</div>
          </div>
        </div>
      </div>
      <div class="setting-section">
        <div class="setting-section-header">
          <div>
            <div class="setting-title">Plan</div>
            <div class="setting-description">{{ currentPlan.name }}</div>
          </div>
          <div>
            <nuxt-link tag="button"
                       :to="localeRoute({name: 'upgrade'})"
                       class="btn btn-primary"
            >
              Manage Plan
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>
    <div class="text-head-5 font-semibold mb-4">Options</div>
    <div class="setting-wrapper">
      <div class="setting-section">
        <div class="setting-section-header">
          <div>
            <div class="setting-title">
              Timeout
            </div>
            <div class="setting-description">
              Automatically locks the app after a chosen period of device inactivity
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
              Timeout Action
            </div>
            <div class="setting-description">
              A locked vault requires that you re-enter your master password to access it again.
            </div>
            <div class="setting-description">
              A logged out vault requires that you re-authenticate to access it again.
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
    <div class="text-head-5 font-semibold mb-4">Security</div>
    <div class="setting-wrapper">
      <div class="setting-section">
        <div class="setting-section-header">
          <div>
            <div class="setting-title">Change Master Key</div>
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
              Emergency Access
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
    <div class="text-head-5 font-semibold mb-4 text-danger">Danger Zone</div>
    <div class="setting-wrapper">
      <div class="setting-section">
        <div class="setting-section-header">
          <div>
            <div class="setting-description mb-4">
              Careful, these actions are not reversible!
            </div>
            <div>
              <button class="btn btn-default !text-danger"
                      @click="openPurgeVault('purge')"
              >
                Delete all account items
              </button>
              <button class="btn btn-default !text-danger"
                      @click="openPurgeVault('delete_account')"
              >
                Delete Account
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
