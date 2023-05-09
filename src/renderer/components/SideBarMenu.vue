<template>
  <div
    class="w-60 h-screen bg-aside min-h-500px min-w-60 flex flex-col justify-between overflow-y-scroll"
    :class="closable ? 'relative overflow-x-hidden' : 'fixed'"
  >
    <button
      v-if="closable"
      class="btn btn-clean absolute top-2 -right-4"
      @click="hideNavMenu"
    >
      <i class="el-icon-close text-lg text-white" />
    </button>
    <div>
      <!-- Logo -->
      <div class="mt-7 px-6">
        <nuxt-link :to="localeRoute({ name: 'vault' })">
          <img class="h-[32px]" src="~assets/images/logo/logo_white.svg">
        </nuxt-link>
      </div>
      <!-- Logo end -->

      <!-- Plan storage -->
      <div v-if="isFreePlan" class="mt-4 px-[20px]">
        <div class="mb-3 flex items-center">
          <img src="~/assets/images/icons/flash_success.svg">
          <p class="text-white font-semibold ml-3">
            {{ $t('data.settings.plan_storage') }}
          </p>
        </div>
        <el-progress
          :show-text="false"
          :percentage="storagePercentage * 100"
          :status="getPercentageStatus(storagePercentage)"
          :stroke-width="5"
        />
        <hr class="border-[#394452] mt-5">
      </div>
      <!-- Plan storage end -->

      <!-- Menu -->
      <nav class="mt-5">
        <template v-for="(item, index) in menu">
          <!-- Collapse items -->
          <template v-if="item.collapse">
            <div
              :key="index"
              class="flex items-center pt-2 text-black-400 font-semibold hover:no-underline cursor-pointer"
              active-class="bg-white bg-opacity-20 text-white"
            >
              <el-collapse
                v-model="activeNames"
                accordion
                class="w-full !border-t-0 !border-b-0"
              >
                <el-collapse-item name="1">
                  <template slot="title">
                    <!-- <span class="text-sm font-medium">{{ $t(`sidebar.${item.label}`) }}</span> -->
                    <div
                      class="mr-2 w-[22px] h-[22px] flex items-center justify-center"
                    >
                      <img
                        :src="require(`~/assets/images/icons/${item.icon}.svg`)"
                        alt=""
                      >
                    </div>
                    <span class="text-sm font-medium">{{
                      $t(`sidebar.${item.label}`)
                    }}</span>
                  </template>
                  <div>
                    <ul>
                      <li v-for="(itemMenu, id) in item.items" :key="id">
                        <nuxt-link
                          :to="localePath({ name: itemMenu.routeName })"
                          class="flex items-center py-2 pl-11 pr-6 hover:text-white hover:bg-white hover:bg-opacity-20 text-black-400 hover:no-underline border-l-4 border-transparent"
                          active-class="bg-white bg-opacity-20 text-[#3C962D] border-l-4 !border-primary font-semibold"
                        >
                          <span class="text-sm">{{
                            $t(`sidebar.${itemMenu.label}`)
                          }}</span>
                        </nuxt-link>
                      </li>
                    </ul>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </div>
          </template>
          <!-- Collapse items end -->

          <nuxt-link
            v-else
            :id="`sidebar__${item.label}`"
            :key="index"
            :to="localePath({ name: item.routeName })"
            class="flex justify-between items-center py-2 px-5 hover:text-white hover:bg-white hover:bg-opacity-20 text-black-400 font-semibold hover:no-underline"
            active-class="bg-white bg-opacity-20 !text-white"
          >
            <div class="flex">
              <!-- Icon -->
              <div
                class="mr-2 w-[22px] h-[22px] flex items-center justify-center"
              >
                <img
                  :src="require(`~/assets/images/icons/${item.icon}.svg`)"
                  alt=""
                >
              </div>
              <!-- Icon end -->

              <!-- Label -->
              <span class="text-sm font-medium">{{
                $t(`sidebar.${item.label}`)
              }}</span>
              <!-- Label -->
            </div>

            <div
              v-if="
                item.routeName === 'shares-index-index' &&
                  pendingShares + pendingMyShares.length > 0
              "
            >
              <div class="notification-badge">
                {{ pendingShares + pendingMyShares.length }}
              </div>
            </div>
          </nuxt-link>
        </template>
      </nav>
      <!-- Menu end -->
    </div>

    <!-- Bottom menu -->
    <div>
      <nav class="my-10">
        <template v-for="(item, index) in bottomMenu">
          <a
            v-if="item.externalLink"
            :key="index"
            class="flex items-center py-2 px-5 hover:text-white hover:bg-white hover:bg-opacity-20 text-black-400 font-semibold hover:no-underline"
            :href="item.externalLink"
            target="_blank"
          >
            <div
              class="mr-2 w-[22px] h-[22px] flex items-center justify-center"
            >
              <img
                :src="require(`~/assets/images/icons/${item.icon}.svg`)"
                alt=""
              >
            </div>
            <span class="text-sm font-medium">{{ $t(`sidebar.${item.label}`) }}
            </span>
          </a>
          <nuxt-link
            v-else
            :id="`sidebar__${item.label}`"
            :key="index"
            :to="localePath({ name: item.routeName, params: item.params })"
            class="flex items-center py-2 px-5 hover:text-white hover:bg-white hover:bg-opacity-20 text-black-400 font-semibold hover:no-underline"
            active-class="bg-white bg-opacity-20 !text-white"
            :class="
              item.routeName === 'settings-account' &&
                [
                  'settings-account',
                  'settings-options',
                  'settings-security',
                  'settings-plan-billing'
                ].includes(getRouteBaseName())
                ? 'bg-white bg-opacity-20 !text-white'
                : ''
            "
          >
            <div
              class="mr-2 w-[22px] h-[22px] flex items-center justify-center"
            >
              <img
                :src="require(`~/assets/images/icons/${item.icon}.svg`)"
                alt=""
              >
            </div>
            <span class="text-sm font-medium">{{ $t(`sidebar.${item.label}`) }}
            </span>
          </nuxt-link>
        </template>
        <a
          href="https://cystack.typeform.com/to/YTUaD1sL"
          target="_blank"
          class="flex items-center py-2 px-5 hover:text-white hover:bg-white hover:bg-opacity-20 text-black-400 font-semibold hover:no-underline"
        >
          <div class="mr-2 w-[22px] h-[22px] flex items-center justify-center">
            <img
              :src="require('~/assets/images/icons/help.svg')"
              alt="feedback"
            >
          </div>
          <span class="text-sm font-medium">{{ $t('sidebar.feedback') }} </span>
        </a>
      </nav>
    </div>
    <!-- Bottom menu end -->
  </div>
