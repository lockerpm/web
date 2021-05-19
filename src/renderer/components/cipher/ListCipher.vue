<template>
  <div class="flex flex-col flex-grow relative">
    <div class="flex-grow lg:px-28 py-10 px-10 mb-20">
      <div class="flex items-center justify-between mb-5">
        <div class="flex-grow">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <template v-if="getRouteBaseName() === 'dashboard-folders-folderId'">
              <el-breadcrumb-item
                :to="localeRoute({name: 'dashboard'})"
              >
                {{ $t('sidebar.dashboard') }}
              </el-breadcrumb-item>
              <el-breadcrumb-item class="flex items-center">
                {{ folder.name }}
              </el-breadcrumb-item>
            </template>
            <template v-else-if="getRouteBaseName() ==='dashboard'">
              Folders
            </template>
            <template v-else>
              <el-breadcrumb-item
                :to="localeRoute({name: routeName})"
              >
                {{ $t(`enum.${type}`) }}
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

      <div v-if="getRouteBaseName() === 'dashboard' && folders"
           class="mb-5"
      >
        <client-only>
          <div class="grid grid-cols-4 md:grid-cols-4 xl:grid-cols-5 gap-6 ">
            <div v-for="item in folders"
                 :key="item.id"
                 class="px-4 py-6 flex items-center cursor-pointer rounded border border-[#E6E6E8] hover:border-primary"
                 :class="{'border-primary': selectedFolder.id === item.id}"
                 @click="selectedFolder = item"
                 @dblclick="routerFolder(item)"
                 @contextmenu.prevent="$refs.menu.open($event, item)"
            >
              <img src="~/assets/images/icons/folderSolid.svg" alt="" class="mr-2">
              <div class="font-semibold">{{ item.name }} ({{ item.ciphersCount }})</div>
            </div>
            <component :is="context" ref="menu"
                       class="el-dropdown-menu" @close="closeContextEvent"
                       @open="openContextEvent"
            >
              <template #default>
                <li class="el-dropdown-menu__item w-[200px]"
                    @click.prevent="addEditFolder(selectedFolder)"
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
      <client-only>
        <el-table
          ref="multipleTable"
          :data="filteredCiphers || []"
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
                <div class="text-[34px] mr-3" v-html="getIconCipher(scope.row, 34)" />
                <div>
                  <a class="text-black font-semibold" @click="routerCipher(scope.row, addEdit)">
                    {{ scope.row.name }} <i v-if="scope.row.organizationId" class="fa fa-share-alt" />
                  </a>
                  <div>
                    {{ scope.row.subTitle }}
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label=""
            width="200"
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

                <el-dropdown trigger="click" :hide-on-click="false">
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
                      <el-dropdown-item>
                        {{ $t('common.share') }}
                      </el-dropdown-item>
                      <el-dropdown-item @click.native="moveFolder(scope.row)">
                        {{ $t('common.move_folder') }}
                      </el-dropdown-item>
                      <el-dropdown-item divided @click.native="moveTrashCipher(scope.row)">
                        <span class="text-danger">{{ $t('common.delete') }}</span>
                      </el-dropdown-item>
                    </template>
                    <template v-else>
                      <el-dropdown-item divided @click.native="restoreCipher(scope.row)">
                        {{ $t('common.restore') }}
                      </el-dropdown-item>
                      <el-dropdown-item @click.native="deleteCipher(scope.row)">
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
    <AddEditCipher ref="addEditCipherDialog" :route-name="routeName" />
    <AddEditFolder ref="addEditFolder" />
    <div class="fixed bottom-[50px] right-[55px]">
      <button v-if="routeName !== 'dashboard'" class="btn btn-fab rounded-full flex items-center justify-center"
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
            <li class="el-dropdown-menu__item font-semibold !text-black"
                @click="addEditFolder({})"
            >
              Tạo thư mục
            </li>
            <li class="el-dropdown-menu__item font-semibold !text-black"
                @click="addEdit({})"
            >
              Tạo danh mục
            </li>
          </ul>
        </div>
        <button slot="reference"
                class="btn btn-fab rounded-full flex items-center justify-center"
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
import AddEditCipher from '../../components/cipher/AddEditCipher'
import AddEditFolder from '../../components/cipher/AddEditFolder'
import { CipherType } from '../../jslib/src/enums'
export default {
  components: {
    AddEditCipher,
    AddEditFolder,
    VueContext: () => import('../../plugins/vue-context')
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
      searchText: '',
      CipherType,
      multipleSelection: [],
      loading: false,
      orderField: 'name', // revisionDate
      orderDirection: 'asc',
      selectedFolder: {},
      context: '',
      openedContextRow: null
    }
  },
  computed: {
    folder () {
      if (this.folders) {
        return find(this.folders, e => e.id === this.$route.params.folderId) || {}
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
      case 'dashboard':
        return 'Login'
      default:
        return 'Login'
      }
    },
    filteredCiphers () {
      if (this.getRouteBaseName() === 'dashboard' && this.ciphers) {
        return this.ciphers.filter(e => !e.folderId)
      }
      return this.ciphers || []
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

        return orderBy(result, [c => this.orderField === 'name' ? c.name.toLowerCase() : c.revisionDate], [this.orderDirection]) || []
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
    }
  },
  methods: {
    addEdit (cipher) {
      this.$refs.addEditCipherDialog.openDialog(cloneDeep(cipher))
    },
    deleteCipher (cipher) {
      this.$refs.addEditCipherDialog.deleteCipher(cipher)
    },
    restoreCipher (cipher) {
      this.$refs.addEditCipherDialog.restoreCipher(cloneDeep(cipher))
    },
    moveTrashCipher (cipher) {
      this.$refs.addEditCipherDialog.moveTrashCipher(cloneDeep(cipher))
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    cloneCipher (cipher) {
      const _cipher = cloneDeep(cipher)
      delete _cipher.id
      this.$refs.addEditCipherDialog.openDialog(_cipher, 'full')
    },
    moveFolder (cipher) {
      this.$refs.addEditCipherDialog.openDialog(cloneDeep(cipher), 'moveFolder')
    },
    async deleteCiphers (ids = []) {
      this.$confirm(this.$tc('data.notifications.delete_selected_desc', ids.length), this.$t('common.warning'), {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(async () => {
        try {
          this.loading = true
          await this.$axios.$put('cystack_platform/pm/ciphers/permanent_delete', { ids })
          this.notify(this.$tc('data.notifications.delete_success', ids.length, { type: this.$tc('type.0', ids.length) }), 'success')
          this.getSyncData()
        } catch (e) {
          this.notify(this.$tc('data.notifications.delete_failed', ids.length, { type: this.$tc('type.0', ids.length) }), 'warning')
          console.log(e)
        } finally {
          this.loading = false
        }
      }).catch(() => {

      })
    },
    async restoreCiphers (ids = []) {
      this.$confirm(this.$tc('data.notifications.restore_selected_desc', ids.length), this.$t('common.warning'), {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(async () => {
        try {
          this.loading = true
          await this.$axios.$put('cystack_platform/pm/ciphers/restore', { ids })
          this.notify(this.$tc('data.notifications.restore_success', ids.length, { type: this.$tc('type.0', ids.length) }), 'success')
          this.getSyncData()
        } catch (e) {
          this.notify(this.$tc('data.notifications.restore_failed', ids.length, { type: this.$tc('type.0', ids.length) }), 'warning')
          console.log(e)
        } finally {
          this.loading = false
        }
      }).catch(() => {

      })
    },
    async moveTrashCiphers (ids = []) {
      this.$confirm(this.$tc('data.notifications.trash_selected_desc', ids.length, { count: ids.length }), this.$t('common.warning'), {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(async () => {
        try {
          this.loading = true
          await this.$axios.$put('cystack_platform/pm/ciphers/delete', { ids })
          this.notify(this.$tc('data.notifications.trash_success', ids.length, { type: this.$tc('type.0', ids.length) }), 'success')
          this.getSyncData()
        } catch (e) {
          this.notify(this.$tc('data.notifications.trash_failed', ids.length, { type: this.$tc('type.0', ids.length) }), 'warning')
          console.log(e)
        } finally {
          this.loading = false
        }
      }).catch(() => {

      })
    },
    async moveFolders (ids = []) {
    },
    changeSort (orderField, orderDirection) {
      this.orderField = orderField
      this.orderDirection = orderDirection
    },
    routerFolder (item) {
      this.$router.push(this.localeRoute({
        name: 'dashboard-folders-folderId',
        params: { folderId: item.id }
      }))
    },
    closeContextEvent () {
      this.openedContextRow = null
    },
    openContextEvent (event, data) {
      this.selectedFolder = data
    },
    addEditFolder (folder) {
      this.$refs.addEditFolder.openDialog(folder)
    },
    deleteFolder (folder) {
      this.$refs.addEditFolder.deleteFolder(folder)
    }
  }
}
</script>
