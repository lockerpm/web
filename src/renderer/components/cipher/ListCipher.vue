<template>
  <div class="flex flex-col flex-grow relative">
    <div class="flex-grow lg:px-28 py-10 px-10 mb-20">
      <div class="flex items-center justify-between">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="localeRoute({name: 'passwords'})">
            {{ $t(`enum.${type}`) }}
          </el-breadcrumb-item>
        </el-breadcrumb>
        <div class="header-actions">
          <el-dropdown trigger="click">
            <div class="text-sm text-black-600 font-semibold">
              Sắp xếp theo <i class="el-icon-caret-bottom el-icon--right" />
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>Tên</el-dropdown-item>
              <el-dropdown-item>Thời gian cập nhật</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <client-only>
        <TableCipher :ciphers="ciphers ? ciphers : []" :type="type" />
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
