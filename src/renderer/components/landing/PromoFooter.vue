<template>
  <div
    class="md:flex md:items-center py-3 border-t border-black-200 landing-font-12 text-black-600 max-w-6xl mx-auto px-6"
  >
    <div class="flex items-center">
      <div v-if="locale === 'vi'">Một sản phẩm của</div>
      <div v-else>A product of</div>
      <a
        :href="
          locale === 'vi' ? 'https://cystack.net/vi' : 'https://cystack.net'
        "
        target="_blank"
      >
        <img
          class="h-4 ml-2 mr-3"
          src="~/assets/images/logo/CyStack.png"
          alt="CyStack"
        >
      </a>
    </div>
    <p class="!break-normal">
      Copyright © {{ currentYear }} Locker.io · All rights reserved.
    </p>
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
</template>
<script>
export default {
  computed: {
    currentYear () {
      return new Date().getFullYear()
    }
  }
}
</script>
