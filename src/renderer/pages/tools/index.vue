<template>
  <div class="flex flex-col flex-column-fluid relative">
    <div class="flex-column-fluid lg:px-28 py-10 px-10 mb-20">
      <div class="mb-5">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item
            :to="localeRoute({name: 'tools'})"
          >
            {{ $t('sidebar.tools') }}
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="setting-wrapper">
        <div class="setting-section">
          <div class="setting-section-header">
            <div class="flex items-center">
              <img src="~/assets/images/icons/icon_tools_pw_generator.svg" alt="" class="mr-3">
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
              <el-popover
                placement="bottom-end"
                width="280"
                trigger="click"
                popper-class="locker-pw-generator"
              >
                <PasswordGenerator />
                <button slot="reference"
                        class="btn btn-icon !text-black-600"
                >
                  <i class="fa fa-chevron-right" />
                </button>
              </el-popover>
            </div>
          </div>
        </div>
        <div class="setting-section">
          <div class="setting-section-header">
            <div class="flex items-center">
              <img src="~/assets/images/icons/icon_tools_pw_health.svg" alt="" class="mr-3">
              <div>
                <div class="setting-title cursor-pointer"
                     @click="go({name: 'tools-password-health'})"
                >
                  {{ $t('data.tools.password_health') }}
                </div>
                <div class="setting-description">
                  {{ $t('data.tools.password_health_desc') }}
                </div>
              </div>
            </div>
            <div>
              <button class="btn btn-icon !text-black-600"
                      @click="go({name: 'tools-password-health'})"
              >
                <i class="fa fa-chevron-right" />
              </button>
            </div>
          </div>
        </div>
        <div class="setting-section">
          <div class="setting-section-header">
            <div class="flex items-center">
              <img src="~/assets/images/icons/icon_tools_pw_breach.svg" alt="" class="mr-3">
              <div>
                <div class="setting-title cursor-pointer"
                     @click="go('tools-breach')"
                >
                  {{ $t('data.tools.data_breach') }}
                </div>
                <div class="setting-description">
                  {{ $t('data.tools.data_breach_desc') }}
                </div>
              </div>
            </div>
            <div>
              <button class="btn btn-icon !text-black-600"
                      @click="go('tools-breach')"
              >
                <i class="fa fa-chevron-right" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PasswordGenerator from '../../components/password/PasswordGenerator'
export default {
  components: { PasswordGenerator },
  data () {
    return {
    }
  },
  computed: {
  },
  methods: {
    go (route) {
      this.$router.push(this.localeRoute(route))
    }
  }
}
</script>
