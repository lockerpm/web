<template>
  <div class="md:w-[410px] md:mx-0 mx-5 border border-black-200 rounded py-[2.8125rem] px-6 text-center">
    <div class="text-head-4 font-semibold mb-2.5">
      {{ $t('data.enterprise.popup.title') }}
    </div>
    <div class="text-base text-black-600 mb-4">
      {{ $t('data.enterprise.popup.desc') }}
    </div>
    <div class="inline-block mb-8 select-none">
      <div class="flex items-center">
        <div class="rounded-[21px] flex items-center bg-black-250 p-1 mx-auto">
          <client-only>
            <img :src="currentUser.avatar" alt="" class="w-[28px] h-[28px] rounded-full mr-2">
          </client-only>
          <div class="mr-2">{{ currentUser.email }}</div>
        </div>
        <button
          class="btn btn-sm btn-clean btn-primary !px-3 !font-normal"
          @click="logout"
        >
          {{ $t('common.logout') }}
        </button>
      </div>
    </div>
    <div v-if="enterpriseInvitation.enterprise" class="text-left mb-8">
      <p class="mb-4" v-html="$t('data.enterprise.popup.text1', { enterpriseName: enterpriseInvitation.enterprise.name })" />
      <p>
        {{ $t('data.enterprise.popup.text2', { enterpriseName: enterpriseInvitation.enterprise.name }) }}
      </p>
      <ul class="ml-6 mb-4 list-disc">
        <li
          v-for="(item, index) in $t('data.enterprise.popup.list')"
          :key="index"
        >
          {{ item }}
        </li>
      </ul>
      <p>
        {{ $t('data.enterprise.popup.text3', { enterpriseName: enterpriseInvitation.enterprise.name }) }}
      </p>
      <p v-if="!isAutoApprove" class="mt-4">
        {{ $t('data.enterprise.popup.text4', { enterpriseName: enterpriseInvitation.enterprise.name }) }}
      </p>
    </div>

    <el-button
      v-if="['invited', 'requested'].includes(enterpriseInvitation.status)"
      type="primary"
      class="w-full"
      :loading="isLoading"
      :disabled="isLoading || requested"
      @click="joinEnterprise"
    >
      <template v-if="requested">
        <i class="el-icon-check" /> Requested
      </template>
      <template v-else>
        {{
          isAutoApprove
            ? $t('data.enterprise.join_now')
            : $t('data.enterprise.request_to_join')
        }}
      </template>
    </el-button>
  </div>
</template>

<script>
export default {
  props: {
    continueLogin: {
      type: Function,
      default: () => () => {}
    }
  },
  data () {
    return {
      isLoading: false,
      requested: false
    }
  },
  computed: {
    enterpriseInvitation () {
      // if (this.enterpriseInvitations[0]?.domain != null) {
      //   return this.enterpriseInvitations[0]
      // }
      // return {}
      return this.enterpriseInvitations[0] || {}
    },
    isAutoApprove () {
      return this.enterpriseInvitation.domain?.auto_approve
    }
  },
  mounted () {
    this.requested = this.enterpriseInvitation.status === 'requested'
  },
  methods: {
    // Join enterprise
    joinEnterprise () {
      this.isLoading = true
      this.$axios.$put(`cystack_platform/pm/enterprises/members/invitations/${this.enterpriseInvitation.id}`, { status: 'confirmed' })
        .then(() => {
          this.notify(this.$t('common.success'), 'success')
        }).catch(() => {
          this.notify(this.$t('common.failed'), 'warning')
        }).finally(() => {
          this.isLoading = false
          this.requested = true
          this.$store.dispatch('LoadEnterpriseInvitations')
          setTimeout(() => {
            this.continueLogin()
          }, 300)
        })
    }
  }
}
</script>

<style scoped>

</style>
