<template>
  <div v-loading="loading" class="rewards">
    <div class="rewards__generate-code">
      <div class="flex-column-fluid lg:px-28 py-8 md:px-10 px-4">
        <div v-html="$t('data.rewards.subtitle')" />
        <GenerateCode
          :claim-status="claimStatus"
          :available-percent="availablePercent"
          :total-percent="totalPercent"
          :remain-percent="remainPercent"
          :genned-percent="gennedPercent"
          @getCode="openGetCodeConfirmDialog"
          @redeemCode="redeemCode"
        />
      </div>
    </div>
    <div class="flex-column-fluid lg:px-28 py-10 md:px-10 px-4 mb-20">
      <Referral :plan-text="planText" />
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
      :available-percent="availablePercent"
      :remain-percent="remainPercent"
      @reload="fetchData"
    />
    <ResubmitDialog
      ref="resubmitDialog"
      :available-percent="availablePercent"
      :remain-percent="remainPercent"
      @reload="fetchData"
    />
    <GetCodeConfirmDialog
      ref="getCodeConfirmDialog"
      :calling-api="callingAPI"
      :available-percent="availablePercent"
      :remain-percent="remainPercent"
      @getCode="handleGetCode"
    />
    <GetCodeSuccessDialog ref="getCodeSuccessDialog" @redeemCode="redeemCode" />
  </div>
</template>

<script>
import moment from 'moment'

import GenerateCode from '@/components/rewards/GenerateCode.vue'
import Referral from '@/components/rewards/Referral.vue'
import ExtInstallation from '@/components/rewards/ExtInstallation.vue'
import DesktopInstallation from '@/components/rewards/DesktopInstallation.vue'
import AppStoreRating from '@/components/rewards/AppStoreRating.vue'
import GooglePlayRating from '@/components/rewards/GooglePlayRating.vue'
import CapterraRating from '@/components/rewards/CapterraRating.vue'

import VerifiedDialog from '@/components/rewards/dialogs/Verified.vue'
import ResubmitDialog from '@/components/rewards/dialogs/Resubmit.vue'
import GetCodeConfirmDialog from '@/components/rewards/dialogs/GetCodeConfirm.vue'
import GetCodeSuccessDialog from '@/components/rewards/dialogs/GetCodeSuccess.vue'

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
    ResubmitDialog,
    GetCodeConfirmDialog,
    GetCodeSuccessDialog
  },

  middleware: ['BlockEnterpriseMember', 'BlockLifetime'],

  data () {
    return {
      loading: false,
      claimStatus: {},
      missions: [],
      callingAPI: false
    }
  },

  computed: {
    totalPercent () {
      return this.claimStatus.total_promo_code_value || 20
    },
    promoCodes () {
      return this.claimStatus.generated_available_promo_codes || []
    },
    gennedPercent () {
      return this.promoCodes.map(c => c.value).reduce((a, b) => a + b, 0)
    },
    availablePercent () {
      return this.claimStatus.available_promo_code_value || 0
    },
    usedPercent () {
      return this.claimStatus.used_promo_code_value || 0
    },
    remainPercent () {
      return this.totalPercent - this.usedPercent
    },
    planText () {
      if (
        ['pm_free', 'pm_lifetime_premium', 'pm_premium'].includes(
          this.currentPlan.alias
        )
      ) {
        return this.$t('plan.plans[1].title')
      }
      return this.$t('plan.plans[2].title')
    }
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
    openVerifiedDialog (data) {
      this.$refs.verifiedDialog.openDialog(data)
    },
    openResubmitDialog (data) {
      this.$refs.resubmitDialog.openDialog(data)
    },
    openGetCodeConfirmDialog () {
      this.$refs.getCodeConfirmDialog.openDialog()
    },
    openGetCodeSuccessDialog (data) {
      this.$refs.getCodeSuccessDialog.openDialog(data)
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
    handleGetCode () {
      this.callingAPI = true
      this.$axios
        .$post('/cystack_platform/pm/reward/claim/promo_codes')
        .then(res => {
          this.callingAPI = false
          this.$refs.getCodeConfirmDialog.closeDialog()
          this.openGetCodeSuccessDialog({
            ...res,
            currentTime: moment().add(7, 'days').format('MMMM Do YYYY')
          })
        })
        .catch(error => {
          this.callingAPI = false
          this.notify(
            error.response?.data?.message ||
              this.$t('errors.something_went_wrong'),
            'error'
          )
        })
    },
    redeemCode (code) {
      this.$router.push(
        this.localeRoute({ name: 'manage-plans', query: { code } })
      )
    },
    getMissionById (id) {
      return (this.missions || []).find(m => m.mission.id === id) || {}
    }
  }
}
</script>
<style lang="scss">
.rewards {
  &__generate-code {
    background-color: #f4f5f7 !important;
  }
  .el-collapse-item__header {
    color: initial !important;
  }
}
</style>
