<template>
  <div class="mt-[205px] mb-28">
    <img src="~/assets/images/404.svg" class="mx-auto">
    <div class="text-center mx-auto mt-[50px]">
      <p class="landing-font-20 text-black-600 mb-[15px]">
        The requested page could not be found!
      </p>
      <NuxtLink :to="localeRoute({name: 'index'})" class="text-primary hover:no-underline landing-font-22 font-bold">
        Back to Home
      </NuxtLink>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'landing'
}
</script>
