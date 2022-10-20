<template>
  <div class="lg:w-2/3 mx-auto">
    <div class="text-head-5 font-semibold mb-2">
      {{ $t('data.settings.security') }}
    </div>
    <div class="text-lg text-black-600 mb-4">
      {{ $t('data.settings.security_desc') }}
    </div>
    <div class="setting-wrapper">
      <div class="setting-section">
        <div class="setting-section-header">
          <div class="text-head-5 font-semibold">{{ $t('data.settings.security_control') }}</div>
          <div>
            <button
              class="btn btn-default mb-4 md:mb-0"
              @click="changeMasterPassword"
            >
              <span><i class="fas fa-key" /> &nbsp; {{ $t('data.settings.change_master_password') }}</span>
            </button>
          </div>
        </div>
        <div class="bg-[#F0F0F0] mt-8 py-5 pl-5 pr-10">
          <div class="flex">
            <div class="px-3 text-lg">
              <i class="fas fa-lightbulb" />
            </div>
            <div class="w-full">
              <div class="text-head-6 mb-3 w-full">
                {{ $t('data.settings.learn_about_secure_desc') }}
              </div>
              <div>
                <a
                  :href="`https://locker.io${locale==='vi'?'/vi':''}/security`"
                  target="_blank"
                >
                  <button class="btn btn-default !whitespace-normal text-left mb-4 md:mb-0 !bg-[#CBCBCB] hover:no-underline hover:text-current">
                    {{ $t('data.settings.learn_about_secure') }}
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- <div class="setting-section">
        <div class="setting-section-header">
          <div>
            <div class="setting-title">
              {{ $t('data.settings.master_password_health') }}
            </div>
            <div class="setting-description">
              {{ $t('data.settings.master_password_health_desc') }}
            </div>
          </div>
          <div>
            <el-switch />
          </div>
        </div>
      </div>
      <div class="setting-section">
        <div class="setting-section-header">
          <div>
            <div class="setting-title">
              {{ $t('data.settings.master_password_hint') }}
            </div>
            <div class="setting-description">
              {{ $t('data.settings.master_password_hint_desc') }}
            </div>
          </div>
          <div>
            <el-switch />
          </div>
        </div>
      </div>
      <div class="setting-section">
        <div class="setting-section-header">
          <div>
            <div class="setting-title flex">
              <div class="mr-2">
                {{ $t('data.settings.weak_passwords') }}
              </div>
              <div>
                <img src="~/assets/images/icons/flash.svg" alt="">
              </div>
            </div>
            <div class="setting-description">
              {{ $t('data.settings.weak_passwords_desc') }}
            </div>
          </div>
          <div>
            <el-switch />
          </div>
        </div>
      </div>
      <div class="setting-section">
        <div class="setting-section-header">
          <div>
            <div class="setting-title flex">
              <div class="mr-2">
                {{ $t('data.settings.data_breach') }}
              </div>
              <div>
                <img src="~/assets/images/icons/flash.svg" alt="">
              </div>
            </div>
            <div class="setting-description">
              {{ $t('data.settings.data_breach_desc') }}
            </div>
          </div>
          <div>
            <el-switch />
          </div>
        </div>
      </div>
      <div class="setting-section">
        <div class="setting-section-header">
          <div>
            <div class="setting-title flex">
              <div class="mr-2">
                {{ $t('data.settings.password_reusage') }}
              </div>
              <div>
                <img src="~/assets/images/icons/flash.svg" alt="">
              </div>
            </div>
            <div class="setting-description">
              {{ $t('data.settings.password_reusage_desc') }}
            </div>
          </div>
          <div>
            <el-switch />
          </div>
        </div>
      </div>
      <div class="setting-section">
        <div class="setting-section-header">
          <div>
            <div class="setting-title flex">
              <div class="mr-2">
                {{ $t('data.settings.emergency_access') }}
              </div>
              <div>
                <img src="~/assets/images/icons/flash.svg" alt="">
              </div>
            </div>
            <div class="setting-description">
              {{ $t('data.settings.emergency_access_desc') }}
            </div>
          </div>
          <div>
            <el-switch />
          </div>
        </div>
      </div> -->
    </div>
    <div class="setting-wrapper">
      <div class="setting-section">
        <div class="setting-section-header">
          <div class="text-head-5 font-semibold">
            {{ $t('data.settings.emergency_access') }} <span><el-badge v-if="pendingRequests" :value="pendingRequests" class="item" /></span>
          </div>
        </div>
        <div class="bg-[#F0F0F0] mt-8 py-5 pl-5 pr-10">
          <div class="flex">
            <div class="px-3 text-lg">
              <i class="fas fa-lightbulb" />
            </div>
            <div class="w-full">
              <div class="text-head-6 mb-3 w-full">
                {{ $t('data.settings.learn_about_emergency_access_desc') }}
              </div>
              <div>
                <a
                  :href="locale==='vi'?'https://support.locker.io/vi/articles/Thiet-lap-tinh-nang-Truy-cap-khan-cap-b54c0b4b560a466f92331b940bbc9244':'https://support.locker.io/articles/Set-up-and-use-Emergency-Access-0e169439bb83453298ea430b22262214'"
                  target="_blank"
                >
                  <button class="btn btn-default !whitespace-normal text-left mb-4 md:mb-0 !bg-[#CBCBCB] hover:no-underline hover:text-current">
                    {{ $t('data.settings.learn_about_emergency_access') }}
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="setting-section">
        <div class="setting-section-header">
          <div>
            <div class="setting-title">{{ $t('data.emergency_access.trusted_emergency_contacts') }}</div>
            <div v-if="trustedPendingRequests>0" class="text-warning">{{ trustedPendingRequests }} {{ $tc('data.emergency_access.pending_request', trustedPendingRequests) }}</div>
          </div>
          <div>
            <button
              class="btn btn-default !text-warning"
              @click="postEmergencyAccess"
            >
              {{ $t('data.emergency_access.add_emergency_contact') }}
            </button>
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
                    :class="{'label-primary-light': scope.row.status === 'confirmed',
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
                      <!-- <template v-if="scope.row.status === 'confirmed'">
                          <el-dropdown-item @click.native="putEmergencyAccess(scope.row)">
                            {{ $t('common.edit') }}
                          </el-dropdown-item>
                        </template> -->
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

      <!-- Contacts trusted you -->
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
                    :class="{'label-primary-light': scope.row.status === 'confirmed',
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
      <!-- Contacts trusted you end -->
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

    <!-- Take over dialog -->
    <el-dialog
      :visible.sync="dialogTakeoverVisible"
      width="435px"
      destroy-on-close
      top="15vh"
      custom-class="locker-dialog"
      :close-on-click-modal="false"
    >
      <!-- Header -->
      <div slot="title">
        <div class="text-head-5 text-black-700 font-semibold truncate">
          {{ $t('common.takeover') }}
        </div>
      </div>
      <!-- Header end -->
      <div class="text-left">
        <div class="text-left">
          <!-- New master pw -->
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
          <!-- New master pw end -->

          <!-- Re enter new master pw -->
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
          <!-- Re enter new master pw end -->
        </div>
      </div>

      <!-- Footer -->
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
      <!-- Footer end -->
    </el-dialog>
    <!-- Take over dialog end -->

    <!-- Take over Locker Password dialog -->
    <el-dialog
      :visible.sync="dialogTakeoverLockerVisible"
      width="435px"
      destroy-on-close
      top="15vh"
      custom-class="locker-dialog"
      :close-on-click-modal="false"
    >
      <!-- Header -->
      <div slot="title">
        <div class="text-head-5 text-black-700 font-semibold truncate">
          {{ $t('common.takeover') }}
        </div>
      </div>
      <!-- Header end -->
      <div class="text-left">
        <div class="text-left">
          <!-- Step 2 - id pw -->
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
          <!-- Step 2 - id pw end -->
        </div>
      </div>

      <!-- Footer -->
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
      <!-- Footer end -->
    </el-dialog>
    <!-- Take over dialog end -->

    <ChangeMasterPassword ref="changeMasterPassword" />
  </div>
