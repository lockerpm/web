<template>
  <div class="setting-wrapper">
    <div class="setting-section">
      <div
        class="setting-section-header cursor-pointer"
        @click="collapsed = !collapsed"
      >
        <div class="text-head-5 font-semibold">
          {{ $t('data.settings.master_password') }}
        </div>
        <div>
          <button
            class="btn btn-outline-primary md:mb-0 mr-4 hidden lg:inline-block setting-button"
            @click="changeMasterPassword"
          >
            <span><i class="fas fa-key mr-2" />{{
              $t('data.settings.change_master_password')
            }}</span>
          </button>
          <i v-if="!collapsed" class="el-icon-arrow-right" />
          <i v-else class="el-icon-arrow-down" />
        </div>
      </div>
      <ChangeMasterPassword ref="changeMasterPassword" />
    </div>
    <div v-if="collapsed" class="setting-section">
      <button
        class="btn btn-outline-primary mb-4 lg:hidden inline-block"
        @click="changeMasterPassword"
      >
        <span><i class="fas fa-key mr-2" />{{
          $t('data.settings.change_master_password')
        }}</span>
      </button>
      <el-row type="flex">
        <el-col :lg="12" :sm="16" :xs="24">
          <p>{{ $t('data.settings.learn_about_secure_desc') }}</p>
        </el-col>
      </el-row>
      <p class="mt-6">
        <a
          :href="`https://support.locker.io/${locale}/locker-general/login-unlock/log-in-to-a-cloud-account/what-is-master-password`"
          target="_blank"
        >
          {{ $t('data.settings.learn_about_secure') }}
          <i class="ml-1 el-icon-right" />
        </a>
      </p>
    </div>
  </div>
</template>

<script>
import ChangeMasterPassword from '../user/ChangeMasterPassword.vue'

export default {
  components: {
    ChangeMasterPassword
  },
  data () {
    return {
      collapsed: false
    }
  },
  computed: {},
  mounted () {},
  methods: {
    changeMasterPassword () {
      this.collapsed = !this.collapsed
      this.$refs.changeMasterPassword.openDialog()
    }
  }
}
</script>
