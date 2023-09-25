<template>
  <div v-loading="loading" class="flex flex-col flex-column-fluid relative">
    <!-- Navigation Menu -->
    <navigation-menu />
    <!-- Navigation Menu end -->

    <!-- List Ciphers, Folders, ... -->
    <div
      v-if="!shouldRenderNoCipher"
      class="flex-column-fluid lg:px-28 py-10 md:px-10 px-4 mb-20"
    >
      <!-- Overview -->
      <list-header
        :route-name="routeName"
        :ciphers="ciphers"
        :folders="folders"
        :collections="collections"
        :organizations="organizations"
        :add-edit="addEdit"
        :add-edit-folder="addEditFolder"
        :view-folder="viewFolder"
        :toggle-view-folder="toggleViewFolder"
      />
      <!-- Overview end -->

      <div
        v-if="!viewFolder"
        class="flex items-center justify-end content-end mb-5"
      >
        <!-- Sort menu -->
        <sort-menu :change-sort="changeSort" :order-string="orderString" />
        <!-- Sort menu end -->
      </div>

      <!-- List Folders -->
      <div
        v-if="
          getRouteBaseName() === 'vault' &&
            (folders || collections) &&
            viewFolder
        "
        class="mb-10"
      >
        <list-folder-items
          :folders="folders"
          :collections="collections"
          :organizations="organizations"
          :add-edit-folder="addEditFolder"
          :delete-folder="deleteFolder"
        />
      </div>
      <!-- List Folder end -->

      <!-- List Ciphers -->
      <client-only v-if="!viewFolder">
        <list-cipher-items
          ref="listCipherItems"
          :deleted="deleted"
          :ciphers="ciphers"
          :organizations="organizations"
          :restore-ciphers="restoreCiphers"
          :delete-ciphers="deleteCiphers"
          :move-trash-ciphers="moveTrashCiphers"
          :add-edit="addEdit"
          :clone-cipher="cloneCipher"
        />
      </client-only>
      <!-- List Ciphers end -->
    </div>

    <!-- No cipher -->
    <NoCipher
      v-else-if="!$store.state.syncing"
      :type="type"
      @add-cipher="handleAddButton"
    />
    <!-- No cipher end -->

    <AddEditCipher
      ref="addEditCipherDialog"
      :type="selectedType"
      :organizations="organizations"
      @reset-selection="resetSelection()"
      @trashed-cipher="resetSelection()"
    />

    <AddEditFolder ref="addEditFolder" :organizations="organizations" />
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'
import orderBy from 'lodash/orderBy'
import AddEditCipher from '../../components/cipher/AddEditCipher'
import AddEditFolder from '../folder/AddEditFolder'
import NoCipher from '../../components/cipher/NoCipher'
import { CipherType } from '../../jslib/src/enums'
import { FieldType } from '../../jslib/src/enums/fieldType'
import NavigationMenu from './list-cipher-components/NavigationMenu.vue'
import ListHeader from './list-cipher-components/ListHeader.vue'
import SortMenu from './list-cipher-components/SortMenu.vue'
import ListFolderItems from './list-cipher-components/ListFolderItems.vue'
import ListCipherItems from './list-cipher-components/ListCipherItems.vue'

