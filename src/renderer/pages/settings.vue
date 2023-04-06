<template>
  <div class="flex flex-col flex-column-fluid relative bg-[#FBFBFC]">
    <div class="flex mb-5 border-b border-black-400 pt-3 lg:px-28 px-10">
      <nuxt-link
        v-for="(item, index) in menu"
        :key="index"
        :to="localeRoute({name: item.routeName})"
        active-class="!text-black font-semibold border-b-2 border-primary pb-3"
        class="text-black-600 mr-8 last:mr-0 hover:no-underline"
        :class="item.label!=='manage_member' || currentPlan.alias === 'pm_family' ? '': 'hidden'"
        exact
      >
        {{ $t(`sidebar.${item.label}`) }}
      </nuxt-link>
    </div>
    <div class="flex-column-fluid lg:px-28 py-10 px-10 mb-20">
      <nuxt-child />
    </div>
  </div>
</template>

<script>
export default {
  components: { },
  props: {
    isError: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      value: 'Option1'
    }
  },
  computed: {
    currentPlan () {
      return this.$store.state.currentPlan
    },
    menu () {
      return [
        {
          label: 'account',
          routeName: 'settings-account'
        },
        {
          label: 'manage_member',
          routeName: 'settings-manage-member'
        },
        {
          label: 'import_export',
          routeName: 'settings-import-export'
        },
        {
          label: 'security',
          routeName: 'settings-security'
        },
        ...!this.isEnterpriseMember
          ? [{
            label: 'plans_billing',
            routeName: 'settings-plans-billing'
          },
          {
            label: 'referral',
            routeName: 'settings-referral'
          }]
          : [],
        {
          label: 'notifications',
          routeName: 'settings-notifications'
        },
        ...this.currentPlan.alias === 'pm_family_discount'
          ? [{
            label: 'family_members',
            routeName: 'settings-family-members'
          }]
          : []

      ]
    }
  }
}
</script>
