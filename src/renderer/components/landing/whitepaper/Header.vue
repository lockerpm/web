<template>
  <nav
    id="header"
    class="fixed w-full z-[90] transition duration-300 ease-in-out bg-white shadow-md"
  >
    <div class="flex flex-wrap items-center justify-between mt-0 py-[14px] px-7">
      <!-- Logo -->
      <div class="flex items-center order-1">
        <nuxt-link :to="localePath('/whitepaper')">
          <img
            src="/logo-whitepaper.svg"
            alt="Locker Whitepaper"
            class="h-[36px]"
          >
        </nuxt-link>
      </div>
      <!-- Logo end -->

      <!-- Icon on mobile -->
      <div class="block lg:hidden landing-transition order-3">
        <a
          id="nav-toggle"
          class="landing-font-28 text-black landing-transition"
        >
          <i class="fa fa-bars" />
        </a>
      </div>
      <!-- Icon on mobile end -->

      <!-- Right actions -->
      <div class="hidden sm:flex lg:ml-16 lg:mr-0 ml-auto mr-6 lg:order-4 order-2">
        <template v-if="showMyVaultBtn">
          <a href="#" class="landing-btn" @click.prevent="goToVault">My Vault</a>
        </template>
        <template v-else>
          <nuxt-link
            class="nav-item text-primary font-semibold px-4 self-center"
            to="/login"
          >
            {{ $t('common.login') }}
          </nuxt-link>
          <nuxt-link
            class="nav-item btn btn-primary hover:!text-white"
            to="/register"
          >
            {{ $t('common.sign_up') }}
          </nuxt-link>
        </template>
      </div>
      <!-- Right actions end -->

      <!-- Content -->
      <div
        id="nav-content"
        class="order-3 w-full mr-1 flex-grow lg:flex lg:items-start lg:w-auto hidden mt-2 lg:mt-0 bg-white lg:bg-transparent p-4 lg:p-0 z-20"
      >
        <!-- Nav items -->
        <ul class="list-reset lg:flex justify-end flex-1 items-center gap-x-[45px]">
          <li
            v-for="(item, index) in menu"
            :key="index"
          >
            <a v-if="item.external" :href="item.link" target="_blank" class="inline-block nav-item text-black landing-transition">
              {{ item.name }}
            </a>
            <nuxt-link
              v-else
              class="inline-block nav-item text-black landing-transition"
              :to="localeRoute({name: item.link})"
              active-class=""
            >
              {{ item.name }}
            </nuxt-link>
          </li>
          <hr class="sm:hidden my-5 opacity-20">
          <div class="sm:hidden">
            <el-select :value="language" placeholder="Select Language" @change="setLocale">
              <el-option
                :label=" $t('data.settings.vietnamese')"
                value="vi"
              />
              <el-option
                :label=" $t('data.settings.english')"
                value="en"
              />
            </el-select>
          </div>
          <template v-if="showMyVaultBtn">
            <li class="sm:hidden">
              <a href="#" class="inline-block nav-item text-black landing-transition" @click.prevent="goToVault">My Vault</a>
            </li>
          </template>
          <template v-else>
            <li class="sm:hidden">
              <nuxt-link
                class="inline-block nav-item text-black landing-transition"
                to="/login"
              >
                {{ $t('common.login') }}
              </nuxt-link>
            </li>
            <li class="sm:hidden">
              <nuxt-link
                class="inline-block nav-item text-black landing-transition"
                to="/register"
              >
                {{ $t('common.sign_up') }}
              </nuxt-link>
            </li>
          </template>
        </ul>
        <!-- Nav items end -->
      </div>
      <!-- Content end -->
    </div>
  </nav>
</template>

<script>
export default {
  data () {
    return {
      menu: [{ name: 'Home', link: 'index' }].concat(this.$t('landing_header.menu'))
    }
  },
  computed: {
    language () {
      return this.$store.state.user.language
    },
    showMyVaultBtn () {
      return this.isLoggedIn || !!this.$cookies.get('cs_locker_token')
    }
  },
  mounted () {
    // Set scroll event
    // const header = document.getElementById('header')
    // document.addEventListener('scroll', function () {
    //   const scrollPos = window.scrollY
    //   if (scrollPos > 10) {
    //     header.classList.add('shadow-lg')
    //     header.classList.remove('bg-transparent')
    //     header.classList.add('bg-white')
    //   } else {
    //     header.classList.remove('shadow-lg')
    //     header.classList.add('bg-transparent')
    //     header.classList.remove('bg-white')
    //   }
    // })

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
    setLocale (locale) {
      this.changeLang(locale)
      setTimeout(() => {
        if (locale === 'vi') {
          window.location.replace('/vi/whitepaper')
          return
        }
        window.location.replace('/whitepaper')
      }, 200)
    }
  }
}
</script>

<style>
.nav-item {
  @apply hover:no-underline hover:text-green;
  font-size: 14px;
}
#header ul li a.nuxt-link-exact-active {
  font-weight: 600;
  color: green !important;
}
a,
a:visited {
  text-decoration: none;
}

</style>