export default {
  components: {
    AddEditCipher,
    AddEditFolder,
    NoCipher,
    // eslint-disable-next-line vue/no-unused-components
    VueContext: () => import('../../plugins/vue-context'),
    NavigationMenu,
    ListHeader,
    SortMenu,
    ListFolderItems,
    ListCipherItems
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
      loading: true,
      orderField: 'revisionDate', // revisionDate
      orderDirection: 'desc',
      context: '',
      dataRendered: [],
      renderIndex: 0,
      viewFolder: false,
      selectedType: null
    }
  },
  computed: {
    type () {
      const cipherMap = Object.values(this.cipherMapping).find(
        m => m.routeName === this.routeName
      )
      if (cipherMap) {
        return cipherMap.friendlyName || cipherMap.type
      }
      switch (this.routeName) {
      case 'vault':
        return 'Vault'
      case 'trash':
        return 'Trash'
      default:
        return null
      }
    },
    orderString () {
      return `${this.orderField}_${this.orderDirection}`
    },
    shouldRenderNoCipher () {
      const haveCipher = this.ciphers?.length
      if (this.getRouteBaseName() === 'vault') {
        return this.folders && !this.folders.length && !haveCipher
      }
      if (this.getRouteBaseName() === 'vault-folders-folderId') {
        return false
      }
      if (this.getRouteBaseName() === 'vault-tfolders-tfolderId') {
        return false
      }
      return !haveCipher && !this.searchText
    }
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
  },
  asyncComputed: {
    ciphers: {
      async get () {
        // this.loading = true
        const deletedFilter = c => {
          return c.isDeleted === this.deleted
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

        // revert some cipher types back to note
        const revertingCiphers = result.filter(cipher =>
          Object.values(this.cipherMapping)
            .filter(m => m.revertToNote)
            .map(m => m.type)
            .includes(cipher.type)
        )
        revertingCiphers.forEach(cipher => {
          try {
            const content = JSON.parse(cipher.notes)
            cipher.type = CipherType.SecureNote
            cipher.secureNote.type = 0
            cipher.notes = content.notes
            function camelCaseToWords (str) {
              if (!str) {
                return ''
              }
              const newStr = str
                .replace(/([a-z])([A-Z])/g, '$1 $2')
                .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
                .replace(/(\b[A-Z]{2,}\b)(?=[a-z])/g, '$1 ')
                .toLowerCase()
              return newStr ? newStr[0].toUpperCase() + newStr.slice(1) : newStr
            }
            const newFields = Object.keys(content)
              .filter(k => k !== 'notes')
              .map(k => ({
                name: camelCaseToWords(k),
                value: content[k],
                type: FieldType.Text
              }))
            cipher.fields = [...(cipher.fields || []), ...newFields]
            this.handleEditCipher(cipher, { silent: true })
          } catch (e) {
            console.log(e)
          }
        })

        // remove hidden ciphers
        result = result.filter(cipher =>
          Object.values(this.cipherMapping)
            .filter(m => !m.hideFromCipherList)
            .map(m => m.type)
            .includes(cipher.type)
        )
        result = result.map(item => {
          const i = this.parseNotesOfNewTypes(item)
          i.checked = false
          return i
        })
        if (this.orderField && this.orderDirection) {
          result =
            orderBy(
              result,
              [
                c =>
                  this.orderField === 'name'
                    ? c.name && c.name.toLowerCase()
                    : c.revisionDate
              ],
              [this.orderDirection]
            ) || []
        }
        // this.dataRendered = result.slice(0, 50)
        // this.renderIndex = 50
        return result
      },
      watch: [
        '$store.state.syncedCiphersToggle',
        'deleted',
        'searchText',
        'filter',
        'orderField',
        'orderDirection'
      ]
    },
    organizations: {
      async get () {
        const result = await this.$userService.getAllOrganizations()
        return result
      },
      watch: ['$store.state.syncedCiphersToggle']
    },
    folders: {
      async get () {
        let folders = []
        try {
          folders = (await this.$folderService.getAllDecrypted()) || []
        } catch (error) {}
        folders = folders.filter(f => f.id)
        folders.forEach(f => {
          const ciphers = this.ciphers
            ? this.ciphers.filter(c => c.folderId === f.id)
            : []
          f.ciphersCount = ciphers && ciphers.length
          f.ciphers = ciphers
        })
        return folders
      },
      watch: ['searchText', 'orderField', 'orderDirection', 'ciphers']
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
        collections.forEach(f => {
          const ciphers =
            this.ciphers &&
            (this.ciphers.filter(c => c.collectionIds.includes(f.id)) || [])
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
    addEdit (cipher, type) {
      this.selectedType = type
      this.$refs.addEditCipherDialog.openDialog(cloneDeep(cipher))
    },
    toggleViewFolder () {
      this.viewFolder = !this.viewFolder
    },
    handleAddButton () {
      this.addEdit({}, this.type)
    },
    cloneCipher (cipher) {
      const _cipher = cloneDeep(cipher)
      delete _cipher.id
      this.$refs.addEditCipherDialog.openDialog(_cipher, true)
    },
    deleteCiphers (ids) {
      this.$refs.addEditCipherDialog.deleteCiphers(ids)
    },
    restoreCiphers (ids) {
      this.$refs.addEditCipherDialog.restoreCiphers(ids)
    },
    moveTrashCiphers (cs) {
      this.$refs.addEditCipherDialog.moveTrashCiphers(cs, this.organizations)
    },
    changeSort (orderField, orderDirection) {
      this.orderField = orderField
      this.orderDirection = orderDirection
    },
    addEditFolder (folder, shouldRedirect = false) {
      this.$refs.addEditFolder.openDialog(folder, shouldRedirect)
    },
    deleteFolder (folder) {
      this.$refs.addEditFolder.deleteFolder(folder)
    },
    resetSelection () {
      this.$refs.listCipherItems.resetSelection()
    }
  }
}
</script>
<style>
.scroller {
  height: 100%;
}

.user {
  height: 32%;
  padding: 0 12px;
  display: flex;
  align-items: center;
}
.vue-recycle-scroller__slot,
.vue-recycle-scroller__item-view {
  display: flex;
  align-items: center;
  width: 100%;
}
.vue-recycle-scroller__item-view {
  @apply border-t-[1px] border-black-400 pt-2 mt-2;
}
.th,
.td {
  flex: 1;
}
.vue-recycle-scroller__slot .th:first-child,
.vue-recycle-scroller__item-view .td:first-child {
  @apply truncate;
  flex: 2;
}
.vue-recycle-scroller__slot .th:nth-child(2),
.vue-recycle-scroller__item-view .td:nth-child(2) {
  margin-left: 40px;
}
.vue-recycle-scroller__item-view .td .items-center .mr-4 .el-checkbox {
  visibility: hidden;
}
.vue-recycle-scroller__item-view:hover .td .items-center .mr-4 .el-checkbox {
  visibility: visible !important;
}
.vue-recycle-scroller__slot .th .self-center .el-checkbox {
  visibility: hidden;
}
.vue-recycle-scroller__slot:hover .th .self-center .el-checkbox {
  visibility: visible !important;
}
.th:last-child {
  text-align: right;
}
</style>
