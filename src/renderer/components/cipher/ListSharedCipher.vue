<template>
  <div v-loading="loading" class="flex flex-col flex-column-fluid relative">
    <!-- Navigation Menu -->
    <div class="navigation-bar">
      <nuxt-link
        v-for="(item, index) in menuShares"
        :key="index"
        :to="localeRoute({name: item.routeName})"
        active-class="navigation-item__active"
        class="navigation-item"
        exact
      >
        {{ $t(`sidebar.${item.label}`) }}
        <!-- <span v-if="item.pending && item.pending>0"><el-badge :value="item.pending" class="item" /></span> -->
        <span v-if="item.pending && item.pending>0"><div class="notification-badge">{{ item.pending }}</div></span>
      </nuxt-link>
    </div>
    <!-- Navigation Menu end -->

    <!-- List Ciphers, Folders, ... -->
    <div v-if="!shouldRenderNoCipher" class="flex-column-fluid lg:px-28 py-10 px-10 mb-20">
      <!-- Overview -->
      <div class="mb-10">
        <div class="flex">
          <div class="text-head-4">
            <template v-if="getRouteBaseName() ==='shares'">
              <span class="font-medium">{{ $t('sidebar.shared_with_you') }}</span>
            </template>
            <template v-else-if="getRouteBaseName() ==='shares-your-shares'">
              <span class="font-medium">{{ $t('type.your_shares') }}</span>
            </template>
            <template v-else>
              <span class="font-medium">
                {{ $tc(`type.${type}`, 2) }}
              </span>
            </template>
          </div>
          <template v-if="getRouteBaseName()=='shares-your-shares'">
            <div class="mx-6 text-head-4"> | </div>
            <div>
              <button class="px-4 py-2 flex items-center cursor-pointer btn-outline-primary rounded justify-center font-semibold" @click="newShare">
                <div class="break-normal">{{ $t('data.sharing.new_share') }}</div>
              </button>
            </div>
          </template>
        </div>
        <div v-if="ciphers" class="uppercase text-head-6">
          <span class="text-primary font-semibold">{{ ciphers.length }}</span> {{ $tc('type.0', ciphers.length) }}
        </div>
      </div>
      <!-- Overview end -->

      <!-- Details -->
      <!-- List Ciphers -->
      <client-only>
        <LazyHydrate when-visible>
          <el-table
            ref="multipleTable"
            :data="(collections || []).concat(ciphers)"
            style="width: 100%"
            row-class-name="hover-table-row"
          >
            <!-- <el-table-column
              type="selection"
              width="55"
            /> -->
            <el-table-column
              prop="name"
              label=""
              min-width="300"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <div class="flex items-center">
                  <template v-if="!['invited', 'accepted'].includes(scope.row.status)">
                    <div
                      v-if="scope.row.type"
                      class="text-[34px] mr-3 flex-shrink-0"
                      :class="{'filter grayscale': scope.row.isDeleted}"
                    >
                      <Vnodes :vnodes="getIconCipher(scope.row, 34)" />
                    </div>
                    <div v-else>
                      <img src="~/assets/images/icons/folderSolidShare.svg" alt="" class="select-none mr-2">
                    </div>
                  </template>
                  <div class="flex flex-col">
                    <a
                      class="text-black font-semibold truncate flex items-center"
                      :class="{'opacity-80': scope.row.isDeleted}"
                      @click="scope.row.status === 'invited'?openAcceptDialog(scope.row) : scope.row.type?routerCipher(scope.row, addEdit):routerFolder(scope.row)"
                    >
                      {{ scope.row.name || $t('data.sharing.encrypted_content') }}
                      <img v-if="scope.row.organizationId" src="~/assets/images/icons/shares.svg" alt="Shared" :title="$t('common.shared_with_you')" class="inline-block ml-2">
                    </a>
                    <div v-if="scope.row.type === CipherType.Login">
                      {{ scope.row.subTitle || 'N/A' }}
                    </div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              v-if="getRouteBaseName()!=='shares-your-shares'"
              :label="$t('common.owner')"
              show-overflow-tooltip
              width="150"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.owner? scope.row.owner.full_name : getTeam(organizations, scope.row.organizationId).name }}</span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('common.type')"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <span>{{ CipherType[scope.row.cipher_type] || CipherType[scope.row.type] || 'Folder' }}</span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('data.ciphers.updated_time')"
              width="150"
            >
              <template slot-scope="scope">
                <span class="break-normal">
                  {{ scope.row.revisionDate? $moment(scope.row.revisionDate).fromNow() : $moment(scope.row.access_time*1000).fromNow() }}
                </span>
              </template>
            </el-table-column>
            <!-- <template v-if="getRouteBaseName()==='shares-your-shares'">
              <el-table-column
                :label="$t('common.user')"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <span>{{ scope.row.user?scope.row.user.email : 'N/A' }}</span>
                </template>
              </el-table-column>
              <el-table-column
                :label="$t('common.status')"
                min-width="120"
                show-overflow-tooltip
              >
                <template v-if="scope.row.user" slot-scope="scope">
                  <span
                    class="label whitespace-normal"
                    :class="{'label-primary-light': scope.row.user.status === 'confirmed',
                             'label-info': scope.row.user.status === 'accepted',
                             'label-warning-light': scope.row.user.status === 'invited',
                             'label-danger-light': scope.row.user.status === 'expired',
                             'label-success': !scope.row.user.status
                    }"
                  >
                    {{ shareInvitationStatus[`${scope.row.user.status || 'shared'}`] }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                :label="$t('common.share_type')"
                show-overflow-tooltip
                min-width="120"
              >
                <template slot-scope="scope">
                  <span>{{ scope.row.user? scope.row.user.share_type : 'N/A' }}</span>
                </template>
              </el-table-column>
            </template> -->
            <template v-if="getRouteBaseName() === 'shares'">
              <el-table-column
                :label="$t('common.status')"
                min-width="120"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <!-- <span>{{ scope.row.status || 'Shared' }}</span> -->
                  <span
                    class="label whitespace-normal"
                    :class="{'label-primary-light': scope.row.status === 'confirmed',
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
              <el-table-column
                :label="$t('common.share_type')"
                show-overflow-tooltip
                width="120"
              >
                <template slot-scope="scope">
                  <span>{{ scope.row.share_type || 'N/A' }}</span>
                </template>
              </el-table-column>
            </template>
            <el-table-column
              :label="$t('common.actions')"
              fixed="right"
              :width="getRouteBaseName()==='shares'?'230':'auto'"
            >
              <template slot-scope="scope">
                <div class="col-actions">
                  <!-- <button
                    v-if="scope.row.login.canLaunch"
                    class="btn btn-icon btn-xs hover:bg-black-400"
                    :title="$t('common.go_to_website')"
                    @click="openNewTab(scope.row.login.uri)"
                  >
                    <i class="fas fa-external-link-square-alt" />
                  </button> -->
                  <template v-if="scope.row.status === 'invited' && getRouteBaseName()==='shares'">
                    <div class="flex">
                      <div class="btn btn-primary" @click="acceptShareInvitation(scope.row)">
                        {{ $t('common.accept') }}
                      </div>
                      <div class="btn btn-default ml-2" @click="rejectShareInvitation(scope.row)">
                        {{ $t('common.decline') }}
                      </div>
                    </div>
                  </template>
                  <el-dropdown v-else trigger="click">
                    <button class="btn btn-icon btn-xs hover:bg-black-400">
                      <i class="fas fa-ellipsis-h" />
                    </button>
                    <el-dropdown-menu slot="dropdown">
                      <template v-if="!['invited', 'accepted'].includes(scope.row.status) && getRouteBaseName() === 'shares'">
                        <template v-if="canManageItem(organizations, scope.row)">
                          <el-dropdown-item @click.native="scope.row.ciphers?addEditFolder(scope.row):addEdit(scope.row)">
                            {{ $t('common.edit') }}
                          </el-dropdown-item>
                          <el-dropdown-item
                            v-if="isOwner(organizations, scope.row)"
                            @click.native="shareItem(scope.row)"
                          >
                            {{ $t('common.share') }}
                          </el-dropdown-item>
                        </template>
                        <template v-if="scope.row.type && !scope.row.isDeleted">
                          <template v-if="scope.row.type === CipherType.Login">
                            <el-dropdown-item
                              v-clipboard:copy="scope.row.login.username"
                              v-clipboard:success="clipboardSuccessHandler"
                              :divided="canManageItem(organizations, scope.row)"
                            >
                              {{ $t('common.copy') }} {{ $t('common.username') }}
                            </el-dropdown-item>
                            <el-dropdown-item
                              v-clipboard:copy="scope.row.login.password"
                              v-clipboard:success="clipboardSuccessHandler"
                              :disabled="!canViewItem(organizations, scope.row)"
                            >
                              {{ $t('common.copy') }} {{ $t('common.password') }}
                            </el-dropdown-item>
                          </template>
                          <template v-if="scope.row.type === CipherType.SecureNote">
                            <el-dropdown-item
                              v-clipboard:copy="scope.row.notes"
                              v-clipboard:success="clipboardSuccessHandler"
                              divided
                            >
                              {{ $t('common.copy') }} {{ $t('common.note') }}
                            </el-dropdown-item>
                          </template>
                          <template v-if="scope.row.type === CipherType.CryptoWallet && scope.row.cryptoWallet">
                            <el-dropdown-item
                              v-clipboard:copy="scope.row.cryptoWallet.seed"
                              v-clipboard:success="clipboardSuccessHandler"
                            >
                              {{ $t('common.copy') }} {{ $t('data.ciphers.seed') }}
                            </el-dropdown-item>
                            <el-dropdown-item
                              v-clipboard:copy="scope.row.cryptoWallet.address"
                              v-clipboard:success="clipboardSuccessHandler"
                            >
                              {{ $t('common.copy') }} {{ $t('data.ciphers.wallet_address') }}
                            </el-dropdown-item>
                            <el-dropdown-item
                              v-clipboard:copy="scope.row.cryptoWallet.privateKey"
                              v-clipboard:success="clipboardSuccessHandler"
                            >
                              {{ $t('common.copy') }} {{ $t('data.ciphers.private_key') }}
                            </el-dropdown-item>
                            <el-dropdown-item
                              v-clipboard:copy="scope.row.cryptoWallet.password"
                              v-clipboard:success="clipboardSuccessHandler"
                            >
                              {{ $t('common.copy') }} {{ $t('data.ciphers.password_pin') }}
                            </el-dropdown-item>
                          </template>
                          <el-dropdown-item @click.native="cloneCipher(scope.row)">
                            {{ $t('common.clone') }}
                          </el-dropdown-item>
                          <el-dropdown-item divided @click.native="moveFolders([scope.row.id])">
                            {{ $t('common.move_folder') }}
                          </el-dropdown-item>
                        </template>
                        <template v-if="!scope.row.isDeleted">
                          <el-dropdown-item :divided="scope.row.type" @click.native="leaveShare(scope.row)">
                            <span class="text-danger">{{ $t('data.ciphers.leave') }}</span>
                          </el-dropdown-item>
                        </template>
                      </template>
                      <!-- <template v-else-if="scope.row.status === 'invited' && getRouteBaseName()==='shares'">
                      <el-dropdown-item @click.native="acceptShareInvitation(scope.row)">
                        {{ $t('common.accept') }}
                      </el-dropdown-item>
                      <el-dropdown-item @click.native="rejectShareInvitation(scope.row)">
                        {{ $t('common.reject') }}
                      </el-dropdown-item>
                    </template> -->
                      <template v-else-if="scope.row.status === 'accepted' && getRouteBaseName()==='shares'">
                        <el-dropdown-item divided @click.native="leaveShare(scope.row)">
                          <span class="text-danger">{{ $t('data.ciphers.leave') }}</span>
                        </el-dropdown-item>
                      </template>
                      <template v-else-if="getRouteBaseName()==='shares-your-shares'">
                        <el-dropdown-item @click.native="scope.row.type?shareItem(scope.row):shareFolder(scope.row)">
                          {{ $t('common.edit') }}
                        </el-dropdown-item>
                        <el-dropdown-item @click.native="stopSharing(scope.row)">
                          {{ $t('data.ciphers.stop_sharing') }}
                        </el-dropdown-item>
                      </template>
                      <!-- <template v-else-if="getRouteBaseName()==='shares-your-shares' && scope.row.user && scope.row.user.status === 'invited'">
                        <el-dropdown-item @click.native="editShareType(scope.row)">
                          {{ $t('common.edit') }}
                        </el-dropdown-item>
                        <el-dropdown-item @click.native="stopSharing(scope.row)">
                          {{ $t('common.cancel') }}
                        </el-dropdown-item>
                      </template>
                      <template v-else-if="getRouteBaseName()==='shares-your-shares' && scope.row.user && scope.row.user.status === 'confirmed'">
                        <el-dropdown-item @click.native="editShareType(scope.row)">
                          {{ $t('common.edit') }}
                        </el-dropdown-item>
                        <el-dropdown-item @click.native="stopSharing(scope.row)">
                          {{ $t('data.ciphers.stop_sharing') }}
                        </el-dropdown-item>
                      </template>
                      <template v-else-if="getRouteBaseName()==='shares-your-shares' && scope.row.user && scope.row.user.status === 'accepted'">
                        <el-dropdown-item @click.native="promptConfirmUser(scope.row)">
                          {{ $t('common.confirm') }}
                        </el-dropdown-item>
                        <el-dropdown-item @click.native="stopSharing(scope.row)">
                          {{ $t('common.cancel') }}
                        </el-dropdown-item>
                      </template> -->
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </LazyHydrate>
      </client-only>
      <!-- List Ciphers end -->
    </div>
    <ShareNoCipher
      v-else-if="!$store.state.syncing"
      :type="type"
      @add-share="newShare"
    />
    <AddEditCipher ref="addEditCipherDialog" :type="type" />
    <AddEditFolder ref="addEditFolder" />
    <AddEditTeamFolder ref="addEditTeamFolder" />
    <ShareCipher ref="shareCipher" :cipher-options="allCiphers" @upgrade-plan="upgradePlan" @shared-cipher="getMyShares" />
    <EditSharedCipher ref="editSharedCipher" @updated-cipher="getMyShares" />
    <ShareFolder ref="shareFolder" />
    <MoveFolder ref="moveFolder" @reset-selection="multipleSelection = []" />
    <PremiumDialog ref="premiumDialog" />
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
      <div slot="footer" class="dialog-footer flex items-center text-left">
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
            @click="confirmShare(selectedCipher)"
          >
            {{ $t('common.confirm') }}
          </button>
        </div>
      </div>
    </el-dialog>
    <el-dialog
      :title="$t('data.sharing.tips')"
      :visible.sync="dialogAcceptVisible"
      width="40%"
    >
      <span>{{ $t('data.sharing.tips_title') }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogAcceptVisible = false">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click="acceptShareInvitation(selectedCipher)">{{ $t('common.accept') }}</el-button>
      </span>
    </el-dialog>
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
import PremiumDialog from '../../components/upgrade/PremiumDialog'
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
    VueContext: () => import('../../plugins/vue-context'),
    Vnodes,
    PremiumDialog,
    LazyHydrate
  },
  props: {
    deleted: {
      type: Boolean,
      default: false
    },
    routeName: {
      type: String,
      default: 'passwords'
    },
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
      loading: true,
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
      // myShares: [],
      dialogAcceptVisible: false
    }
  },
  computed: {
    shareInvitationStatus () {
      return this.$t('data.sharing')
    },
    menuShares () {
      return [
        {
          label: 'shared_with_you',
          routeName: 'shares',
          pending: this.pendingShares
        },
        {
          label: 'your_shares',
          routeName: 'shares-your-shares'
        }
      ]
    },
    folder () {
      if (this.folders) {
        return find(this.folders, e => e.id === this.$route.params.folderId) || {}
      }
      return {}
    },
    collection () {
      if (this.collections) {
        return find(this.collections, e => e.id === this.$route.params.tfolderId) || { name: 'Unassigned Folder' }
      }
      return {}
    },
    orderString () {
      return `${this.orderField}_${this.orderDirection}`
    },
    type () {
      switch (this.routeName) {
      case 'passwords':
        return 'Login'
      case 'notes':
        return 'SecureNote'
      case 'cards':
        return 'Card'
      case 'identities':
        return 'Identity'
      case 'vault':
        return 'Vault'
      case 'shares':
        return 'Shares'
      case 'trash':
        return 'Trash'
      default:
        return null
      }
    },
    filteredCiphers () {
      if (this.getRouteBaseName() === 'vault' && this.ciphers) {
        return this.ciphers.filter(e => !e.folderId)
      }
      return this.ciphers || []
    },
    shouldRenderNoCipher () {
      const haveCipher = this.filteredCiphers.length + this.collections?.length
      if (this.getRouteBaseName() === 'vault') {
        return this.folders && !this.folders.length && !haveCipher
      }
      // if (this.getRouteBaseName() === 'shares') {
      //   return this.collections && !this.collections.length
      // }
      if (this.getRouteBaseName() === 'vault-folders-folderId') {
        return false
      }
      if (this.getRouteBaseName() === 'vault-tfolders-tfolderId') {
        return false
      }
      return !haveCipher && !this.searchText
      // return true
    },
    shouldRenderShare () {
      return (this.getRouteBaseName() === 'shares')
    },
    canManageTeamFolder () {
      return this.teams.some(e => ['owner', 'admin', 'manager'].includes(e.role))
    },
    canCreateTeamFolder () {
      return this.teams.some(e => ['owner', 'admin'].includes(e.role))
    }
    // shareTypeMapping () {
    //   return {
    //     1: 'Edit',
    //     2: 'Only fill',
    //     3: 'View'
    //   }
    // }
    // pendingShares () {
    //   return this.invitations.filter(item => item.status === 'invited').length
    // }
  },
  watch: {
    ciphers () {
      if (this.ciphers) {
        this.loading = false
      }
    }
  },
  async mounted () {
    this.context = 'VueContext'
    window.onscroll = () => {
      const bottomOfWindow = Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop) + window.innerHeight + 500 >= document.documentElement.scrollHeight

      if (bottomOfWindow) {
        this.lastIndex += 50
        if (this.lastIndex <= this.ciphers.length) {
          this.dataRendered = this.dataRendered.concat(this.ciphers.slice(this.lastIndex, this.lastIndex + 50))
        }
      }
    }
    // this.getPendingShares()
    const locked = await this.$vaultTimeoutService.isLocked(this.$store.state.isLoggedInPw)
    if (!locked) {
      if (this.getRouteBaseName() === 'shares') {
        this.getShareInvitations()
      }
      if (this.getRouteBaseName() === 'shares-your-shares') {
        // this.getMyShares()
      }
    }
  },
  asyncComputed: {
    allCiphers: {
      async get () {
        // this.loading = true
        // const result = await this.$cipherService.getAllDecrypted()
        const deletedFilter = c => {
          return c.isDeleted === this.deleted
        }
        let result = []

        result = await this.$searchService.searchCiphers('', [null, deletedFilter], null) || []
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
          return c.isDeleted === this.deleted
        }
        let result = []

        result = await this.$searchService.searchCiphers(this.searchText, [this.filter, deletedFilter], null) || []
        result = result.filter(item => !item.collectionIds.length)
        if (this.getRouteBaseName() === 'shares') {
          result = result.filter(item => this.getTeam(this.organizations, item.organizationId).type !== 0)
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
              share_type: org.type === 1 ? this.$t('data.ciphers.editable') : item.viewPassword ? this.$t('data.ciphers.viewable') : this.$t('data.ciphers.only_use')
            }
          })
          result = this.invitations.concat(result)
        } else if (this.getRouteBaseName() === 'shares-your-shares') {
          // const myShare = await this.$axios.$get('cystack_platform/pm/sharing/my_share') || []
          result = result.filter(item => this.getTeam(this.organizations, item.organizationId).type === 0)
          const resultMapping = []
          result.forEach(item => {
            const org = find(this.myShares, e => e.organization_id === item.organizationId) || {}
            const members = org.members || []
            // members.forEach(member => {
            //   resultMapping.push({
            //     ...item,
            //     subTitle: item.subTitle,
            //     user: {
            //       ...member,
            //       share_type: member.share_type === 'Edit' ? this.$t('data.ciphers.editable') : member.share_type === 'View' ? this.$t('data.ciphers.viewable') : this.$t('data.ciphers.only_use')
            //     }
            //   })
            // })
            if (members.length) {
              resultMapping.push(item)
            }
          })
          result = resultMapping
        }
        result = orderBy(result, ['user.status'], [this.orderDirection]) || []
        this.dataRendered = result.slice(0, 50)
        // if (!this.$store.state.syncing) {
        //   this.loading = false
        // }
        return result
      },
      watch: ['$store.state.syncedCiphersToggle', 'deleted', 'searchText', 'filter', 'orderField', 'orderDirection', 'invitations', 'myShares']
    },
    collections: {
      async get () {
        if (this.$store.state.syncing) {
          return
        }
        let collections = await this.$collectionService.getAllDecrypted() || []
        collections = collections.filter(f => f.id)
        if (this.getRouteBaseName() === 'shares') {
          collections = collections.filter(item => this.getTeam(this.organizations, item.organizationId).type !== 0)
          collections = collections.map(item => {
            const org = this.getTeam(this.organizations, item.organizationId)
            return {
              ...item,
              share_type: org.type === 1 ? this.$t('data.ciphers.editable') : !item.hidePasswords ? this.$t('data.ciphers.viewable') : this.$t('data.ciphers.only_use')
            }
          })
        } else if (this.getRouteBaseName() === 'shares-your-shares') {
          collections = collections.filter(item => this.getTeam(this.organizations, item.organizationId).type === 0)
          const resultMapping = []
          collections.forEach(item => {
            const org = find(this.myShares, e => e.organization_id === item.organizationId) || {}
            const members = org.members || []
            // members.forEach(member => {
            //   resultMapping.push({
            //     ...item,
            //     subTitle: item.subTitle,
            //     user: {
            //       ...member,
            //       share_type: member.share_type === 'Edit' ? this.$t('data.ciphers.editable') : member.share_type === 'View' ? this.$t('data.ciphers.viewable') : this.$t('data.ciphers.only_use')
            //     }
            //   })
            // })
            if (members.length) {
              resultMapping.push(item)
            }
          })
          collections = resultMapping
        }
        collections.forEach(f => {
          const ciphers = this.allCiphers && (this.allCiphers.filter(c => c.collectionIds.includes(f.id)) || [])
          f.ciphersCount = ciphers && ciphers.length
          f.ciphers = ciphers
        })
        if (!this.$store.state.syncing) {
          this.loading = false
        }
        return collections
      },
      watch: ['searchText', 'orderField', 'orderDirection', 'ciphers']
    }
  },
  methods: {
    addEdit (cipher) {
      this.$refs.addEditCipherDialog.openDialog(cloneDeep(cipher))
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    cloneCipher (cipher) {
      const _cipher = cloneDeep(cipher)
      delete _cipher.id
      this.$refs.addEditCipherDialog.openDialog(_cipher, true)
    },
    moveFolders (ids) {
      this.$refs.moveFolder.openDialog(ids)
    },
    deleteCiphers (ids) {
      this.$refs.addEditCipherDialog.deleteCiphers(ids)
    },
    restoreCiphers (ids) {
      this.$refs.addEditCipherDialog.restoreCiphers(ids)
    },
    moveTrashCiphers (ids) {
      this.$refs.addEditCipherDialog.moveTrashCiphers(ids)
    },
    changeSort (orderField, orderDirection) {
      this.orderField = orderField
      this.orderDirection = orderDirection
    },
    routerFolder (item) {
      this.$router.push(this.localeRoute({
        name: 'vault-folders-folderId',
        params: { folderId: item.id }
      }))
    },
    routerCollection (item) {
      if (item.id === 'unassigned') {
        this.$router.push(this.localeRoute({
          name: 'vault-teams-teamId-tfolders-tfolderId',
          params: { teamId: item.organizationId, tfolderId: item.id }
        }))
      } else {
        this.$router.push(this.localeRoute({
          name: 'vault-teams-teamId-tfolders-tfolderId',
          params: { teamId: item.organizationId, tfolderId: item.id }
        }))
      }
    },
    openContextFolder (event, data) {
      this.selectedFolder = data
    },
    openContextTeamFolder (event, data) {
      this.selectedFolder = data
      console.log(this.selectedFolder)
    },
    addEditFolder (folder, shouldRedirect = false) {
      this.$refs.addEditFolder.openDialog(folder, shouldRedirect)
    },
    addEditTeamFolder (folder, shouldRedirect = false) {
      this.$refs.addEditTeamFolder.openDialog(folder, shouldRedirect)
    },
    deleteFolder (folder) {
      this.$refs.addEditFolder.deleteFolder(folder)
    },
    deleteTeamFolder (folder) {
      this.$refs.addEditTeamFolder.deleteFolder(folder)
    },
    shareItem (cipher) {
      this.$refs.shareCipher.openDialog(cipher)
    },
    shareFolder (folder) {
      this.$refs.shareFolder.openDialog(folder)
    },
    countUnassignedItems (ciphers = [], organizationId) {
      if (ciphers) {
        const filteredCipher = ciphers.filter(c => c.organizationId === organizationId && c.collectionIds.length === 0)
        return filteredCipher.length
      }
      return 0
    },
    canDeleteTeamFolder (team) {
      return ['owner', 'admin'].includes(team.role) && !team.locked
    },
    async getShareInvitations () {
      this.invitations = await this.$axios.$get('cystack_platform/pm/sharing/invitations') || []
      this.invitations = this.invitations.map(item => {
        const shareType = item.share_type === 'Edit' ? this.$t('data.ciphers.editable') : item.share_type === 'View' ? this.$t('data.ciphers.viewable') : this.$t('data.ciphers.only_use')
        return {
          ...item,
          share_type: shareType
        }
      })
      this.$store.commit('UPDATE_PENDING_SHARES', this.invitations.filter(item => item.status === 'invited').length)
    },
    async acceptShareInvitation (cipher) {
      try {
        await this.$axios.$put(`cystack_platform/pm/sharing/invitations/${cipher.id}`, { status: 'accept' })
        // this.getSyncData()
        this.getShareInvitations()
        this.notify(this.$t('data.notifications.accept_invitation_success'), 'success')
      } catch (e) {
        this.notify(this.$t('data.notifications.accept_invitation_failed'), 'warning')
      } finally {
        this.dialogAcceptVisible = false
      }
    },
    async rejectShareInvitation (cipher) {
      try {
        await this.$axios.$put(`cystack_platform/pm/sharing/invitations/${cipher.id}`, { status: 'reject' })
        // this.getSyncData()
        this.getShareInvitations()
        this.notify(this.$t('data.notifications.reject_invitation'), 'success')
      } catch (e) {
        this.notify(this.$t('data.notifications.reject_invitation_failed'), 'warning')
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
          const ciphers = await Promise.all(cipher.ciphers.map(async cipher => {
            const type_ = cipher.type
            if (type_ === 7) {
              cipher.type = CipherType.SecureNote
              cipher.secureNote.type = 0
            }
            const cipherEnc = await this.$cipherService.encrypt(cipher, this.$cryptoService.getEncKey())
            const data = new CipherRequest(cipherEnc)
            data.type = type_
            return {
              id: cipher.id,
              ...data
            }
          }))
          const payload = {
            folder: {
              id: cipher.id,
              name: folderNameEnc,
              ciphers
            }
          }
          memberId ? await this.$axios.$post(`cystack_platform/pm/sharing/${cipher.organizationId}/members/${memberId}/stop`, payload) : await this.$axios.$post(`cystack_platform/pm/sharing/${cipher.organizationId}/stop`, payload)
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
          const cipherEnc = await this.$cipherService.encrypt(cipher, personalKey)
          const data = new CipherRequest(cipherEnc)
          // console.log(data)
          data.type = type_
          cipher.type = type_
          memberId
            ? await this.$axios.$post(`cystack_platform/pm/sharing/${cipher.organizationId}/members/${memberId}/stop`, {
              folder: null,
              cipher: { ...data, id: cipher.id }
            })
            : await this.$axios.$post(`cystack_platform/pm/sharing/${cipher.organizationId}/stop`, {
              folder: null,
              cipher: { ...data, id: cipher.id }
            })
        }
        this.notify(this.$tc('data.notifications.update_success', 1, { type: this.$tc(`type.${cipher.type || 'Folder'}`, 1) }), 'success')
        await this.getMyShares()
      } catch (error) {
        this.notify(this.$tc('data.notifications.update_failed', 1, { type: this.$tc(`type.${cipher.type || 'Folder'}`, 1) }), 'warning')
        console.log(error)
      }
    },
    async leaveShare (cipher) {
      this.$confirm(this.$tc('data.notifications.leave_share', 1), this.$t('common.warning'), {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(async () => {
        try {
          await this.$axios.$post(`cystack_platform/pm/sharing/${cipher.organizationId}/leave`)
          if (cipher.ciphers) {
            const deletedIds = cipher.ciphers.map(c => c.id)
            await this.$cipherService.delete(deletedIds)
          } else {
            await this.$cipherService.delete([cipher.id])
          }
          this.notify(this.$tc('data.notifications.update_success', 1, { type: this.$tc(`type.${cipher.type || 'Folder'}`, 1) }), 'success')
        } catch (error) {
          this.notify(this.$tc('data.notifications.update_failed', 1, { type: this.$tc(`type.${cipher.type || 'Folder'}`, 1) }), 'warning')
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
      const { public_key: publicKey } = await this.$axios.$post('cystack_platform/pm/sharing/public_key', { email })
      return publicKey
    },
    async promptConfirmUser (cipher) {
      this.selectedCipher = cipher
      const user = cipher.user || {}
      this.publicKey = await this.getPublicKey(user.email)
      const publicKey = Utils.fromB64ToArray(this.publicKey)
      const fingerprint = await this.$cryptoService.getFingerprint(user.pwd_user_id, publicKey.buffer)
      if (fingerprint) {
        this.userFingerPrint = fingerprint.join('-')
      }
      this.dontAskAgain = await this.$storageService.get('autoConfirmFingerprints')
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
        await this.$axios.$post(`cystack_platform/pm/sharing/${cipher.organizationId}/members/${cipher.user.id}`, {
          key
        })
        this.closeDialogConfirm()
        await this.getMyShares()
        this.notify(this.$t('data.notifications.confirm_member_success'), 'success')
      } catch (e) {
        console.log(e)
        this.notify(this.$t('data.notifications.confirm_member_failed'), 'warning')
      } finally {
        this.loadingConfirm = false
      }
    },
    newShare () {
      this.$refs.shareCipher.openDialog({})
    },
    async getPendingShares () {
      const invitations = await this.$axios.$get('cystack_platform/pm/sharing/invitations') || []
      this.pendingShares = invitations.filter(item => item.status === 'invited').length
    },
    async getMyShares () {
      // this.myShares = await this.$axios.$get('cystack_platform/pm/sharing/my_share') || []
      this.$store.dispatch('LoadMyShares')
    },
    upgradePlan () {
      this.$refs.shareCipher.closeDialog()
      this.$refs.premiumDialog.openDialog()
    },
    openAcceptDialog (item) {
      this.selectedCipher = item
      this.dialogAcceptVisible = true
    },
    addEditFolder (folder, shouldRedirect = false) {
      this.$refs.addEditFolder.openDialog(folder, shouldRedirect)
    }
  }
}
</script>
