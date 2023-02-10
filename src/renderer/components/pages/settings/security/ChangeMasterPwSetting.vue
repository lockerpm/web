<template>
  <div>
    <!-- Display -->
    <div class="setting-wrapper">
      <div class="setting-section">
        <div class="setting-section-header">
          <div class="text-head-5 font-semibold">
            {{ $t('data.settings.security_control') }}
          </div>
          <div>
            <button
              class="btn btn-default mb-4 md:mb-0"
              @click="changeMasterPassword"
            >
              <span><i class="fas fa-key" /> &nbsp;
                {{ $t('data.settings.change_master_password') }}</span>
            </button>
          </div>
        </div>
        <div class="bg-[#F0F0F0] mt-8 py-5 pl-5 pr-10">
          <div class="flex">
            <div class="px-3 text-lg">
              <i class="fas fa-lightbulb" />
            </div>
            <div class="w-full">
              <div class="text-head-6 mb-3 w-full">
                {{ $t('data.settings.learn_about_secure_desc') }}
              </div>
              <div>
                <a
                  :href="`https://locker.io${
                    locale === 'vi' ? '/vi' : ''
                  }/security`"
                  target="_blank"
                >
                  <button
                    class="btn btn-default !whitespace-normal text-left mb-4 md:mb-0 !bg-[#CBCBCB] hover:no-underline hover:text-current"
                  >
                    {{ $t('data.settings.learn_about_secure') }}
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Display end -->

    <!-- Dialog -->
    <ChangeMasterPassword ref="changeMasterPassword" />
    <!-- Dialog end -->
  </div>
</template>
<script>
import ChangeMasterPassword from '@/components/user/ChangeMasterPassword'

export default {
  components: {
    ChangeMasterPassword
  },

  methods: {
    changeMasterPassword () {
      this.$refs.changeMasterPassword.openDialog()
    }
  }
}
</script>
