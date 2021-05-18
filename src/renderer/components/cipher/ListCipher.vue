<template>
  <div class="flex flex-col flex-grow relative">
    <div class="flex-grow lg:px-28 py-10 px-10 mb-20">
      <div class="flex items-center justify-between mb-5">
        <div class="flex-grow">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="localeRoute({name: routeName})">
              {{ routeName !=='dashboard' ? $t(`enum.${type}`) : 'Folders' }}
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="header-actions">
          <el-dropdown trigger="click">
            <div class="text-sm text-black-600 font-semibold">
              Sắp xếp theo <i class="el-icon-caret-bottom el-icon--right" />
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="changeSort('name', 'asc')">Tên tăng dần</el-dropdown-item>
              <el-dropdown-item @click.native="changeSort('name', 'desc')">Tên giảm dần</el-dropdown-item>
              <el-dropdown-item @click.native="changeSort('revisionDate', 'asc')">Thời gian tăng dần</el-dropdown-item>
              <el-dropdown-item @click.native="changeSort('revisionDate', 'desc')">Thời gian giảm dần</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>

      <div v-if="routeName === 'dashboard' && folders"
           class="mb-5"
      >
        <client-only>
          <div class="grid grid-cols-4 md:grid-cols-4 xl:grid-cols-5 gap-6 ">
            <div v-for="item in folders"
                 :key="item.id"
                 class="px-4 py-6 flex items-center cursor-pointer rounded border border-[#E6E6E8]"
            >
              <img src="~/assets/images/icons/folderSolid.svg" alt="" class="mr-2">
              <div class="font-semibold">{{ item.name }} ({{ item.ciphersCount }})</div>
            </div>
          </div>
        </client-only>
      </div>
      <client-only>
        <el-table
          ref="multipleTable"
          :data="ciphers ? ciphers : []"
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
            <template slot="header" slot-scope="scope">
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
                    {{ scope.row.name }}
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
    <AddEditCipher ref="addEditCipherDialog" :type="type" />
    <div class="fixed bottom-[50px] right-[55px]">
      <button class="btn btn-fab rounded-full flex items-center justify-center" @click="addEdit({})">
        <i class="fas fa-plus text-[24px]" />
      </button>
    </div>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'
import orderBy from 'lodash/orderBy'
import AddEditCipher from '../../components/cipher/AddEditCipher'
import { CipherType } from '../../jslib/src/enums'
export default {
  components: {
    AddEditCipher
  },
  props: {
    type: {
      type: String,
      default: null
    },
    deleted: {
      type: Boolean,
      default: false
    },
    routeName: {
      type: String,
      default: 'passwords'
    }
  },
  data () {
    return {
      cryptoService: null,
      data: {},
      filter: this.type ? c => c.type === CipherType[this.type] : null,
      searchText: '',
      CipherType,
      multipleSelection: [],
      loading: false,
      orderField: 'name', // revisionDate
      orderDirection: 'asc'
    }
  },
  created () {
  },
  mounted () {
  },
  asyncComputed: {
    ciphers: {
      async get () {
        const deletedFilter = c => {
          return c.isDeleted === this.deleted
        }
        const result = await this.$searchService.searchCiphers(this.searchText, [this.filter, deletedFilter], null) || []
        return orderBy(result, [c => this.orderField === 'name' ? c.name.toLowerCase() : c.revisionDate], [this.orderDirection])
      },
      watch: ['$store.state.syncedCiphersToggle', 'deleted', 'searchText', 'filter', 'orderField', 'orderDirection']
    },
    folders: {
      async get () {
        let folders = await this.$folderService.getAllDecrypted() || []
        folders = folders.filter(f => f.id)
        folders.forEach(f => {
          const ciphers = this.ciphers && (this.ciphers.filter(c => c.folderId === f.id) || [])
          f.ciphersCount = ciphers.length
        })
        console.log(folders)
        return folders
      },
      watch: ['$store.state.syncedCiphersToggle', 'searchText', 'orderField', 'orderDirection', 'ciphers']
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
    }
  }
}
</script>
