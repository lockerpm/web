<template>
  <div class="flex flex-col flex-column-fluid relative">
    <NoCipher v-if="shouldRenderNoCipher" :type="type"
              @add-cipher="addEdit({})"
    />
    <div v-else class="flex-column-fluid lg:px-28 py-10 px-10 mb-20">
      <div class="flex items-center justify-between mb-5">
        <div class="flex-grow">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <template v-if="getRouteBaseName() === 'vault-folders-folderId'">
              <el-breadcrumb-item
                :to="localeRoute({name: 'vault'})"
              >
                {{ $t('sidebar.vault') }}
              </el-breadcrumb-item>
              <el-breadcrumb-item class="flex items-center">
                {{ folder.name }}
              </el-breadcrumb-item>
            </template>
            <template v-else-if="getRouteBaseName() === 'vault-tfolders-tfolderId'">
              <el-breadcrumb-item
                :to="localeRoute({name: 'vault'})"
              >
                {{ $t('sidebar.vault') }}
              </el-breadcrumb-item>
              <el-breadcrumb-item class="flex items-center">
                {{ collection.name }}
              </el-breadcrumb-item>
            </template>
            <template v-else-if="getRouteBaseName() ==='vault'">
              <span class="font-medium">Folders</span>
            </template>
            <template v-else-if="getRouteBaseName() ==='shares'">
              <span class="font-medium">Shares</span>
            </template>
            <template v-else-if="getRouteBaseName() ==='trash'">
              <span class="font-medium">Trash</span>
            </template>
            <template v-else>
              <el-breadcrumb-item
                :to="localeRoute({name: routeName})"
              >
                {{ $tc(`type.${type}`, 2) }}
              </el-breadcrumb-item>
            </template>
          </el-breadcrumb>
        </div>
        <div class="header-actions">
          <el-dropdown trigger="click">
            <div class="text-sm text-black-600 font-semibold">
              Sắp xếp theo <i class="el-icon-caret-bottom el-icon--right" />
            </div>
            <el-dropdown-menu slot="dropdown" class="w-[200px] ">
              <el-dropdown-item
                class="flex items-center justify-between"
                @click.native="changeSort('name', 'asc')"
              >
                <span>Tên tăng dần</span>
                <i v-if="orderString==='name_asc'" class="fa fa-check" />
              </el-dropdown-item>
              <el-dropdown-item
                class="flex items-center justify-between"
                @click.native="changeSort('name', 'desc')"
              >
                <span>Tên giảm dần</span>
                <i v-if="orderString==='name_desc'" class="fa fa-check" />
              </el-dropdown-item>
              <el-dropdown-item
                class="flex items-center justify-between"
                @click.native="changeSort('revisionDate', 'asc')"
              >
                <span>Thời gian tăng dần</span>
                <i v-if="orderString==='revisionDate_asc'" class="fa fa-check" />
              </el-dropdown-item>
              <el-dropdown-item
                class="flex items-center justify-between"
                @click.native="changeSort('revisionDate', 'desc')"
              >
                <span>Thời gian giảm dần</span>
                <i v-if="orderString==='revisionDate_desc'" class="fa fa-check" />
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div v-if="getRouteBaseName() === 'vault' && folders"
           class="mb-10"
      >
        <client-only>
          <div class="grid grid-cols-4 md:grid-cols-4 2xl:grid-cols-5 gap-6 ">
            <div v-for="item in folders"
                 :key="item.id"
                 class="px-4 py-6 flex items-center cursor-pointer rounded border border-[#E6E6E8] hover:border-primary"
                 :class="{'border-primary': selectedFolder.id === item.id}"
                 :title="item.name"
                 @click="selectedFolder = item"
                 @dblclick="routerFolder(item)"
                 @contextmenu.prevent="$refs.menu.open($event, item)"
            >
              <img src="~/assets/images/icons/folderSolid.svg" alt="" class="select-none mr-2">
              <div class="font-semibold break-all select-none">{{ item.name }} ({{ item.ciphersCount }})</div>
            </div>
            <component :is="context" ref="menu"
                       class="el-dropdown-menu"
                       @open="openContextFolder"
            >
              <template #default>
                <li class="el-dropdown-menu__item w-[200px]"
                    @click.prevent="addEditFolder(selectedFolder, false)"
                >
                  Đổi tên
                </li>
                <li class="el-dropdown-menu__item"
                    @click.prevent="deleteFolder(selectedFolder)"
                >
                  <span class="text-danger">Xóa</span>
                </li>
              </template>
            </component>
          </div>
        </client-only>
      </div>
      <div v-if="getRouteBaseName() === 'vault' && collections"
           class="mb-10"
      >
        <client-only>
          <template v-for="(value, key) in filteredCollection">
            <div class="mb-5 font-medium">
              {{ getTeam(teams, key).name }}
            </div>
            <div :key="key" class="grid grid-cols-4 md:grid-cols-4 2xl:grid-cols-5 gap-6 ">
              <div v-for="item in value"
                   :key="item.id"
                   class="px-4 py-6 cursor-pointer rounded border border-[#E6E6E8] hover:border-primary"
                   :class="{'border-primary': selectedFolder.id === item.id}"
                   :title="`${item.name} (${item.ciphersCount})`"
                   @click="selectedFolder = item"
                   @dblclick="routerCollection(item)"
                   @contextmenu.prevent="canManageItem(teams, item) ? $refs.menuTeam.open($event, item) : null"
              >
                <div class="flex items-center">
                  <img src="~/assets/images/icons/folderSolidShare.svg" alt="" class="select-none mr-2">
                  <div class="font-semibold truncate select-none">{{ item.name }} ({{ item.ciphersCount }})</div>
                </div>
              </div>
            </div>
          </template>
          <component :is="context" ref="menuTeam"
                     class="el-dropdown-menu"
                     @open="openContextTeamFolder"
          >
            <template #default>
              <li class="el-dropdown-menu__item w-[200px]"
                  @click.prevent="addEditTeamFolder(selectedFolder, false)"
              >
                Đổi tên
              </li>
              <li class="el-dropdown-menu__item w-[200px]"
                  @click.prevent="putTeamFolderUsers(selectedFolder)"
              >
                User Access
              </li>
              <li class="el-dropdown-menu__item w-[200px]"
                  @click.prevent="putTeamFolderGroups(selectedFolder)"
              >
                Group Access
              </li>
              <li class="el-dropdown-menu__item"
                  @click.prevent="deleteTeamFolder(selectedFolder)"
              >
                <span class="text-danger">Xóa</span>
              </li>
            </template>
          </component>
        </client-only>
      </div>
      <client-only>
        <div v-if="getRouteBaseName() === 'vault'"
             class="mb font-medium"
        >
          All items
        </div>
        <el-table
          ref="multipleTable"
          :data="ciphers || []"
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
            show-overflow-tooltip
          >
            <template slot="header">
              <div v-if="multipleSelection.length" class="flex items-center ">
                <div class="text-black mr-8">
                  {{ multipleSelection.length }} mục được chọn
                </div>
                <div v-if="deleted">
                  <button class="btn btn-default btn-xs"
                          @click="restoreCiphers(multipleSelection.map(e => e.id))"
                  >
                    Khôi phục
                  </button>
                  <button class="btn btn-default btn-xs !text-danger"
                          @click="deleteCiphers(multipleSelection.map(e => e.id))"
                  >
                    Xóa vĩnh viễn
                  </button>
                </div>
                <div v-else>
                  <button class="btn btn-default btn-xs"
                          @click="moveFolders(multipleSelection.map(e => e.id))"
                  >
                    Chuyển thư mục
                  </button>
                  <button class="btn btn-default btn-xs !text-danger"
                          @click="moveTrashCiphers(multipleSelection.map(e => e.id))"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            </template>
            <template slot-scope="scope">
              <div class="flex items-center">
                <div class="text-[34px] mr-3 flex-shrink-0"
                     :class="{'filter grayscale': scope.row.isDeleted}"
                >
                  <Vnodes :vnodes="getIconCipher(scope.row, 34)" />
                </div>
                <div class="flex flex-col">
                  <a class="text-black font-semibold truncate flex items-center"
                     :class="{'opacity-80': scope.row.isDeleted}"
                     @click="routerCipher(scope.row, addEdit)"
                  >
                    {{ scope.row.name }}
                    <img v-if="scope.row.organizationId" src="~/assets/images/icons/shares.svg" alt="" class="inline-block ml-2">
                  </a>
                  <div>
                    {{ scope.row.subTitle }}
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="right"
            label="Sở hữu"
          >
            <template slot-scope="scope">
              <span>{{ getTeam(teams, scope.row.organizationId).name || 'Cá nhân' }}</span>
            </template>
          </el-table-column>
          <el-table-column
            width="200"
            align="right"
            label="Cập nhật lúc"
          >
            <template slot-scope="scope">
              {{ $moment(scope.row.revisionDate).fromNow() }}
            </template>
          </el-table-column>
          <el-table-column
            label=""
            align="right"
            width="200"
          >
            <template slot-scope="scope">
              <div class="col-actions">
                <button v-if="scope.row.login.canLaunch"
                        class="btn btn-icon btn-xs hover:bg-black-400"
                        @click="openNewTab(scope.row.login.uri)"
                >
                  <i class="fas fa-external-link-square-alt" />
                </button>
                <el-dropdown v-if="canManageItem(teams, scope.row)" trigger="click" :hide-on-click="false">
                  <button class="btn btn-icon btn-xs hover:bg-black-400">
                    <i class="fas fa-ellipsis-h" />
                  </button>
                  <el-dropdown-menu slot="dropdown">
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
                        v-if="!scope.row.organizationId"
                        @click.native="shareItem(scope.row)"
                      >
                        {{ $t('common.share') }}
                      </el-dropdown-item>
                      <el-dropdown-item @click.native="moveFolders([scope.row.id])">
                        {{ $t('common.move_folder') }}
                      </el-dropdown-item>
                      <el-dropdown-item
                        v-if="canManageTeamFolder"
                        divided @click.native="shareItem(scope.row)"
                      >
                        {{ $t('common.collections') }}
                      </el-dropdown-item>
                      <el-dropdown-item divided @click.native="moveTrashCiphers([scope.row.id])">
                        <span class="text-danger">{{ $t('common.delete') }}</span>
                      </el-dropdown-item>
                    </template>
                    <template v-else>
                      <el-dropdown-item divided @click.native="restoreCiphers([scope.row.id])">
                        {{ $t('common.restore') }}
                      </el-dropdown-item>
                      <el-dropdown-item @click.native="deleteCiphers([scope.row.id])">
                        <span class="text-danger">{{ $t('common.permanently_delete') }}</span>
                      </el-dropdown-item>
                    </template>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </client-only>
    </div>
    <AddEditCipher ref="addEditCipherDialog" :route-name="routeName" :type="type" />
    <AddEditFolder ref="addEditFolder" @done="getSyncData" />
    <AddEditTeamFolder ref="addEditTeamFolder" @done="getSyncData" />
    <AddEditTeamFolderUsers ref="addEditTeamFolderUsers" @done="getSyncData" />
    <AddEditTeamFolderGroups ref="addEditTeamFolderGroups" @done="getSyncData" />
    <ShareCipher ref="shareCipher" />
    <MoveFolder ref="moveFolder" @reset-selection="multipleSelection = []" />
    <div class="fixed bottom-[50px] right-[55px]">
      <button v-if="getRouteBaseName() === 'vault-tfolders-tfolderId' && !collection.readOnly"
              class="btn btn-fab btn-primary rounded-full flex items-center justify-center"
              @click="addEdit({
                organizationId: collection.organizationId
              })"
      >
        <i class="fas fa-plus text-[24px]" />
      </button>
      <button v-else-if="!['vault', 'shares'].includes(routeName)" class="btn btn-fab rounded-full flex items-center justify-center"
              @click="addEdit({})"
      >
        <i class="fas fa-plus text-[24px]" />
      </button>
      <el-popover
        v-else
        placement="right-end"
        width="200"
        trigger="click"
        popper-class="!p-0"
      >
        <div class="text-black">
          <div class="px-5 pt-5 text-xs">Tạo</div>
          <ul class="el-dropdown-menu !static !border-0 !shadow-none">
            <li v-if="getRouteBaseName() ==='vault'" class="el-dropdown-menu__item font-semibold !text-black"
                @click="addEditFolder({}, true)"
            >
              Tạo thư mục
            </li>
            <li v-if="getRouteBaseName() ==='vault' && canManageTeamFolder"
                class="el-dropdown-menu__item font-semibold !text-black"
                @click="addEditTeamFolder({})"
            >
              Tạo thư mục Teams
            </li>
            <li class="el-dropdown-menu__item font-semibold !text-black"
                @click="addEdit({})"
            >
              Tạo mục
            </li>
          </ul>
        </div>
        <button slot="reference"
                class="btn btn-fab rounded-full flex items-center justify-center btn-primary"
        >
          <i class="fas fa-plus text-[24px]" />
        </button>
      </el-popover>
    </div>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'
