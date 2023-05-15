<template>
  <div class="rewards">
    <div class="rewards__generate-code">
      <div class="flex-column-fluid lg:px-28 py-8 md:px-10 px-4">
        <p>{{ $t('data.rewards.subtitle') }}</p>
        <div class="my-6">
          <el-progress
            :percentage="totalPercent"
            :show-text="false"
            status="success"
            style="width: 260px;"
          />
          <p class="mt-1">
            {{ $t('data.rewards.progress', { percent: totalPercent }) }}
          </p>
        </div>
        <GenerateCode />
      </div>
    </div>
    <div class="flex-column-fluid lg:px-28 py-10 md:px-10 px-4 mb-20">
      <Referral />
      <ExtInstallation
        @send="openVerifiedDialog"
        @resubmit="openResubmitDialog"
      />
      <DesktopInstallation
        @send="openVerifiedDialog"
        @resubmit="openResubmitDialog"
      />
      <AppStoreRating
        @send="openVerifiedDialog"
        @resubmit="openResubmitDialog"
      />
      <GooglePlayRating
        @send="openVerifiedDialog"
        @resubmit="openResubmitDialog"
      />
      <CapterraRating
        @send="openVerifiedDialog"
        @resubmit="openResubmitDialog"
      />
    </div>

    <VerifiedDialog
      ref="verifiedDialog"
    />
    <ResubmitDialog
      ref="resubmitDialog"
    />
  </div>
</template>

<script>
import GenerateCode from '@/components/rewards/GenerateCode.vue'
import Referral from '@/components/rewards/Referral.vue'
import ExtInstallation from '@/components/rewards/ExtInstallation.vue'
import DesktopInstallation from '@/components/rewards/DesktopInstallation.vue'
import AppStoreRating from '@/components/rewards/AppStoreRating.vue'
import GooglePlayRating from '@/components/rewards/GooglePlayRating.vue'
import CapterraRating from '@/components/rewards/CapterraRating.vue'

import VerifiedDialog from '@/components/rewards/dialogs/Verified.vue'
import ResubmitDialog from '@/components/rewards/dialogs/Resubmit.vue'

export default {
  components: {
    GenerateCode,
    Referral,
    ExtInstallation,
    DesktopInstallation,
    AppStoreRating,
    GooglePlayRating,
    CapterraRating,

    VerifiedDialog,
    ResubmitDialog
  },
  props: {
  },
  data () {
    return {
      totalPercent: 10
    }
  },
  computed: {
  },
  methods: {
    openVerifiedDialog () {
      this.$refs.verifiedDialog.openDialog(true)
    },
    openResubmitDialog () {
      this.$refs.resubmitDialog.openDialog(true)
    }
  }
}
</script>
<style lang="scss" scoped>
.rewards {
  &__generate-code {
    background-color: #F4F5F7 !important;
  }
}
</style>