</template>

<script>
export default {
  props: {
    closable: {
      type: Boolean,
      default: true
    }
    // pendingShares: {
    //   type: Number,
    //   default: 0
    // }
  },
  data () {
    return {
      activeNames: '1'
    }
  },
  computed: {
    isFreePlan () {
      return this.$store.state.currentPlan?.alias === 'pm_free'
    },

    storagePercentage () {
      const planLimit = this.$store.state.itemsCount.plan_limit || {}
      const ciphersCount = this.$store.state.itemsCount.ciphers || {}

      const res = this.cipherTypesList
        .filter(c => !!c.freeLimit && !c.revertToNote)
        .map(c => ({
          limit: planLimit[c.type] || c.freeLimit,
          total: ciphersCount[c.type] || 0
        }))

      // Private email
      res.push({
        limit: planLimit.relay_addresses || 5,
        total: this.$store.state.itemsCount.relay_addresses?.total || 0
      })

      const totalLimit = res.reduce((a, b) => a + b.limit, 0)
      const totalItems = res.reduce((a, b) => a + b.total, 0)

      return totalItems / totalLimit
    },

    menu () {
      return [
        {
          label: 'inventory',
          icon: 'inventory',
          collapse: true,
          items: [
            {
              label: 'all',
              routeName: 'vault'
            },
            ...this.cipherTypesList.filter(v => !!v.routeName && !v.noMenu)
          ]
        },
        {
          label: 'authenticator',
          icon: 'authenticator',
          routeName: 'authenticator'
        },
        {
          label: 'security_tools',
          icon: 'security',
          routeName: 'tools'
        },
        ...(this.isEnterpriseMember
          ? [
            {
              label: 'policies',
              icon: 'policies',
              routeName: 'policies'
            }
          ]
          : []),
        {
          label: 'shares',
          icon: 'share',
          routeName: 'shares-index-index'
        },
        {
          label: 'private_email',
          icon: 'private_email',
          routeName: 'relay'
        },
        {
          label: 'trash',
          icon: 'trashh',
          routeName: 'trash'
        }
      ]
    },
    bottomMenu () {
      return [
        ...(this.currentPlan.alias === 'pm_free' && !this.isEnterpriseMember
          ? [
            {
              label: 'upgrade',
              routeName: 'manage-plans',
              icon: 'upgrade'
            }
          ]
          : []),
        ...(this.isEnterpriseAdminOrOwner
          ? [
            {
              label: 'enterprise_dashboard',
              externalLink: process.env.lockerEnterprise,
              icon: 'dashboard'
            }
          ]
          : []),
        {
          label: 'settings',
          routeName: 'settings-account',
          icon: 'setting'
        }
        // {
        //   label: 'tools',
        //   routeName: 'tools',
        //   icon: 'tools'
        // }
        // {
        //   label: 'help',
        //   routeName: 'help-feedback',
        //   icon: 'help'
        // }
      ]
    }
  },
  watch: {
    '$route.path' () {
      this.hideNavMenu()
    }
  },
  methods: {
    hideNavMenu () {
      this.$emit('close')
    },
    getPercentageStatus (percentage) {
      if (percentage > 0.8) {
        return 'exception'
      }
      if (percentage > 0.5) {
        return 'warning'
      }
      return 'success'
    }
  }
}
</script>

<style>
.sidebar-open .sidebar {
  transform: translateX(0);
}
.sidebar {
  @apply transition-transform md:hidden fixed top-0 left-0 h-screen;
  transform: translateX(-100%);
}
</style>
