<template>
  <div class="lg:px-28 px-10 h-[60px] flex items-center border-0 border-b border-black-200 relative">
    <div id="nav-content" class="md:hidden hidden fixed top-0 left-0 h-screen" style="z-index: 1000">
      <div class="w-60 h-screen bg-aside min-h-500px min-w-60 flex flex-col justify-start relative">
        <button
          class="btn btn-clean absolute top-2 -right-2"
          @click="hideNavMenu"
        >
          <i class="el-icon-close text-lg text-white" />
        </button>
        <div class="mt-7 px-6">
          <img class="h-[32px]" src="~assets/images/logo/logo_white.svg">
        </div>

        <nav class="mt-7">
          <nuxt-link
            v-for="(item, index) in menu"
            :key="index"
            :to="localePath({name: item.routeName, params: $route.params})"
            class="flex items-center py-2 px-6 hover:text-white hover:bg-white hover:bg-opacity-20 text-black-400 font-semibold hover:no-underline"
            active-class="bg-white bg-opacity-20 text-white"
            :exact="item.exact"
          >
            <span class="text-sm font-medium">{{ $t(`sidebar.${item.label}`) }}</span>
          </nuxt-link>
        </nav>
      </div>
    </div>
    <div class="flex-grow">
      <el-select
        :value="currentTeam"
        :placeholder="$t('common.select_target')"
        class="middle-item"
        value-key="id"
        @change="selectProgram"
      >
        <el-option
          v-for="item in teams.filter(e => e.is_business)"
          :key="item.id"
          :label="item.name"
          :value="item"
        />
      </el-select>
    </div>
    <div class="flex">
      <el-dropdown trigger="click">
        <div class="flex items-center">
          <span
            v-if="currentTeam.id"
            class="w-[35px] h-[35px] rounded-full border flex items-center justify-center mr-2"
            :style="`borderColor: ${intToRGB(hashCode(currentTeam.name+currentTeam.id))}!important`"
          >
            <span class="text-black font-bold uppercase">{{ getAvatarString(currentTeam.name) }}</span>
          </span>
          <el-avatar v-else :size="35" :src="currentUser.avatar" class="mr-2" />
          <div>
            <div class="text-sm text-black font-semibold"><nobr>{{ currentTeam.name }} <i class="el-icon-caret-bottom el-icon--right" /></nobr></div>
            <div class="text-xs text-black-600">{{ $t(`data.members.role.${currentTeam.role}.title`) }}</div>
          </div>
        </div>
        <el-dropdown-menu slot="dropdown" class="min-w-[200px]">
          <el-dropdown-item class="text-warning" @click.native="goVault">
            {{ $t('data.admin_menu.my_vault') }}
          </el-dropdown-item>
          <el-dropdown-item class="text-warning" divided @click.native="goSetting">
            {{ $t('data.admin_menu.team_profile') }}
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="lock">
            {{ $t('data.profile_menu.lock') }}
          </el-dropdown-item>
          <el-dropdown-item @click.native="logout">
            <span class="text-danger">{{ $t('data.profile_menu.logout') }}</span>
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
export default {
  data () {
    return {
      menu: [
        {
          label: 'dashboard',
          routeName: 'admin-teamId',
          exact: true
        },
        {
          label: 'users',
          routeName: 'admin-teamId-users'
        },
        {
          label: 'groups',
          routeName: 'admin-teamId-groups'
        },
        {
          label: 'shared_folders',
          routeName: 'admin-teamId-shared-folders'
        },
        {
          label: 'policies',
          routeName: 'admin-teamId-policies'
        },
        {
          label: 'logs',
          routeName: 'admin-teamId-activity-logs'
        },
        {
          label: 'settings',
          routeName: 'admin-teamId-settings'
        }
      ]
    }
  },
  computed: {
    currentTeam () {
      return this.$store.state.currentTeam
    }
  },
  mounted () {
    // Set click event
    const navMenuDiv = document.getElementById('nav-content')
    const navMenu = document.getElementById('nav-toggle')

    document.onclick = check
    function check (e) {
      const target = (e && e.target)

      // Nav Menu
      if (!checkParent(target, navMenuDiv)) {
        // click NOT on the menu
        if (checkParent(target, navMenu)) {
          // click on the link
          if (navMenuDiv.classList.contains('hidden')) {
            navMenuDiv.classList.remove('hidden')
          } else {
            navMenuDiv.classList.add('hidden')
          }
        } else {
          // click both outside link and outside menu, hide menu
          navMenuDiv.classList.add('hidden')
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
    goVault () {
      this.$router.push(this.localeRoute({ name: 'vault' }))
    },
    goSetting () {
      this.$router.push(this.localeRoute({ name: 'admin-teamId-settings', params: { teamId: this.$route.params.teamId } }))
    },
    getAvatarString (string) {
      const matches = string.match(/\b(\w)/g)
      if (matches && matches.length > 1) {
        return matches.join('').substring(0, 2)
      }

      return string.substring(0, 2)
    },
    hashCode (str) { // java String#hashCode
      let hash = 0
      for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash)
      }
      return hash
    },
    intToRGB (i) {
      const c = (i & 0x00FFFFFF)
        .toString(16)
        .toUpperCase()

      return '#' + '00000'.substring(0, 6 - c.length) + c
    },
    selectProgram (value) {
      this.$router.push(this.localeRoute({ name: 'admin-teamId', params: { teamId: value.id } }))
    },
    hideNavMenu () {
      const navMenuDiv = document.getElementById('nav-content')
      if (navMenuDiv.classList.contains('hidden')) {
        navMenuDiv.classList.remove('hidden')
      } else {
        navMenuDiv.classList.add('hidden')
      }
    }
  }
}
</script>
