<template>
  <div class="flex flex-col relative">
    <div class="flex-grow lg:px-28 pt-5 px-10 mb-20">
      <div class="flex items-center justify-between">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="localeRoute({name: 'passwords'})">
            Passwords
          </el-breadcrumb-item>
        </el-breadcrumb>
        <div class="header-actions">
          <button class="btn btn-icon btn-xs btn-action"
                  @click="addEdit"
          >
            <i class="fa fa-pen" />
          </button>
          <button class="btn btn-icon btn-xs btn-action">
            <i class="fas fa-share-square" />
          </button>
          <el-dropdown trigger="click" :hide-on-click="false">
            <button class="btn btn-icon btn-xs btn-action">
              <i class="fas fa-ellipsis-h" />
            </button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                {{ $t('common.move_folder') }}
              </el-dropdown-item>
              <el-dropdown-item>
                <span class="text-danger">{{ $t('common.delete') }}</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <client-only>
        <TableCipher :ciphers="ciphers ? ciphers : []" />
      </client-only>
    </div>
    <AddEditCipher ref="addEditCipherDialog" />
  </div>
</template>

<script>
import AddEditCipher from '../../components/cipher/AddEditCipher'
import { CipherType } from '../../jslib/src/enums/cipherType'
import TableCipher from '../../components/cipher/TableCipher'
export default {
  components: {
    AddEditCipher, TableCipher
  },
  middleware: 'LoggedIn',
  data () {
    return {
      cryptoService: null,
      data: {},
      deleted: false,
      filter: c => c.type === CipherType.Login,
      searchText: ''
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
        return await this.$searchService.searchCiphers(this.searchText, [this.filter, deletedFilter], null) || []
      },
      watch: ['$store.state.syncedCiphersToggle', 'deleted', 'searchText', 'filter']
    }
  },
  methods: {
    addEdit (item) {
      this.$refs.addEditCipherDialog.openDialog(item)
    }
  }
}
</script>
