<template>
  <div v-loading="loading" class="rewards">
    <div class="rewards__generate-code">
      <div class="flex-column-fluid lg:px-28 py-8 md:px-10 px-4">
        <p>{{ $t('data.rewards.subtitle') }}</p>
        <GenerateCode
          :claim-status="claimStatus"
          :missions="missions"
        />
      </div>
    </div>
    <div class="flex-column-fluid lg:px-28 py-10 md:px-10 px-4 mb-20">
      <Referral />
      <ExtInstallation
        :mission="getMissionById('extension_installation_and_review')"
        @send="openVerifiedDialog"
        @resubmit="openResubmitDialog"
      />
      <DesktopInstallation
        :mission="getMissionById('desktop_app_installation')"
        @send="openVerifiedDialog"
        @resubmit="openResubmitDialog"
      />
      <AppStoreRating
        :mission="getMissionById('app_store_rating_and_review')"
        @send="openVerifiedDialog"
        @resubmit="openResubmitDialog"
      />
      <GooglePlayRating
        :mission="getMissionById('google_play_rating_and_review')"
        @send="openVerifiedDialog"
        @resubmit="openResubmitDialog"
      />
      <CapterraRating
        :mission="getMissionById('capterra_rating_and_review')"
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
      loading: false,
      claimStatus: null,
      missions: []
    }
  },
  computed: {
  },
  mounted () {
    if (!this.isEnterpriseMember) {
      this.getClaimStatus()
      this.getMissions()
    } else {
      this.$router.push(this.localePath({ name: 'vault' }))
    }
  },
  methods: {
    openVerifiedDialog () {
      this.$refs.verifiedDialog.openDialog(true)
    },
    openResubmitDialog () {
      this.$refs.resubmitDialog.openDialog(true)
    },
    async fetchData () {
      this.loading = true
      await this.getClaimStatus()
      await this.getMissions()
      this.loading = false
    },
    getClaimStatus () {
      this.$axios.$get('/cystack_platform/pm/reward/claim').then(res => {
        this.claimStatus = res
      })
    },
    getMissions () {
      this.$axios.$get('/cystack_platform/pm/reward/missions').then(res => {
        this.missions = res
      })
    },
    getMissionById (id) {
      return (this.missions || []).find(m => m.mission.id === id) || {}
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
