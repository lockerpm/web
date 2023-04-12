<template>
  <div
    v-if="['vault', ...cipherRoutes].includes(currentRoute)"
    class="navigation-bar"
  >
    <el-dropdown trigger="click" class="py-4">
      <span class="el-dropdown-link py-4 font-semibold text-black">
        {{ $t('sidebar.inventory')
        }}<i class="el-icon-arrow-down el-icon--right" />
      </span>
      <el-dropdown-menu
        slot="dropdown"
        class="grid grid-cols-1 sm:grid-cols-3 gap-x-2"
      >
        <div v-for="(group, index) in groups" :key="index">
          <el-dropdown-item
            v-for="item in group.filter(m => !m.noMenu)"
            :key="item.label"
            :class="{
              'font-semibold !text-black': item.routeName === currentRoute
            }"
            @click.native="$router.push(localeRoute({ name: item.routeName }))"
          >
            {{ $t(`sidebar.${item.label}`) }}
          </el-dropdown-item>
        </div>
      </el-dropdown-menu>
    </el-dropdown>

    <p class="py-4 ml-4">
      {{
        currentCipherMapping ? $t(`sidebar.${currentCipherMapping.label}`) : ''
      }}
    </p>
  </div>
</template>
<script>
import { CipherType } from '../../../core/enums/cipherType'

export default {
  data () {
    return {
      CipherType
    }
  },

  computed: {
    groups () {
      const res = Object.values(this.cipherGroupMapping)
      res[0].unshift({
        label: 'all',
        routeName: 'vault'
      })
      return res
    },

    currentRoute () {
      return this.getRouteBaseName()
    },

    currentCipherMapping () {
      return this.cipherTypesList.find(m => m.routeName === this.currentRoute)
    }
  }
}
</script>
