<template>
  <div class="full-width bg-[#DFDFDF]">
    <div class="max-w-6xl px-6 mx-auto h-screen flex items-center justify-center">
      <div class="m-login__container markdown-body">
        <div class="text-center mb-4">
          <img
            v-if="token.valid === true"
            src="~/assets/images/img-cs.svg#icon-successful"
            class="mx-auto"
            style="height: 100px; background: transparent"
          >
          <img
            v-if="token.valid === false"
            src="~/assets/images/img-cs.svg#icon-error_1_"
            class="mx-auto"
            style="height: 100px; background: transparent"
          >
        </div>
        <transition
          appear
          appear-active-class="animated flipInY"
        >
          <div
            v-if="token.valid === true"
            class="m-login__signin"
          >
            <div class="m-login__head text-center">
              <div class="m-login__desc">
                <h1 class="landing-font-28 font-semibold mb-3">
                  {{ $t("business.register.active_l1") }}
                </h1>
                <p class="mb-0">
                  {{ $t("business.register.active_l2") }}
                </p>
                <button
                  class="btn btn-primary m-btn--wide mt-4"
                  @click="goNext()"
                >
                  {{ $t("business.register.sign_in_btn") }} ({{ seconds }}s)
                </button>
              </div>
            </div>
          </div>
          <div
            v-if="token.valid === false"
            class="m-login__signin"
          >
            <div class="m-login__head text-center">
              <div class="m-login__desc">
                <h1 class="landing-font-28 font-semibold mb-3">
                  {{ $t("business.register.active_failed_l1") }}
                </h1>
                <p class="mb-0">
                  {{ $t("business.register.active_failed_l2") }}
                </p>
                <button
                  class="btn btn-light m-btn--wide mt-4"
                  @click="backHome"
                >
                  {{ $t("business.register.back_btn") }}
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

export default {
  layout: 'register',
  asyncData ({ $axios, params }) {
    const headers = {
      'CF-Access-Client-Id': process.env.ACCESS_CLIENT_ID,
      'CF-Access-Client-Secret': process.env.ACCESS_CLIENT_SECRET
    }
    return $axios.$post('cystack_platform/pm/payments/trial/enterprise', { token: params.token }, { headers })
      .then(res => {
        console.log(res)
        return {
          token: { valid: true }
        }
      })
      .catch(e => {
        return {
          token: { valid: false }
        }
      })
  },
  data () {
    return {
      token: {
        valid: null,
        key: ''
      },
      seconds: 10,
      intervalTimer: null
    }
  },
  mounted () {
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
      this.$router.push('/vault')
    },
    backHome () {
      this.$router.push(this.localePath('/business/register'))
    }
  }
}
</script>

<style scoped>
</style>
