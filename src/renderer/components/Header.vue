<template>
  <div id="header-default" class="lg:px-28 px-10 h-[60px] flex items-center border-0 border-b border-black-200 relative">
    <div id="nav-content" class="sidebar" style="z-index: 1000">
      <SideBarMenu :closable="true" @close="hideNavMenu" />
    </div>
    <div class="flex-grow">
      <div v-if="shouldShowSearch" class="text-black-600 py-3">
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
      <div class="mr-3">
        <button class="btn btn-primary" @click="$router.push(localePath({name: 'plans'}))">
          {{ $t('common.manage_plans') }}
        </button>
      </div>
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
            @click.native="go('settings-account')"
          >
            {{ $t('data.profile_menu.account_settings') }}
          </el-dropdown-item>
          <el-dropdown-item class="text-warning" icon="far fa-life-ring">
            <a class="hover:no-underline text-current hover:text-current" :href="locale==='vi'?'https://support.locker.io/vi':'https://support.locker.io'" target="_blank">
              {{ $t('data.profile_menu.support_center') }}
            </a>
          </el-dropdown-item>
          <!-- <el-dropdown-item class="text-warning" icon="far fa-flag">
            <a class="hover:no-underline text-current hover:text-current" :href="locale==='vi'?'https://support.locker.io/vi':'https://support.locker.io'" target="_blank">
              {{ $t('data.profile_menu.tour') }}
            </a>
          </el-dropdown-item> -->
          <el-dropdown-item class="text-warning" icon="far fa-comment">
            <a class="hover:no-underline text-current hover:text-current" href="https://zo8rr5fc706.typeform.com/to/OotlSyQ7" target="_blank">
              {{ $t('data.profile_menu.feedback') }}
            </a>
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
import SideBarMenu from '../components/SideBarMenu.vue'
export default {
  components: {
    SideBarMenu
  },
  asyncComputed: {
    async locked () {
      return await this.$vaultTimeoutService.isLocked(this.$store.state.isLoggedInPw)
    }
  },
  computed: {
    shouldShowSearch () {
      return ['vault', 'passwords', 'notes', 'cards', 'identities', 'crypto-asset', 'shares', 'trash', 'vault-tfolders-tfolderId', 'vault-folders-folderId', 'shares-your-shares'].includes(this.getRouteBaseName())
    },
    currentPlan () {
      return this.$store.state.currentPlan
    },
    manageableTeams () {
      return this.teams.filter(e => ['owner', 'admin'].includes(e.role) && e.is_business)
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
/* Enter and leave animations can use different */
/* durations and timing functions.              */
.slide-fade-enter-active {
  transition: all .2s ease;
}
.slide-fade-leave-active {
  transition: all .4s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
</style>
