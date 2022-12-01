<template>
  <div>
    <div class="md:w-[410px] md:mx-0 mx-5 border border-black-200 rounded py-[2.8125rem] px-6 text-center">
      <div class="text-head-4 font-semibold mb-2.5">
        {{ $t('data.policies.lock_by_2fa.title') }}
      </div>
      <div class="text-base text-black-600 mb-4">
        {{ $t('data.policies.lock_by_2fa.desc') }}
      </div>
      <div class="inline-block mb-4 select-none">
        <div class="flex items-center">
          <div class="rounded-[21px] flex items-center bg-black-250 p-1 mx-auto">
            <client-only>
              <img :src="currentUser.avatar" alt="" class="w-[28px] h-[28px] rounded-full mr-2">
            </client-only>
            <div class="mr-2">{{ currentUser.email }}</div>
          </div>
        </div>
      </div>

      <img src="~assets/images/pages/lock/lock-2fa.png" alt="Require 2FA" class="w-full mb-8">

      <el-button
        type="primary"
        class="w-full"
        @click="goToId"
      >
        {{ $t('data.policies.lock_by_2fa.enable_btn') }}
      </el-button>
    </div>

    <div>
      <p class="w-full text-center mt-4">
        {{ $t('data.policies.lock_by_2fa.logout_text') }}
        <button
          class="btn btn-sm btn-clean btn-primary !px-0 !font-normal"
          @click="logout"
        >
          {{ $t('common.logout') }}
        </button>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    goToId () {
      window.location = 'https://id.locker.io/security/two-step-verification'
    }
  }
}
</script>

<style scoped>

</style>
