<template>
  <div class="flex flex-col relative">
    <div class="flex-grow lg:px-28 pt-5 px-10 mb-20">
      <div class="flex items-center justify-between">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="localeRoute({name: 'passwords'})">
            {{ $t(`enum.${type}`) }}
          </el-breadcrumb-item>
        </el-breadcrumb>
        <div class="header-actions" />
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
import { CipherType } from '../../jslib/src/enums'
import TableCipher from '../../components/cipher/TableCipher'
export default {
  components: {
    AddEditCipher, TableCipher
  },
  props: {
    type: {
      type: String,
      default: null
    },
    deleted: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      cryptoService: null,
      data: {},
      filter: this.type ? c => c.type === CipherType[this.type] : null,
      searchText: '',
      CipherType
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
