<template>
  <div v-loading="loading">
    <!-- List Ciphers, Folders, ... -->
    <div
      v-if="!shouldRenderNoCipher"
      class="flex-column-fluid lg:px-28 py-10 px-10 mb-20"
    >
      <!-- Overview -->
      <div class="mb-10">
        <div class="flex">
          <div class="text-head-4">
            <span class="font-medium">{{ $t('sidebar.shared_with_you') }}</span>
          </div>
        </div>
        <div v-if="ciphers" class="uppercase text-head-6">
          <span class="text-primary font-semibold">{{ ciphers.length }}</span>
          {{ $tc('type.0', ciphers.length) }}
        </div>
      </div>
      <!-- Overview end -->

      <!-- List Ciphers -->
      <client-only>
        <LazyHydrate when-visible>
          <el-table
            ref="multipleTable"
            :data="tableData"
            style="width: 100%"
            row-class-name="hover-table-row"
          >
            <!-- Item name -->
            <el-table-column
              prop="name"
              label=""
              min-width="300"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <div class="flex items-center">
                  <template
                    v-if="!['invited', 'accepted'].includes(scope.row.status)"
                  >
                    <!-- Item -->
                    <div
                      v-if="scope.row.type"
                      class="text-[34px] mr-3 flex-shrink-0"
                      :class="{ 'filter grayscale': scope.row.isDeleted }"
                    >
                      <Vnodes :vnodes="getIconCipher(scope.row, 34)" />
                    </div>

                    <!-- Folder -->
                    <div v-else>
                      <img
                        src="~/assets/images/icons/folderSolidShare.svg"
                        alt=""
                        class="select-none mr-2"
                      >
                    </div>
                  </template>
                  <div class="flex flex-col">
                    <a
                      class="text-black font-semibold truncate flex items-center"
                      :class="{ 'opacity-80': scope.row.isDeleted }"
                      @click="
                        scope.row.status === 'invited'
                          ? openAcceptDialog(scope.row)
                          : scope.row.type
                            ? routerCipher(scope.row, addEdit)
                            : routerFolder(scope.row)
                      "
                    >
                      {{
                        scope.row.name || $t('data.sharing.encrypted_content')
                      }}
                      <img
                        v-if="scope.row.organizationId"
                        src="~/assets/images/icons/shares.svg"
                        alt="Shared"
                        :title="$t('common.shared_with_you')"
                        class="inline-block ml-2"
                      >
                    </a>
                    <div v-if="scope.row.type === CipherType.Login">
                      {{ scope.row.subTitle || 'N/A' }}
                    </div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <!-- Item name end -->

            <!-- Owner -->
            <el-table-column
              :label="$t('common.owner')"
              show-overflow-tooltip
              width="150"
            >
              <template slot-scope="scope">
                <span>{{
                  scope.row.owner
                    ? scope.row.owner.full_name
                    : getTeam(organizations, scope.row.organizationId).name
                }}</span>
              </template>
            </el-table-column>
            <!-- Owner end -->

            <!-- Type -->
            <el-table-column :label="$t('common.type')" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{
                  CipherType[scope.row.cipher_type] ||
                    CipherType[scope.row.type] ||
                    'Folder'
                }}</span>
              </template>
            </el-table-column>
            <!-- Type end -->

            <!-- Updated time -->
            <el-table-column
              :label="$t('data.ciphers.updated_time')"
              width="150"
            >
              <template slot-scope="scope">
                <span class="break-normal">
                  {{
                    scope.row.revisionDate
                      ? $moment(scope.row.revisionDate).fromNow()
                      : $moment(scope.row.access_time * 1000).fromNow()
                  }}
                </span>
              </template>
            </el-table-column>
            <!-- Updated time end -->

            <!-- Share status -->
            <el-table-column
              :label="$t('common.status')"
              min-width="120"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <!-- <span>{{ scope.row.status || 'Shared' }}</span> -->
                <span
                  class="label whitespace-normal"
                  :class="{
                    'label-primary-light': scope.row.status === 'confirmed',
                    'label-info': scope.row.status === 'accepted',
                    'label-warning-light': scope.row.status === 'invited',
                    'label-danger-light': scope.row.status === 'expired',
                    'label-success': !scope.row.status
                  }"
                >
                  {{ shareInvitationStatus[`${scope.row.status || 'shared'}`] }}
                </span>
              </template>
            </el-table-column>
            <!-- Share status end -->

            <!-- Permission -->
            <el-table-column
              :label="$t('common.share_type')"
              show-overflow-tooltip
              width="120"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.share_type || 'N/A' }}</span>
              </template>
            </el-table-column>
            <!-- Permission end -->

            <!-- Actions -->
            <el-table-column
              :label="$t('common.actions')"
              fixed="right"
              width="230"
            >
              <template slot-scope="scope">
                <div class="col-actions">
                  <!-- Accept/Decline share -->
                  <template v-if="scope.row.status === 'invited'">
                    <div class="flex">
                      <div
                        class="btn btn-primary"
                        @click="acceptShareInvitation(scope.row)"
                      >
                        {{ $t('common.accept') }}
                      </div>
                      <div
                        class="btn btn-default ml-2"
                        @click="rejectShareInvitation(scope.row)"
                      >
                        {{ $t('common.decline') }}
                      </div>
                    </div>
                  </template>
                  <!-- Accept/Decline share end -->

                  <!-- More -->
                  <el-dropdown v-else trigger="click">
                    <button class="btn btn-icon btn-xs hover:bg-black-400">
                      <i class="fas fa-ellipsis-h" />
                    </button>
                    <el-dropdown-menu slot="dropdown">
                      <!-- When item is not invited or accepted (waiting for owner confirmation) -->
                      <template
                        v-if="
                          !['invited', 'accepted'].includes(scope.row.status)
                        "
                      >
                        <!-- Edit -->
                        <template
                          v-if="canManageItem(organizations, scope.row)"
                        >
                          <el-dropdown-item
                            @click.native="
                              scope.row.ciphers
                                ? addEditFolder(scope.row)
                                : addEdit(scope.row)
                            "
                          >
                            {{ $t('common.edit') }}
                          </el-dropdown-item>
                          <!-- Edit end -->
                        </template>
                        <!-- Edit end -->

                        <!-- Action for each type of item -->
                        <template v-if="scope.row.type && !scope.row.isDeleted">
                          <template v-if="scope.row.type === CipherType.Login">
                            <el-dropdown-item
                              v-clipboard:copy="scope.row.login.username"
                              v-clipboard:success="clipboardSuccessHandler"
                              :divided="canManageItem(organizations, scope.row)"
                            >
                              {{ $t('common.copy') }}
                              {{ $t('common.username') }}
                            </el-dropdown-item>
                            <el-dropdown-item
                              v-clipboard:copy="scope.row.login.password"
                              v-clipboard:success="clipboardSuccessHandler"
                              :disabled="!canViewItem(organizations, scope.row)"
                            >
                              {{ $t('common.copy') }}
                              {{ $t('common.password') }}
                            </el-dropdown-item>
                          </template>
                          <template
                            v-if="scope.row.type === CipherType.SecureNote"
                          >
                            <el-dropdown-item
                              v-clipboard:copy="scope.row.notes"
                              v-clipboard:success="clipboardSuccessHandler"
                              divided
                            >
                              {{ $t('common.copy') }} {{ $t('common.note') }}
                            </el-dropdown-item>
                          </template>
                          <template
                            v-if="
                              scope.row.type === CipherType.CryptoWallet &&
                                scope.row.cryptoWallet
                            "
                          >
                            <el-dropdown-item
                              v-clipboard:copy="scope.row.cryptoWallet.seed"
                              v-clipboard:success="clipboardSuccessHandler"
                            >
                              {{ $t('common.copy') }}
                              {{ $t('data.ciphers.seed') }}
                            </el-dropdown-item>
                            <el-dropdown-item
                              v-clipboard:copy="scope.row.cryptoWallet.address"
                              v-clipboard:success="clipboardSuccessHandler"
                            >
                              {{ $t('common.copy') }}
                              {{ $t('data.ciphers.wallet_address') }}
                            </el-dropdown-item>
                            <el-dropdown-item
                              v-clipboard:copy="
                                scope.row.cryptoWallet.privateKey
                              "
                              v-clipboard:success="clipboardSuccessHandler"
                            >
                              {{ $t('common.copy') }}
                              {{ $t('data.ciphers.private_key') }}
                            </el-dropdown-item>
                            <el-dropdown-item
                              v-clipboard:copy="scope.row.cryptoWallet.password"
                              v-clipboard:success="clipboardSuccessHandler"
                            >
                              {{ $t('common.copy') }}
                              {{ $t('data.ciphers.password_pin') }}
                            </el-dropdown-item>
                          </template>
                          <el-dropdown-item
                            @click.native="cloneCipher(scope.row)"
                          >
                            {{ $t('common.clone') }}
                          </el-dropdown-item>
                          <el-dropdown-item
                            divided
                            @click.native="moveFolders([scope.row.id])"
                          >
                            {{ $t('common.move_folder') }}
                          </el-dropdown-item>
                        </template>
                        <!-- Action for each type of item end -->

                        <!-- Leave share -->
                        <template v-if="!scope.row.isDeleted">
                          <el-dropdown-item
                            :divided="!!scope.row.type"
                            @click.native="leaveShare(scope.row)"
                          >
                            <span class="text-danger">{{
                              $t('data.ciphers.leave')
                            }}</span>
                          </el-dropdown-item>
                        </template>
                        <!-- Leave share end -->
                      </template>
                      <!-- When item is not invited or accepted end -->

                      <!-- When item is accepted (waiting for owner confirmation) -->
                      <template v-else-if="scope.row.status === 'accepted'">
                        <el-dropdown-item
                          divided
                          @click.native="leaveShare(scope.row)"
                        >
                          <span class="text-danger">{{
                            $t('data.ciphers.leave')
                          }}</span>
                        </el-dropdown-item>
                      </template>
                      <!-- When item is accepted end -->
                    </el-dropdown-menu>
                  </el-dropdown>
                  <!-- More end -->
                </div>
              </template>
            </el-table-column>
            <!-- Actions end -->
          </el-table>
        </LazyHydrate>
      </client-only>
      <!-- List Ciphers end -->
    </div>

    <ShareNoCipher v-else-if="!$store.state.syncing" :type="type" />

    <AddEditCipher ref="addEditCipherDialog" :type="type" />

    <AddEditFolder ref="addEditFolder" />

    <AddEditTeamFolder ref="addEditTeamFolder" />

    <ShareCipher
      ref="shareCipher"
      :cipher-options="allCiphers"
      @upgrade-plan="upgradePlan"
      @shared-cipher="getMyShares"
      @confirm-user="promptConfirmUser"
    />

    <EditSharedCipher ref="editSharedCipher" @updated-cipher="getMyShares" />

    <ShareFolder
      ref="shareFolder"
      @upgrade-plan="upgradePlan"
      @shared-folder="getMyShares"
      @confirm-user="promptConfirmUser"
    />

    <MoveFolder ref="moveFolder" @reset-selection="multipleSelection = []" />

    <!-- Owner confirmation dialog -->
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
        <div class="text-head-6 mb-4">
          {{ $t('data.notifications.fingerprint_description_1') }}
        </div>
        <div
          class="text-danger-400 bg-black-200 bg-opacity-50 rounded px-4 py-2 mb-4"
        >
          {{ userFingerPrint }}
        </div>
        <div class="text-sm">
          {{ $t('data.notifications.fingerprint_description_2') }}
        </div>
      </div>
      <div slot="footer" class="dialog-footer flex items-center text-left">
        <div class="flex-grow" />
        <div>
          <button class="btn btn-default" @click="dialogConfirmVisible = false">
            {{ $t('common.cancel') }}
          </button>
          <button
            class="btn btn-primary"
            :disabled="loadingConfirm"
            @click="confirmShare(selectedCipher)"
          >
            {{ $t('common.confirm') }}
          </button>
        </div>
      </div>
    </el-dialog>
    <!-- Owner confirmation dialog end -->

    <!-- Accept share dialog -->
    <el-dialog
      :title="$t('data.sharing.tips')"
      :visible.sync="dialogAcceptVisible"
      width="40%"
    >
      <span>{{ $t('data.sharing.tips_title') }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogAcceptVisible = false">{{
          $t('common.cancel')
        }}</el-button>
        <el-button
          type="primary"
          @click="acceptShareInvitation(selectedCipher)"
        >{{ $t('common.accept') }}</el-button>
      </span>
    </el-dialog>
    <!-- Accept share dialog end -->
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'
import orderBy from 'lodash/orderBy'
import find from 'lodash/find'
import LazyHydrate from 'vue-lazy-hydration'
import AddEditCipher from '../../components/cipher/AddEditCipher'
import AddEditFolder from '../folder/AddEditFolder'
import AddEditTeamFolder from '../folder/AddEditTeamFolder'
import ShareCipher from '../../components/cipher/ShareCipher'
import EditSharedCipher from '../../components/cipher/EditSharedCipher'
import ShareFolder from '../../components/folder/ShareFolder'
import MoveFolder from '../folder/MoveFolder'
import ShareNoCipher from '../../components/cipher/ShareNoCipher'
import { CipherType } from '../../jslib/src/enums'
import Vnodes from '../../components/Vnodes'
import { CipherRequest } from '../../jslib/src/models/request'
import { Utils } from '../../jslib/src/misc/utils.ts'

