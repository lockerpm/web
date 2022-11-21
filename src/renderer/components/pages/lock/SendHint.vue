<template>
  <div>
    <div class="md:w-[410px] md:mx-0 mx-5 border border-black-200 rounded py-[2.8125rem] px-6 text-center">
      <!-- Get hint step 1 -->
      <template v-if="step === 1">
        <div class="text-head-4 font-semibold mb-2.5">
          {{ $t('master_password.master_password_hint') }}
        </div>
        <div class="text-base mb-4">
          {{ $t('master_password.master_password_hint_desc') }}
        </div>
        <div class="inline-block mb-8 select-none">
          <div class="rounded-[21px] flex items-center bg-black-250 p-1 mx-auto">
            <client-only>
              <img :src="currentUser.avatar" alt="" class="w-[28px] h-[28px] rounded-full mr-2">
            </client-only>
            <div class="mr-2">{{ currentUser.email }}</div>
          </div>
        </div>
        <div class="form-group">
          <button
            class="btn btn-primary w-full"
            :disabled="loadingSend"
            @click="sendHint"
          >
            {{ $t('master_password.send') }}
          </button>
        </div>
      </template>
      <!-- Get hint step 1 end -->

      <!-- Get hint step 2 - sent hint success -->
      <template v-if="step === 2">
        <img src="~/assets/images/icons/icon_settings.svg" alt="" class="mx-auto mb-4">
        <div class="text-head-4 font-semibold mb-2.5">
          {{ $t('master_password.master_password_hint') }}
        </div>
        <div class="text-base mb-4">
          {{ $t('master_password.hint_success') }}
        </div>
        <button class="btn btn-clean !text-primary !pb-0" @click="handleGoBack">
          <i class="fa fa-chevron-left" />&nbsp;&nbsp;&nbsp;{{ $t('master_password.back_login') }}
        </button>
      </template>
      <!-- Get hint step 3 end -->
    </div>

    <div v-if="step === 1" class="mt-1">
      <button class="btn btn-clean !text-primary" @click="handleGoBack">
        <i class="fa fa-chevron-left" />&nbsp;&nbsp;&nbsp;{{ $t('master_password.back_login') }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    goBack: {
      type: Function,
      default: () => () => {}
    }
  },
  data () {
    return {
      step: 1,
      loadingSend: false
    }
  },
  methods: {
    sendHint () {
      this.loadingSend = true
      this.$axios.$post('cystack_platform/pm/users/password_hint', {
        email: this.currentUser.email
      })
        .then(res => {
          this.loadingSend = false
          this.step = 2
        })
    },
    handleGoBack () {
      this.goBack()
      this.step = 1
    }
  }
}
</script>

<style scoped>

</style>