</template>

<script>
import ChangeMasterPassword from '@/components/user/ChangeMasterPassword'
import { Utils } from '@/jslib/src/misc/utils.ts'
import PasswordStrengthBar from '@/components/password/PasswordStrengthBar'
import EmergencyContact from '@/components/setting/EmergencyContact.vue'
import { SymmetricCryptoKey } from '@/jslib/src/models/domain/symmetricCryptoKey'
export default {
  components: {
    ChangeMasterPassword,
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
      errors: {
      },
      bugs: {},
      showPassword: false,
      showRePassword: false,
      showIdPassword: false,
      showIdRePassword: false,
      loadingSetPassword: false,
      emergencyAccessStatus: this.$t('data.emergency_access.status'),
      takeoverStep: 1
    }
  },
  computed: {
    currentPlan () {
      return this.$store.state.currentPlan
    },
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
    const locked = await this.$vaultTimeoutService.isLocked(this.$store.state.isLoggedInPw)
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
    changeMasterPassword () {
      this.$refs.changeMasterPassword.openDialog()
    },
    getEmergencyAccess () {
      this.getListTrusted()
      this.getListGranted()
    },
    postEmergencyAccess () {
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
    putEmergencyAccess (emergency_contact) {
      this.$refs.emergencyContact.openDialog(emergency_contact)
    },
    deleteEmergencyAccess (emergency_contact) {
      this.$refs.emergencyContact.deleteEmergencyAccess(emergency_contact)
    },
    async generateAccessKey () {
      const pk = Utils.fromB64ToArray(this.publicKey)
      const encKey = await this.$cryptoService.getEncKey()
      const key = await this.$cryptoService.rsaEncrypt(encKey.key, pk.buffer)
      return key.encryptedString
    },
    async getPublicKey (emergency_access) {
      this.userFingerPrint = ''
      const { public_key: publicKey } = await this.$axios.$get(`cystack_platform/pm/emergency_access/${emergency_access.id}/public_key`)
      return publicKey
    },
    async promptConfirmEmergencyAccess (emergency_access) {
      this.selectedEmergencyAccess = emergency_access
      this.publicKey = await this.getPublicKey(emergency_access)
      const publicKey = Utils.fromB64ToArray(this.publicKey)
      const fingerprint = await this.$cryptoService.getFingerprint(emergency_access.grantee_pwd_user_id, publicKey.buffer)
      if (fingerprint) {
        this.userFingerPrint = fingerprint.join('-')
      }
      this.dontAskAgain = await this.$storageService.get('autoConfirmFingerprints')
      // this.openDialogConfirm()
      this.confirmEmergencyAccess(emergency_access)
    },
    openDialogConfirm () {
      this.dialogConfirmVisible = true
    },
    closeDialogConfirm () {
      this.dialogConfirmVisible = false
    },
    async confirmEmergencyAccess (emergency_access) {
      try {
        this.loadingConfirm = true
        const key = await this.generateAccessKey()
        await this.$axios.$post(`cystack_platform/pm/emergency_access/${emergency_access.id}/confirm`, {
          key
        })
        this.closeDialogConfirm()
        this.getListTrusted()
        this.notify(this.$t('data.notifications.confirm_emergency_access_success', { user: emergency_access.email }), 'success')
      } catch (e) {
        console.log(e)
        this.notify(this.$t('data.notifications.confirm_emergency_access_failed', { user: emergency_access.email }), 'warning')
      } finally {
        this.loadingConfirm = false
      }
    },
    promptRequestAccess (emergency_access) {
      this.selectedEmergencyAccess = emergency_access
      this.openDialogRequest()
    },
    openDialogRequest (emergency_access) {
      this.dialogConfirmVisible = true
    },
    closeDialogRequest () {
      this.dialogConfirmVisible = false
    },
    async requestAccess (emergency_access) {
      this.$confirm(this.$t('data.notifications.request_emergency_access', { day: emergency_access.wait_time_days }), emergency_access.full_name || this.$t('common.warning'), {
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        type: 'warning'
      }).then(async () => {
        try {
          await this.$axios.$post(`cystack_platform/pm/emergency_access/${emergency_access.id}/initiate`)
          this.closeDialogRequest()
          this.getListGranted()
          this.notify(this.$t('data.notifications.request_send_success', { user: emergency_access.email }), 'success')
        } catch (e) {
          console.log(e)
          this.notify(this.$t('data.notifications.request_send_failed'), 'warning')
        }
      }).catch(() => {})
    },
    async approveEmergencyAccess (emergency_access) {
      this.$confirm(this.$t('data.notifications.approve_emergency_access', { user: emergency_access.full_name, type: emergency_access.type }), emergency_access.full_name || this.$t('common.warning'), {
        confirmButtonText: 'Approve',
        cancelButtonText: 'No',
        type: 'warning'
      }).then(
        async () => {
          try {
            await this.$axios.$post(`cystack_platform/pm/emergency_access/${emergency_access.id}/approve`)
            this.getListTrusted()
            this.notify(this.$t('data.notifications.emergency_access_approved_success'), 'success')
          } catch (e) {
            this.notify(this.$t('data.notifications.emergency_access_approved_failed'), 'warning')
          }
        }
      ).catch(() => {})
    },
    async rejectEmergencyAccess (emergency_access) {
      try {
        await this.$axios.$post(`cystack_platform/pm/emergency_access/${emergency_access.id}/reject`)
        this.getListTrusted()
        this.notify(this.$t('data.notifications.emergency_access_rejected_success'), 'success')
      } catch (e) {
        this.notify(this.$t('data.notifications.emergency_access_rejected_failed'), 'warning')
      }
    },
    async acceptInvite (emergency_access) {
      try {
        await this.$axios.$post(`cystack_platform/pm/emergency_access/${emergency_access.id}/accept`)
        this.getListGranted()
        this.notify(this.$t('data.notifications.accept_invitation_success'), 'success')
      } catch (e) {
        this.notify(this.$t('data.notifications.accept_invitation_failed'), 'warning')
      }
    },
    async reinvite (emergency_access) {
      try {
        await this.$axios.$post(`cystack_platform/pm/emergency_access/${emergency_access.id}/reinvite`)
        this.getListTrusted()
        this.notify(this.$t('data.notifications.reinvited_user_success', { user: emergency_access.email }), 'success')
      } catch (e) {
        this.notify(this.$t('data.notifications.reinvited_user_failed', { user: emergency_access.email }), 'warning')
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
    // Change master pw + id pw
    async setPasswordForGrantor () {
      if (this.masterPassword.length < 8) {
        this.notify(this.$t('data.notifications.invalid_master_password'), 'warning')
        return
      }
      try {
        this.loadingSetPassword = true
        this.bugs = {}
        const response = await this.$axios.$post(`/cystack_platform/pm/emergency_access/${this.selectedEmergencyAccess.id}/takeover`)
        const oldKeyBuffer = await this.$cryptoService.rsaDecrypt(response.key_encrypted)
        // console.log('oldKeyBuffer: ', oldKeyBuffer)
        const oldEncKey = new SymmetricCryptoKey(oldKeyBuffer)
        // console.log('oldEnKey: ', oldEncKey)
        if (oldEncKey == null) {
          // console.log('oldEncKey')
          this.notify(this.$t('data.notifications.error_occurred'), 'warning')
          return
        }

        const key = await this.$cryptoService.makeKey(this.masterPassword, this.selectedEmergencyAccess.email, response.kdf, response.kdf_iterations)
        const masterPasswordHash = await this.$cryptoService.hashPassword(this.masterPassword, key)

        const encKey = await this.$cryptoService.remakeEncKey(key, oldEncKey)

        // Create master pw item
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
    // Change locker pw (id password)
    async setLockerPasswordForGrantor () {
      if (this.idPassword.length < 8) {
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
