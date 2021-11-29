<template>
  <div class="flex flex-col flex-column-fluid relative bg-[#FBFBFC]">
    <div class="flex-column-fluid lg:px-28 py-10 px-10 mb-20">
      <div class="mb-5">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item
            :to="localeRoute({name: 'settings'})"
          >
            Settings
          </el-breadcrumb-item>
          <el-breadcrumb-item
            :to="localeRoute({name: 'settings-emergency-access'})"
          >
            Emergency Access
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="text-head-5 font-semibold mb-4">
        Emergency Access
      </div>
      <div class="setting-description mb-5">
        {{ $t('data.emergency_access.emergency_access_desc') }}
      </div>
      <div class="setting-wrapper">
        <div class="setting-section">
          <div class="setting-section-header">
            <div>
              <div class="setting-title">{{ $t('data.emergency_access.trusted_emergency_contacts') }}</div>
            </div>
            <div>
              <button
                class="btn btn-default !text-warning"
                @click="postEmergencyAccess"
              >
                {{ $t('data.emergency_access.add_emergency_contact') }}
              </button>
            </div>
          </div>
          <div class="setting-section-body">
            <!-- <client-only>
              <el-table
                v-loading="loading"
                :data="list_trusted"
                style="width: 100%"
              >
                <el-table-column
                  label="Users"
                >
                  <template slot-scope="scope">
                    <div class="flex items-center">
                      <el-avatar :src="scope.row.avatar" :size="32" />
                      <div class="ml-2">
                        <div class="text-black font-semibold truncate">{{ scope.row.full_name || scope.row.email }}</div>
                        <div v-if="scope.row.username">@{{ scope.row.username }}</div>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  label="Status"
                  align="right"
                >
                  <template slot-scope="scope">
                    <span
                      class="label capitalize"
                      :class="{'label-primary-light': scope.row.status === 'confirmed',
                               'label-success-light': scope.row.status === 'accepted',
                               'label-warning-light': scope.row.status === 'invited',
                               'label-danger-light': scope.row.status === 'expired'
                      }"
                    >
                      {{ scope.row.status }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="Type"
                  align="right"
                >
                  <template slot-scope="scope">
                    {{ scope.row.type }}
                  </template>
                </el-table-column>
                <el-table-column
                  align="right"
                >
                  <template slot-scope="scope">
                    <el-dropdown
                      trigger="click"
                      :hide-on-click="false"
                    >
                      <button class="btn btn-icon btn-xs hover:bg-black-400">
                        <i class="fas fa-ellipsis-h" />
                      </button>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item
                          v-if="scope.row.status === 'accepted'"
                          @click.native="promptConfirmEmergencyAccess(scope.row)"
                        >
                          <span class="text-success">{{ $t('common.confirm') }}</span>
                        </el-dropdown-item>
                        <template v-if="scope.row.status === 'confirmed'">
                          <el-dropdown-item
                            @click.native="putEmergencyAccess(scope.row)"
                          >
                            {{ $t('common.edit') }}
                          </el-dropdown-item>
                          <el-dropdown-item
                            @click.native="putUserGroups(scope.row)"
                          >
                            {{ $t('common.groups') }}
                          </el-dropdown-item>
                        </template>
                        <el-dropdown-item @click.native="deleteEmergencyAccess(scope.row)">
                          <span class="text-danger">
                            {{ $t('common.remove') }}
                          </span>
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </template>
                </el-table-column>
              </el-table>
            </client-only> -->
          </div>
        </div>
        <div class="setting-section">
          <div class="setting-section-header">
            <div>
              <div class="setting-title">{{ $t('data.emergency_access.designated_emergency_contacts') }}</div>
            </div>
          </div>
          <div class="setting-section-body" />
        </div>
      </div>
    </div>
    <emergency-contact ref="emergencyContact" />
  </div>
</template>

<script>
import EmergencyContact from '../../components/setting/EmergencyContact.vue'
// import { Utils } from '../../../jslib/src/misc/utils.ts'
export default {
  components: {
    EmergencyContact
  },
  data () {
    return {
      list_trusted: [],
      list_granted: [],
      loading: true,
      loadingConfirm: false,
      dialogConfirmVisible: false,
      dontAskAgain: false,
      publicKey: null,
      userFingerPrint: '',
      selectedEmergencyAccess: {}
    }
  },
  mounted () {
    this.getListTrusted()
  },
  methods: {
    postEmergencyAccess () {
      this.$refs.emergencyContact.openDialog({})
    },
    getListTrusted () {
      this.loading = true
      this.$axios.$get('cystack_platform/pm/emergency_access/trusted')
        .then(res => {
          this.list_trusted = res
          this.loading = false
        })
    },
    getListGranted () {
      this.loading = true
      this.$axios.$get('cystack_platform/pm/emergency_access/granted')
        .then(res => {
          this.list_granted = res
          this.loading = false
        })
    },
    putEmergencyAccess (emergency_contact) {
      this.$refs.emergencyContact.openDialog(emergency_contact)
    },
    deleteEmergencyAccess (emergency_contact) {
      this.$refs.emergencyContact.deleteEmergencyAccess(emergency_contact)
    }
    // async generateOrgKey () {
    //   const pk = Utils.fromB64ToArray(this.publicKey)
    //   const orgKey = await this.$cryptoService.getOrgKey(this.$route.params.teamId)
    //   const key = await this.$cryptoService.rsaEncrypt(orgKey.key, pk.buffer)
    //   return key.encryptedString
    // },
    // async getPublicKey (emergency_access) {
    //   this.userFingerPrint = ''
    //   const { public_key: publicKey } = await this.$axios.$get(`cystack_platform/pm/emergency_access/${emergency_access.id}/public_key`)
    //   return publicKey
    // },
    // async promptConfirmEmergencyAccess (emergency_access) {
    //   this.selectedEmergencyAccess = emergency_access
    //   this.publicKey = await this.getPublicKey(emergency_access)
    //   const publicKey = Utils.fromB64ToArray(this.publicKey)
    //   const fingerprint = await this.$cryptoService.getFingerprint(user.pwd_user_id, publicKey.buffer)
    //   if (fingerprint) {
    //     this.userFingerPrint = fingerprint.join('-')
    //   }
    //   this.dontAskAgain = await this.$storageService.get('autoConfirmFingerprints')
    //   this.openDialogConfirm()
    // },
    // openDialogConfirm () {
    //   this.dialogConfirmVisible = true
    // },
    // closeDialogConfirm () {
    //   this.dialogConfirmVisible = false
    // },
    // async confirmEmergencyAccess (emergency_access) {
    //   try {
    //     this.loadingConfirm = true
    //     await this.$axios.$post(`cystack_platform/pm/emergency_access/${emergency_access.id}/confirm`, {
    //       key: this.publicKey
    //     })
    //     this.closeDialogConfirm()
    //     this.getListTrusted()
    //     this.notify(this.$t('data.notifications.confirm_member_success'), 'success')
    //   } catch (e) {
    //     console.log(e)
    //     this.notify(this.$t('data.notifications.confirm_member_failed'), 'warning')
    //   } finally {
    //     this.loadingConfirm = false
    //   }
    // }
  }
}
</script>

<style lang="scss" scoped>

</style>
