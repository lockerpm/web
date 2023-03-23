<template>
  <div class="flex flex-col flex-column-fluid relative">
    <!-- Navigation Menu -->
    <div class="navigation-bar">
      <nuxt-link
        v-for="(item, index) in menuShares"
        :key="index"
        :to="localeRoute({ name: item.routeName })"
        active-class="navigation-item__active"
        class="navigation-item"
        :class="{
          'navigation-item__active':
            index === 2 && getRouteBaseName() === 'shares-index-quick-shares-id'
        }"
        exact=""
      >
        {{ $t(`sidebar.${item.label}`) }}
        <span v-if="item.pending && item.pending > 0">
          <div class="notification-badge">{{ item.pending }}</div>
        </span>
      </nuxt-link>
    </div>
    <!-- Navigation Menu end -->

    <!-- Content -->
    <nuxt-child />
    <!-- Content end -->
  </div>
</template>

<script>
export default {
  computed: {
    menuShares () {
      return [
        {
          label: 'shared_with_you',
          routeName: 'shares-index',
          pending: this.pendingShares
        },
        {
          label: 'your_shares',
          routeName: 'shares-index-your-shares'
        },
        {
          label: 'quick_shares',
          routeName: 'shares-index-quick-shares'
        }
      ]
    }
  }
}
</script>
