<template>
  <div>
    <el-collapse v-model="collapse" class="mb-8">
      <el-collapse-item class="setting-wrapper" name="collapse">
        <!-- Header -->
        <template slot="title">
          <div class="w-full">
            <div
              class="py-5 flex items-center justify-between"
              style="width: calc(100% - 24px)"
            >
              <div class="flex items-center">
                <div>
                  <div class="text-head-5 font-semibold">
                    {{ $t('data.rewards.referral.title') }}
                  </div>
                  <span
                    v-if="!collapse.length"
                    class="text-black-500 lg:hidden md:flex"
                  >
                    {{ $t('data.rewards.note1', { month: 1, plan: planText }) }}
                  </span>
                </div>
                <span
                  v-if="!collapse.length"
                  class="ml-4 text-black-500 lg:flex md:hidden hidden"
                >
                  {{ $t('data.rewards.note1', { month: 1, plan: planText }) }}
                </span>
              </div>
              <div class="flex items-center">
                <div class="mr-3 font-semibold">
                  {{ referrals.referred }}/{{ referrals.referral_limit }}
                </div>
                <img :src="require('~/assets/images/icons/referral.svg')">
              </div>
            </div>
            <div
              v-if="
                currentPlan.alias !== 'pm_free' &&
                  currentPlan.extra_time > 0 &&
                  referrals.referred > 0
              "
              class="flex items-center pb-5"
            >
              <a href="/settings/plans-billing">{{
                $t('data.rewards.discontinue')
              }}</a>
              <span class="ml-1">{{
                $t('data.rewards.discontinue_note')
              }}</span>
            </div>
          </div>
        </template>
        <!-- Header end -->
        <!-- Body -->
        <div class="px-5">
          <div class="lg:w-1/2 md:w-full mb-4">
            {{ $t('data.rewards.referral.subtitle') }}
          </div>
          <div class="text-head-6 font-semibold">
            {{ $t('data.rewards.referral.subtitle1') }}
          </div>
          <div class="mb-4 text-black-500">
            {{ $t('data.rewards.referral.subtitle1_desc') }}
          </div>
          <div class="flex items-center justify-between w-full">
            <div style="width: calc(100% - 160px)">
              <el-input :value="referrals.referral_link" readonly>
                <div
                  slot="suffix"
                  class="flex items-center mr-3 cursor-pointer"
                >
                  <span
                    v-clipboard:copy="referrals.referral_link"
                    v-clipboard:success="clipboardSuccessHandler"
                    class="flex items-center cursor-pointer"
                  >
                    <i class="far fa-copy" />
                  </span>
                </div>
              </el-input>
            </div>
            <div class="flex items-center">
              <ShareNetwork
                network="facebook"
                :title="title"
                :url="referrals.referral_link"
                class="mr-2"
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
                class="mr-2"
              >
                <button
                  class="btn btn-icon btn-share bg-[#1DA1F2] !text-white"
                  type="button"
                >
                  <i class="fab fa-twitter text-head-5" />
                </button>
              </ShareNetwork>
              <!-- Use custom link for Telegram because the ue-social-sharing version is bugged -->
              <a
                target="_blank"
                :href="`https://t.me/share/url?url=${referrals.referral_link}&text=${title}`"
                class="btn btn-icon btn-share bg-[#0088cc] !text-white"
                type="button"
              >
                <i class="fab fa-telegram text-head-5" />
              </a>
            </div>
          </div>
        </div>
        <!-- Body end -->
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    planText: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      collapse: [],
      title: this.$t('landing.title'),
      referrals: {
        referral_link: ''
      }
    }
  },
  created () {
    this.getReferrals()
  },
  methods: {
    getReferrals () {
      this.$axios.$get('cystack_platform/pm/referrals').then(res => {
        this.referrals = res
      })
    }
  }
}
</script>
