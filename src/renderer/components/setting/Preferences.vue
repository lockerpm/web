<template>
  <div class="setting-wrapper">
    <div class="setting-section">
      <div
        class="setting-section-header cursor-pointer"
        @click="collapsed = !collapsed"
      >
        <div class="text-head-5 font-semibold">
          {{ $t('data.settings.preferences') }}
        </div>
        <div>
          <el-tooltip
            class="item"
            effect="light"
            :content="$t('data.settings.lock_desc')"
            placement="bottom-end"
          >
            <button
              class="btn btn-default !text-warning mr-4 md:mb-0"
              @click="lock"
            >
              {{ $t('common.lock') }}
            </button>
          </el-tooltip>
          <i v-if="collapsed" class="el-icon-arrow-right" />
          <i v-else class="el-icon-arrow-down" />
        </div>
      </div>
    </div>
    <div v-if="!collapsed">
      <div class="setting-section">
        <div class="setting-section-header">
          <div class="pr-4">
            <div class="setting-title">{{ $t('data.settings.language') }}</div>
          </div>
          <div>
            <el-select
              :value="locale"
              placeholder="Select"
              @change="changeLang"
            >
              <el-option label="Tiếng Việt" value="vi" />
              <el-option label="English" value="en" />
              <el-option label="繁體中文" value="zh" />
              <el-option :label="$t('data.settings.dont_find_lang')" value="new" />
            </el-select>
          </div>
        </div>
      </div>
      <div class="setting-section">
        <div class="setting-section-header">
          <div class="pr-4">
            <div class="setting-title">
              {{ $t('data.settings.timeout') }}
            </div>
            <div class="setting-description">
              {{ $t('data.settings.timeout_desc') }}
            </div>
          </div>
          <div>
            <el-select
              v-model="user.timeout"
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
          <div class="pr-4">
            <div class="setting-title">
              {{ $t('data.settings.timeout_action') }}
            </div>
            <div class="setting-description">
              {{ $t('data.settings.timeout_action_1') }}
            </div>
            <div class="setting-description">
              {{ $t('data.settings.timeout_action_2') }}
            </div>
          </div>
          <div>
            <el-select
              v-model="user.timeout_action"
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
  </div>
</template>

<script>
export default {
  components: {},
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
        { label: this.$t('data.timeouts.twoWeeks'), value: 60 * 24 * 14 },
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
    }
  }
}
</script>
