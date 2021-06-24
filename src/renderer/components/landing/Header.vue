<template>
  <nav
    id="header"
    class="fixed w-full z-30 transition duration-300 ease-in-out bg-transparent"
  >
    <div class="max-w-6xl mx-auto flex flex-wrap items-center justify-between mt-0 py-[14px] px-6">
      <!-- Logo -->
      <div class="flex items-center order-1">
        <nuxt-link to="/">
          <img
            src="~/assets/images/logo/locker_logo.png"
            alt="CyStack Locker"
            class="w-[105px] h-[28px]"
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
      <div class="hidden sm:flex lg:ml-[195px] lg:mr-0 ml-auto mr-6 lg:order-4 order-2">
        <a
          class="nav-item text-black px-4"
          href="#"
        >
          Đăng nhập
        </a>
        <a
          class="nav-item text-black"
          href="#"
        >
          Đăng ký
        </a>
        <nuxt-link :to="localeRoute({name: 'vault'})" class="btn btn-primary">
          vault
        </nuxt-link>
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
            <a
              class="inline-block nav-item text-black landing-transition"
              :href="item.link"
            >
              {{ item.name }}
            </a>
          </li>
          <li class="sm:hidden">
            <a
              class="inline-block nav-item text-black landing-transition"
              href="#"
            >
              Đăng nhập
            </a>
          </li>
          <li class="sm:hidden">
            <a
              class="inline-block nav-item text-black landing-transition"
              href="#"
            >
              Đăng ký
            </a>
          </li>
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
      menu: [
        {
          name: 'Lợi ích',
          link: 'how-it-works'
        },
        {
          name: 'Tính năng',
          link: 'features'
        },
        {
          name: 'Bảng giá',
          link: '#'
        },
        {
          name: 'Tải về',
          link: 'download'
        },
        {
          name: 'Doanh nghiệp',
          link: '#'
        }
      ]
    }
  },
  computed: {
    language () {
      return this.$store.state.user.language
    }
  },

  mounted () {
    // Set scroll event
    const header = document.getElementById('header')
    document.addEventListener('scroll', function () {
      const scrollPos = window.scrollY
      header.classList.remove('bg-transparent')
      header.classList.add('bg-white')
      if (scrollPos > 10) {
        header.classList.add('shadow-lg')
      } else {
        header.classList.remove('shadow-lg')
      }
      
    })

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
  }
}
</script>

<style>
.nav-item {
  @apply hover:no-underline hover:text-green;
  font-size: 14px;
}
</style>
