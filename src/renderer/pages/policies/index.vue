<template>
  <div
    class="flex flex-col flex-column-fluid relative bg-[#FBFBFC] min-h-screen"
  >
    <div class="flex-column-fluid lg:px-28 py-10 px-10 mb-20">
      <!-- Breadcrumb -->
      <div class="mb-5">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="localeRoute({ name: 'policies' })">
            {{ $t('data.policies.title') }}
          </el-breadcrumb-item>
          <el-breadcrumb-item
            v-if="getRouteBaseName() === 'policies-index-violated'"
            :to="localeRoute({ name: 'policies-index-violated' })"
          >
            {{ $t('data.policies.violated_items') }}
          </el-breadcrumb-item>
        </el-breadcrumb>

        <p v-if="getRouteBaseName() === 'policies'" class="text-black mt-2">
          {{ $t('data.policies.you_are_a_member_of') }}
          <span class="text-primary">{{ currentOrg.name }}</span>.
          {{ $t('data.policies.rules_being_applied') }}
        </p>
      </div>
      <!-- Breadcrumb end -->

      <LazyHydrate when-visible>
        <div
          v-if="getRouteBaseName() === 'policies'"
          v-loading="loading"
          class="policy-wrapper"
        >
          <el-collapse accordion>
            <!-- Password requirements -->
            <el-collapse-item v-if="isPwPolicyEnabled" class="setting-wrapper">
              <!-- Header -->
              <template slot="title">
                <div class="flex flex-row items-center py-4 w-full">
                  <img
                    src="~/assets/images/icons/policy_pw-requirements.svg"
                    style="height: 36px"
                  >

                  <div class="flex flex-col ml-4 flex-1">
                    <p class="font-semibold text-black mb-1 h-auto line-h-auto">
                      {{ $t('data.policies.password_requirement') }}
                    </p>
                    <p class="text-black text-xs font-normal">
                      {{ $t('data.policies.password_requirement_desc') }}
                    </p>
                  </div>

                  <div
                    style="
                      border-radius: 100px;
                      margin-right: 16px;
                      overflow: hidden;
                    "
                  >
                    <div v-if="violatedPasswords.length" class="bg-danger">
                      <p class="font-semibold text-white px-3 py-1">
                        {{ violatedPasswords.length }}
                        {{ $tc('common.issue', violatedPasswords.length) }}
                      </p>
                    </div>

                    <div v-else class="bg-success">
                      <p class="font-semibold text-white px-3 py-1">
                        {{ $t('common.good') }}
                      </p>
                    </div>
                  </div>
                </div>
              </template>
              <!-- Header end -->

              <!-- Body -->
              <div class="px-4">
                <hr class="border-black-100 mb-4">
                <p class="text-lg text-black font-semibold">
                  {{ $t('data.policies.policy_details') }}
                </p>
                <p class="text-black">
                  {{ $t('data.policies.password_requirement_policy_details') }}
                </p>
                <ul style="list-style-type: circle; margin-left: 20px">
                  <li v-for="(item, index) in pwPolicies" :key="index">
                    {{ item }}
                  </li>
                </ul>
                <p
                  class="text-black mb-2"
                  v-html="$t('data.policies.password_requirement_note')"
                />

                <a
                  v-if="violatedPasswords.length"
                  class="text-danger hover:text-danger"
                  @click.prevent="go({ name: 'policies-index-violated' })"
                >
                  <span
                    style="font-size: 22px; vertical-align: middle"
                    class="mr-1"
                  >
                    <i class="el-icon-error" />
                  </span>
                  <span>{{
                    $tc(
                      'data.policies.you_have_violated_items',
                      violatedPasswords.length
                    )
                  }}</span>
                </a>
              </div>
              <!-- Body end -->
            </el-collapse-item>
            <!-- Password requirements end -->

            <!-- Master Password requirements -->
            <el-collapse-item
              v-if="isMasterPwPolicyEnabled"
              class="setting-wrapper"
            >
              <!-- Header -->
              <template slot="title">
                <div class="flex flex-row items-center py-4 w-full">
                  <img
                    src="~/assets/images/icons/policy_master-pw-requirements.svg"
                    style="height: 36px"
                  >

                  <div class="flex flex-col ml-4 flex-1">
                    <p class="font-semibold text-black mb-1 h-auto line-h-auto">
                      {{ $t('data.policies.master_password_requirement') }}
                    </p>
                    <p class="text-black text-xs font-normal">
                      {{ $t('data.policies.master_password_requirement_desc') }}
                    </p>
                  </div>

                  <div
                    style="
                      border-radius: 100px;
                      margin-right: 16px;
                      overflow: hidden;
                    "
                  >
                    <div v-if="isMasterPwViolated" class="bg-danger">
                      <p class="font-semibold text-white px-3 py-1">
                        1 {{ $tc('common.issue', 1) }}
                      </p>
                    </div>

                    <div v-else class="bg-success">
                      <p class="font-semibold text-white px-3 py-1">
                        {{ $t('common.good') }}
                      </p>
                    </div>
                  </div>
                </div>
              </template>
              <!-- Header end -->

              <!-- Body -->
              <div class="px-4">
                <hr class="border-black-100 mb-4">
                <p class="text-lg text-black font-semibold">
                  {{ $t('data.policies.policy_details') }}
                </p>
                <p class="text-black">
                  {{
                    $t(
                      'data.policies.master_password_requirement_policy_details'
                    )
                  }}
                </p>
                <ul
                  class="mb-2"
                  style="list-style-type: circle; margin-left: 20px"
                >
                  <li v-for="(item, index) in pwPolicies" :key="index">
                    {{ item }}
                  </li>
                </ul>
                <a
                  v-if="isMasterPwViolated"
                  class="text-danger hover:text-danger"
                  @click.prevent="go({ name: 'settings-security' })"
                >
                  <span
                    style="font-size: 22px; vertical-align: middle"
                    class="mr-1"
                  >
                    <i class="el-icon-error" />
                  </span>
                  <span>{{
                    $t('data.policies.need_to_change_master_pw')
                  }}</span>
                </a>
              </div>
              <!-- Body end -->
            </el-collapse-item>
            <!-- Master Password requirements end -->

            <!-- Block failed login -->
            <el-collapse-item
              v-if="isBlockFailedLoginEnabled"
              class="setting-wrapper"
            >
              <!-- Header -->
              <template slot="title">
                <div class="flex flex-row items-center py-4 w-full">
                  <img
                    src="~/assets/images/icons/policy_block-failed-login.svg"
                    style="height: 36px"
                  >

                  <div class="flex flex-col ml-4 flex-1">
                    <p class="font-semibold text-black mb-1 h-auto line-h-auto">
                      {{ $t('data.policies.block_failed_logins') }}
                    </p>
                    <p class="text-black text-xs font-normal">
                      {{ $t('data.policies.block_failed_logins_desc') }}
                    </p>
                  </div>

                  <div
                    style="
                      border-radius: 100px;
                      margin-right: 16px;
                      overflow: hidden;
                    "
                  >
                    <div v-if="blockedTimes" class="bg-warning">
                      <p class="font-semibold text-white px-3 py-1">
                        1 {{ $tc('common.issue', 1) }}
                      </p>
                    </div>

                    <div v-else class="bg-success">
                      <p class="font-semibold text-white px-3 py-1">
                        {{ $t('common.good') }}
                      </p>
                    </div>
                  </div>
                </div>
              </template>
              <!-- Header end -->

              <!-- Body -->
              <div class="px-4">
                <hr class="border-black-100 mb-4">
                <p class="text-lg text-black font-semibold">
                  {{ $t('data.policies.policy_details') }}
                </p>
                <p class="text-black">
                  {{ $t('data.policies.block_failed_logins_policy_details') }}
                </p>
                <p v-if="blockedTimes" class="text-black">
                  <span
                    style="font-size: 22px; vertical-align: middle"
                    class="mr-1"
                  >
                    <i class="el-icon-warning text-warning" />
                  </span>
                  {{ $tc('data.policies.you_have_been_blocked', blockedTimes) }}
                </p>
              </div>
              <!-- Body end -->
            </el-collapse-item>
            <!-- Block failed login end -->

            <!-- Passwordless login -->
            <el-collapse-item
              v-if="isPasswordlessEnabled"
              class="setting-wrapper"
            >
              <!-- Header -->
              <template slot="title">
                <div class="flex flex-row items-center py-4 w-full">
                  <img
                    src="~/assets/images/icons/policy_pwless.svg"
                    style="height: 36px"
                  >

                  <div class="flex flex-col ml-4 flex-1">
                    <p class="font-semibold text-black mb-1 h-auto line-h-auto">
                      {{ $t('data.policies.passwordless') }}
                    </p>
                    <p class="text-black text-xs font-normal">
                      {{ $t('data.policies.passwordless_desc') }}
                    </p>
                  </div>
                </div>
              </template>
              <!-- Header end -->

              <!-- Body -->
              <div class="px-4">
                <hr class="border-black-100 mb-4">
                <p class="text-lg text-black font-semibold">
                  {{ $t('data.policies.policy_details') }}
                </p>
                <p class="text-black">
                  {{ $t('data.policies.passwordless_policy_details') }}
                </p>
              </div>
              <!-- Body end -->
            </el-collapse-item>
            <!-- Passwordless login end -->

            <!-- 2FA -->
            <el-collapse-item v-if="isLogin2FAEnabled" class="setting-wrapper">
              <!-- Header -->
              <template slot="title">
                <div class="flex flex-row items-center py-4 w-full">
                  <img
                    src="~/assets/images/icons/policy_pwless.svg"
                    style="height: 36px"
                  >

                  <div class="flex flex-col ml-4 flex-1">
                    <p class="font-semibold text-black mb-1 h-auto line-h-auto">
                      {{ $t('data.policies.2fa') }}
                    </p>
                    <p class="text-black text-xs font-normal">
                      {{ $t('data.policies.2fa_desc') }}
                    </p>
                  </div>
                </div>
              </template>
              <!-- Header end -->

              <!-- Body -->
              <div class="px-4">
                <hr class="border-black-100 mb-4">
                <p class="text-lg text-black font-semibold">
                  {{ $t('data.policies.policy_details') }}
                </p>
                <p class="text-black">
                  {{
                    $t('data.policies.2fa_policy_details', {
                      target: login2FATarget
                    })
                  }}
                </p>
              </div>
              <!-- Body end -->
            </el-collapse-item>
            <!-- 2FA end -->
          </el-collapse>

          <div v-if="isEmpty && !loading" class="setting-wrapper">
            <div class="px-4 py-8 flex items-center flex flex-col">
              <img
                :src="require('~/assets/images/pages/policies/empty-img.svg')"
                height="61"
              >
              <p class="mt-4">
                {{ $t('data.policies.no_active_policies') }}
              </p>
            </div>
          </div>
        </div>
      </LazyHydrate>

      <nuxt-child
        :violated-passwords="violatedPasswords"
        :violations-map="violationsMap"
      />
    </div>
  </div>
