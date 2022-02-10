<template>
  <div
    class="w-60 h-screen bg-aside min-h-500px min-w-60 flex flex-col justify-between overflow-y-scroll"
    :class="closable?'relative overflow-x-hidden':'fixed'"
  >
    <button
      v-if="closable"
      class="btn btn-clean absolute top-2 -right-4"
      @click="hideNavMenu"
    >
      <i class="el-icon-close text-lg text-white" />
    </button>
    <div>
      <div class="mt-7 px-6">
        <img class="h-[32px]" src="~assets/images/logo/logo_white.svg">
      </div>
      <nav class="mt-7">
        <template
          v-for="(item, index) in menu"
        >
          <template v-if="item.collapse">
            <!-- <div
              class="flex items-center py-2 px-5 hover:text-white hover:bg-white hover:bg-opacity-20 text-black-400 font-semibold hover:no-underline cursor-pointer"
              active-class="bg-white bg-opacity-20 text-white"
              @click="$router.push(localePath({name: 'vault'}))"
            >
              <div class="mr-2 w-[22px] h-[22px] flex items-center">
                <img :src="require(`~/assets/images/icons/${item.icon}.svg`)" alt="">
              </div>
              <span class="text-sm font-medium">{{ $t(`sidebar.${item.label}`) }}</span>
            </div>
            <ul v-if="['vault', 'passwords', 'notes', 'cards', 'identities'].includes(getRouteBaseName())" key="1">
              <li
                v-for="(itemMenu, id) in item.items"
                :key="id"
              >
                <nuxt-link
                  :to="localePath({name: itemMenu.routeName})"
                  class="flex items-center py-2 pl-11 pr-6 hover:text-white hover:bg-white hover:bg-opacity-20 text-black-400 hover:no-underline border-l-4 border-transparent"
                  active-class="bg-white bg-opacity-20 text-[#3C962D] border-l-4 !border-primary font-semibold"
                >
                  <span class="text-sm">{{ $t(`sidebar.${itemMenu.label}`) }}</span>
                </nuxt-link>
              </li>
            </ul> -->
            <div
              :key="index"
              class="flex items-center pt-2 text-black-400 font-semibold hover:no-underline cursor-pointer"
              active-class="bg-white bg-opacity-20 text-white"
            >
              <el-collapse v-model="activeNames" accordion class="w-full !border-t-0 !border-b-0">
                <el-collapse-item name="1">
                  <template slot="title">
                    <!-- <span class="text-sm font-medium">{{ $t(`sidebar.${item.label}`) }}</span> -->
                    <div class="mr-2 w-[22px] h-[22px] flex items-center">
                      <img :src="require(`~/assets/images/icons/${item.icon}.svg`)" alt="">
                    </div>
                    <span class="text-sm font-medium">{{ $t(`sidebar.${item.label}`) }}</span>
                  </template>
                  <div>
                    <ul>
                      <li
                        v-for="(itemMenu, id) in item.items"
                        :key="id"
                      >
                        <nuxt-link
                          :to="localePath({name: itemMenu.routeName})"
                          class="flex items-center py-2 pl-11 pr-6 hover:text-white hover:bg-white hover:bg-opacity-20 text-black-400 hover:no-underline border-l-4 border-transparent"
                          active-class="bg-white bg-opacity-20 text-[#3C962D] border-l-4 !border-primary font-semibold"
                        >
                          <span class="text-sm">{{ $t(`sidebar.${itemMenu.label}`) }}</span>
                        </nuxt-link>
                      </li>
                    </ul>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </div>
          </template>
          <nuxt-link
            v-else
            :key="index"
            :to="localePath({name: item.routeName})"
            class="flex justify-between items-center py-2 px-5 hover:text-white hover:bg-white hover:bg-opacity-20 text-black-400 font-semibold hover:no-underline"
            active-class="bg-white bg-opacity-20 !text-white"
          >
            <div class="flex">
              <div class="mr-2 w-[22px] h-[22px] flex items-center">
                <img :src="require(`~/assets/images/icons/${item.icon}.svg`)" alt="">
              </div>
              <span class="text-sm font-medium">{{ $t(`sidebar.${item.label}`) }}</span>
            </div>
            <div v-if="item.routeName==='shares' && pendingShares>0">
              <div class="notification-badge">
                {{ pendingShares }}
              </div>
            </div>
          </nuxt-link>
        </template>
      </nav>
    </div>
    <div>
      <nav class="my-10">
        <nuxt-link
          v-for="(item, index) in bottomMenu"
          :key="index"
          :to="localePath({name: item.routeName, params: item.params})"
          class="flex items-center py-2 px-5 hover:text-white hover:bg-white hover:bg-opacity-20 text-black-400 font-semibold hover:no-underline"
          active-class="bg-white bg-opacity-20 !text-white"
          :class="item.routeName==='settings-account'&&['settings-account', 'settings-options', 'settings-security', 'settings-plan-billing'].includes(getRouteBaseName())?'bg-white bg-opacity-20 !text-white':''"
        >
          <div class="mr-2 w-[22px] h-[22px] flex items-center">
            <img :src="require(`~/assets/images/icons/${item.icon}.svg`)" alt="">
          </div>
          <span class="text-sm font-medium">{{ $t(`sidebar.${item.label}`) }} </span>
        </nuxt-link>
      </nav>
    </div>
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
      menu: [
        {
          label: 'inventory',
          icon: 'inventory',
          collapse: true,
          items: [
            {
              label: 'all',
              routeName: 'vault'
            },
            {
              label: 'passwords',
              routeName: 'passwords'
            },
            {
              label: 'notes',
              routeName: 'notes'
            },
            {
              label: 'cards',
              routeName: 'cards'
            },
            {
              label: 'identities',
              routeName: 'identities'
            }
          ]
        },
        {
          label: 'security',
          icon: 'security',
          routeName: 'tools'
        },
        {
          label: 'shares',
          icon: 'share',
          routeName: 'shares'
        },
        {
          label: 'trash',
          icon: 'trashh',
          routeName: 'trash'
        }
      ],
      activeNames: '1'
    }
  },
  computed: {
    bottomMenu () {
      return [
        ...this.currentPlan.alias === 'pm_free'
          ? [{
            label: 'upgrade',
            routeName: 'plans',
            icon: 'upgrade'
          }]
          : [],
        ...this.manageableTeams && this.manageableTeams.length
          ? [{
            label: 'dashboard',
            routeName: 'admin-teamId',
            icon: 'dashboard',
            params: { teamId: this.manageableTeams[0].id }
          }]
          : [],
        {
          label: 'settings',
          routeName: 'settings-account',
          icon: 'setting'
        },
        // {
        //   label: 'tools',
        //   routeName: 'tools',
        //   icon: 'tools'
        // }
        {
          label: 'help',
          routeName: 'help-feedback',
          icon: 'help'
        }
      ]
    }
  },
  methods: {
    hideNavMenu () {
      this.$emit('close')
    }
  }
}
</script>

<style>
.sidebar-open .sidebar{
  transform: translateX(0);
}
.sidebar {
  @apply transition-transform md:hidden fixed top-0 left-0 h-screen;
  transform: translateX(-100%);
}
</style>
