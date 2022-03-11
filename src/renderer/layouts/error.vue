<template>
  <div v-if="error.statusCode === 404" class="mt-[205px] mb-28">
    <!-- <img src="~/assets/images/landing/404.svg" class="mx-auto"> -->
    <div class="text-center mx-auto mt-[50px]">
      <p class="landing-font-20 text-black-600 mb-[15px]">
        {{ $t('landing_error.not_found') }}
      </p>
      <NuxtLink :to="localeRoute({name: 'index'})" class="text-primary hover:no-underline landing-font-22 font-bold">
        {{ $t('landing_error.back_to_home') }}
      </NuxtLink>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'landing',
  props: ['error'] // you can set a custom layout for the error page
}
</script>
