<template>
  <div class="header-actions">
    <div class="flex">
      <el-dropdown trigger="click" class="self-center">
        <div class="text-sm text-black-600 font-semibold">
          {{ $t('data.ciphers.sort_by') }}
          <i class="el-icon-caret-bottom el-icon--right" />
        </div>
        <el-dropdown-menu slot="dropdown" class="w-[200px]">
          <el-dropdown-item
            v-if="isSearching"
            class="flex items-center justify-between"
            @click.native="changeSort('', '')"
          >
            <span>{{ $t('data.ciphers.most_relevant') }}</span>
            <i v-if="orderString === '_'" class="fa fa-check" />
          </el-dropdown-item>
          <el-dropdown-item
            class="flex items-center justify-between"
            @click.native="changeSort('name', 'asc')"
          >
            <span>{{ $t('data.ciphers.name') }}
              {{ $t('data.ciphers.ascending') }}</span>
            <i v-if="orderString === 'name_asc'" class="fa fa-check" />
          </el-dropdown-item>
          <el-dropdown-item
            class="flex items-center justify-between"
            @click.native="changeSort('name', 'desc')"
          >
            <span>{{ $t('data.ciphers.name') }}
              {{ $t('data.ciphers.descending') }}</span>
            <i v-if="orderString === 'name_desc'" class="fa fa-check" />
          </el-dropdown-item>
          <el-dropdown-item
            class="flex items-center justify-between"
            @click.native="changeSort('revisionDate', 'asc')"
          >
            <span>{{ $t('data.ciphers.time') }}
              {{ $t('data.ciphers.ascending') }}</span>
            <i v-if="orderString === 'revisionDate_asc'" class="fa fa-check" />
          </el-dropdown-item>
          <el-dropdown-item
            class="flex items-center justify-between"
            @click.native="changeSort('revisionDate', 'desc')"
          >
            <span>{{ $t('data.ciphers.time') }}
              {{ $t('data.ciphers.descending') }}</span>
            <i v-if="orderString === 'revisionDate_desc'" class="fa fa-check" />
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    changeSort: {
      type: Function,
      default: () => () => {}
    },
    orderString: {
      type: String,
      default: () => ''
    }
  },

  computed: {
    isSearching () {
      return this.searchText && this.searchText.trim().length > 0
    }
  },

  watch: {
    isSearching (newVal) {
      if (newVal) {
        this.changeSort('', '')
      } else {
        this.changeSort('revisionDate', 'desc')
      }
    }
  }
}
</script>
