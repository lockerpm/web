<template>
  <div v-loading="loading" class="flex flex-col flex-column-fluid relative">
    <!-- Navigation Menu -->
    <div class="flex mb-5 border-b border-black-400 py-3 lg:px-28 px-10">
      <nuxt-link
        v-for="(item, index) in menuShares"
        :key="index"
        :to="localeRoute({name: item.routeName})"
        active-class="!text-primary"
        class="text-black-600 font-bold mr-8 last:mr-0 hover:no-underline"
        exact
      >
        {{ $t(`sidebar.${item.label}`) }}
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
                <div class="break-normal">New Share</div>
              </button>
            </div>
          </template>
        </div>
        <div v-if="ciphers && !viewFolder" class="uppercase text-head-6">
          <span class="text-primary font-semibold">{{ ciphers.length }}</span> {{ $tc('type.0', ciphers.length) }}
        </div>
        <div v-if="folders && viewFolder" class="uppercase text-head-6">
          <span class="text-primary font-semibold">{{ folders.length }}</span> {{ $tc('type.Folder', folders.length) }}
        </div>
      </div>
      <!-- Overview end -->

      <!-- Details -->
      <!-- List Ciphers -->
      <client-only v-if="!viewFolder">
        <el-table
          ref="multipleTable"
          :data="dataRendered || []"
          style="width: 100%"
          row-class-name="hover-table-row"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="55"
          />
          <el-table-column
            prop="name"
            label=""
            min-width="300"
            show-overflow-tooltip
          >
            <template slot="header">
              <div v-if="multipleSelection.length" class="flex items-center ">
                <div class="text-black mr-8 whitespace-nowrap">
                  {{ multipleSelection.length }} {{ $t('data.ciphers.selected_items') }}
                </div>
                <div v-if="deleted">
                  <button
                    class="btn btn-default btn-xs"
                    @click="restoreCiphers(multipleSelection.map(e => e.id))"
                  >
                    {{ $t('common.restore') }}
                  </button>
                  <button
                    class="btn btn-default btn-xs !text-danger"
                    @click="deleteCiphers(multipleSelection.map(e => e.id))"
                  >
                    {{ $t('common.permanently_delete') }}
                  </button>
                </div>
                <div v-else class="">
                  <button
                    class="btn btn-default btn-xs"
                    @click="moveFolders(multipleSelection.map(e => e.id))"
                  >
                    {{ $t('common.move_folder') }}
                  </button>
                  <button
                    class="btn btn-default btn-xs !text-danger"
                    @click="moveTrashCiphers(multipleSelection.map(e => e.id))"
                  >
                    {{ $t('common.delete') }}
                  </button>
                </div>
              </div>
            </template>
            <template slot-scope="scope">
              <div class="flex items-center">
                <div
                  class="text-[34px] mr-3 flex-shrink-0"
                  :class="{'filter grayscale': scope.row.isDeleted}"
                >
                  <Vnodes :vnodes="getIconCipher(scope.row, 34)" />
                </div>
                <div class="flex flex-col">
                  <a
                    class="text-black font-semibold truncate flex items-center"
                    :class="{'opacity-80': scope.row.isDeleted}"
                    @click="routerCipher(scope.row, addEdit)"
                  >
                    {{ scope.row.name || 'N/A' }}
                    <img v-if="scope.row.organizationId" src="~/assets/images/icons/shares.svg" alt="Shared" :title="$t('common.shared_with_you')" class="inline-block ml-2">
                  </a>
                  <div>
                    {{ scope.row.subTitle || 'N/A' }}
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            v-if="getRouteBaseName()!=='shares-your-shares'"
            align="right"
            :label="$t('common.owner')"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span>{{ scope.row.owner? scope.row.owner.full_name : getTeam(organizations, scope.row.organizationId).name }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="right"
            :label="$t('common.type')"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span>{{ CipherType[scope.row.cipher_type] || CipherType[scope.row.type] }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="right"
            :label="$t('data.ciphers.updated_time')"
          >
            <template slot-scope="scope">
              <span class="break-normal">
                {{ scope.row.revisionDate? $moment(scope.row.revisionDate).fromNow() : $moment(scope.row.access_time*1000).fromNow() }}
              </span>
            </template>
          </el-table-column>
          <template v-if="getRouteBaseName()==='shares-your-shares'">
            <el-table-column
              align="right"
              :label="$t('common.user')"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <span>{{ scope.row.user?scope.row.user.email : 'N/A' }}</span>
              </template>
            </el-table-column>
            <el-table-column
              align="right"
              :label="$t('common.status')"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <!-- <span>{{ scope.row.user.status || 'N/A' }}</span> -->
                <span
                  v-if="scope.row.user"
                  class="label"
                  :class="{'label-primary-light': scope.row.user.status === 'confirmed',
                           'label-success-light': scope.row.user.status === 'accepted',
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
              align="right"
              :label="$t('common.share_type')"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <span>{{ scope.row.user? scope.row.user.share_type : 'N/A' }}</span>
              </template>
            </el-table-column>
          </template>
          <template v-if="getRouteBaseName() === 'shares'">
            <el-table-column
              align="right"
              :label="$t('common.status')"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <!-- <span>{{ scope.row.status || 'Shared' }}</span> -->
                <span
                  class="label"
                  :class="{'label-primary-light': scope.row.status === 'confirmed',
                           'label-success-light': scope.row.status === 'accepted',
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
              align="right"
              :label="$t('common.share_type')"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <span>{{ scope.row.share_type || 'N/A' }}</span>
              </template>
            </el-table-column>
          </template>
          <el-table-column
            label=""
            align="right"
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
                <el-dropdown trigger="click" :hide-on-click="false">
                  <button class="btn btn-icon btn-xs hover:bg-black-400">
                    <i class="fas fa-ellipsis-h" />
                  </button>
                  <el-dropdown-menu slot="dropdown">
                    <template v-if="scope.row.status !== 'invited' && getRouteBaseName() === 'shares'">
                      <el-dropdown-item @click.native="addEdit(scope.row)">
                        {{ $t('common.edit') }}
                      </el-dropdown-item>
                      <template v-if="!scope.row.isDeleted && scope.row.type === CipherType.Login">
                        <el-dropdown-item
                          v-clipboard:copy="scope.row.login.username"
                          v-clipboard:success="clipboardSuccessHandler"
                          divided
                        >
                          {{ $t('common.copy') }} {{ $t('common.username') }}
                        </el-dropdown-item>
                        <el-dropdown-item
                          v-clipboard:copy="scope.row.login.password"
                          v-clipboard:success="clipboardSuccessHandler"
                        >
                          {{ $t('common.copy') }} {{ $t('common.password') }}
                        </el-dropdown-item>
                      </template>
                      <template v-if="!scope.row.isDeleted && scope.row.type === CipherType.SecureNote">
                        <el-dropdown-item
                          v-clipboard:copy="scope.row.notes"
                          v-clipboard:success="clipboardSuccessHandler"
                          divided
                        >
                          {{ $t('common.copy') }} {{ $t('common.note') }}
                        </el-dropdown-item>
                      </template>
                      <template v-if="!scope.row.isDeleted">
                        <el-dropdown-item divided @click.native="cloneCipher(scope.row)">
                          {{ $t('common.clone') }}
                        </el-dropdown-item>
                        <el-dropdown-item
                          v-if="!scope.row.organizationId && canManageTeamFolder"
                          @click.native="shareItem(scope.row)"
                        >
                          {{ $t('common.share') }}
                        </el-dropdown-item>
                        <el-dropdown-item @click.native="moveFolders([scope.row.id])">
                          {{ $t('common.move_folder') }}
                        </el-dropdown-item>
                      </template>
                      <template v-if="!scope.row.isDeleted">
                        <el-dropdown-item divided @click.native="leaveShare(scope.row)">
                          <span class="text-danger">{{ $t('common.delete') }}</span>
                        </el-dropdown-item>
                      </template>
                    </template>
                    <template v-else-if="getRouteBaseName()==='shares'">
                      <el-dropdown-item @click.native="acceptShareInvitation(scope.row)">
                        {{ $t('common.accept') }}
                      </el-dropdown-item>
                      <el-dropdown-item @click.native="rejectShareInvitation(scope.row)">
                        {{ $t('common.reject') }}
                      </el-dropdown-item>
                    </template>
                    <template v-else-if="getRouteBaseName()==='shares-your-shares' && scope.row.user.status === 'invited'">
                      <el-dropdown-item @click.native="stopSharing(scope.row)">
                        {{ $t('common.cancel') }}
                      </el-dropdown-item>
                    </template>
                    <template v-else-if="getRouteBaseName()==='shares-your-shares' && scope.row.user.status === 'confirmed'">
                      <el-dropdown-item @click.native="editShareType(scope.row)">
                        {{ $t('common.edit') }}
                      </el-dropdown-item>
                      <el-dropdown-item @click.native="stopSharing(scope.row)">
                        {{ $t('common.stop_sharing') }}
                      </el-dropdown-item>
                    </template>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </client-only>
      <!-- List Ciphers end -->
    </div>
    <NoCipher
      v-else-if="!loading"
      :type="type"
      @add-cipher="handleAddButton"
    />
    <AddEditCipher ref="addEditCipherDialog" :type="type" />
    <ChooseCipherType ref="chooseCipherType" />
    <AddEditFolder ref="addEditFolder" />
    <AddEditTeamFolder ref="addEditTeamFolder" />
    <AddEditTeamFolderUsers ref="addEditTeamFolderUsers" />
    <AddEditTeamFolderGroups ref="addEditTeamFolderGroups" />
    <ShareCipher ref="shareCipher" :cipher-options="allCiphers" />
    <ShareFolder ref="shareFolder" />
    <MoveFolder ref="moveFolder" @reset-selection="multipleSelection = []" />
  </div>
</template>

<script>
import * as lunr from 'lunr'
import cloneDeep from 'lodash/cloneDeep'
import orderBy from 'lodash/orderBy'
import find from 'lodash/find'
import groupBy from 'lodash/groupBy'
import { data } from 'cheerio/lib/api/attributes'
import AddEditCipher from '../../components/cipher/AddEditCipher'
import AddEditFolder from '../folder/AddEditFolder'
import AddEditTeamFolder from '../folder/AddEditTeamFolder'
import AddEditTeamFolderUsers from '../folder/AddEditTeamFolderUsers'
import AddEditTeamFolderGroups from '../folder/AddEditTeamFolderGroups'
import ShareCipher from '../../components/cipher/ShareCipher'
import ShareFolder from '../../components/folder/ShareFolder'
import MoveFolder from '../folder/MoveFolder'
import NoCipher from '../../components/cipher/NoCipher'
import { CipherType } from '../../jslib/src/enums'
import Vnodes from '../../components/Vnodes'
import ChooseCipherType from '../../components/cipher/ChooseCipherType'
import { CipherRequest } from '../../jslib/src/models/request'
export default {
  components: {
    ChooseCipherType,
    AddEditCipher,
    AddEditFolder,
    AddEditTeamFolder,
    ShareCipher,
    ShareFolder,
    MoveFolder,
    NoCipher,
    AddEditTeamFolderUsers,
    AddEditTeamFolderGroups,
    VueContext: () => import('../../plugins/vue-context'),
    Vnodes
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
      loading: false,
      orderField: 'name', // revisionDate
      orderDirection: 'asc',
      selectedFolder: {},
      context: '',
      publicKey: '',
      indexing: false,
      index: null,
      menuShares: [
        {
          label: 'shared_with_you',
          routeName: 'shares'
        },
        {
          label: 'your_shares',
          routeName: 'shares-your-shares'
        }
      ],
      dataRendered: [],
      lastIndex: 0,
      options: ['Login', 'SecureNote', 'Card', 'Identity'],
      selectedType: 'Login',
      viewFolder: false,
      shareInvitationStatus: {
        invited: 'Pending',
        accepted: 'Accepted',
        confirmed: 'Confirmed',
        shared: 'Shared',
        waiting: 'Waiting for confirmation'
      }
    }
  },
  computed: {
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
    filteredCollection () {
      return groupBy(this.collections, 'organizationId')
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
      const haveCipher = this.filteredCiphers.length
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
  },
  asyncComputed: {
    allCiphers: {
      async get () {
        this.loading = true
        let result = await this.$cipherService.getAllDecrypted()
        // remove ciphers generated by authenticator
        result = result.filter(cipher => [CipherType.Login, CipherType.SecureNote, CipherType.Card, CipherType.Identity].includes(cipher.type))
        return result
      },
      watch: ['$store.state.syncedCiphersToggle', 'deleted', 'searchText', 'filter', 'orderField', 'orderDirection']
    },
    organizations: {
      async get () {
        const result = await this.$userService.getAllOrganizations()
        return result
      },
      watch: ['allCiphers']
    },
    ciphers: {
      async get () {
        const deletedFilter = c => {
          return c.isDeleted === this.deleted
        }
        let result = await this.searchCiphers(this.searchText, [this.filter, deletedFilter], null) || []
        if (this.getRouteBaseName() === 'shares') {
          result = result.filter(item => this.getTeam(this.organizations, item.organizationId).type !== 0)
          const invitations = await this.$axios.$get('cystack_platform/pm/sharing/invitations') || []
          result = invitations.concat(result)
        } else if (this.getRouteBaseName() === 'shares-your-shares') {
          const myShare = await this.$axios.$get('cystack_platform/pm/sharing/my_share') || []
          result = result.filter(item => this.getTeam(this.organizations, item.organizationId).type === 0)
          const resultMapping = []
          result.forEach(item => {
            const org = find(myShare, e => e.organization_id === item.organizationId) || {}
            const members = org.members || []
            members.forEach(member => {
              resultMapping.push({
                ...item,
                user: member
              })
            })
          })
          result = resultMapping
        }
        this.dataRendered = result.slice(0, 50)
        if (!this.$store.state.syncing) {
          this.loading = false
        }
        return orderBy(result, [c => this.orderField === 'name' ? (c.name && c.name.toLowerCase()) : c.revisionDate], [this.orderDirection]) || []
      },
      watch: ['allCiphers']
    }
  },
  methods: {
    addEdit (cipher) {
      this.$refs.addEditCipherDialog.openDialog(cloneDeep(cipher))
    },
    handleAddButton () {
      if (this.getRouteBaseName() === 'vault-tfolders-tfolderId' && !this.collection.readOnly) {
        this.addEdit({
          organizationId: this.collection.organizationId
        })
      } else if (!['vault', 'shares'].includes(this.getRouteBaseName())) {
        this.addEdit({})
      } else {
        this.chooseCipherType()
      }
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
    putTeamFolderGroups (folder) {
      this.$refs.addEditTeamFolderGroups.openDialog(folder)
    },
    putTeamFolderUsers (folder) {
      this.$refs.addEditTeamFolderUsers.openDialog(folder)
    },
    chooseCipherType () {
      this.$refs.chooseCipherType.openDialog()
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
    isBiz (team) {
      return team.is_business
    },
    async searchCiphers (query = '', filter, ciphers) {
      const results = []
      if (query != null) {
        query = query.trim().toLowerCase()
      }
      if (query === '') {
        query = null
      }
      if (ciphers == null) {
        ciphers = this.allCiphers
      }
      if (filter != null && Array.isArray(filter) && filter.length > 0) {
        ciphers = ciphers.filter(c => filter.every(f => f == null || f(c)))
      } else if (filter != null) {
        ciphers = ciphers.filter(filter)
      }
      if (!this.isSearchable(query)) {
        return ciphers
      }

      if (this.indexing) {
        await new Promise(r => setTimeout(r, 250))
        if (this.indexing) {
          await new Promise(r => setTimeout(r, 500))
        }
      }

      const index = this.getIndexForSearch()
      if (index === null) {
        // Fall back to basic search if index is not available
        return this.searchCiphersBasic(ciphers, query)
      }
      const ciphersMap = new Map()
      ciphers.forEach(c => ciphersMap.set(c.id, c))

      let searchResults = null
      const isQueryString = query != null && query.length > 1 && query.indexOf('>') === 0
      if (isQueryString) {
        try {
          searchResults = index.search(query.substr(1).trim())
        } catch { }
      } else {
        // tslint:disable-next-line
        const soWild = lunr.Query.wildcard.LEADING | lunr.Query.wildcard.TRAILING
        searchResults = index.query(q => {
          lunr.tokenizer(query).forEach(token => {
            const t = token.toString()
            q.term(t, { fields: ['name'], wildcard: soWild })
            q.term(t, { fields: ['subtitle'], wildcard: soWild })
            q.term(t, { fields: ['login.uris'], wildcard: soWild })
            q.term(t, {})
          })
        })
      }

      if (searchResults != null) {
        searchResults.forEach(r => {
          if (ciphersMap.has(r.ref)) {
            results.push(ciphersMap.get(r.ref))
          }
        })
      }
      return results
    },
    isSearchable (query) {
      const notSearchable = query == null || (this.index == null && query.length < this.searchableMinLength) ||
            (this.index != null && query.length < this.searchableMinLength && query.indexOf('>') !== 0)
      return !notSearchable
    },
    getIndexForSearch () {
      return this.index
    },
    searchCiphersBasic (ciphers, query, deleted = false) {
      query = query.trim().toLowerCase()
      return ciphers.filter(c => {
        if (deleted !== c.isDeleted) {
          return false
        }
        if (c.name != null && c.name.toLowerCase().includes(query)) {
          return true
        }
        if (query.length >= 8 && c.id.startsWith(query)) {
          return true
        }
        if (c.subTitle != null && c.subTitle.toLowerCase().includes(query)) {
          return true
        }
        if (c.login && c.login.uri != null && c.login.uri.toLowerCase().includes(query)) {
          return true
        }
        return false
      })
    },
    getSharedInvitations () {
      this.loading = true
      this.$axios.$get('cystack_platform/pm/sharing/invitations')
        .then(res => {
          this.sharedInvitations = res
          this.loading = false
        })
    },
    async acceptShareInvitation (cipher) {
      try {
        await this.$axios.$put(`cystack_platform/pm/sharing/invitations/${cipher.id}`, { status: 'accept' })
        this.notify(this.$t('data.notifications.accept_invitation_success'), 'success')
      } catch (e) {
        this.notify(this.$t('data.notifications.accept_invitation_failed'), 'warning')
      }
    },
    async rejectShareInvitation (cipher) {
      try {
        await this.$axios.$put(`cystack_platform/pm/sharing/invitations/${cipher.id}`, { status: 'reject' })
        this.notify(this.$t('data.notifications.accept_invitation_success'), 'success')
      } catch (e) {
        this.notify(this.$t('data.notifications.accept_invitation_failed'), 'warning')
      }
    },
    editShareType (cipher) {
      console.log(cipher)
    },
    async stopSharing (cipher) {
      try {
        let memberId = null
        if (cipher.user) {
          memberId = cipher.user.id
          delete cipher.user
        }
        const personalKey = await this.$cryptoService.getEncKey()
        const cipherEnc = await this.$cipherService.encrypt(cipher, personalKey)
        const data = new CipherRequest(cipherEnc)
        console.log(data)
        await this.$axios.$post(`cystack_platform/pm/sharing/${cipher.organizationId}/members/${memberId}/stop`, {
          folder: null,
          cipher: { ...data, id: cipher.id }
        })
        this.notify(this.$tc('data.notifications.update_success', 1, { type: this.$tc(`type.${CipherType[cipher.type]}`, 1) }), 'success')
      } catch (error) {
        this.notify(this.$tc('data.notifications.update_failed', 1, { type: this.$tc(`type.${CipherType[cipher.type]}`, 1) }), 'warning')
        console.log(error)
      }
    },
    async leaveShare (cipher) {
      try {
        await this.$axios.$post(`cystack_platform/pm/sharing/${cipher.organizationId}/leave`)
        this.notify(this.$tc('data.notifications.update_success', 1, { type: this.$tc(`type.${CipherType[cipher.type]}`, 1) }), 'success')
      } catch (error) {
        this.notify(this.$tc('data.notifications.update_failed', 1, { type: this.$tc(`type.${CipherType[cipher.type]}`, 1) }), 'warning')
        console.log(error)
      }
    },
    newShare () {
      this.$refs.shareCipher.openDialog({})
    }
  }
}
</script>