import orderBy from 'lodash/orderBy'
import find from 'lodash/find'
import groupBy from 'lodash/groupBy'
import AddEditCipher from '../../components/cipher/AddEditCipher'
import AddEditFolder from '../folder/AddEditFolder'
import AddEditTeamFolder from '../folder/AddEditTeamFolder'
import AddEditTeamFolderUsers from '../folder/AddEditTeamFolderUsers'
import AddEditTeamFolderGroups from '../folder/AddEditTeamFolderGroups'
import ShareCipher from '../../components/cipher/ShareCipher'
import MoveFolder from '../folder/MoveFolder'
import NoCipher from '../../components/cipher/NoCipher'
import { CipherType } from '../../jslib/src/enums'
import Vnodes from '../../components/Vnodes'
export default {
  components: {
    AddEditCipher,
    AddEditFolder,
    AddEditTeamFolder,
    ShareCipher,
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
      publicKey: ''
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
        return find(this.collections, e => e.id === this.$route.params.tfolderId) || {}
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
      if (this.getRouteBaseName() === 'shares') {
        return this.collections && !this.collections.length
      }
      if (this.getRouteBaseName() === 'vault-folders-folderId') {
        return false
      }
      if (this.getRouteBaseName() === 'vault-tfolders-tfolderId') {
        return false
      }
      return !haveCipher && !this.searchText
    },
    shouldRenderShare () {
      return (this.getRouteBaseName() === 'shares')
    },
    canManageTeamFolder () {
      return this.teams.some(e => ['owner', 'admin'].includes(e.role))
    }
  },
  created () {
  },
  mounted () {
    this.context = 'VueContext'
  },
  asyncComputed: {
    ciphers: {
      async get () {
        const deletedFilter = c => {
          return c.isDeleted === this.deleted
        }
        const result = await this.$searchService.searchCiphers(this.searchText, [this.filter, deletedFilter], null) || []

        return orderBy(result, [c => this.orderField === 'name' ? (c.name && c.name.toLowerCase()) : c.revisionDate], [this.orderDirection]) || []
      },
      watch: ['$store.state.syncedCiphersToggle', 'deleted', 'searchText', 'filter', 'orderField', 'orderDirection']
    },
    folders: {
      async get () {
        let folders = await this.$folderService.getAllDecrypted() || []
        folders = folders.filter(f => f.id)
        folders.forEach(f => {
          const ciphers = this.ciphers && (this.ciphers.filter(c => c.folderId === f.id) || [])
          f.ciphersCount = ciphers && ciphers.length
        })
        return folders
      },
      watch: ['searchText', 'orderField', 'orderDirection', 'ciphers']
    },
    collections: {
      async get () {
        let collections = await this.$collectionService.getAllDecrypted() || []
        collections = collections.filter(f => f.id)
        collections.forEach(f => {
          const ciphers = this.ciphers && (this.ciphers.filter(c => c.collectionIds.includes(f.id)) || [])
          f.ciphersCount = ciphers && ciphers.length
        })
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
      this.$router.push(this.localeRoute({
        name: 'vault-tfolders-tfolderId',
        params: { tfolderId: item.id }
      }))
    },
    openContextFolder (event, data) {
      this.selectedFolder = data
    },
    openContextTeamFolder (event, data) {
      this.selectedFolder = data
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
    putTeamFolderGroups (folder) {
      this.$refs.addEditTeamFolderGroups.openDialog(folder)
    },
    putTeamFolderUsers (folder) {
      this.$refs.addEditTeamFolderUsers.openDialog(folder)
    }
  }
}
</script>
