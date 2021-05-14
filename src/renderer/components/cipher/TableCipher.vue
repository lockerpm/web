<template>
  <client-only>
    <el-table
      ref="multipleTable"
      :data="ciphers ? ciphers : []"
      style="width: 100%"
      row-class-name="hover-table-row"
    >
      <el-table-column
        type="selection"
        width="55"
      />
      <el-table-column
        label=""
      >
        <template slot-scope="scope">
          <div class="flex items-center">
            <div class="text-[34px] mr-3" v-html="getIconCipher(scope.row, 34)" />
            <div>
              <nuxt-link :to="localeRoute({name: 'passwords-id', params: {id: scope.row.id}})">
                <a class="text-black font-semibold">
                  {{ scope.row.name }}
                </a>
              </nuxt-link>
              <div>
                {{ scope.row.subTitle }}
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label=""
      >
        <template slot-scope="scope">
          {{ $moment(scope.row.revisionDate).fromNow() }}
        </template>
      </el-table-column>
      <el-table-column
        label=""
        align="right"
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
                <el-dropdown-item>
                  {{ $t('common.share') }}
                </el-dropdown-item>
                <el-dropdown-item>
                  {{ $t('common.move_folder') }}
                </el-dropdown-item>
                <el-dropdown-item>
                  <span class="text-danger">{{ $t('common.delete') }}</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </client-only>
</template>

<script>
export default {
  props: {
    ciphers: {
      type: Array,
      default () {
        return []
      }
    }
  }
}
</script>
