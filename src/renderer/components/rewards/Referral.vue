<template>
  <div class="lg:w-3/4 md:w-full">
    <el-collapse v-model="collapse" class="mb-8">
      <el-collapse-item
        class="setting-wrapper"
        name="collapse"
      >
        <!-- Header -->
        <template slot="title">
          <div class="py-5 flex items-center justify-between" style="width: 95%">
            <div class="flex items-center">
              <div class="text-head-5 font-semibold">
                {{ $t('data.rewards.referral.title') }}
              </div>
              <span v-if="!collapse.length" class="ml-4 text-black-500">
                {{ $t('data.rewards.note1', { month: 1 }) }}
              </span>
            </div>
            <div class="flex items-center">
              <div class="mr-3 font-semibold">
                {{ referrals.referred }}/{{ referrals.referral_limit }}
              </div>
              <img :src="require('~/assets/images/icons/referral.svg')">
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
            <div style="width: calc(100% - 142px)">
              <el-input
                :value="referrals.referral_link"
                readonly
              >
                <div slot="suffix" class="flex items-center mr-3 cursor-pointer">
                  <span
                    v-clipboard:copy="'referrals.referral_link'"
                    v-clipboard:success="clipboardSuccessHandler"
                    class="flex items-center cursor-pointer"
                  >
                    <i class="far fa-copy" />
                  </span>
                </div>
              </el-input>
            </div>
            <div class="flex items-center">
              <img :src="require('~/assets/images/icons/facebook.svg')" class="mr-2">
              <img :src="require('~/assets/images/icons/twitter.svg')" class="mr-2">
              <img :src="require('~/assets/images/icons/telegram.svg')">
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
  },
  data () {
    return {
      collapse: [],
      referrals: {
        referral_link: ''
      }
    }
  },
  computed: {
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
