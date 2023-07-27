<template>
  <div class="header-actions">
    <div class="flex">
      <el-dropdown trigger="click" class="self-center">
        <!-- Trigger -->
        <div class="text-sm text-black-600 font-semibold">
          {{ $t('data.ciphers.sort_by') }}
          <i class="el-icon-caret-bottom el-icon--right" />
        </div>
        <!-- Trigger end -->

        <el-dropdown-menu slot="dropdown" class="w-[200px]">
          <!-- Most relevant (by search) -->
          <el-dropdown-item
            v-if="isSearching"
            class="flex items-center justify-between"
            @click.native="changeSort('', '')"
          >
            <span>{{ $t('data.ciphers.most_relevant') }}</span>
            <i v-if="orderString === '_'" class="fa fa-check" />
          </el-dropdown-item>
          <!-- Most relevant end -->

          <!-- Name asc -->
          <el-dropdown-item
            class="flex items-center justify-between"
            @click.native="changeSort('name', 'asc')"
          >
            <span>{{ $t('data.ciphers.name') }}
              {{ $t('data.ciphers.ascending') }}</span>
            <i v-if="orderString === 'name_asc'" class="fa fa-check" />
          </el-dropdown-item>
          <!-- Name asc end -->

          <!-- Name desc -->
          <el-dropdown-item
            class="flex items-center justify-between"
            @click.native="changeSort('name', 'desc')"
          >
            <span>{{ $t('data.ciphers.name') }}
              {{ $t('data.ciphers.descending') }}</span>
            <i v-if="orderString === 'name_desc'" class="fa fa-check" />
          </el-dropdown-item>
          <!-- Name desc end -->

          <!-- Revision date asc -->
          <el-dropdown-item
            class="flex items-center justify-between"
            @click.native="changeSort('revisionDate', 'asc')"
          >
            <span>{{ $t('data.ciphers.time') }}
              {{ $t('data.ciphers.ascending') }}</span>
            <i v-if="orderString === 'revisionDate_asc'" class="fa fa-check" />
          </el-dropdown-item>
          <!-- Revision date asc end -->

          <!-- Revision date desc -->
          <el-dropdown-item
            class="flex items-center justify-between"
            @click.native="changeSort('revisionDate', 'desc')"
          >
            <span>{{ $t('data.ciphers.time') }}
              {{ $t('data.ciphers.descending') }}</span>
            <i v-if="orderString === 'revisionDate_desc'" class="fa fa-check" />
          </el-dropdown-item>
          <!-- Revision date desc end -->

          <!-- Other options -->
          <el-dropdown-item
            v-for="(item, index) in otherOptions"
            :key="`other_${index}`"
            class="flex items-center justify-between"
            @click.native="changeSort(item.key, item.order)"
          >
            <span>{{ item.label }}</span>
            <i
              v-if="orderString === `${item.key}_${item.order}`"
              class="fa fa-check"
            />
          </el-dropdown-item>
          <!-- Other options end -->
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
    },
    otherOptions: {
      type: Array,
      default: () => []
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
