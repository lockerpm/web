<template>
  <div class="full-width bg-[#F4F5F7]">
    <div v-if="loading" style="height: 100vh">
      <BusyOverlay />
    </div>

    <div
      v-else
      class="max-w-6xl px-6 mx-auto h-screen flex items-center justify-center"
    >
      <div class="m-login__container markdown-body">
        <div class="text-center mb-6">
          <img
            v-if="token.valid"
            src="~/assets/images/email-success-locker.svg"
            class="mx-auto"
            style="height: 100px; background: transparent"
          >
          <img
            v-else
            src="~/assets/images/img-cs.svg#icon-error_1_"
            class="mx-auto"
            style="height: 100px; background: transparent"
          >
        </div>
        <transition appear appear-active-class="animated flipInY">
          <div v-if="token.valid" class="m-login__signin">
            <div class="m-login__head text-center">
              <div class="m-login__desc">
                <h1 class="landing-font-28 font-semibold mb-4">
                  {{ $t('business.register.active_l1') }}
                </h1>
                <p class="mb-0">
                  {{ $t('business.register.active_l2') }}
                </p>
                <button
                  class="btn btn-primary m-btn--wide mt-6"
                  @click="goNext()"
                >
                  {{ $t('business.register.sign_in_btn') }} ({{ seconds }}s)
                </button>
              </div>
            </div>
          </div>
          <div v-else class="m-login__signin">
            <div class="m-login__head text-center">
              <div class="m-login__desc">
                <h1 class="landing-font-28 font-semibold mb-4">
                  {{ $t('business.register.active_failed_l1') }}
                </h1>
                <p class="mb-0">
                  {{ $t('business.register.active_failed_l2') }}
                </p>
                <button
                  class="btn btn-primary m-btn--wide mt-6"
                  @click="backHome"
                >
                  {{ $t('business.register.back_btn') }}
                </button>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import BusyOverlay from '@/components/BusyOverlay'

export default {
  components: {
    BusyOverlay
  },
  layout: 'register',
  data () {
    return {
      token: {
        valid: null
      },
      loading: true,
      seconds: 10,
      intervalTimer: null
    }
  },
  async mounted () {
    try {
      const token = this.$route.params.token
      if (token) {
        await this.$axios.$post('cystack_platform/pm/payments/trial/enterprise', {
          token
        })
        this.token.valid = true
      } else {
        this.token.valid = false
      }
    } catch (error) {
      console.log(error)
      this.token.valid = false
    }
    this.loading = false
    if (this.token.valid) {
      this.intervalTimer = setInterval(async () => {
        this.seconds--
        if (this.seconds === 0) {
          await this.goNext()
        }
      }, 1000)
    }
  },
  methods: {
    async goNext () {
      clearInterval(this.intervalTimer)
      // this.$router.push(this.localePath('/vault'))
      window.location = 'https://passwords.locker.io'
    },
    backHome () {
      this.$router.push(this.localePath('/business/register'))
    }
  }
}
</script>

<style scoped></style>
