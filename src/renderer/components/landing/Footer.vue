<template>
  <footer>
    <div class="max-w-6xl mx-auto px-6">
      <!-- Menu -->
      <div class="w-full lg:flex md:pt-12 md:pb-24">
        <!-- Menu items -->
        <div class="w-full lg:w-9/12">
          <div class="grid grid-cols-12 gap-8 py-8 md:py-12">
            <div
              v-for="(parent, i) in $t('landing_footer.menu')"
              :key="i"
              class="col-span-6 md:col-span-3"
            >
              <h6 class="font-bold landing-font-16 mb-[20px]">
                {{ parent.category }}
              </h6>
              <ul>
                <li
                  v-for="(item, index) in parent.items"
                  :key="index"
                  class="mb-3"
                >
                  <a
                    v-if="item.external"
                    target="_blank"
                    class="text-black-600 landing-transition hover:no-underline hover:text-green sm:max-w-[170px] block"
                    :href="item.link"
                  >
                    {{ item.name }}
                  </a>
                  <nuxt-link
                    v-else-if="item.params"
                    class="text-black-600 landing-transition hover:no-underline hover:text-green sm:max-w-[170px] block"
                    :to="localePath(`/${item.link}?${item.params}`)"
                  >
                    {{ item.name }}
                  </nuxt-link>
                  <nuxt-link
                    v-else
                    class="text-black-600 landing-transition hover:no-underline hover:text-green sm:max-w-[170px] block"
                    :to="localePath(`/${item.link}`)"
                  >
                    {{ item.name }}
                  </nuxt-link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <!-- Menu items end -->

        <!-- Social -->
        <div class="w-full lg:w-3/12">
          <div class="py-8 md:py-12">
            <div class="w-full mb-8">
              <h6 class="font-bold landing-font-16 mb-[20px]">
                {{ $t('landing_footer.join') }}
              </h6>
              <div class="flex">
                <a
                  class="text-black-600 landing-font-22 landing-transition mr-6 w-10 h-10 text-center border hover:border-green"
                  style="border-radius: 50%"
                  target="_blank"
                  href="https://forum.locker.io"
                >
                  <i class="fac fa-locker mt-2" />
                </a>
                <a
                  class="text-black-600 landing-font-22 landing-transition mr-6 w-10 h-10 text-center border hover:border-green"
                  style="border-radius: 50%"
                  target="_blank"
                  href="https://www.facebook.com/lockerpm"
                >
                  <i class="fab fa-facebook-f mt-2" />
                </a>
                <a
                  class="text-black-600 landing-font-22 landing-transition mr-6 w-10 h-10 text-center border hover:border-green"
                  style="border-radius: 50%"
                  target="_blank"
                  href="https://twitter.com/lockerpm"
                >
                  <i class="fab fa-twitter mt-2" />
                </a>
              </div>
              <div class="flex mt-[20px]">
                <a
                  class="text-black-600 landing-font-22 landing-transition mr-6 w-10 h-10 text-center border hover:border-green"
                  style="border-radius: 50%"
                  target="_blank"
                  href="https://www.linkedin.com/showcase/lockerpm/"
                >
                  <i class="fab fa-linkedin-in mt-2" />
                </a>
                <a
                  class="text-black-600 landing-font-22 landing-transition mr-6 w-10 h-10 text-center border hover:border-green"
                  style="border-radius: 50%"
                  target="_blank"
                  href="https://www.instagram.com/lockerpasswordmanager/"
                >
                  <i class="fab fa-instagram mt-2" />
                </a>
                <a
                  class="text-black-600 landing-font-22 landing-transition mr-6 w-10 h-10 text-center border hover:border-green"
                  style="border-radius: 50%"
                  target="_blank"
                  href="https://www.youtube.com/channel/UCDnpPE-fftcvkOUROdOrByA"
                >
                  <i class="fab fa-youtube mt-2" />
                </a>
              </div>
              <address class="not-italic mt-5">
                <p class="landing-font-14 text-black-600">
                  {{ $t('common.cystack_address') }}<br>
                  Email: contact@locker.io<br>
                  Phone: (+84) 247 109 9656
                </p>
              </address>
            </div>
            <div class="w-full">
              <!-- Language switcher -->
              <div
                :class="locale==='vi'?'opacity-06':''"
                :style="{paddingLeft: locale==='vi'?'22px': '0px'}"
                class="text-sm text-black-600 font-normal hover:text-green"
                style="cursor: pointer;"
                @click="setLocale('en')"
              >
                <span v-show="locale!=='vi'" class="mr-2"><i class="fas fa-location-arrow" /></span>English
              </div>
              <div
                :class="locale==='en'?'opacity-06':''"
                :style="{paddingLeft: locale!=='vi'?'22px': '0px'}"
                class="text-sm text-black-600 font-normal hover:text-green"
                style="margin-top: 11px; cursor: pointer;"
                @click="setLocale('vi')"
              >
                <span v-show="locale==='vi'" class="mr-2"><i class="fas fa-location-arrow" /></span>Vietnamese
              </div>

              <!-- Language switcher end -->
            </div>
          </div>
        </div>
        <!-- Social end -->
      </div>
      <!-- Menu end -->

      <!-- Bottom -->
      <div class="md:flex md:items-center py-3 border-t border-black-200 landing-font-12 text-black-600">
        <div class="flex items-center">
          <div v-if="locale==='vi'">
            Một sản phẩm của
          </div>
          <div v-else>
            A product of
          </div>
          <a :href="locale==='vi'?'https://cystack.net/vi':'https://cystack.net'" target="_blank">
            <img class="h-4 ml-2 mr-3" src="~/assets/images/logo/CyStack.png" alt="CyStack">
          </a>
        </div>
        <div class="">
          Copyright © {{ currentYear }} Locker.io ·  All rights reserved.
        </div>
        <div class="flex-grow md:text-right">
          <nuxt-link
            :to="localePath(`/terms`)"
            class="mr-4 text-black-600 hover:no-underline hover:text-green"
          >
            {{ $t('landing_footer.terms') }}
          </nuxt-link>
          <nuxt-link
            :to="localePath(`/privacy`)"
            class="text-black-600 hover:no-underline hover:text-green"
          >
            {{ $t('landing_footer.policy') }}
          </nuxt-link>
        </div>
      </div>
      <!-- Bottom -->
    </div>
  </footer>
</template>

<script>
export default {
  computed: {
    currentYear () { return new Date().getFullYear() }
  },
  methods: {
    setLocale (locale) {
      this.changeLang(locale)
      setTimeout(() => {
        if (this.$route.path.startsWith('/vi/blog') && locale === 'en') {
          this.$router.push('/blog')
          return
        }
        if (this.$route.path.startsWith('/blog') && locale === 'vi') {
          this.$router.push('/vi/blog')
          return
        }
        if (this.$route.path.startsWith('/vi/whitepaper') && locale === 'en') {
          window.location.replace('/whitepaper')
          return
        }
        if (this.$route.path.startsWith('/whitepaper') && locale === 'vi') {
          window.location.replace('/vi/whitepaper')
        }
      }, 200)
    }

  }
}
</script>

<style scoped>

</style>
