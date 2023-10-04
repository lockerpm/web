<template>
  <el-dialog
    :visible.sync="dialogVisible"
    width="650px"
    destroy-on-close
    top="5vh"
    custom-class="locker-dialog"
    :close-on-click-modal="false"
  >
    <!-- Title -->
    <div slot="title">
      <div class="text-head-6 text-black-700 font-semibold mb-4">
        {{ $t('data.folders.share_folder') }}
      </div>
      <div class="flex items-center">
        <img
          src="~/assets/images/icons/folderSolid.svg"
          alt=""
          class="select-none mr-2"
        >
        <div class="text-black-700 font-semibold">{{ folder.name }}</div>
      </div>
    </div>
    <!-- Title end -->

    <!-- Select -->
    <div class="text-left">
      <div class="grid grid-cols-4 gap-x-2 mb-4">
        <InputText
          v-model="user.username"
          label="Email"
          class="w-full col-span-3"
          :error-text="!isMemberEmailInputValid && !!user.username"
          @keyupEnter="addMember"
        />
        <el-button
          class="btn btn-outline-primary"
          :loading="dialogLoading.addMember"
          :disabled="!isMemberEmailInputValid"
          style="margin-bottom: 0.625rem"
          @click="addMember"
        >
          {{ $t('data.folders.add_member') }}
        </el-button>
      </div>
    </div>
    <!-- Select end -->

    <!-- Table -->
    <div>
      <el-table :data="newMembers.concat(members)" style="width: 100%">
        <el-table-column :label="$t('data.sharing.member')" width="200">
          <template slot-scope="scope">
            {{ scope.row.email || scope.row.username }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('common.view')" width="100">
          <template slot-scope="scope">
            <el-radio
              label="member"
              :value="scope.row.role"
              @change="
                v => {
                  if (v === 'admin') {
                    updatePermission(scope.row, 'member')
                  }
                }
              "
            >
              <span />
            </el-radio>
          </template>
        </el-table-column>
        <el-table-column :label="$t('common.edit')" width="100">
          <template slot-scope="scope">
            <el-radio
              label="admin"
              :value="scope.row.role"
              @change="
                v => {
                  if (v === 'member') {
                    updatePermission(scope.row, 'admin')
                  }
                }
              "
            >
              <span />
            </el-radio>
          </template>
        </el-table-column>
        <el-table-column :label="$t('common.status')">
          <template slot-scope="scope">
            <span v-if="scope.row.status === 'pending'" class="italic">
              {{ shareInvitationStatus.pending }}
            </span>
            <span
              v-else
              class="label whitespace-normal"
              :class="{
                'label-primary-light': scope.row.status === 'confirmed',
                'label-info': scope.row.status === 'accepted',
                'label-warning-light': scope.row.status === 'invited',
                'label-danger-light': scope.row.status === 'expired',
                'label-success': !scope.row.status
              }"
            >
              {{ shareInvitationStatus[`${scope.row.status || 'shared'}`] }}
            </span>
            <span v-if="scope.row.status === 'accepted'"><button
              class="btn btn-outline-primary mt-2"
              @click="$emit('confirm-user', { user: scope.row })"
            >
              {{ $t('common.confirm') }}
            </button></span>
          </template>
        </el-table-column>
        <el-table-column width="50">
          <template slot-scope="scope">
            <span class="cursor-pointer" @click="stopSharing(scope.row)">
              <i class="el-icon-delete" />
            </span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- Table end -->

    <!-- Footer -->
    <div slot="footer" class="dialog-footer flex items-center text-left">
      <div class="flex-grow" />
      <div>
        <button class="btn btn-default" @click="dialogVisible = false">
          {{ $t('common.cancel') }}
        </button>
        <button
          class="btn btn-primary"
          :disabled="loading"
          @click="shareFolder()"
        >
          {{ $t('common.save') }}
        </button>
      </div>
    </div>
    <!-- Footer end -->
  </el-dialog>
</template>

<script>
import InputText from '../../components/input/InputText.vue'
import { CipherType } from '../../jslib/src/enums'
import { Utils } from '../../jslib/src/misc/utils.ts'
import { FolderRequest } from '../../jslib/src/models/request'

