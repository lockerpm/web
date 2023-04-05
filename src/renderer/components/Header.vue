<template>
  <div
    id="header-default"
    class="lg:px-28 md:px-10 px-4 h-[60px] flex items-center border-0 border-b border-black-200 relative"
  >
    <div id="nav-content" class="sidebar" style="z-index: 1000">
      <SideBarMenu :closable="true" @close="hideNavMenu" />
    </div>

    <!-- Search bar -->
    <div class="flex-grow">
      <div v-if="shouldShowSearch" class="text-black-600 py-3">
        <i
          class="!hidden sm:!inline-block fa fa-search mr-4 rounded-full shadow-md p-2"
        />
        <input
          type="text"
          :value="searchText"
          class="sm:w-1/2 w-full focus:border-0 border-0 truncate"
          :placeholder="$t('common.search_placeholder')"
          @input="handleSearch"
        >
      </div>
    </div>
    <!-- Search bar end -->

    <div class="flex">
      <template v-if="!currentTeam">
        <!-- Referral -->
        <div class="mr-3 md:block hidden">
          <button
            class="btn btn-outline-primary"
            @click="$router.push(localePath({ name: 'settings-referral' }))"
          >
            {{ $t('sidebar.referral') }}
          </button>
        </div>
        <!-- Referral end -->

        <!-- Manage plans -->
        <div class="mr-3 md:block hidden">
          <button
            class="btn btn-primary"
            @click="$router.push(localePath({ name: 'manage-plans' }))"
          >
            {{ $t('common.manage_plans') }}
          </button>
        </div>
        <!-- Manage plans end -->
      </template>

      <!-- Noti -->
      <div class="mr-3 self-center">
        <NotificationBell />
      </div>
      <!-- Noti end -->

      <!-- Dropdown menu -->
      <el-dropdown trigger="click">
        <!-- User info -->
        <div
          id="nav__profile"
          class="flex items-center"
          @click="showTutorialLastStep"
        >
          <el-avatar :size="35" :src="currentUser.avatar" class="mr-2" />
          <div>
            <div class="text-sm font-semibold">
              <nobr>
                {{ currentUser.full_name }}
                <i class="el-icon-caret-bottom el-icon--right" />
              </nobr>
            </div>
            <div class="text-xs text-black-600">
              {{ currentTeam ? currentTeam.name : currentPlan.name }}
            </div>
          </div>
        </div>
        <!-- User info -->

        <el-dropdown-menu slot="dropdown" class="min-w-[200px]">
          <template v-if="!currentTeam">
            <el-dropdown-item
              class="text-warning md:hidden"
              icon="fa fa-tasks"
              @click.native="go('manage-plans')"
            >
              {{ $t('common.manage_plans') }}
            </el-dropdown-item>
            <el-dropdown-item
              class="text-warning md:hidden"
              icon="fa fa-user-friends"
              @click.native="go('settings-referral')"
            >
              {{ $t('data.settings.referral') }}
            </el-dropdown-item>
          </template>

          <el-dropdown-item
            class="text-warning"
            icon="fa fa-user-circle"
            @click.native="go('settings-account')"
          >
            {{ $t('data.profile_menu.account_settings') }}
          </el-dropdown-item>

          <el-dropdown-item class="text-warning" icon="far fa-life-ring">
            <a
              class="hover:no-underline text-current hover:text-current"
              :href="
                locale === 'vi'
                  ? 'https://support.locker.io/vi'
                  : 'https://support.locker.io'
              "
              target="_blank"
            >
              {{ $t('data.profile_menu.support_center') }}
            </a>
          </el-dropdown-item>

          <el-dropdown-item class="text-warning" icon="far fa-comment">
            <a
              class="hover:no-underline text-current hover:text-current"
              href="https://forum.locker.io"
              target="_blank"
            >
              {{ $t('data.profile_menu.feedback') }}
            </a>
          </el-dropdown-item>

          <el-dropdown-item
            class="text-warning"
            icon="far fa-flag"
            @click.native="startTutorial"
          >
            {{ $t('data.profile_menu.tour') }}
          </el-dropdown-item>

          <el-dropdown-item icon="fas fa-lock" @click.native="lock">
            {{ $t('data.profile_menu.lock') }}
          </el-dropdown-item>

          <el-dropdown-item icon="fas fa-sign-out-alt" @click.native="logout">
            {{ $t('data.profile_menu.logout') }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <!-- Dropdown menu end -->

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
import NotificationBell from './notifications/NotificationBell'

export default {
  components: {
    NotificationBell,
    SideBarMenu
  },
  asyncComputed: {
    async locked () {
      return await this.$vaultTimeoutService.isLocked()
    }
  },
  computed: {
    shouldShowSearch () {
      return [
        ...this.cipherRoutes,
        'vault',
        'shares',
        'trash',
        'vault-tfolders-tfolderId',
        'vault-folders-folderId',
        'shares-your-shares',
        'authenticator'
      ].includes(this.getRouteBaseName())
    },
    currentPlan () {
      return this.$store.state.currentPlan
    },
    currentTeam () {
      return this.teams[0]
    }
  },
  mounted () {
    // Set click event
    const navMenuDiv = document.getElementById('nav-content')
    const headerDiv = document.getElementById('header-default')
    const navMenu = document.getElementById('nav-toggle')

    document.onclick = check
    function check (e) {
      const target = e && e.target

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
    },
    startTutorial () {
      this.$store.commit('UPDATE_NOTICE', { showTutorial: true })
    },
    showTutorialLastStep () {
      if (this.$tutorial.isActive()) {
        this.$tutorial.cancel()
        this.$store.commit('UPDATE_NOTICE', { showTutorialStep6: true })
      }
    }
  }
}
</script>
<style scoped>
/* Enter and leave animations can use different */
/* durations and timing functions.              */
.slide-fade-enter-active {
  transition: all 0.2s ease;
}
.slide-fade-leave-active {
  transition: all 0.4s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
.el-dropdown-menu.notification {
  @apply max-h-[90vh];
  overflow-y: scroll;
}
</style>
