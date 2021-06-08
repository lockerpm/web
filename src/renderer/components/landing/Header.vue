<template>
  <nav
    id="header"
    class="fixed w-full z-30 transition duration-300 ease-in-out bg-white"
  >
    <div class="max-w-6xl mx-auto flex flex-wrap items-center justify-between mt-0 py-2 px-6">
      <!-- Logo -->
      <div class="flex items-center">
        <nuxt-link to="/">
          <img
            src="~/assets/images/logo/locker-logo.svg"
            alt="CyStack Locker"
          >
        </nuxt-link>
      </div>
      <!-- Logo end -->

      <!-- Icon on mobile -->
      <div class="block lg:hidden landing-transition">
        <a
          id="nav-toggle"
          class="landing-font-28 text-black landing-transition"
        >
          <i class="fa fa-bars" />
        </a>
      </div>
      <!-- Icon on mobile end -->

      <!-- Content -->
      <div
        id="nav-content"
        class="w-full flex-grow lg:flex lg:items-center lg:w-auto hidden mt-2 lg:mt-0 bg-white lg:bg-transparent p-4 lg:p-0 z-20"
      >
        <!-- Nav items -->
        <ul class="list-reset lg:flex justify-end flex-1 items-center">
          <li
            v-for="(item, index) in menu"
            :key="index"
            class="mr-1"
          >
            <a
              class="inline-block py-2 px-4 hover:no-underline landing-font-15 text-black landing-transition"
              :href="item.link"
            >
              {{ item.name }}
            </a>
          </li>
        </ul>
        <!-- Nav items end -->
      </div>
      <!-- Content end -->

      <!-- Right actions -->
      <div class="hidden lg:flex">
        <a
          class="landing-btn landing-bg-green hover:opacity-80"
          href="#"
        >
          Đăng ký
        </a>
      </div>
      <!-- Right actions end -->
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
          link: '#'
        },
        {
          name: 'Tính năng',
          link: '#'
        },
        {
          name: 'Bảng giá',
          link: '#'
        },
        {
          name: 'Tải về',
          link: '#'
        },
        {
          name: 'Doanh nghiệp',
          link: '#'
        }
      ]
    }
  },

  mounted () {
    // Set scroll event
    const header = document.getElementById('header')
    document.addEventListener('scroll', function () {
      const scrollPos = window.scrollY

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

<style scoped>

</style>