export default {
  components: { InputText },
  data () {
    return {
      CipherType,
      folder: {
        collectionIds: [],
        organizationId: ''
        // viewPassword: true
      },
      originFolder: {},
      loading: false,
      dialogVisible: false,
      errors: {},
      writeableCollections: [],
      user: {
        id: null,
        username: '',
        role: 'member'
      },
      newMembers: [],
      orgKey: null,
      sharingKey: null,
      dialogLoading: {
        addMember: false
      }
    }
  },
  computed: {
    ownershipOptions () {
      return this.teams.filter(e =>
        ['owner', 'admin', 'manager'].includes(e.role)
      )
    },
    roleOptions () {
      return [
        // { label: 'Viewer', value: 'viewer' },
        // { label: 'Editor', value: 'editor' },
        // { label: 'Admin', value: 'admin' },
        { label: this.$t('data.ciphers.viewable'), value: 'member' },
        { label: this.$t('data.ciphers.editable'), value: 'admin' }
      ]
    },
    shareInvitationStatus () {
      return this.$t('data.sharing')
    },
    members () {
      const share = this.myShares.find(
        s => s.id === this.folder.organizationId
      ) || { members: [] }
      return (
        share.members.map(member => {
          return {
            username: member.email,
            status: member.status,
            role: member.role,
            id: member.id,
            key: null
          }
        }) || []
      )
    },
    isMemberEmailInputValid () {
      const emails = this.user.username
        .split(',')
        .map(item => item.trim())
        .filter(item => item.length)
      if (!emails.length) {
        return false
      }
      return emails.every(this.validateEmail)
    }
  },
  methods: {
    async openDialog (folder = {}) {
      this.dialogVisible = true
      this.folder = { organizationId: '', ...folder }
      if (this.folder.organizationId) {
        this.orgKey = await this.$cryptoService.getOrgKey(
          this.folder.organizationId
        )
      } else {
        const shareKey = await this.$cryptoService.makeShareKey()
        this.sharingKey = shareKey ? shareKey[0].encryptedString : null
        this.orgKey = shareKey[1]
      }
    },
    closeDialog () {
      this.dialogVisible = false
    },
    async getPublicKey (email) {
      const { public_key: publicKey } = await this.$axios.$post(
        'cystack_platform/pm/sharing/public_key',
        { email }
      )
      return publicKey
    },
    async generateMemberKey (publicKey, orgKey) {
      const pk = Utils.fromB64ToArray(publicKey)
      const key = await this.$cryptoService.rsaEncrypt(orgKey.key, pk.buffer)
      return key.encryptedString
    },
    async shareFolder () {
      if (!this.newMembers.length) {
        this.closeDialog()
        return
      }
      try {
        this.loading = true
        const collection = await this.$cryptoService.encrypt(
          this.folder.name,
          this.orgKey
        )
        const collectionName = collection.encryptedString
        const ciphers = await Promise.all(
          this.folder.ciphers.map(async cipher => {
            const { data } = await this.getEncCipherForRequest(cipher, {
              noCheck: true,
              encKey: this.orgKey
            })
            return {
              id: cipher.id,
              ...data
            }
          })
        )
        const payload = {
          sharing_key: this.sharingKey,
          folder: {
            id: this.folder.id,
            name: collectionName,
            ciphers
          },
          members: this.newMembers
        }
        if (this.folder.organizationId) {
          const url = `cystack_platform/pm/sharing/${this.folder.organizationId}/members`
          await this.$axios.$post(url, payload)
        } else {
          const url = 'cystack_platform/pm/sharing'
          await this.$axios.$put(url, payload)
        }
        this.notify(this.$tc('data.notifications.share_success', 1), 'success')
        this.closeDialog()
        this.newMembers = []
        this.$emit('shared-folder')
      } catch (e) {
        if (e.response && e.response.data && e.response.data.code === '7002') {
          this.notify(e.response.data.message, 'warning')
          this.$emit('upgrade-plan')
        }
        if (e.response && e.response.data && e.response.data.code === '5000') {
          this.notify(this.$tc('errors.5000', 2), 'error')
        } else {
          this.notify(this.$t('errors.something_went_wrong'), 'warning')
          console.log(e)
        }
      } finally {
        this.loading = false
      }
    },
    async addMember () {
      if (!this.isMemberEmailInputValid) {
        return
      }
      const emails = this.user.username
        .split(',')
        .map(item => item.trim())
        .filter(item => item.length)
      if (!emails.length) {
        return
      }
      try {
        this.dialogLoading.addMember = true
        const members = await Promise.all(
          emails.map(async email => {
            const publicKey = await this.getPublicKey(email)
            const key = publicKey
              ? await this.generateMemberKey(publicKey, this.orgKey)
              : null
            return {
              id: null,
              username: email,
              key,
              status: 'pending',
              role: 'member'
            }
          })
        )
        this.newMembers = this.newMembers.concat(members)
        this.user.username = ''
      } catch (e) {
        this.notify(this.$t('errors.something_went_wrong'), 'error')
      } finally {
        this.dialogLoading.addMember = false
      }
    },
    async stopSharing (row) {
      if (row.status === 'pending') {
        this.newMembers = this.newMembers.filter(member => member !== row)
        return
      }
      try {
        const personalKey = await this.$cryptoService.getEncKey()
        const folderEnc = await this.$folderService.encrypt(
          this.folder,
          personalKey
        )
        const data = new FolderRequest(folderEnc)
        const ciphers = await Promise.all(
          this.folder.ciphers.map(async cipher => {
            const { data } = await this.getEncCipherForRequest(cipher, {
              noCheck: true,
              encKey: personalKey
            })
            return {
              id: cipher.id,
              ...data
            }
          })
        )
        await this.$axios.$post(
          `cystack_platform/pm/sharing/${this.folder.organizationId}/members/${row.id}/stop`,
          {
            folder: { ...data, id: this.folder.id, ciphers }
          }
        )
        this.notify(this.$t('data.notifications.stop_share_success'), 'success')
        await this.getMyShares()
      } catch (error) {
        this.notify(this.$t('errors.something_went_wrong'), 'warning')
        console.log(error)
      }
    },
    async getMyShares () {
      this.$store.dispatch('LoadMyShares')
    },
    async updatePermission (row, role) {
      if (row.id) {
        try {
          if (this.user.role === 'member-hide_passwords') {
            this.user.role = 'member'
            this.user.hide_passwords = true
          } else {
            this.user.hide_passwords = false
          }
          await this.$axios.$put(
            `cystack_platform/pm/sharing/${this.folder.organizationId}/members/${row.id}`,
            {
              role
            }
          )
          this.notify(
            this.$t('data.notifications.update_share_success'),
            'success'
          )
          await this.getMyShares()
          this.$emit('updated-cipher')
        } catch (error) {
          this.notify(this.$t('errors.something_went_wrong'), 'warning')
          console.log(error)
        }
      } else {
        row.role = role
      }
    }
  }
}
</script>
