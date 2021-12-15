<template>
  <div class="flex flex-col flex-column-fluid relative bg-[#FBFBFC]">
    <div class="flex-column-fluid lg:px-28 py-10 px-10 mb-20">
      <div class="text-head-5 font-semibold mb-4">Team Policies</div>
      <div class="setting-wrapper">
        <div class="setting-section">
          <div class="setting-section-header">
            <div>
              <div class="setting-title">{{ $t('data.password_policies.min_password_length') }}</div>
              <div class="setting-description">{{ $t('data.password_policies.min_password_length_desc') }}</div>
            </div>
            <div>
              <el-switch v-model="policies_checklist.min_password_length" />
            </div>
          </div>
          <div v-if="policies_checklist.min_password_length" class="flex w-full mt-10">
            <div class="setting-description w-1/2 pr-[72px] italic">{{ $t('data.password_policies.min_password_length_rcm') }}</div>
            <div class="w-1/2 flex">
              <el-slider
                v-model="teamPolicy.min_password_length"
                :min="0"
                :max="128"
                :debounce="800"
                class="w-full self-center"
              />
              <input
                v-model="teamPolicy.min_password_length"
                class="h-[44px] w-[70px] ml-3"
                type="number"
                min="0"
                max="128"
                @change="updateLength('min_password_length')"
              >
            </div>
          </div>
        </div>
        <div class="setting-section">
          <div class="setting-section-header">
            <div>
              <div class="setting-title">{{ $t('data.password_policies.max_password_length') }}</div>
              <div class="setting-description">{{ $t('data.password_policies.max_password_length_desc') }}</div>
            </div>
            <div>
              <el-switch v-model="policies_checklist.max_password_length" />
            </div>
          </div>
          <div v-if="policies_checklist.max_password_length" class="flex w-full mt-10">
            <div class="setting-description w-1/2 pr-[72px] italic">{{ $t('data.password_policies.max_password_length_rcm') }}</div>
            <div class="w-1/2 flex">
              <el-slider
                v-model="teamPolicy.max_password_length"
                :min="0"
                :max="128"
                :debounce="800"
                class="w-full self-center"
              />
              <input
                v-model="teamPolicy.max_password_length"
                class="h-[44px] w-[70px] ml-3"
                type="number"
                min="0"
                max="128"
                @change="updateLength('max_password_length')"
              >
            </div>
          </div>
        </div>
        <div class="setting-section">
          <div class="setting-section-header">
            <div>
              <div class="setting-title">{{ $t('data.password_policies.password_complexity') }}</div>
              <div class="setting-description">{{ $t('data.password_policies.password_complexity_desc') }}</div>
            </div>
            <div>
              <el-switch v-model="teamPolicy.password_composition" />
            </div>
          </div>
          <div v-if="teamPolicy.password_composition" class="grid md:grid-cols-2 grid-cols-1 gap-y-3 w-full mt-10">
            <el-checkbox v-model="teamPolicy.require_lower_case" :label="$t('data.password_policies.requires_lowercase')" />
            <el-checkbox v-model="teamPolicy.require_upper_case" :label="$t('data.password_policies.requires_uppercase')" />
            <el-checkbox v-model="teamPolicy.require_special_character" :label="$t('data.password_policies.requires_special')" />
            <el-checkbox v-model="teamPolicy.require_digit" :label="$t('data.password_policies.requires_number')" />
            <el-checkbox v-model="teamPolicy.avoid_ambiguous_character" :label="$t('data.password_policies.avoid_ambiguous')" />
          </div>
          <div class="italic setting-description mt-6">{{ $t('data.password_policies.notice') }}</div>
        </div>
        <div class="setting-section">
          <div class="setting-section-header">
            <div>
              <div class="setting-title">{{ $t('data.password_policies.failed_login_attempts') }}</div>
              <div class="setting-description">{{ $t('data.password_policies.failed_login_attempts_desc') }}</div>
            </div>
            <div>
              <el-switch v-model="policies_checklist.failed_login_attempts" />
            </div>
          </div>
          <div v-if="policies_checklist.failed_login_attempts" class="w-full mt-10">
            <div class="setting-section-header">
              <div>
                <div class="setting-description">{{ $t('data.password_policies.failed_login_how_many') }}</div>
              </div>
              <div>
                <el-select
                  v-model="teamPolicy.failed_login_attempts"
                  placeholder=""
                  :disabled="loading"
                >
                  <el-option
                    v-for="item in loginAttempts"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </div>
            </div>
            <div class="setting-section-header mt-3">
              <div>
                <div class="setting-description">{{ $t('data.password_policies.failed_login_how_long', {failed_login_attempts: teamPolicy.failed_login_attempts}), }}</div>
              </div>
              <div>
                <el-select
                  v-model="teamPolicy.failed_login_duration"
                  placeholder=""
                  :disabled="loading"
                >
                  <el-option
                    v-for="item in loginDurations"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </div>
            </div>
            <div class="setting-section-header mt-3">
              <div>
                <div class="setting-description">{{ $t('data.password_policies.failed_login_how_much_time') }}</div>
              </div>
              <div>
                <el-select
                  v-model="teamPolicy.failed_login_block_time"
                  placeholder=""
                  :disabled="loading"
                >
                  <el-option
                    v-for="item in loginDurations"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </div>
            </div>
          </div>
        </div>
        <div class="setting-section">
          <div class="setting-section-header">
            <div>
              <div class="setting-title">{{ $t('data.password_policies.block_mobile') }}</div>
              <div class="setting-description">{{ $t('data.password_policies.block_mobile_desc') }}</div>
            </div>
            <div>
              <el-switch v-model="teamPolicy.block_mobile" />
            </div>
          </div>
        </div>
        <div class="setting-section">
          <div class="setting-section-header">
            <div>
              <div class="setting-title">{{ $t('data.password_policies.ip_filtering') }}</div>
              <div class="setting-description">{{ $t('data.password_policies.ip_filtering_desc') }}</div>
            </div>
            <div>
              <el-switch v-model="policies_checklist.ip_filtering" />
            </div>
          </div>
          <div v-if="policies_checklist.ip_filtering" class="w-full mt-10">
            <div class="">
              <div class="">
                <div class="setting-description">{{ $t('data.password_policies.ip_block') }}</div>
              </div>
              <div>
                <el-tag
                  v-for="(ip, index) in teamPolicy.ip_block"
                  :key="index"
                  class="mr-3 mt-3"
                  closable
                  type="danger"
                  :disable-transitions="false"
                  @close="handleClose(index, 'ip_block')"
                >
                  {{ ip }}
                </el-tag>
                <el-input
                  v-if="inputIpBlock"
                  ref="inputIpBlock"
                  v-model="newIpBlock"
                  clearable
                  class="inline-new-tag mt-3"
                  :trigger-on-focus="false"
                  @clear="inputIpBlock=false"
                  @keyup.enter.native="handleInputConfirm('ip_block')"
                />
                <el-button v-else class="button-new-tag mt-3" size="small" @click="showInput('ip_block')">+ {{ $t('common.add') }}</el-button>
              </div>
            </div>
            <div class="mt-5">
              <div class="">
                <div class="setting-description">{{ $t('data.password_policies.ip_allow') }}</div>
              </div>
              <div>
                <el-tag
                  v-for="(ip, index) in teamPolicy.ip_allow"
                  :key="index"
                  class="mr-3 mt-3"
                  closable
                  :disable-transitions="false"
                  @close="handleClose(index, 'ip_allow')"
                >
                  {{ ip }}
                </el-tag>
                <el-input
                  v-if="inputIpAllow"
                  ref="inputIpAllow"
                  v-model="newIpAllow"
                  clearable
                  class="inline-new-tag mt-3"
                  :trigger-on-focus="false"
                  @clear="inputIpAllow=false"
                  @keyup.enter.native="handleInputConfirm('ip_allow')"
                />
                <el-button v-else class="button-new-tag mt-3" size="small" @click="showInput('ip_allow')">+ {{ $t('common.add') }}</el-button>
              </div>
            </div>
          </div>
        </div>
        <div class="setting-section">
          <div class="setting-section-header">
            <div>
              <div class="setting-title">{{ $t('data.password_policies.failed_login_owner_email') }}</div>
              <div class="setting-description">{{ $t('data.password_policies.failed_login_owner_email_desc') }}</div>
            </div>
            <div>
              <el-switch v-model="teamPolicy.failed_login_owner_email" />
            </div>
          </div>
        </div>
        <div class="setting-section">
          <div class="setting-section-header">
            <div class="md:w-[400px]">
              <div class="form-group">
                <button
                  class="btn btn-primary"
                  :disabled="loading"
                  @click="putTeamPolicy"
                >
                  {{ $t('common.update') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {
  },
  data () {
    return {
      loading: false,
      policies_checklist: {
        min_password_length: false,
        max_password_length: false,
        failed_login_attempts: false,
        ip_filtering: false
      },
      teamPolicy: {},
      newIpBlock: '',
      newIpAllow: '',
      inputIpBlock: false,
      inputIpAllow: false
    }
  },
  computed: {
    loginDurations () {
      return [
        { label: this.$t('data.timeouts.oneMinute'), value: 60 },
        { label: this.$t('data.timeouts.fiveMinutes'), value: 300 },
        { label: this.$t('data.timeouts.tenMinutes'), value: 600 },
        { label: this.$t('data.timeouts.fifteenMinutes'), value: 900 },
        { label: this.$t('data.timeouts.thirtyMinutes'), value: 1800 },
        { label: this.$t('data.timeouts.oneHour'), value: 3600 },
        { label: this.$t('data.timeouts.fourHours'), value: 14400 }
      ]
    },
    loginAttempts () {
      return [
        { label: this.$t('data.password_policies.failed_login_times.oneLogin'), value: 1 },
        { label: this.$t('data.password_policies.failed_login_times.twoLogins'), value: 2 },
        { label: this.$t('data.password_policies.failed_login_times.threeLogins'), value: 3 },
        { label: this.$t('data.password_policies.failed_login_times.fourLogins'), value: 4 },
        { label: this.$t('data.password_policies.failed_login_times.fiveLogins'), value: 5 },
        { label: this.$t('data.password_policies.failed_login_times.tenLogins'), value: 10 },
        { label: this.$t('data.password_policies.failed_login_times.fifteenLogins'), value: 15 }
      ]
    }
  },
  async mounted () {
    await this.getTeamPolicy()
    // this.teamPolicy.password_complexity = {
    //   lowercase: false,
    //   uppercase: false,
    //   special: false,
    //   digit: false,
    //   avoid_ambiguous: false
    // }
  },
  methods: {
    async getTeamPolicy () {
      this.teamPolicy = await this.$axios.$get(`cystack_platform/pm/teams/${this.$route.params.teamId}/policy`)
      this.policies_checklist.min_password_length = !!this.teamPolicy.min_password_length
      this.policies_checklist.max_password_length = !!this.teamPolicy.max_password_length
      this.policies_checklist.password_composition = !!this.teamPolicy.password_composition
      this.policies_checklist.failed_login_attempts = !!this.teamPolicy.failed_login_attempts
      this.policies_checklist.ip_filtering = !!this.teamPolicy.ip_allow.length || !!this.teamPolicy.ip_block.length
    },
    async putTeamPolicy () {
      try {
        this.loading = true
        if (this.newIpBlock) {
          const ipList = this.newIpBlock.split(',')
          ipList.forEach(ip => this.teamPolicy.ip_block.push(ip.trim()))
        }
        if (this.newIpAllow) {
          const ipList = this.newIpAllow.split(',')
          ipList.forEach(ip => this.teamPolicy.ip_allow.push(ip.trim()))
        }
        const newPolicy = {
          ...this.teamPolicy,
          min_password_length: this.policies_checklist.min_password_length ? parseInt(this.teamPolicy.min_password_length) > 0 ? parseInt(this.teamPolicy.min_password_length) : null : null,
          max_password_length: this.policies_checklist.max_password_length ? parseInt(this.teamPolicy.max_password_length) > 0 ? parseInt(this.teamPolicy.max_password_length) : null : null,
          failed_login_attempts: this.policies_checklist.failed_login_attempts ? parseInt(this.teamPolicy.failed_login_attempts) > 0 ? parseInt(this.teamPolicy.failed_login_attempts) : null : null,
          ip_allow: this.policies_checklist.ip_filtering ? this.teamPolicy.ip_allow : [],
          ip_block: this.policies_checklist.ip_filtering ? this.teamPolicy.ip_block : []
        }
        if (newPolicy.min_password_length && newPolicy.max_password_length && newPolicy.max_password_length < newPolicy.min_password_length) {
          this.notify(this.$t('data.notifications.max_less_than_min'), 'warning')
          return
        }
        this.team = await this.$axios.$put(`cystack_platform/pm/teams/${this.$route.params.teamId}/policy`, newPolicy)
        this.newIpBlock = ''
        this.newIpAllow = ''
        this.inputIpBlock = false
        this.inputIpAllow = false
        this.notify(this.$t('data.notifications.update_team_success'), 'success')
      } catch (e) {
        this.notify(this.$t('data.notifications.update_team_failed'), 'warning')
      } finally {
        this.loading = false
      }
    },
    updateLength (v) {
      this.teamPolicy[`${v}`] = parseInt(this.teamPolicy[`${v}`])
    },
    handleClose (index, type) {
      this.teamPolicy[`${type}`].splice(index, 1)
    },
    showInput (type) {
      if (type === 'ip_block') {
        this.inputIpBlock = true
        this.$nextTick(_ => {
          this.$refs.inputIpBlock.$refs.input.focus()
        })
      }
      if (type === 'ip_allow') {
        this.inputIpAllow = true
        this.$nextTick(_ => {
          this.$refs.inputIpAllow.$refs.input.focus()
        })
      }
    },
    async handleInputConfirm (type) { // check input and push to current IP list
      if (type === 'ip_block') {
        const ipList = this.newIpBlock.split(',')
        ipList.forEach(ip => {
          ip = ip.trim()
          if (this.newIpBlock && !this.teamPolicy.ip_block.includes(ip)) {
            this.teamPolicy.ip_block.push(ip)
          }
        })
        this.inputIpBlock = false
        this.newIpBlock = ''
      }
      if (type === 'ip_allow') {
        const ipList = this.newIpAllow.split(',')
        ipList.forEach(ip => {
          ip = ip.trim()
          if (this.newIpAllow && !this.teamPolicy.ip_allow.includes(ip)) {
            this.teamPolicy.ip_allow.push(ip)
          }
        })
        this.inputIpAllow = false
        this.newIpAllow = ''
      }
    }
  }
}
</script>
