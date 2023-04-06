<template>
  <div class="setting-wrapper">
    <div class="setting-section">
      <div class="setting-section-header cursor-pointer" @click="collapsed = !collapsed">
        <div class="text-head-5 font-semibold">
          {{ $t('data.settings.emergency_access') }} <span>
            <el-badge v-if="pendingRequests" :value="pendingRequests" class="item" />
          </span>
        </div>
        <div>
          <button
            class="btn btn-outline-primary mr-4"
            @click="postEmergencyAccess"
          >
            <i class="el-icon-plus" />
            {{ $t('data.emergency_access.add_emergency_contact') }}
          </button>
          <i v-if="!collapsed" class="el-icon-arrow-right" />
          <i v-else class="el-icon-arrow-down" />
        </div>
      </div>
      <EmergencyContact
        ref="emergencyContact"
        @done="getEmergencyAccess"
      />
      <el-dialog
        :visible.sync="dialogConfirmVisible"
        width="435px"
        destroy-on-close
        top="15vh"
        custom-class="locker-dialog"
        :close-on-click-modal="false"
      >
        <div slot="title">
          <div class="text-head-5 text-black-700 font-semibold truncate">
            {{ $t('data.notifications.fingerprint_title') }}
          </div>
        </div>
        <div class="text-left">
          <div class="text-head-6 mb-4">{{ $t('data.notifications.fingerprint_description_1') }}</div>
          <div class="text-danger-400 bg-black-200 bg-opacity-50 rounded px-4 py-2 mb-4">
            {{ userFingerPrint }}
          </div>
          <div class="text-sm">{{ $t('data.notifications.fingerprint_description_2') }}</div>
        </div>
        <div
          slot="footer"
          class="dialog-footer flex items-center text-left"
        >
          <div class="flex-grow" />
          <div>
            <button
              class="btn btn-default"
              @click="dialogConfirmVisible = false"
            >
              {{ $t('common.cancel') }}
            </button>
            <button
              class="btn btn-primary"
              :disabled="loadingConfirm"
              @click="confirmEmergencyAccess(selectedEmergencyAccess)"
            >
              {{ $t('common.confirm') }}
            </button>
          </div>
        </div>
      </el-dialog>

      <el-dialog
        :visible.sync="dialogTakeoverVisible"
        width="435px"
        destroy-on-close
        top="15vh"
        custom-class="locker-dialog"
        :close-on-click-modal="false"
      >
        <div slot="title">
          <div class="text-head-5 text-black-700 font-semibold truncate">
            {{ $t('common.takeover') }}
          </div>
        </div>
        <div class="text-left">
          <div class="text-left">
            <div class="form-group !mb-4">
              <label for="">{{ $t('master_password.new_password') }}</label>
              <div class="input-group mb-1.5">
                <input
                  v-model="masterPassword"
                  :type="showPassword ? 'text' : 'password'"
                  class="form-control"
                  :name="randomString()"
                  autocomplete="new-password"
                >
                <div class="input-group-append !bg-white">
                  <button
                    class="btn btn-icon"
                    type="button"
                    tabindex="-1"
                    @click="showPassword = !showPassword"
                  >
                    <i
                      class="far"
                      :class="{'fa-eye': !showPassword, 'fa-eye-slash': showPassword}"
                    />
                  </button>
                </div>
              </div>
              <PasswordStrengthBar
                v-if="masterPassword"
                :score="passwordStrength.score"
              />
            </div>
            <div class="form-group !mb-4">
              <label for="">{{ $t('master_password.re_password') }}</label>
              <div
                class="input-group"
                :class="[errors.masterRePassword ? 'is-invalid' :'']"
              >
                <input
                  v-model="masterRePassword"
                  :type="showRePassword ? 'text' : 'password'"
                  class="form-control"
                  name="repassword"
                  placeholder=""
                >
                <div class="input-group-append !bg-white">
                  <button
                    class="btn btn-icon"
                    tabindex="-1"
                    @click="showRePassword = !showRePassword"
                  >
                    <i
                      class="far"
                      :class="{'fa-eye': !showRePassword, 'fa-eye-slash': showRePassword}"
                    />
                  </button>
                </div>
              </div>
              <div class="invalid-feedback">{{ $t('errors.confirm_password') }}</div>
            </div>
          </div>
        </div>

        <div
          slot="footer"
          class="dialog-footer flex items-center text-left"
        >
          <div class="flex-grow" />
          <div>
            <button
              class="btn btn-default"
              @click="dialogTakeoverVisible = false"
            >
              {{ $t('common.cancel') }}
            </button>
            <button
              class="btn btn-primary"
              :disabled="loadingSetPassword || !masterPassword || masterPassword!=masterRePassword"
              @click="setPasswordForGrantor()"
            >
              {{ $t('common.confirm') }}
            </button>
          </div>
        </div>
      </el-dialog>

      <el-dialog
        :visible.sync="dialogTakeoverLockerVisible"
        width="435px"
        destroy-on-close
        top="15vh"
        custom-class="locker-dialog"
        :close-on-click-modal="false"
      >
        <div slot="title">
          <div class="text-head-5 text-black-700 font-semibold truncate">
            {{ $t('common.takeover') }}
          </div>
        </div>
        <div class="text-left">
          <div class="text-left">
            <div class="form-group !mb-4">
              <label for="">{{ $t('master_password.id_password') }}</label>
              <div
                class="input-group"
                :class="[bugs.new_password ? 'is-invalid' :'']"
              >
                <input
                  v-model="idPassword"
                  :type="showIdPassword ? 'text' : 'password'"
                  class="form-control"
                  name="repassword"
                  placeholder=""
                >
                <div class="input-group-append !bg-white">
                  <button
                    class="btn btn-icon"
                    tabindex="-1"
                    @click="showIdPassword = !showIdPassword"
                  >
                    <i
                      class="far"
                      :class="{'fa-eye': !showIdPassword, 'fa-eye-slash': showIdPassword}"
                    />
                  </button>
                </div>
              </div>
              <div class="invalid-feedback">{{ bugs.new_password && bugs.new_password[0] }}</div>
            </div>
            <div class="form-group !mb-4">
              <label for="">{{ $t('master_password.id_password_confirm') }}</label>
              <div
                class="input-group"
                :class="[errors.idRePassword ? 'is-invalid' :'']"
              >
                <input
                  v-model="idRePassword"
                  :type="showIdRePassword ? 'text' : 'password'"
                  class="form-control"
                  name="repassword"
                  placeholder=""
                >
                <div class="input-group-append !bg-white">
                  <button
                    class="btn btn-icon"
                    tabindex="-1"
                    @click="showIdRePassword = !showIdRePassword"
                  >
                    <i
                      class="far"
                      :class="{'fa-eye': !showIdRePassword, 'fa-eye-slash': showIdRePassword}"
                    />
                  </button>
                </div>
              </div>
              <div class="invalid-feedback">{{ $t('errors.id_confirm_password') }}</div>
            </div>
          </div>
        </div>

        <div
          slot="footer"
          class="dialog-footer flex items-center text-left"
        >
          <div class="flex-grow" />
          <div>
            <button
              class="btn btn-default"
              @click="dialogTakeoverLockerVisible = false "
            >
              {{ $t('common.cancel') }}
            </button>
            <button
              class="btn btn-primary"
              :disabled="loadingSetPassword || !idPassword || idPassword !== idRePassword"
              @click="setLockerPasswordForGrantor()"
            >
              {{ $t('common.confirm') }}
            </button>
          </div>
        </div>
      </el-dialog>
    </div>
    <div v-if="collapsed">
      <div class="setting-section">
        <el-row type="flex">
          <el-col :lg="12" :sm="16" :xs="24">
            <p>{{ $t('data.settings.learn_about_emergency_access_desc') }}</p>
          </el-col>
        </el-row>
        <p class="mt-6">
          <a
            :href="locale==='vi'?'https://support.locker.io/vi/articles/Thiet-lap-tinh-nang-Truy-cap-khan-cap-b54c0b4b560a466f92331b940bbc9244':'https://support.locker.io/articles/Set-up-and-use-Emergency-Access-0e169439bb83453298ea430b22262214'"
            target="_blank"
          >
            {{ $t('data.settings.learn_about_emergency_access') }} <i class="ml-1 el-icon-right" />
          </a>
        </p>
      </div>
      <div class="setting-section">
        <div class="setting-section-header">
          <div>
            <div class="setting-title">{{ $t('data.emergency_access.trusted_emergency_contacts') }}</div>
            <div v-if="trustedPendingRequests>0" class="text-warning">{{ trustedPendingRequests }} {{ $tc('data.emergency_access.pending_request', trustedPendingRequests) }}</div>
          </div>
        </div>
        <div class="setting-section-body">
          <client-only>
            <el-table
              v-loading="loading"
              :data="list_trusted"
              style="width: 100%"
            >
              <el-table-column :label="$t('common.users')" min-width="200">
                <template slot-scope="scope">
                  <div class="flex items-center">
                    <el-avatar
                      :src="scope.row.avatar"
                      :size="32"
                    />
                    <div class="ml-2">
                      <div class="text-black font-semibold truncate">{{ scope.row.email }}</div>
                      <div v-if="scope.row.full_name">{{ scope.row.full_name }}</div>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                :label="$t('common.status')"
                align="right"
                min-width="120"
              >
                <template slot="header">
                  <span>{{ $t('common.status') }}</span>
                </template>
                <template slot-scope="scope">
                  <span
                    class="label capitalize"
                    :class="{
                      'label-primary-light': scope.row.status === 'confirmed',
                      'label-success-light': scope.row.status === 'accepted',
                      'label-warning-light': scope.row.status === 'invited',
                      'label-danger-light': scope.row.status === 'expired',
                      'label-black': scope.row.status === 'recovery_initiated',
                      'label-success': scope.row.status === 'recovery_approved',
                    }"
                  >
                    {{ emergencyAccessStatus[`${scope.row.status}`] }}
                  </span>
                  <el-tooltip
                    v-if="scope.row.status==='recovery_initiated'"
                    class="item"
                    effect="dark"
                    placement="top-start"
                  >
                    <div slot="content">{{ $t('data.emergency_access.grantor_recovery_initiated_info', {day: (((scope.row.recovery_initiated_date + scope.row.wait_time_days*24*60*60)*1000 - new Date().getTime())/(1000*60*60*24)).toFixed(1)}) }}</div>
                    <i class="el-icon-info" />
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column
                :label="$t('data.emergency_access.access_type')"
                align="right"
                min-width="100"
              >
                <template slot="header">
                  <span>{{ $t('data.emergency_access.access_type') }} <el-tooltip
                    class="item"
                    effect="dark"
                    placement="top-start"
                  >
                    <div slot="content">{{ $t('common.view') }}: {{ $t(`data.emergency_access.view_desc`) }} <br> {{ $t('common.takeover') }}: {{ $t(`data.emergency_access.takeover_desc`) }}</div>
                    <i class="el-icon-info" />
                  </el-tooltip></span>
                </template>
                <template slot-scope="scope">
                  <span class="capitalize label label-info">
                    {{ scope.row.type }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column align="right">
                <template slot-scope="scope">
                  <el-dropdown
                    trigger="click"
                    :hide-on-click="false"
                  >
                    <button class="btn btn-icon btn-xs hover:bg-black-400">
                      <i class="fas fa-ellipsis-h" />
                    </button>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item
                        v-if="scope.row.status === 'invited'"
                        @click.native="reinvite(scope.row)"
                      >
                        <span class="text-warning">{{ $t('common.reinvite') }}</span>
                      </el-dropdown-item>
                      <el-dropdown-item
                        v-if="scope.row.status === 'accepted'"
                        @click.native="promptConfirmEmergencyAccess(scope.row)"
                      >
                        <span class="text-success">{{ $t('common.confirm') }}</span>
                      </el-dropdown-item>
                      <template v-if="scope.row.status === 'recovery_initiated'">
                        <el-dropdown-item @click.native="approveEmergencyAccess(scope.row)">
                          <span class="text-success">
                            {{ $t('common.accept') }}
                          </span>
                        </el-dropdown-item>
                        <el-dropdown-item @click.native="rejectEmergencyAccess(scope.row)">
                          <span class="text-warning">
                            {{ $t('common.reject') }}
                          </span>
                        </el-dropdown-item>
                      </template>
                      <el-dropdown-item
                        v-if="scope.row.status === 'recovery_approved'"
                        @click.native="rejectEmergencyAccess(scope.row)"
                      >
                        <span class="text-warning">{{ $t('common.reject') }}</span>
                      </el-dropdown-item>
                      <el-dropdown-item @click.native="deleteEmergencyAccess(scope.row)">
                        <span class="text-danger">
                          {{ $t('common.remove') }}
                        </span>
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </template>
              </el-table-column>
            </el-table>
          </client-only>
        </div>
      </div>
      <div class="setting-section">
        <!-- Header -->
        <div class="setting-section-header">
          <div>
            <div class="setting-title">{{ $t('data.emergency_access.designated_emergency_contacts') }}</div>
            <div v-if="grantedPendingRequests>0" class="text-warning">{{ grantedPendingRequests }} {{ $tc('data.emergency_access.pending_request', grantedPendingRequests) }}</div>
          </div>
        </div>
        <!-- Header end -->

        <!-- Table -->
        <div class="setting-section-body">
          <client-only>
            <el-table
              v-loading="loading"
              :data="list_granted"
              style="width: 100%"
            >
              <!-- User info -->
              <el-table-column :label="$t('common.users')" min-width="200">
                <template slot-scope="scope">
                  <div class="flex items-center">
                    <el-avatar
                      :src="scope.row.avatar"
                      :size="32"
                    />
                    <div class="ml-2">
                      <div class="text-black font-semibold truncate">{{ scope.row.email }}</div>
                      <div v-if="scope.row.full_name">{{ scope.row.full_name }}</div>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <!-- User info end -->

              <!-- Status -->
              <el-table-column
                :label="$t('common.status')"
                align="right"
                min-width="120"
              >
                <template slot-scope="scope">
                  <span
                    class="label capitalize"
                    :class="{
                      'label-primary-light': scope.row.status === 'confirmed',
                      'label-success-light': scope.row.status === 'accepted',
                      'label-warning-light': scope.row.status === 'invited',
                      'label-danger-light': scope.row.status === 'expired',
                      'label-black': scope.row.status === 'recovery_initiated',
                      'label-success': scope.row.status === 'recovery_approved',
                    }"
                  >
                    {{ emergencyAccessStatus[`${scope.row.status}`] }}
                  </span>
                  <el-tooltip
                    v-if="scope.row.status==='recovery_initiated'"
                    class="item"
                    effect="dark"
                    placement="top-start"
                  >
                    <div slot="content">{{ $t('data.emergency_access.grantee_recovery_initiated_info', {day: (((scope.row.recovery_initiated_date + scope.row.wait_time_days*24*60*60)*1000 - new Date().getTime())/(1000*60*60*24)).toFixed(1)}) }}</div>
                    <i class="el-icon-info" />
                  </el-tooltip>
                </template>
              </el-table-column>
              <!-- Status end -->

              <!-- Access type -->
              <el-table-column
                :label="$t('data.emergency_access.access_type')"
                align="right"
                min-width="100"
              >
                <template slot="header">
                  <span>{{ $t('data.emergency_access.access_type') }} <el-tooltip
                    class="item"
                    effect="dark"
                    placement="top-start"
                  >
                    <div slot="content">{{ $t('common.view') }}: {{ $t(`data.emergency_access.view_desc`) }} <br> {{ $t('common.takeover') }}: {{ $t(`data.emergency_access.takeover_desc`) }}</div>
                    <i class="el-icon-info" />
                  </el-tooltip></span>
                </template>
                <template slot-scope="scope">
                  <span class="capitalize label label-info">
                    {{ scope.row.type }}
                  </span>
                </template>
              </el-table-column>
              <!-- Access type end -->

              <!-- Action -->
              <el-table-column align="right">
                <template slot-scope="scope">
                  <el-dropdown
                    trigger="click"
                    :hide-on-click="false"
                  >
                    <button class="btn btn-icon btn-xs hover:bg-black-400">
                      <i class="fas fa-ellipsis-h" />
                    </button>
                    <el-dropdown-menu slot="dropdown">
                      <!-- Accept invitation -->
                      <el-dropdown-item
                        v-if="scope.row.status==='invited'"
                        @click.native="acceptInvite(scope.row)"
                      >
                        <span class="text-success">
                          {{ $t('common.accept') }}
                        </span>
                      </el-dropdown-item>
                      <!-- Accept invitation end -->

                      <!-- Request access -->
                      <template v-if="scope.row.status === 'confirmed'">
                        <el-dropdown-item @click.native="requestAccess(scope.row)">
                          {{ $t('common.request_access') }}
                        </el-dropdown-item>
                      </template>
                      <!-- Request access end -->

                      <!-- Request view -->
                      <el-dropdown-item
                        v-if="scope.row.status === 'recovery_approved' && scope.row.type==='view'"
                        @click.native="viewGrantorVault(scope.row)"
                      >
                        <span class="text-success">{{ $t('common.view') }}</span>
                      </el-dropdown-item>
                      <!-- Request view end -->

                      <!-- Request takeover reset Master Password-->
                      <el-dropdown-item
                        v-if="scope.row.status === 'recovery_approved' && scope.row.type==='takeover'"
                        @click.native="takeoverGrantorVault(scope.row)"
                      >
                        {{ $t('data.emergency_access.reset_master_pw') }}
                      </el-dropdown-item>
                      <!-- Request takeover reset Master Password end -->

                      <!-- Request takeover reset Locker password -->
                      <el-dropdown-item
                        v-if="scope.row.status === 'recovery_approved' && scope.row.type==='takeover'"
                        @click.native="takeoverGrantorLocker(scope.row)"
                      >
                        {{ $t('data.emergency_access.reset_pw') }}
                      </el-dropdown-item>
                      <!-- Request takeover reset Locker password end -->

                      <!-- Remove -->
                      <el-dropdown-item @click.native="deleteEmergencyAccess(scope.row)">
                        <span class="text-danger">
                          {{ $t('common.remove') }}
                        </span>
                      </el-dropdown-item>
                      <!-- Remove end -->
                    </el-dropdown-menu>
                  </el-dropdown>
                </template>
              </el-table-column>
              <!-- Action end -->
            </el-table>
          </client-only>
        </div>
        <!-- Table end -->
      </div>
    </div>
  </div>
