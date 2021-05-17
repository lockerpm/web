<template>
  <div>
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
          label=""
        >
          <template slot="header" slot-scope="scope">
            <div v-if="multipleSelection.length" class="flex items-center ">
              <div class="text-black mr-8">
                {{ multipleSelection.length }} mục được chọn
              </div>
              <div>
                <button class="btn btn-default btn-xs">
                  Chuyển thư mục
                </button>
                <button class="btn btn-default btn-xs !text-danger">
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

              <button class="btn btn-icon btn-xs hover:bg-black-400"
                      @click="addEdit(scope.row)"
              >
                <i class="fas fa-pen" />
              </button>

              <el-dropdown trigger="click" :hide-on-click="false">
                <button class="btn btn-icon btn-xs hover:bg-black-400">
                  <i class="fas fa-ellipsis-h" />
                </button>
                <el-dropdown-menu slot="dropdown">
                  <template v-if="!scope.row.isDeleted && scope.row.type === CipherType.Login">
                    <el-dropdown-item
                      v-clipboard:copy="scope.row.login.username"
                      v-clipboard:success="clipboardSuccessHandler"
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
                    >
                      {{ $t('common.copy') }} {{ $t('common.note') }}
                    </el-dropdown-item>
                  </template>
                  <template v-if="!scope.row.isDeleted">
                    <el-dropdown-item>
                      {{ $t('common.clone') }}
                    </el-dropdown-item>
                    <el-dropdown-item>
                      {{ $t('common.share') }}
                    </el-dropdown-item>
                    <el-dropdown-item>
                      {{ $t('common.move_folder') }}
                    </el-dropdown-item>
                    <el-dropdown-item @click.native="moveTrashCipher(scope.row)">
                      <span class="text-danger">{{ $t('common.delete') }}</span>
                    </el-dropdown-item>
                  </template>
                  <template v-else>
                    <el-dropdown-item @click.native="restoreCipher(scope.row)">
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
    <AddEditCipher ref="addEditCipherDialog" />
  </div>
</template>

<script>
import AddEditCipher from '../../components/cipher/AddEditCipher'
import { CipherType } from '../../jslib/src/enums'
import { CipherMixin } from '../../plugins/cipherMixin'
export default {
  components: { AddEditCipher },
  mixins: [CipherMixin],
  props: {
    type: {
      type: String,
      default: 'Login'
    },
    ciphers: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      CipherType,
      multipleSelection: []
    }
  },
  methods: {
    addEdit (cipher) {
      this.$refs.addEditCipherDialog.openDialog(cipher)
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    }
  }
}
</script>
