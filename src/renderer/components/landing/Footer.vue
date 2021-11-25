<template>
  <footer>
    <div class="max-w-6xl mx-auto px-6">
      <!-- Menu -->
      <div class="w-full lg:flex md:pt-12 md:pb-24">
        <!-- Menu items -->
        <div class="w-full lg:w-9/12">
          <div class="grid sm:grid-cols-12 gap-8 py-8 md:py-12">
            <div
              v-for="(parent, i) in menu"
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
          <div class="grid sm:grid-cols-12 gap-8 py-8 md:py-12">
            <div class="col-span-12">
              <h6 class="font-bold landing-font-16 mb-[20px]">
                Follow us
              </h6>

              <div class="flex">
                <a
                  class="text-black-600 landing-font-22 landing-transition mr-6 w-10 h-10 text-center border hover:border-green"
                  style="border-radius: 50%"
                  href="#"
                >
                  <i class="fab fa-facebook-f mt-2" />
                </a>
                <a
                  class="text-black-600 landing-font-22 landing-transition mr-6 w-10 h-10 text-center border hover:border-green"
                  style="border-radius: 50%"
                  href="#"
                >
                  <i class="fab fa-twitter mt-2" />
                </a>
                <a
                  class="text-black-600 landing-font-22 landing-transition mr-6 w-10 h-10 text-center border hover:border-green"
                  style="border-radius: 50%"
                  href="#"
                >
                  <i class="fab fa-linkedin-in mt-2" />
                </a>
                <!--                <a-->
                <!--                  class="text-black-600 landing-font-32 landing-transition mr-6"-->
                <!--                  href="#"-->
                <!--                >-->
                <!--                  <i class="fab fa-twitter" />-->
                <!--                </a>-->
                <!--                <a-->
                <!--                  class="text-black-600 landing-font-32 landing-transition"-->
                <!--                  href="#"-->
                <!--                >-->
                <!--                  <i class="fab fa-linkedin" />-->
                <!--                </a>-->
              </div>
            </div>
          </div>
        </div>
        <!-- Social end -->
      </div>
      <!-- Menu end -->

      <!-- Bottom -->
      <div class="md:flex md:items-center md:justify-between py-3 border-t border-black-200">
        <div>
          <p class="text-black-600 landing-font-12">
            Copyright © {{ currentYear }} Locker.io ·  All rights reserved.
          </p>
        </div>
        <div>
          <a
            href="#"
            class="text-black-600 landing-font-12 mr-4 hover:no-underline hover:text-green"
          >
            Điều khoản
          </a>
          <a
            href="#"
            class="text-black-600 landing-font-12 hover:no-underline hover:text-green"
          >
            Chính sách
          </a>
        </div>
      </div>
      <!-- Bottom -->
    </div>
  </footer>
</template>

<script>
export default {

  data () {
    return {
      menu: this.$t('landing_footer.menu')
    }
  },
  computed: {
    currentYear () { return new Date().getFullYear() }
  }
}
</script>

<style scoped>

</style>
