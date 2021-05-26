<template>
  <div>
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
            <div class="setting-title">Plan</div>
            <div class="setting-description">Business Premium Trial</div>
          </div>
          <div>
            <button class="btn btn-primary">
              Upgrade
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="setting-wrapper">
      <div class="setting-section">
        <div class="setting-section-header">
          <div>
            <div class="setting-title">Change Master Password</div>
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
    <ChangeMasterPassword ref="changeMasterPassword" />
  </div>
</template>

<script>
import ChangeMasterPassword from '../../components/user/ChangeMasterPassword'
export default {
  components: {
    ChangeMasterPassword
  },
  data () {
    return {
      user: {},
      loading: false,
      collapsed: false
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
    }
  },
  mounted () {
    this.getUser()
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
    }
  }
}
</script>
