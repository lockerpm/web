<template>
  <div
    class="flex flex-col flex-column-fluid relative bg-[#FBFBFC] min-h-screen"
  >
    <div
      class="flex mb-5 border-b border-black-400 pt-3 lg:px-28 md:px-10 px-4 sm:overflow-x-hidden overflow-x-auto hidden-scrollbar"
    >
      <nuxt-link
        v-for="(item, index) in menu.filter(i => !i.hidden)"
        :key="index"
        :to="localeRoute({ name: item.routeName })"
        active-class="!text-black font-semibold border-b-2 border-primary pb-3"
        class="text-black-600 mr-8 last:mr-0 hover:no-underline"
      >
        {{ $t(`sidebar.${item.label}`) }}
      </nuxt-link>
    </div>
    <div class="flex-column-fluid lg:px-28 py-10 md:px-10 px-4 mb-20">
      <nuxt-child />
    </div>
  </div>
</template>

<script>
export default {
  components: {},
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
          routeName: 'settings-manage-member',
          hidden: !this.isFamilyUser
        },
        {
          label: 'import_export',
          routeName: 'settings-import-export'
        },
        {
          label: 'security',
          routeName: 'settings-security'
        },
        {
          label: 'plans_billing',
          routeName: 'settings-plans-billing',
          hidden: this.isEnterpriseMember
        },
        {
          label: 'notifications',
          routeName: 'settings-notifications'
        }
      ]
    }
  },
  mounted () {
    // Tutorial
    if (this.$store.state.tutorial.isActive) {
      this.markDoneStep('view_settings')
    }
  }
}
</script>
