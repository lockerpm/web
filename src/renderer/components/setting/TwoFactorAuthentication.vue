<template>
  <div class="setting-wrapper">
    <div class="setting-section">
      <div class="setting-section-header cursor-pointer" @click="collapsed = !collapsed">
        <div class="text-head-5 font-semibold">
          {{ $t('data.settings.two_factor_authentication') }}
        </div>
        <div>
          <a href="https://id.locker.io/security/two-step-verification" target="_blank" class="mr-4">
            <button
              class="btn btn-default md:mb-0"
              @click="() => collapsed = !collapsed"
            >
              <span>{{ $t('data.settings.two_step_verification') }}</span>
            </button>
          </a>
          <i v-if="!collapsed" class="el-icon-arrow-right" />
          <i v-else class="el-icon-arrow-down" />
        </div>
      </div>
    </div>
    <div v-if="collapsed" class="setting-section">
      <el-row type="flex">
        <el-col :lg="12" :sm="16" :xs="24">
          <p>{{ $t('data.settings.two_factor_authentication_des') }}</p>
        </el-col>
      </el-row>
      <p class="mt-6">
        <a
          :href="locale === 'vi' ? 'https://support.locker.io/vi/articles/Thiet-lap-tai-khoan-Locker-e20d25ca704d4b78b8672257bbc1eb96?content=6._Thiet_lap_2FA_%28Xac_thuc_hai_yeu_to%29' : 'https://support.locker.io/articles/Set-up-Locker-account-07472a425a1148b5a332bf69c2bb63b0?content=6._Enable_two-factor_authentication_(2FA)'"
          target="_blank"
        >
          {{ $t('data.settings.learn_two_factor_authentication') }} <i class="ml-1 el-icon-right" />
        </a>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  components: {
  },
  data () {
    return {
      collapsed: false
    }
  },
  computed: {
  },
  mounted () {
  },
  methods: {
  }
}
</script>
