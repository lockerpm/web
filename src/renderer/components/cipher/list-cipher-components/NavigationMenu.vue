<template>
  <div
    v-if="['vault', ...cipherRoutes].includes(getRouteBaseName())"
    class="navigation-bar overflow-x-scroll"
  >
    <nuxt-link
      v-for="(item, index) in menuVault"
      :key="index"
      :to="localeRoute({ name: item.routeName })"
      active-class="navigation-item__active"
      class="navigation-item"
      exact
    >
      {{ $t(`sidebar.${item.label}`) }}
    </nuxt-link>
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
    menuVault () {
      return [
        {
          label: 'all',
          routeName: 'vault'
        },
        ...Object.values(this.cipherMapping).filter(m => !m.noMenu)
      ]
    }
  }
}
</script>
