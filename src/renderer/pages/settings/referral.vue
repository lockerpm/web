<template>
  <div class="md:w-2/3 mx-auto">
    <div class="text-head-4 font-semibold mb-4">
      {{ $t('data.settings.referral') }}
    </div>
    <div class="text-lg text-black-600 mb-4">
      {{ $t('data.settings.referral_desc') }}
    </div>
    <div class="setting-wrapper">
      <div class="setting-section form-group">
        <div class="mb-2 font-medium">
          {{ $t('data.settings.referral_link') }}
        </div>
        <div class="setting-description">{{ $t('data.settings.referral_details') }}</div>
        <div class="md:flex items-center space-x-1 mt-3">
          <div class="input-group bg-black-300 mr-2 md:mb-0 mb-3">
            <input
              type="text"
              class="form-control bg-black-300"
              readonly
              :value="referrals.referral_link"
            >
            <div class="input-group-append">
              <button
                v-clipboard:copy="referrals.referral_link"
                v-clipboard:success="clipboardSuccessHandler"
                class="btn !bg-black-300 !bg-transparent !text-black-600 "
                type="button"
              >
                <i class="fas fa-clone" />
              </button>
            </div>
          </div>
          <!-- <ShareNetwork
            network="messenger"
            :title="title"
            :url="referrals.referral_link"
          >
            <button
              class="btn btn-icon btn-share bg-[#0082FF] !text-white"
              type="button"
            >
              <i class="fab fa-facebook-messenger text-head-5" />
            </button>
          </ShareNetwork> -->
          <ShareNetwork
            network="facebook"
            :title="title"
            :url="referrals.referral_link"
          >
            <button
              class="btn btn-icon btn-share bg-[#34589D] !text-white"
              type="button"
            >
              <i class="fab fa-facebook-f text-head-5" />
            </button>
          </ShareNetwork>
          <ShareNetwork
            network="twitter"
            :title="title"
            :url="referrals.referral_link"
          >
            <button
              class="btn btn-icon btn-share bg-[#1DA1F2] !text-white"
              type="button"
            >
              <i class="fab fa-twitter text-head-5" />
            </button>
          </ShareNetwork>
          <ShareNetwork
            network="telegram"
            :url="referrals.referral_link"
            :title="title"
          >
            <button
              class="btn btn-icon btn-share bg-[#0088cc] !text-white"
              type="button"
            >
              <i class="fab fa-telegram text-head-5" />
            </button>
          </ShareNetwork>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  asyncData ({ $axios }) {
    return $axios.$get('cystack_platform/pm/referrals')
      .then(res => {
        return {
          referrals: res
        }
      })
  },
  data () {
    return {
      title: this.$t('landing.title')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
