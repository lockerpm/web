<template>
  <el-dialog
    :visible.sync="dialogVisible"
    width="600px"
    destroy-on-close
    top="5vh"
    custom-class="locker-dialog"
    :close-on-click-modal="false"
  >
    <div slot="title">
      <div class="text-head-5 text-black-700 font-semibold truncate">
        {{ emergency_access.id ? 'Edit emergency contact' : 'Invite emergency contact' }}
      </div>
      <!-- <div class="setting-description">
        {{ $t('data.emergency_access.invite_emergency_contact_desc') }}
      </div> -->
    </div>
    <div class="text-left">
      <InputText
        v-model="emergency_access.email"
        label="Email"
        class="w-full"
        :error-text="errors.email && errors.email[0]"
        :disabled="emergency_access.id?true:false"
      />
      <div class="uppercase mb-2">{{ $t('data.emergency_access.user_access') }}</div>
      <div class="form-group">
        <el-radio-group v-model="emergency_access.type">
          <el-radio
            v-for="item in userAccessOptions"
            :key="item"
            :label="item"
            class="!flex items-start !break-words !whitespace-normal !mb-4"
          >
            <div>{{ $t(`data.emergency_access.${item}`) }}</div>
            <div class="!break-words !whitespace-normal font-normal text-black-500 mt-2">
              {{ $t(`data.emergency_access.${item}_desc`) }}
            </div>
          </el-radio>
        </el-radio-group>
      </div>
      <div class="form-group">
        <div class="">{{ $t(`data.emergency_access.wait_time`) }}</div>
        <div>
          <el-select
            v-model="emergency_access.wait_time_days"
            :placeholder="$t('common.select_an_option')"
            :disabled="loading"
          >
            <el-option
              v-for="item in waitTimeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <div class="!break-words !whitespace-normal font-normal text-black-500 mt-2">
          {{ $t(`data.emergency_access.wait_time_desc`) }}
        </div>
      </div>
    </div>
    <div slot="footer" class="dialog-footer flex items-center text-left">
      <div class="flex-grow" />
      <div>
        <button
          class="btn btn-default"
          @click="dialogVisible = false"
        >
          {{ $t('common.cancel') }}
        </button>
        <button
          class="btn btn-primary"
          :disabled="loading"
          @click="emergency_access.id ? putEmergencyAccess(emergency_access) : postEmergencyAccess(emergency_access)"
        >
          {{ emergency_access.id ? $t('common.update') : $t('common.add') }}
        </button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import InputText from '../input/InputText'
import { Utils } from '../../jslib/src/misc/utils.ts'
export default {
  components: {
    InputText
  },
  data () {
    return {
      userAccessOptions: [
        'view', 'takeover'
      ],
      loading: false,
      dialogVisible: false,
      errors: {},
      collections: [],
      emergency_access: {
        type: 'view'
      },
      file: null
    }
  },
  computed: {
    waitTimeOptions () {
      return [
        { label: this.$t('data.wait_time_days.oneDay'), value: 1 },
        { label: this.$t('data.wait_time_days.twoDays'), value: 2 },
        { label: this.$t('data.wait_time_days.sevenDays'), value: 7 },
        { label: this.$t('data.wait_time_days.fourteenDays'), value: 14 },
        { label: this.$t('data.wait_time_days.thirtyDays'), value: 30 }
        // { label: this.$t('data.wait_time_days.ninetyDays'), value: 90 }
      ]
    }
  },
  methods: {
    async openDialog (emergencyAccess = {}) {
      this.dialogVisible = true
      if (emergencyAccess.id) {
        this.emergency_access = { ...emergencyAccess }
      } else {
        this.emergency_access = {
          type: 'view',
          wait_time_days: null,
          email: ''
        }
      }
    },
    closeDialog () {
      this.dialogVisible = false
    },
    async postEmergencyAccess (emergencyAccess) {
      try {
        this.loading = true
        const publicKey = await this.getPublicKey(emergencyAccess.email)
        const key = await this.generateAccessKey(publicKey)
        await this.$axios.$post('cystack_platform/pm/emergency_access/invite', { ...emergencyAccess, key })
        this.notify(this.$t('data.notifications.invite_user_success'), 'success')
        this.closeDialog()
        this.$emit('done')
      } catch (e) {
        this.errors = (e.response && e.response.data && e.response.data.details) || {}
        if (e.response && e.response.data && e.response.data.message) {
          this.notify(e.response.data.message, 'warning')
        } else {
          this.notify(this.$t('data.notifications.invite_user_failed'), 'warning')
        }
      } finally {
        this.loading = false
      }
    },
    async putEmergencyAccess (emergencyAccess) {
      try {
        this.loading = true
        await this.$axios.$put(`cystack_platform/pm/emergency_access/${emergencyAccess.id}`, emergencyAccess)
        this.notify(this.$t('data.notifications.update_contact_success'), 'success')
        this.closeDialog()
        this.$emit('done')
      } catch (e) {
        console.log(e)
        this.errors = (e.response && e.response.data && e.response.data.details) || {}
        this.notify(this.$t('data.notifications.update_contact_failed'), 'warning')
      } finally {
        this.loading = false
      }
    },
    async deleteEmergencyAccess (emergencyAccess) {
      this.$confirm(this.$t('data.notifications.delete_emergency_contact'), emergencyAccess.full_name || this.$t('common.warning'), {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(async () => {
        try {
          this.loading = true
          await this.$axios.$delete(`cystack_platform/pm/emergency_access/${emergencyAccess.id}`)
          this.closeDialog()
          this.$emit('done')
          this.notify(this.$t('data.notifications.remove_user_success', { user: emergencyAccess.email }), 'success')
        } catch (e) {
          this.errors = (e.response && e.response.data && e.response.data.details) || {}
          this.notify(this.$t('data.notifications.remove_user_failed'), 'warning')
        } finally {
          this.loading = false
        }
      }).catch(() => {

      })
    },
    async getPublicKey (email) {
      const { public_key: publicKey } = await this.$axios.$post('cystack_platform/pm/sharing/public_key', { email })
      return publicKey
    },
    async generateAccessKey (publicKey) {
      const pk = Utils.fromB64ToArray(publicKey)
      const encKey = await this.$cryptoService.getEncKey()
      const key = await this.$cryptoService.rsaEncrypt(encKey.key, pk.buffer)
      return key.encryptedString
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
