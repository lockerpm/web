<template>
  <div v-loading="loading">
    <!-- List Ciphers, Folders, ... -->
    <div
      v-if="!shouldRenderNoCipher"
      class="flex-column-fluid lg:px-28 px-10 mb-20"
    >
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
                  <!-- Icon -->
                  <div>
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
                  </div>
                  <!-- Icon end -->

                  <!-- Name -->
                  <div class="flex flex-col">
                    <a
                      class="text-black font-semibold truncate flex items-center"
                      :class="{ 'opacity-80': scope.row.isDeleted }"
                      @click="
                        scope.row.type
                          ? routerCipher(scope.row, addEdit)
                          : routerFolder(scope.row)
                      "
                    >
                      {{ scope.row.name }}
                      <img
                        v-if="scope.row.organizationId"
                        src="~/assets/images/icons/shares.svg"
                        alt="Shared"
                        title="Your shares"
                        class="inline-block ml-2"
                      >
                    </a>
                    <div v-if="scope.row.type === CipherType.Login">
                      {{ scope.row.subTitle || 'N/A' }}
                    </div>
                  </div>
                  <!-- Name end -->
                </div>
              </template>
            </el-table-column>
            <!-- Item name end -->

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

            <!-- Actions -->
            <el-table-column
              :label="$t('common.actions')"
              fixed="right"
              width="auto"
            >
              <template slot-scope="scope">
                <div class="col-actions">
                  <!-- More -->
                  <el-dropdown trigger="click">
                    <button class="btn btn-icon btn-xs hover:bg-black-400">
                      <i class="fas fa-ellipsis-h" />
                    </button>
                    <div
                      v-if="
                        !!pendingMyShares.find(
                          s => s.organization_id === scope.row.organizationId
                        )
                      "
                      class="notification-badge"
                    >
                      1
                    </div>
                    <el-dropdown-menu slot="dropdown">
                      <!-- Edit share -->
                      <el-dropdown-item
                        @click.native="
                          scope.row.type
                            ? shareItem(scope.row)
                            : shareFolder(scope.row)
                        "
                      >
                        {{ $t('common.edit') }}
                      </el-dropdown-item>
                      <!-- Edit share end -->

                      <!-- Stop share -->
                      <el-dropdown-item @click.native="stopSharing(scope.row)">
                        {{ $t('data.ciphers.stop_sharing') }}
                      </el-dropdown-item>
                      <!-- Stop share end -->
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

    <ShareNoCipher v-else-if="!$store.state.syncing" @add-share="newShare" />

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

    <!-- Confirm share dialog -->
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
    <!-- Confirm share dialog end -->
  </div>
</template>

<script>
import orderBy from 'lodash/orderBy'
import LazyHydrate from 'vue-lazy-hydration'
import ShareCipher from '../../../components/cipher/shares/ShareCipher'
import EditSharedCipher from '../../../components/cipher/shares/EditSharedCipher'
import ShareFolder from '../../../components/folder/ShareFolder'
import ShareNoCipher from '../../../components/cipher/shares/ShareNoCipher'
import { CipherType } from '../../../jslib/src/enums'
import Vnodes from '../../../components/Vnodes'
import { CipherRequest } from '../../../jslib/src/models/request'
import { Utils } from '../../../jslib/src/misc/utils.ts'
import { AccountRole } from '../../../constants'

CipherType.TOTP = 5
CipherType.MasterPassword = 8
CipherType.CryptoBackup = 7
CipherType[7] = 'Crypto Backup'

export default {
  components: {
    ShareCipher,
    EditSharedCipher,
    ShareFolder,
    ShareNoCipher,
    // eslint-disable-next-line vue/no-unused-components
    VueContext: () => import('../../../plugins/vue-context'),
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
      CipherType,
      loading: false,
      selectedFolder: {},
      context: '',
      publicKey: '',
      dataRendered: [],
      lastIndex: 0,
      userFingerPrint: '',
      selectedUser: {},
      loadingConfirm: false,
      dialogConfirmVisible: false,
      selectedCipher: {},
      isItemInUrlOpened: false
    }
  },

  computed: {
    shouldRenderNoCipher () {
      const haveCipher = this.ciphers?.length || this.collections?.length
      return !haveCipher && !this.searchText
    },
    tableData () {
      return [].concat(this.collections || [], this.ciphers || [])
    }
  },

  watch: {
    '$store.state.syncing' () {
      if (this.$store.state.syncing) {
        this.loading = true
      } else {
        this.loading = false
      }
    },

    collections (newData) {
      const initialId = this.$route.query?.id
      if (this.isItemInUrlOpened || !newData || !initialId) {
        return
      }
      const collection = newData.find(c => c.id === initialId)
      if (collection) {
        this.isItemInUrlOpened = true
        this.shareFolder(collection)
      }
    },

    ciphers (newData) {
      const initialId = this.$route.query?.id
      if (this.isItemInUrlOpened || !newData || !initialId) {
        return
      }
      const cipher = newData.find(c => c.id === initialId)
      if (cipher) {
        this.isItemInUrlOpened = true
        this.shareItem(cipher)
      }
    },

    pendingShares () {
      this.getShareInvitations()
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
      // this.getMyShares()
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
        } catch (error) {
          //
        }
        result = result.filter(item => !item.collectionIds.length)
        result = result.filter(
          item =>
            this.getTeam(this.organizations, item.organizationId).type ===
            AccountRole.OWNER
        )
        result = orderBy(result, ['user.status'], ['desc']) || []
        this.dataRendered = result.slice(0, 50)
        return result
      },
      watch: [
        '$store.state.syncedCiphersToggle',
        'deleted',
        'searchText',
        'filter',
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
            this.getTeam(this.organizations, item.organizationId).type ===
            AccountRole.OWNER
        )
        collections.forEach(f => {
          f.ciphersCount = 0
          f.ciphers = []
        })
        return collections
      },
      watch: ['searchText', 'ciphers']
    }
  },

  methods: {
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
    shareItem (cipher) {
      this.selectedCipher = cipher
      this.$refs.shareCipher.openDialog(cipher)
    },
    shareFolder (folder) {
      this.selectedCipher = folder
      this.$refs.shareFolder.openDialog(folder)
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
    async getMyShares () {
      this.$store.dispatch('LoadMyShares')
    },
    upgradePlan () {
      this.$refs.shareCipher.closeDialog()
    }
  }
}
</script>