CipherType.TOTP = 5
CipherType.MasterPassword = 8
CipherType.CryptoBackup = 7
CipherType[7] = 'Crypto Backup'

export default {
  components: {
    AddEditCipher,
    AddEditFolder,
    AddEditTeamFolder,
    ShareCipher,
    EditSharedCipher,
    ShareFolder,
    MoveFolder,
    ShareNoCipher,
    // eslint-disable-next-line vue/no-unused-components
    VueContext: () => import('../../plugins/vue-context'),
    Vnodes,
    LazyHydrate
  },

  props: {
    filter: {
      type: Function,
      default: null
    }
  },

  data () {
    return {
      cryptoService: null,
      data: {},
      CipherType,
      multipleSelection: [],
      loading: false,
      orderField: 'name', // revisionDate
      orderDirection: 'desc',
      selectedFolder: {},
      context: '',
      publicKey: '',
      indexing: false,
      index: null,
      dataRendered: [],
      lastIndex: 0,
      options: ['Login', 'SecureNote', 'Card', 'Identity'],
      selectedType: 'Login',
      userFingerPrint: '',
      selectedUser: {},
      loadingConfirm: false,
      dialogConfirmVisible: false,
      selectedCipher: {},
      invitations: [],
      dialogAcceptVisible: false,
      isItemInUrlOpened: false
    }
  },

  computed: {
    shareInvitationStatus () {
      return this.$t('data.sharing')
    },
    folder () {
      if (this.folders) {
        return (
          find(this.folders, e => e.id === this.$route.params.folderId) || {}
        )
      }
      return {}
    },
    collection () {
      if (this.collections) {
        return (
          find(
            this.collections,
            e => e.id === this.$route.params.tfolderId
          ) || { name: 'Unassigned Folder' }
        )
      }
      return {}
    },
    filteredCiphers () {
      return this.ciphers || []
    },
    shouldRenderNoCipher () {
      const haveCipher =
        this.filteredCiphers.length +
        this.collections?.length +
        this.invitations.length
      return !haveCipher && !this.searchText
    },
    tableData () {
      return this.invitations.concat(this.collections || [], this.ciphers || [])
    }
  },

  watch: {
    '$store.state.syncing' () {
      if (this.$store.state.syncing) {
        this.loading = true
      } else {
        this.loading = false
      }
    }
  },

  async mounted () {
    // Load more data when scrolling
    this.context = 'VueContext'
    window.onscroll = () => {
      const bottomOfWindow =
        Math.max(
          window.pageYOffset,
          document.documentElement.scrollTop,
          document.body.scrollTop
        ) +
          window.innerHeight +
          500 >=
        document.documentElement.scrollHeight

      if (bottomOfWindow) {
        this.lastIndex += 50
        if (this.lastIndex <= this.ciphers?.length) {
          this.dataRendered = this.dataRendered.concat(
            this.ciphers.slice(this.lastIndex, this.lastIndex + 50)
          )
        }
      }
    }

    // Load data
    const locked = await this.$vaultTimeoutService.isLocked()
    if (!locked) {
      this.getShareInvitations()
    }
  },

  asyncComputed: {
    allCiphers: {
      async get () {
        const deletedFilter = c => {
          return c.isDeleted === false
        }
        const nonProtectedCipher = c => {
          return ![CipherType.MasterPassword, CipherType.TOTP].includes(c.type)
        }
        let result = []
        try {
          result =
            (await this.$searchService.searchCiphers(
              '',
              [nonProtectedCipher, deletedFilter],
              null
            )) || []
        } catch (error) {}
        return result
      },
      watch: ['$store.state.syncedCiphersToggle']
    },
    organizations: {
      async get () {
        const result = await this.$userService.getAllOrganizations()
        return result
      },
      watch: ['$store.state.syncedCiphersToggle']
    },
    ciphers: {
      async get () {
        const deletedFilter = c => {
          return c.isDeleted === false
        }
        let result = []
        try {
          result =
            (await this.$searchService.searchCiphers(
              this.searchText,
              [this.filter, deletedFilter],
              null
            )) || []
        } catch (error) {}
        result = result.filter(item => !item.collectionIds.length)
        result = result.filter(
          item =>
            this.getTeam(this.organizations, item.organizationId).type !== 0
        )
        result = result.map(item => {
          if (item.type === 7) {
            try {
              item.cryptoWallet = JSON.parse(item.notes)
              // item.notes = item.cryptoWallet ? item.cryptoWallet.notes : ''
            } catch (error) {
              console.log(error)
            }
          }
          const org = this.getTeam(this.organizations, item.organizationId)
          return {
            ...item,
            subTitle: item.subTitle,
            share_type:
              org.type === 1
                ? this.$t('data.ciphers.editable')
                : item.viewPassword
                  ? this.$t('data.ciphers.viewable')
                  : this.$t('data.ciphers.only_use')
          }
        })
        result = orderBy(result, ['user.status'], [this.orderDirection]) || []
        this.dataRendered = result.slice(0, 50)
        return result
      },
      watch: [
        '$store.state.syncedCiphersToggle',
        'deleted',
        'searchText',
        'filter',
        'orderField',
        'orderDirection',
        'invitations',
        'myShares'
      ]
    },
    collections: {
      async get () {
        if (this.$store.state.syncing) {
          return
        }
        let collections = []
        try {
          collections = (await this.$collectionService.getAllDecrypted()) || []
        } catch (error) {}
        collections = collections.filter(f => f.id)
        collections = collections.filter(
          item =>
            this.getTeam(this.organizations, item.organizationId).type !== 0
        )
        collections = collections.map(item => {
          const org = this.getTeam(this.organizations, item.organizationId)
          return {
            ...item,
            share_type:
              org.type === 1
                ? this.$t('data.ciphers.editable')
                : !item.hidePasswords
                  ? this.$t('data.ciphers.viewable')
                  : this.$t('data.ciphers.only_use')
          }
        })
        collections.forEach(f => {
          const ciphers =
            this.allCiphers &&
            (this.allCiphers.filter(c => c.collectionIds.includes(f.id)) || [])
          f.ciphersCount = ciphers && ciphers.length
          f.ciphers = ciphers
        })
        return collections
      },
      watch: ['searchText', 'orderField', 'orderDirection', 'ciphers']
    }
  },

  methods: {
    cloneCipher (cipher) {
      const _cipher = cloneDeep(cipher)
      delete _cipher.id
      this.$refs.addEditCipherDialog.openDialog(_cipher, true)
    },
    moveFolders (ids) {
      this.$refs.moveFolder.openDialog(ids)
    },
    routerFolder (item) {
      this.$router.push(
        this.localeRoute({
          name: 'vault-folders-folderId',
          params: { folderId: item.id }
        })
      )
    },
    addEditFolder (folder, shouldRedirect = false) {
      this.$refs.addEditFolder.openDialog(folder, shouldRedirect)
    },
    async getShareInvitations () {
      this.invitations =
        (await this.$axios.$get('cystack_platform/pm/sharing/invitations')) ||
        []
      this.invitations = this.invitations.map(item => {
        const shareType =
          item.share_type === 'Edit'
            ? this.$t('data.ciphers.editable')
            : item.share_type === 'View'
              ? this.$t('data.ciphers.viewable')
              : this.$t('data.ciphers.only_use')
        return {
          ...item,
          share_type: shareType
        }
      })
      this.$store.commit(
        'UPDATE_PENDING_SHARES',
        this.invitations.filter(item => item.status === 'invited').length
      )
    },
    async acceptShareInvitation (cipher) {
      try {
        await this.$axios.$put(
          `cystack_platform/pm/sharing/invitations/${cipher.id}`,
          { status: 'accept' }
        )
        // this.getSyncData()
        this.getShareInvitations()
        this.notify(
          this.$t('data.notifications.accept_invitation_success'),
          'success'
        )
      } catch (e) {
        this.notify(
          this.$t('data.notifications.accept_invitation_failed'),
          'warning'
        )
      } finally {
        this.dialogAcceptVisible = false
      }
    },
    async rejectShareInvitation (cipher) {
      try {
        await this.$axios.$put(
          `cystack_platform/pm/sharing/invitations/${cipher.id}`,
          { status: 'reject' }
        )
        // this.getSyncData()
        this.getShareInvitations()
        this.notify(this.$t('data.notifications.reject_invitation'), 'success')
      } catch (e) {
        this.notify(
          this.$t('data.notifications.reject_invitation_failed'),
          'warning'
        )
      }
    },
    editShareType (cipher) {
      this.$refs.editSharedCipher.openDialog(cipher)
    },
    async stopSharing (cipher) {
      try {
        if (cipher.ciphers) {
          let memberId = null
          if (cipher.user) {
            memberId = cipher.user.id
            delete cipher.user
          }
          let folderNameEnc = await this.$cryptoService.encrypt(cipher.name)
          folderNameEnc = folderNameEnc.encryptedString
          const ciphers = await Promise.all(
            cipher.ciphers.map(async cipher => {
              const type_ = cipher.type
              if (type_ === 7) {
                cipher.type = CipherType.SecureNote
                cipher.secureNote.type = 0
              }
              const cipherEnc = await this.$cipherService.encrypt(
                cipher,
                this.$cryptoService.getEncKey()
              )
              const data = new CipherRequest(cipherEnc)
              data.type = type_
              cipher.type = type_
              return {
                id: cipher.id,
                ...data
              }
            })
          )
          const payload = {
            folder: {
              id: cipher.id,
              name: folderNameEnc,
              ciphers
            }
          }
          memberId
            ? await this.$axios.$post(
              `cystack_platform/pm/sharing/${cipher.organizationId}/members/${memberId}/stop`,
              payload
            )
            : await this.$axios.$post(
              `cystack_platform/pm/sharing/${cipher.organizationId}/stop`,
              payload
            )
        } else {
          let memberId = null
          if (cipher.user) {
            memberId = cipher.user.id
            delete cipher.user
          }
          const type_ = cipher.type
          if (type_ === 7) {
            cipher.type = CipherType.SecureNote
            cipher.secureNote.type = 0
          }
          const personalKey = await this.$cryptoService.getEncKey()
          const cipherEnc = await this.$cipherService.encrypt(
            cipher,
            personalKey
          )
          const data = new CipherRequest(cipherEnc)
          // console.log(data)
          data.type = type_
          cipher.type = type_
          memberId
            ? await this.$axios.$post(
              `cystack_platform/pm/sharing/${cipher.organizationId}/members/${memberId}/stop`,
              {
                folder: null,
                cipher: { ...data, id: cipher.id }
              }
            )
            : await this.$axios.$post(
              `cystack_platform/pm/sharing/${cipher.organizationId}/stop`,
              {
                folder: null,
                cipher: { ...data, id: cipher.id }
              }
            )
        }
        this.notify(this.$t('data.notifications.stop_share_success'), 'success')
        await this.getMyShares()
      } catch (error) {
        this.notify(this.$t('errors.something_went_wrong'), 'warning')
        console.log(error)
      }
    },
    async leaveShare (cipher) {
      this.$confirm(
        this.$tc('data.notifications.leave_share', 1),
        this.$t('common.warning'),
        {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }
      ).then(async () => {
        try {
          await this.$axios.$post(
            `cystack_platform/pm/sharing/${
              cipher.organizationId || cipher?.team?.id
            }/leave`
          )
          if (cipher.ciphers) {
            const deletedIds = cipher.ciphers.map(c => c.id)
            await this.$cipherService.delete(deletedIds)
          } else {
            await this.$cipherService.delete([cipher.id])
          }
          this.notify(
            this.$t('data.notifications.leave_share_success'),
            'success'
          )
        } catch (error) {
          this.notify(this.$t('errors.something_went_wrong'), 'warning')
          console.log(error)
        }
      })
    },
    async generateOrgKey (orgId) {
      const pk = Utils.fromB64ToArray(this.publicKey)
      const orgKey = await this.$cryptoService.getOrgKey(orgId)
      const key = await this.$cryptoService.rsaEncrypt(orgKey.key, pk.buffer)
      return key.encryptedString
    },
    async getPublicKey (email) {
      this.userFingerPrint = ''
      const { public_key: publicKey } = await this.$axios.$post(
        'cystack_platform/pm/sharing/public_key',
        { email }
      )
      return publicKey
    },
    async promptConfirmUser (user) {
      this.selectedCipher.user = user.user || {}
      const selectedUser = user.user || {}
      this.publicKey = await this.getPublicKey(
        selectedUser.email || selectedUser.username
      )
      const publicKey = Utils.fromB64ToArray(this.publicKey)
      const fingerprint = await this.$cryptoService.getFingerprint(
        selectedUser.pwd_user_id,
        publicKey.buffer
      )
      if (fingerprint) {
        this.userFingerPrint = fingerprint.join('-')
      }
      this.dontAskAgain = await this.$storageService.get(
        'autoConfirmFingerprints'
      )
      this.openDialogConfirm()
    },
    openDialogConfirm () {
      this.dialogConfirmVisible = true
    },
    closeDialogConfirm () {
      this.dialogConfirmVisible = false
    },
    async confirmShare (cipher) {
      try {
        this.loadingConfirm = true
        const key = await this.generateOrgKey(cipher.organizationId)
        await this.$axios.$post(
          `cystack_platform/pm/sharing/${cipher.organizationId}/members/${cipher.user.id}`,
          {
            key
          }
        )
        this.closeDialogConfirm()
        await this.getMyShares()
        this.notify(
          this.$t('data.notifications.confirm_member_success'),
          'success'
        )
      } catch (e) {
        console.log(e)
        this.notify(
          this.$t('data.notifications.confirm_member_failed'),
          'warning'
        )
      } finally {
        this.loadingConfirm = false
      }
    },
    newShare () {
      this.$refs.shareCipher.openDialog({})
    },
    async getPendingShares () {
      const invitations =
        (await this.$axios.$get('cystack_platform/pm/sharing/invitations')) ||
        []
      this.pendingShares = invitations.filter(
        item => item.status === 'invited'
      ).length
    },
    async getMyShares () {
      // this.myShares = await this.$axios.$get('cystack_platform/pm/sharing/my_share') || []
      this.$store.dispatch('LoadMyShares')
    },
    upgradePlan () {
      this.$refs.shareCipher.closeDialog()
    },
    openAcceptDialog (item) {
      this.selectedCipher = item
      this.dialogAcceptVisible = true
    }
  }
}
</script>
