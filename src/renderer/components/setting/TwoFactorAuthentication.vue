<template>
  <div class="setting-wrapper">
    <div class="setting-section">
      <div
        class="setting-section-header cursor-pointer"
        @click="collapsed = !collapsed"
      >
        <div class="text-head-5 font-semibold">
          {{ $t('data.settings.two_factor_authentication') }}
        </div>
        <div>
          <a
            href="https://id.locker.io/security/two-step-verification"
            target="_blank"
            class="mr-4 hidden lg:inline-block"
          >
            <button
              class="btn btn-outline-primary md:mb-0 setting-button"
              @click="() => (collapsed = !collapsed)"
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
      <a
        href="https://id.locker.io/security/two-step-verification"
        target="_blank"
        class="mb-4 lg:hidden inline-block"
      >
        <button
          class="btn btn-outline-primary md:mb-0"
          @click="() => (collapsed = !collapsed)"
        >
          <span>{{ $t('data.settings.two_step_verification') }}</span>
        </button>
      </a>
      <el-row type="flex">
        <el-col :lg="12" :sm="16" :xs="24">
          <p>{{ $t('data.settings.two_factor_authentication_des') }}</p>
        </el-col>
      </el-row>
      <p class="mt-6">
        <a
          :href="`https://support.locker.io/${locale}/locker-general/security-for-locker-account/2fa-for-locker-account`"
          target="_blank"
        >
          {{ $t('data.settings.learn_two_factor_authentication') }}
          <i class="ml-1 el-icon-right" />
        </a>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data () {
    return {
      collapsed: false
    }
  },
  computed: {},
  mounted () {},
  methods: {}
}
</script>
