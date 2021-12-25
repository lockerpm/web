<template>
  <div id="header-default" class="lg:px-28 px-10 h-[60px] flex items-center border-0 border-b border-black-200 relative">
    <div id="nav-content" class="sidebar" style="z-index: 1000">
      <div class="w-60 h-screen bg-aside min-h-500px min-w-60 flex flex-col justify-between relative overflow-y-scroll overflow-x-hidden">
        <button
          class="btn btn-clean absolute top-2 -right-6"
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
              <div v-if="item.collapse" :key="index">
                <div
                  class="flex items-center py-2 px-6 hover:text-white hover:bg-white hover:bg-opacity-20 text-black-400 font-semibold hover:no-underline"
                  active-class="bg-white bg-opacity-20 text-white"
                >
                  <div class="mr-2 w-[22px] h-[22px] flex items-center">
                    <img :src="require(`~/assets/images/icons/${item.icon}.svg`)" alt="">
                  </div>
                  <span class="text-sm font-medium">{{ $t(`sidebar.${item.label}`) }}</span>
                </div>
                <ul>
                  <li
                    v-for="(itemMenu, id) in item.items"
                    :key="id"
                  >
                    <nuxt-link
                      :to="localePath({name: itemMenu.routeName})"
                      class="flex items-center py-2 pl-12 pr-6 hover:text-white hover:bg-white hover:bg-opacity-20 text-black-400 font-semibold hover:no-underline"
                      active-class="bg-white bg-opacity-20 text-white"
                    >
                      <!-- <div class="mr-2 w-[22px] h-[22px] flex items-center">
                    <img :src="require(`~/assets/images/icons/${itemMenu.icon}.svg`)" alt="">
                  </div> -->
                      <span class="text-sm font-medium">{{ $t(`sidebar.${itemMenu.label}`) }}</span>
                    </nuxt-link>
                  </li>
                </ul>
              </div>
              <nuxt-link
                v-else
                :key="index"
                :to="localePath({name: item.routeName})"
                class="flex items-center py-2 px-6 hover:text-white hover:bg-white hover:bg-opacity-20 text-black-400 font-semibold hover:no-underline"
                active-class="bg-white bg-opacity-20 text-white"
              >
                <div class="mr-2 w-[22px] h-[22px] flex items-center">
                  <img :src="require(`~/assets/images/icons/${item.icon}.svg`)" alt="">
                </div>
                <span class="text-sm font-medium">{{ $t(`sidebar.${item.label}`) }}</span>
              </nuxt-link>
            </template>
          </nav>
        </div>
        <div>
          <nav class="mb-10">
            <nuxt-link
              v-for="(item, index) in bottomMenu"
              :key="index"
              :to="localePath({name: item.routeName, params: item.params})"
              class="flex items-center py-2 px-6 hover:text-white hover:bg-white hover:bg-opacity-20 text-black-400 font-semibold hover:no-underline"
              active-class="bg-white bg-opacity-20 text-white"
            >
              <div class="mr-2 w-[22px] h-[22px] flex items-center">
                <img :src="require(`~/assets/images/icons/${item.icon}.svg`)" alt="">
              </div>
              <span class="text-sm font-medium">{{ $t(`sidebar.${item.label}`) }} </span>
            </nuxt-link>
          </nav>
        </div>
      </div>
    </div>
    <div class="flex-grow">
      <div v-if="shouldShowSearch" class="text-black-600 p-3">
        <i class="!hidden sm:!inline-block fa fa-search mr-4 rounded-full shadow-md p-2" />
        <input
          type="text"
          :value="searchText"
          class="sm:w-1/2 w-full focus:border-0 border-0 truncate"
          :placeholder="$t('common.search_placeholder')"
          @input="handleSearch"
        >
      </div>
    </div>
    <div class="flex">
      <el-dropdown trigger="click">
        <div class="flex items-center">
          <el-avatar :size="35" :src="currentUser.avatar" class="mr-2" />
          <div>
            <div class="text-sm font-semibold"><nobr>{{ currentUser.full_name }} <i class="el-icon-caret-bottom el-icon--right" /></nobr></div>
            <div class="text-xs text-black-600">{{ currentPlan.name }}</div>
          </div>
        </div>
        <el-dropdown-menu slot="dropdown" class="min-w-[200px]">
          <el-dropdown-item
            class="text-warning"
            icon="fa fa-user-circle"
            @click.native="go('settings')"
          >
            {{ $t('data.profile_menu.account_settings') }}
          </el-dropdown-item>
          <el-dropdown-item class="text-warning" icon="far fa-life-ring">
            {{ $t('data.profile_menu.support_center') }}
          </el-dropdown-item>
          <el-dropdown-item class="text-warning" icon="far fa-flag">
            {{ $t('data.profile_menu.tour') }}
          </el-dropdown-item>
          <el-dropdown-item class="text-warning" icon="far fa-comment">
            {{ $t('data.profile_menu.feedback') }}
          </el-dropdown-item>
          <el-dropdown-item icon="fas fa-lock" @click.native="lock">
            {{ $t('data.profile_menu.lock') }}
          </el-dropdown-item>
          <el-dropdown-item icon="fas fa-sign-out-alt" @click.native="logout">
            {{ $t('data.profile_menu.logout') }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <div class="block md:hidden landing-transition ml-5">
        <a
          id="nav-toggle"
          class="landing-font-28 text-black landing-transition"
        >
          <i class="fa fa-bars" />
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import debounce from 'lodash/debounce'
export default {
  data () {
    return {
      // menu: [
      //   {
      //     label: 'all',
      //     routeName: 'vault',
      //     icon: 'all'
      //   },
      //   {
      //     label: 'passwords',
      //     routeName: 'passwords',
      //     icon: 'passwords'
      //   },
      //   {
      //     label: 'notes',
      //     routeName: 'notes',
      //     icon: 'notes'
      //   },
      //   {
      //     label: 'cards',
      //     routeName: 'cards',
      //     icon: 'cards'
      //   },
      //   {
      //     label: 'identities',
      //     routeName: 'identities',
      //     icon: 'identities'
      //   },
      //   {
      //     label: 'shares',
      //     routeName: 'shares',
      //     icon: 'shares'
      //   },
      //   {
      //     label: 'trash',
      //     routeName: 'trash',
      //     icon: 'trash'
      //   }
      // ]
      menu: [
        {
          label: 'inventory',
          icon: 'all',
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
        // {
        //   label: 'Security',
        //   icon: 'shield-alt',
        //   routeName: ''
        // }
        {
          label: 'shares',
          icon: 'shares',
          routeName: 'shares'
        },
        {
          label: 'trash',
          icon: 'trash',
          routeName: 'trash'
        },
        {
          label: 'tools',
          routeName: 'tools',
          icon: 'tools'
        }
      ]
    }
  },
  computed: {
    shouldShowSearch () {
      return ['vault', 'passwords', 'notes', 'identities', 'shares', 'trash', 'vault-tfolders-tfolderId', 'vault-folders-folderId'].includes(this.getRouteBaseName())
    },
    currentPlan () {
      return this.$store.state.currentPlan
    },
    manageableTeams () {
      return this.teams.filter(e => ['owner', 'admin'].includes(e.role) && e.is_business)
    },
    bottomMenu () {
      return [
        ...this.currentPlan.alias === 'pm_free'
          ? [{
            label: 'upgrade',
            routeName: 'upgrade',
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
          routeName: 'settings',
          icon: 'settings'
        },
        {
          label: 'help',
          routeName: 'help',
          icon: 'help'
        }
      ]
    }
  },
  mounted () {
    // Set click event
    const navMenuDiv = document.getElementById('nav-content')
    const headerDiv = document.getElementById('header-default')
    const navMenu = document.getElementById('nav-toggle')

    document.onclick = check
    function check (e) {
      const target = (e && e.target)

      // Nav Menu
      if (!checkParent(target, navMenuDiv)) {
        // click NOT on the menu
        if (checkParent(target, navMenu)) {
          // click on the link
          // if (navMenuDiv.classList.contains('hidden')) {
          //   navMenuDiv.classList.remove('hidden')
          // } else {
          //   navMenuDiv.classList.add('hidden')
          // }
          if (headerDiv.classList.contains('sidebar-open')) {
            headerDiv.classList.remove('sidebar-open')
          } else {
            headerDiv.classList.add('sidebar-open')
          }
        } else if (headerDiv.classList.contains('sidebar-open')) {
          // click both outside link and outside menu, hide menu
          // navMenuDiv.classList.add('hidden')
          headerDiv.classList.remove('sidebar-open')
        }
      }
    }
    function checkParent (t, elm) {
      while (t.parentNode) {
        if (t === elm) {
          return true
        }
        t = t.parentNode
      }
      return false
    }
  },
  methods: {
    handleSearch: debounce(function (e) {
      this.$store.commit('UPDATE_SEARCH', e.target.value)
    }, 800),
    go (name) {
      this.$router.push(this.localeRoute({ name }))
    },
    hideNavMenu () {
      // const navMenuDiv = document.getElementById('nav-content')
      // if (navMenuDiv.classList.contains('hidden')) {
      //   navMenuDiv.classList.remove('hidden')
      // } else {
      //   navMenuDiv.classList.add('hidden')
      // }
      const headerDiv = document.getElementById('header-default')
      if (headerDiv.classList.contains('sidebar-open')) {
        headerDiv.classList.remove('sidebar-open')
      }
    }
  }
}
</script>
<style scoped>
.sidebar-open .sidebar{
  transform: translateX(0);
}
.sidebar {
  @apply transition-transform md:hidden fixed top-0 left-0 h-screen;
  transform: translateX(-100%);
}
</style>
