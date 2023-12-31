<template>
  <div
    class="flex flex-col flex-column-fluid relative bg-[#FBFBFC] min-h-screen"
  >
    <div class="flex-column-fluid lg:px-28 py-10 md:px-10 px-4 mb-20">
      <div class="mb-5">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="localeRoute({ name: 'tools' })">
            {{ $t('sidebar.tools') }}
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="setting-wrapper">
        <!-- Password generator -->
        <el-popover
          placement="top-end"
          width="280"
          trigger="click"
          popper-class="locker-pw-generator !top-[130px]"
        >
          <PasswordGenerator />
          <div
            slot="reference"
            class="setting-section setting-section--hover !border-b"
          >
            <div class="setting-section-header">
              <div class="flex items-center">
                <img
                  src="~/assets/images/icons/icon_tools_pw_generator.svg"
                  alt=""
                  class="mr-3"
                >
                <div>
                  <div class="setting-title">
                    {{ $t('data.tools.password_generator') }}
                  </div>
                  <div class="setting-description">
                    {{ $t('data.tools.password_generator_desc') }}
                  </div>
                </div>
              </div>
              <div>
                <button class="btn btn-icon !text-black-600">
                  <i class="fa fa-chevron-right" />
                </button>
              </div>
            </div>
          </div>
        </el-popover>
        <!-- Password generator end -->

        <!-- Password health -->
        <div
          class="setting-section setting-section--hover"
          @click="
            !isPremiumFeaturesAvailable
              ? upgrade()
              : go('tools-password-health')
          "
        >
          <div class="setting-section-header">
            <div class="flex items-center">
              <img
                src="~/assets/images/icons/icon_tools_pw_health.svg"
                alt=""
                class="mr-3"
              >
              <div>
                <div class="setting-title cursor-pointer">
                  {{ $t('data.tools.password_health') }}
                  <div
                    class="label label-black tracking-[1px] font-semibold uppercase !text-xs"
                  >
                    Premium
                  </div>
                </div>
                <div class="setting-description">
                  {{ $t('data.tools.password_health_desc') }}
                </div>
              </div>
            </div>
            <div>
              <button
                class="btn btn-icon !text-black-600"
                @click="
                  !isPremiumFeaturesAvailable
                    ? upgrade()
                    : go({ name: 'tools-password-health' })
                "
              >
                <i class="fa fa-chevron-right" />
              </button>
            </div>
          </div>
        </div>
        <!-- Password health end -->

        <!-- Breach scanner -->
        <div
          class="setting-section setting-section--hover"
          @click="!isPremiumFeaturesAvailable ? upgrade() : go('tools-breach')"
        >
          <div class="setting-section-header">
            <div class="flex items-center">
              <img
                src="~/assets/images/icons/icon_tools_pw_breach.svg"
                alt=""
                class="mr-3"
              >
              <div>
                <div class="setting-title cursor-pointer">
                  {{ $t('data.tools.data_breach') }}
                  <div
                    class="label label-black tracking-[1px] font-semibold uppercase !text-xs"
                  >
                    Premium
                  </div>
                </div>
                <div class="setting-description">
                  {{ $t('data.tools.data_breach_desc') }}
                </div>
              </div>
            </div>
            <div>
              <button
                class="btn btn-icon !text-black-600"
                @click="
                  !isPremiumFeaturesAvailable ? upgrade() : go('tools-breach')
                "
              >
                <i class="fa fa-chevron-right" />
              </button>
            </div>
          </div>
        </div>
        <!-- Breach scanner end -->
      </div>
    </div>
    <el-dialog title="Tips" :visible.sync="dialogVisible" width="30%">
      <span>Upgrade to Premium plan to access this feature</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button
          type="primary"
          @click="$router.push(localeRoute({ name: 'manage-plans' }))"
        >Upgrade</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import PasswordGenerator from '../../components/password/PasswordGenerator'
export default {
  components: { PasswordGenerator },
  data () {
    return {
      dialogVisible: false
    }
  },
  computed: {
    currentPlan () {
      return this.$store.state.currentPlan
    }
  },
  methods: {
    go (route) {
      this.$router.push(this.localeRoute(route))
    },
    upgrade () {
      // this.dialogVisible = true
      this.$store.commit('UPDATE_NOTICE', { showPleaseUpgrade: true })
    }
  }
}
</script>
