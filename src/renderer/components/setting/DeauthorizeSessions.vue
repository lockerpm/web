<template>
  <div>
    <el-dialog
      :visible.sync="dialogVisible"
      width="575px"
      destroy-on-close
      top="15vh"
      custom-class="locker-dialog"
      :close-on-click-modal="false"
    >
      <!-- Title -->
      <div slot="title">
        <div class="text-head-5 text-black-700 font-semibold truncate">
          {{
            deviceInfo
              ? $t(`data.settings.deauthorize_device`, {
                name: deviceInfo.name
              })
              : $t(`data.settings.deauthorize_sessions`)
          }}
        </div>
      </div>
      <!-- Title end -->

      <!-- Body -->
      <div class="text-left">
        <p v-if="deviceInfo" class="mb-2">
          {{ $t(`data.settings.deauthorize_device_desc`) }}
        </p>

        <template v-else>
          <p class="mb-2">
            {{ $t(`data.settings.deauthorize_sessions_title`) }}
          </p>
          <div class="locker-callout locker-callout-danger mb-5">
            <p>
              {{ $t(`data.settings.deauthorize_sessions_desc`) }}
            </p>
          </div>
        </template>

        <form @submit.prevent="confirmPassword">
          <div class="form-group">
            <InputText
              v-model="password"
              :label="$t('common.master_password')"
              class="w-full"
              :disabled="loading"
              :error-text="errors.password && $t('errors.invalid_password')"
              is-password
              @change="errors = {}"
            />
          </div>
        </form>
      </div>
      <!-- Body end -->

      <!-- Footer -->
      <div slot="footer" class="dialog-footer flex items-center text-left">
        <div class="flex-grow" />
        <div>
          <button class="btn btn-default" @click="dialogVisible = false">
            {{ $t('common.cancel') }}
          </button>
          <el-button
            type="danger"
            :disabled="loading || !password"
            :loading="loading"
            @click="confirmPassword"
          >
            {{ $t(`common.confirm`) }}
          </el-button>
        </div>
      </div>
      <!-- Footer end -->
    </el-dialog>
  </div>
</template>

<script>
import InputText from '../input/InputText'
export default {
  components: {
    InputText
  },

  props: {
    device: {
      type: Object,
      default: () => ({})
    }
  },

  data () {
    return {
      password: '',
      showPassword: false,
      dialogVisible: false,
      loading: false,
      count: 0,
      errors: {},
      type: 'purge'
    }
  },

  computed: {
    deviceInfo () {
      if (!this.device.device_identifier) {
        return null
      }
      switch (this.device.client_id) {
      case 'web':
        return {
          icon: 'fa-laptop',
          name: 'Web Application'
        }
      case 'browser':
        return {
          icon: 'fa-puzzle-piece',
          name: 'Web Extension'
        }
      case 'mobile':
        return {
          icon: 'fa-mobile-alt',
          name: 'Mobile Application'
        }
      case 'desktop':
        return {
          icon: 'fa-desktop',
          name: 'Desktop Application'
        }
      default:
        return {
          icon: 'fa-puzzle-piece',
          name: 'Other Application'
        }
      }
    }
  },

  methods: {
    async openDialog (type) {
      this.dialogVisible = true
      this.password = ''
      this.type = type
      this.count = 0
    },

    closeDialog () {
      this.dialogVisible = false
    },

    async confirmPassword () {
      this.loading = true
      this.errors = {}
      const keyHash = await this.$cryptoService.hashPassword(
        this.password,
        null
      )
      const storedKeyHash = await this.$cryptoService.getKeyHash()
      if (
        storedKeyHash != null &&
        keyHash != null &&
        storedKeyHash === keyHash
      ) {
        if (this.deviceInfo) {
          await this.deauthorizeDevice(this.device.device_identifier)
        } else {
          await this.deauthorizeSessions(keyHash)
        }
      } else {
        this.errors = { password: 1 }
        this.count++
        this.$emit('reject')
        if (this.count > 5) {
          this.lock()
        }
      }
      this.loading = false
    },

    async deauthorizeDevice (deviceId) {
      try {
        await this.$axios.$delete(
          `/cystack_platform/pm/users/me/devices/${deviceId}`
        )
        this.closeDialog()
        this.notify(this.$t('common.done'), 'success')
        this.$emit('device-deleted', deviceId)
      } catch (e) {
        this.notify(this.$t('errors.something_went_wrong'), 'warning')
      }
    },

    async deauthorizeSessions (hashedPassword) {
      try {
        await this.$axios.$post(
          'cystack_platform/pm/users/session/revoke_all',
          {
            master_password_hash: hashedPassword
          }
        )
        this.closeDialog()
        this.lock()
        this.notify(
          this.$t('data.settings.deauthorize_sessions_success'),
          'success'
        )
      } catch (e) {
        this.notify(
          this.$t('data.settings.deauthorize_sessions_failed'),
          'warning'
        )
      }
    }
  }
}
</script>