</template>

<script>
import { Utils } from '@/jslib/src/misc/utils.ts'
import PasswordStrengthBar from '@/components/password/PasswordStrengthBar'
import EmergencyContact from '@/components/setting/EmergencyContact.vue'
import { SymmetricCryptoKey } from '@/jslib/src/models/domain/symmetricCryptoKey'
import { MIN_MASTER_PW_LEN } from '@/constants'
export default {
  components: {
    EmergencyContact,
    PasswordStrengthBar
  },
  data () {
    return {
      user: {},
      loading: false,
      list_trusted: [],
      list_granted: [],
      loading2: true,
      loadingConfirm: false,
      dialogConfirmVisible: false,
      dialogRequestVisible: false,
      dialogTakeoverVisible: false,
      dialogTakeoverLockerVisible: false,
      dontAskAgain: false,
      publicKey: null,
      userFingerPrint: '',
      selectedEmergencyAccess: {},
      masterPassword: '',
      masterRePassword: '',
      idPassword: '',
      idRePassword: '',
      errors: {},
      bugs: {},
      showPassword: false,
      showRePassword: false,
      showIdPassword: false,
      showIdRePassword: false,
      loadingSetPassword: false,
      emergencyAccessStatus: this.$t('data.emergency_access.status'),
      takeoverStep: 1,
      collapsed: false
    }
  },
  computed: {
    passwordStrength () {
      return this.$passwordGenerationService.passwordStrength(this.masterPassword, ['cystack']) || {}
    },
    trustedPendingRequests () {
      const listPending = this.list_trusted.filter(item => item.status === 'invited')
      return listPending.length
    },
    grantedPendingRequests () {
      const listPending = this.list_granted.filter(item => item.status === 'invited')
      return listPending.length
    },
    pendingRequests () {
      return this.trustedPendingRequests + this.grantedPendingRequests
    }
  },
  watch: {
    masterRePassword (newValue) {
      if (this.masterPassword && newValue && this.masterPassword !== newValue) {
        this.errors.masterRePassword = 1
      } else {
        this.errors.masterRePassword = 0
      }
    },
    idRePassword (newValue) {
      if (this.idPassword && newValue && this.idPassword !== newValue) {
        this.errors.idRePassword = 1
      } else {
        this.errors.idRePassword = 0
      }
    }
  },
  async mounted () {
    const locked = await this.$vaultTimeoutService.isLocked()
    if (!locked) {
      await Promise.all([
        this.getUser(),
        this.getListTrusted(),
        this.getListGranted()
      ])
    }
  },
  methods: {
    async getUser () {
      const user = await this.$store.dispatch('LoadCurrentUserPw')
      this.user = { ...user }
    },
    getEmergencyAccess () {
      this.getListTrusted()
      this.getListGranted()
    },
    postEmergencyAccess () {
      this.collapsed = !this.collapsed
      this.$refs.emergencyContact.openDialog({})
    },
    getListTrusted () {
      this.loading = true
      this.$axios.$get('cystack_platform/pm/emergency_access/trusted')
        .then(res => {
          this.list_trusted = res
          this.loading = false
        })
    },
    getListGranted () {
      this.loading2 = true
      this.$axios.$get('cystack_platform/pm/emergency_access/granted')
        .then(res => {
          this.list_granted = res
          this.loading2 = false
        })
    },
    putEmergencyAccess (emergencyContact) {
      this.$refs.emergencyContact.openDialog(emergencyContact)
    },
    deleteEmergencyAccess (emergencyContact) {
      this.$refs.emergencyContact.deleteEmergencyAccess(emergencyContact)
    },
    async generateAccessKey () {
      const pk = Utils.fromB64ToArray(this.publicKey)
      const encKey = await this.$cryptoService.getEncKey()
      const key = await this.$cryptoService.rsaEncrypt(encKey.key, pk.buffer)
      return key.encryptedString
    },
    async getPublicKey (emergencyAccess) {
      this.userFingerPrint = ''
      const { public_key: publicKey } = await this.$axios.$get(`cystack_platform/pm/emergency_access/${emergencyAccess.id}/public_key`)
      return publicKey
    },
    async promptConfirmEmergencyAccess (emergencyAccess) {
      this.selectedEmergencyAccess = emergencyAccess
      this.publicKey = await this.getPublicKey(emergencyAccess)
      const publicKey = Utils.fromB64ToArray(this.publicKey)
      const fingerprint = await this.$cryptoService.getFingerprint(emergencyAccess.grantee_pwd_user_id, publicKey.buffer)
      if (fingerprint) {
        this.userFingerPrint = fingerprint.join('-')
      }
      this.dontAskAgain = await this.$storageService.get('autoConfirmFingerprints')
      // this.openDialogConfirm()
      this.confirmEmergencyAccess(emergencyAccess)
    },
    openDialogConfirm () {
      this.dialogConfirmVisible = true
    },
    closeDialogConfirm () {
      this.dialogConfirmVisible = false
    },
    async confirmEmergencyAccess (emergencyAccess) {
      try {
        this.loadingConfirm = true
        const key = await this.generateAccessKey()
        await this.$axios.$post(`cystack_platform/pm/emergency_access/${emergencyAccess.id}/confirm`, {
          key
        })
        this.closeDialogConfirm()
        this.getListTrusted()
        this.notify(this.$t('data.notifications.confirm_emergency_access_success', { user: emergencyAccess.email }), 'success')
      } catch (e) {
        console.log(e)
        this.notify(this.$t('data.notifications.confirm_emergency_access_failed', { user: emergencyAccess.email }), 'warning')
      } finally {
        this.loadingConfirm = false
      }
    },
    async requestAccess (emergencyAccess) {
      this.$confirm(this.$t('data.notifications.request_emergency_access', { day: emergencyAccess.wait_time_days }), emergency_access.full_name || this.$t('common.warning'), {
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        type: 'warning'
      }).then(async () => {
        try {
          await this.$axios.$post(`cystack_platform/pm/emergency_access/${emergencyAccess.id}/initiate`)
          this.dialogConfirmVisible = false
          this.getListGranted()
          this.notify(this.$t('data.notifications.request_send_success', { user: emergencyAccess.email }), 'success')
        } catch (e) {
          console.log(e)
          this.notify(this.$t('data.notifications.request_send_failed'), 'warning')
        }
      }).catch(() => {})
    },
    async approveEmergencyAccess (emergencyAccess) {
      this.$confirm(this.$t('data.notifications.approve_emergency_access', { user: emergencyAccess.full_name, type: emergency_access.type }), emergency_access.full_name || this.$t('common.warning'), {
        confirmButtonText: 'Approve',
        cancelButtonText: 'No',
        type: 'warning'
      }).then(
        async () => {
          try {
            await this.$axios.$post(`cystack_platform/pm/emergency_access/${emergencyAccess.id}/approve`)
            this.getListTrusted()
            this.notify(this.$t('data.notifications.emergency_access_approved_success'), 'success')
          } catch (e) {
            this.notify(this.$t('data.notifications.emergency_access_approved_failed'), 'warning')
          }
        }
      ).catch(() => {})
    },
    async rejectEmergencyAccess (emergencyAccess) {
      try {
        await this.$axios.$post(`cystack_platform/pm/emergency_access/${emergencyAccess.id}/reject`)
        this.getListTrusted()
        this.notify(this.$t('data.notifications.emergency_access_rejected_success'), 'success')
      } catch (e) {
        this.notify(this.$t('data.notifications.emergency_access_rejected_failed'), 'warning')
      }
    },
    async acceptInvite (emergencyAccess) {
      try {
        await this.$axios.$post(`cystack_platform/pm/emergency_access/${emergencyAccess.id}/accept`)
        this.getListGranted()
        this.notify(this.$t('data.notifications.accept_invitation_success'), 'success')
      } catch (e) {
        this.notify(this.$t('data.notifications.accept_invitation_failed'), 'warning')
      }
    },
    async reinvite (emergencyAccess) {
      try {
        await this.$axios.$post(`cystack_platform/pm/emergency_access/${emergencyAccess.id}/reinvite`)
        this.getListTrusted()
        this.notify(this.$t('data.notifications.reinvited_user_success', { user: emergencyAccess.email }), 'success')
      } catch (e) {
        this.notify(this.$t('data.notifications.reinvited_user_failed', { user: emergencyAccess.email }), 'warning')
      }
    },
    viewGrantorVault (item) {
      this.$router.push(this.localeRoute({
        name: 'settings-security-emergency-access-id',
        params: { id: item.id }
      }))
    },
    takeoverGrantorVault (item) {
      this.dialogTakeoverVisible = true
      this.selectedEmergencyAccess = item
    },
    takeoverGrantorLocker (item) {
      this.dialogTakeoverLockerVisible = true
      this.selectedEmergencyAccess = item
    },
    async setPasswordForGrantor () {
      if (this.masterPassword.length < MIN_MASTER_PW_LEN) {
        this.notify(this.$t('data.notifications.invalid_master_password'), 'warning')
        return
      }
      try {
        this.loadingSetPassword = true
        this.bugs = {}
        const response = await this.$axios.$post(`/cystack_platform/pm/emergency_access/${this.selectedEmergencyAccess.id}/takeover`)
        const oldKeyBuffer = await this.$cryptoService.rsaDecrypt(response.key_encrypted)
        const oldEncKey = new SymmetricCryptoKey(oldKeyBuffer)
        if (oldEncKey == null) {
          this.notify(this.$t('data.notifications.error_occurred'), 'warning')
          return
        }

        const key = await this.$cryptoService.makeKey(this.masterPassword, this.selectedEmergencyAccess.email, response.kdf, response.kdf_iterations)
        const masterPasswordHash = await this.$cryptoService.hashPassword(this.masterPassword, key)

        const encKey = await this.$cryptoService.remakeEncKey(key, oldEncKey)

        const encMasterPwItem = await this.createEncryptedMasterPwItem(this.masterPassword, encKey[0])

        const request = {
          key: encKey[1].encryptedString,
          new_password: this.idPassword,
          new_master_password_hash: masterPasswordHash,
          score: this.passwordStrength.score,
          master_password_cipher: encMasterPwItem
        }
        await this.$axios.$post(`/cystack_platform/pm/emergency_access/${this.selectedEmergencyAccess.id}/password`, request)
        this.notify(this.$t('data.notifications.takeover_success', { user: this.selectedEmergencyAccess.email }), 'success')
        this.dialogTakeoverVisible = false
        this.takeoverStep = 1
      } catch (error) {
        this.bugs = error.response && error.response.data && error.response.data.details
        this.notify(this.$t('data.notifications.error_occurred'), 'warning')
      } finally {
        this.loadingSetPassword = false
      }
    },
    async setLockerPasswordForGrantor () {
      if (this.idPassword.length < MIN_MASTER_PW_LEN) {
        this.notify(this.$t('data.notifications.invalid_master_password'), 'warning')
        return
      }
      try {
        await this.$axios.$post(`/cystack_platform/pm/emergency_access/${this.selectedEmergencyAccess.id}/id_password`, {
          new_password: this.idPassword
        })
        this.notify(this.$t('data.notifications.takeover_locker_success', { user: this.selectedEmergencyAccess.email }), 'success')
      } catch (e) {
        this.notify(this.$t('data.notifications.takeover_locker_success', { user: this.selectedEmergencyAccess.email }), 'warning')
      } finally {
        this.dialogTakeoverLockerVisible = false
      }
    }
  }
}
</script>
