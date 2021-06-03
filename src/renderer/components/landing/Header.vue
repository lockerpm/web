<template>
  <nav
    id="header"
    class="fixed w-full z-30 top-0 bg-white"
  >
    <div class="w-full container mx-auto flex flex-wrap items-center justify-between mt-0 py-2">
      <!-- Logo -->
      <div class="pl-4 flex items-center">
        <nuxt-link to="/">
          <img
            src="~/assets/images/logo/locker-logo.svg"
            alt="CyStack Locker"
          >
        </nuxt-link>
      </div>
      <!-- Logo end -->

      <!-- Menu on mobile -->
      <div class="block lg:hidden pr-4">
        <a
          id="nav-toggle"
          class="text-3xl"
        >
          <i class="fa fa-bars" />
        </a>
      </div>
      <!-- Menu on mobile end -->

      <!-- Content -->
      <div
        id="nav-content"
        class="w-full flex-grow lg:flex lg:items-center lg:w-auto hidden mt-2 lg:mt-0 bg-white lg:bg-transparent p-4 lg:p-0 z-20"
      >
        <!-- Nav items -->
        <ul class="list-reset lg:flex justify-end flex-1 items-center">
          <li class="mr-3">
            <a class="inline-block py-2 px-4 font-bold no-underline" href="#">
              Active
            </a>
          </li>
          <li class="mr-3">
            <a class="inline-block no-underline hover:text-gray-800 hover:text-underline py-2 px-4" href="#">
              link
            </a>
          </li>
          <li class="mr-3">
            <a class="inline-block text-black no-underline hover:text-gray-800 hover:text-underline py-2 px-4" href="#">
              link
            </a>
          </li>
        </ul>
        <!-- Nav items end -->

        <!-- Right actions -->
        <button
          id="navAction"
          class="mx-auto lg:mx-0 hover:underline bg-white font-bold rounded-full mt-4 lg:mt-0 py-4 px-8 shadow"
        >
          Action
        </button>
        <!-- Right actions end -->
      </div>
    </div>
    <!-- Content end -->
  </nav>
</template>

<script>
export default {
  mounted () {
    // Set scroll event
    const header = document.getElementById('header')
    document.addEventListener('scroll', function () {
      const scrollPos = window.scrollY

      if (scrollPos > 10) {
        header.classList.add('shadow', 'border-b', 'border-gray-100')
      } else {
        header.classList.remove('shadow', 'border-b', 'border-gray-100')
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