</template>

<script>
import LazyHydrate from 'vue-lazy-hydration'
import { CipherType } from '../../core/enums/cipherType'

// const worker = new Worker()
export default {
  components: { LazyHydrate },

  data () {
    return {
      violationsMap: new Map(),
      violatedPasswords: [],
      isMasterPwViolated: false,
      loading: false,
      pwPolicies: [],
      blockedTimes: 0
    }
  },

  computed: {
    isPwPolicyEnabled () {
      return this.enterprisePolicies.password_requirement?.enabled
    },
    isMasterPwPolicyEnabled () {
      return this.enterprisePolicies.master_password_requirement?.enabled
    },
    isBlockFailedLoginEnabled () {
      return this.enterprisePolicies.block_failed_login?.enabled
    },
    isPasswordlessEnabled () {
      return this.enterprisePolicies.passwordless?.enabled
    },
    isLogin2FAEnabled () {
      return this.enterprisePolicies['2fa']?.enabled
    },
    isEmpty () {
      return (
        !this.isPwPolicyEnabled &&
        !this.isMasterPwPolicyEnabled &&
        !this.isBlockFailedLoginEnabled &&
        !this.isPasswordlessEnabled &&
        !this.isLogin2FAEnabled
      )
    },
    login2FATarget () {
      const onlyAdmin = this.enterprisePolicies['2fa']?.config.onlyAdmin
      if (onlyAdmin) {
        return this.locale === 'vi' ? 'Các quản trị viên' : 'Admins'
      }
      return this.locale === 'vi' ? 'Người dùng' : 'Users'
    }
  },

  watch: {
    isEnterpriseMember (newValue) {
      if (!newValue) {
        this.$router.push('/vault')
      }
    },
    '$store.state.syncedCiphersToggle' () {
      this.$cipherService.getAllDecrypted().then(result => {
        this.ciphers = result
        this.loading = true
        setTimeout(() => {
          this.violatedPasswords = this.getViolatedPasswordCiphers()
          this.getMasterPwViolations()
          this.getPwPolicies()
          this.getMasterPwPolicies()
          this.getViolations()
          this.loading = false
        }, 100)
      })
    }
  },

  async mounted () {
    if (!this.isEnterpriseMember) {
      this.$router.push('/vault')
    }
    this.loading = true
    this.ciphers = await this.$cipherService.getAllDecrypted()
    setTimeout(() => {
      this.violatedPasswords = this.getViolatedPasswordCiphers()
      this.getMasterPwViolations()
      this.getPwPolicies()
      this.getMasterPwPolicies()
      this.getViolations()
      this.loading = false
    }, 300)
  },

  methods: {
    go (route) {
      this.$router.push(this.localeRoute(route))
    },

    getViolatedPasswordCiphers () {
      if (!this.isPwPolicyEnabled) {
        return []
      }
      const allCiphers = this.ciphers
      const violatedCiphers = []

      allCiphers.forEach(c => {
        if (
          c.type !== CipherType.Login ||
          c.login.password == null ||
          c.login.password === '' ||
          c.isDeleted
        ) {
          return
        }
        const violations =
          this.checkPasswordPolicy(c.login.password || '') || []
        if (violations.length) {
          this.violationsMap.set(c.id, violations.length)
          violatedCiphers.push(c)
        }
      })

      return violatedCiphers
    },

    getMasterPwViolations () {
      if (!this.isMasterPwPolicyEnabled) {
        return
      }
      const cipher = this.ciphers.find(
        c => c.type === CipherType.MasterPassword
      )
      const violations = this.checkPasswordPolicy(
        cipher.login.password || '',
        'master_password_requirement'
      )
      this.isMasterPwViolated = !!violations.length
    },

    getPwPolicies () {
      this.pwPolicies = this.listPasswordPolicy()
    },

    getMasterPwPolicies () {
      this.pwPolicies = this.listPasswordPolicy('master_password_requirement')
    },

    async getViolations () {
      if (!this.isBlockFailedLoginEnabled) {
        return
      }
      try {
        const res = await this.$axios.$get(
          '/cystack_platform/pm/users/me/violation'
        )
        this.blockedTimes = res.failed_login
      } catch (e) {
        //
      }
    }
  }
}
</script>
<style>
.policy-wrapper .el-collapse-item__header {
  height: auto;
  line-height: 18px;
  font-size: 14px;
}

.policy-wrapper .setting-wrapper {
  margin-bottom: 12px;
}
</style>
