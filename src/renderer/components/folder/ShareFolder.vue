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
      <div class="text-head-6 text-black-700 font-semibold mb-4">
        {{ $t('data.folders.share_folder') }}
      </div>
      <div class="flex items-center">
        <img src="~/assets/images/icons/folderSolid.svg" alt="" class="select-none mr-2">
        <div class="text-black-700 font-semibold">{{ folder.name }}</div>
      </div>
    </div>
    <div class="text-left">
      <div class="grid grid-cols-3 gap-x-2 mb-4">
        <InputText
          v-model="user.username"
          label="Email"
          class="w-full col-span-2"
        />
        <!-- <InputSelect
          label="Role"
          initial-value="admin"
          class="w-full !mb-[10px]"
          :options="roleOptions"
          @change="(v) => user.role = v"
        /> -->
        <button class="btn btn-outline-primary mb-[10px]" @click="addMember">
          {{ $t('data.folders.add_member') }}
        </button>
      </div>
    </div>
    <div>
      <el-table
        :data="members"
        style="width: 100%"
      >
        <el-table-column
          :label="$t('data.sharing.member')"
          width="200"
        >
          <template slot-scope="scope">
            {{ scope.row.email || scope.row.username }}
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('common.view')"
          width="100"
        >
          <template slot-scope="scope">
            <el-checkbox
              :value="scope.row.role === 'member'"
              @change="(v) => { if (v===true) {scope.row.role = 'member'}}"
            />
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('common.edit')"
          width="100"
        >
          <template slot-scope="scope">
            <el-checkbox
              :value="scope.row.role === 'admin'"
              @change="(v) => { if (v===true) {scope.row.role = 'admin'}}"
            />
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
              :class="{'label-primary-light': scope.row.status === 'confirmed',
                       'label-info': scope.row.status === 'accepted',
                       'label-warning-light': scope.row.status === 'invited',
                       'label-danger-light': scope.row.status === 'expired',
                       'label-success': !scope.row.status
              }"
            >
              {{ shareInvitationStatus[`${scope.row.status || 'shared'}`] }}
            </span>
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
    <div
      slot="footer"
      class="dialog-footer flex items-center text-left"
    >
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
          @click="shareFolder()"
        >
          {{ $t('common.share') }}
        </button>
      </div>
    </div>
  </el-dialog>
</template>

<script>

import InputSelect from '../../components/input/InputSelect.vue'
import InputText from '../../components/input/InputText.vue'
import { CipherType } from '../../jslib/src/enums'
import { Utils } from '../../jslib/src/misc/utils.ts'
import { CipherRequest, FolderRequest } from '../../jslib/src/models/request'

export default {
  components: { InputText, InputSelect },
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
      members: [],
      orgKey: null,
      sharingKey: null
    }
  },
  computed: {
    ownershipOptions () {
      return this.teams.filter(e => ['owner', 'admin', 'manager'].includes(e.role))
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
    }
  },
  methods: {
    async openDialog (folder = {}) {
      this.dialogVisible = true
      this.folder = { organizationId: '', ...folder }
      if (this.folder.organizationId) {
        this.orgKey = await this.$cryptoService.getOrgKey(this.folder.organizationId)
        const share = this.myShares.find(s => s.id === this.folder.organizationId) || {}
        this.members = share.members.map(member => {
          return {
            username: member.email,
            status: member.status,
            role: member.role,
            id: member.id,
            key: null
          }
        }) || []
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
      const { public_key: publicKey } = await this.$axios.$post('cystack_platform/pm/sharing/public_key', { email })
      return publicKey
    },
    async generateMemberKey (publicKey, orgKey) {
      const pk = Utils.fromB64ToArray(publicKey)
      const key = await this.$cryptoService.rsaEncrypt(orgKey.key, pk.buffer)
      return key.encryptedString
    },
    async shareItem (folder) {
      const shareKey = await this.$cryptoService.makeShareKey()
      try {
        this.loading = true
        // const publicKey = await this.getPublicKey(this.user.username)
        const collection = await this.$cryptoService.encrypt(folder.name, shareKey[1])
        const collectionName = collection.encryptedString
        const emails = this.user.username.split(',').map(item => item.trim()).filter(item => item.length)
        // const promises = []
        // const members = []
        // emails.forEach(email => {
        //   const promise = this.getPublicKey(email).then(publicKey => {
        //     this.generateMemberKey(publicKey, shareKey[1]).then(key => {
        //       members.push({ username: email, key, role: this.user.role })
        //       return {}
        //     })
        //   })
        //   promises.push(promise)
        // })
        // await Promise.all(promises)
        const members = await Promise.all(emails.map(async email => {
          const publicKey = await this.getPublicKey(email)
          const key = await this.generateMemberKey(publicKey, shareKey[1])
          return {
            username: email,
            role: this.user.role,
            key
          }
        }))
        const url = 'cystack_platform/pm/sharing'
        await this.$axios.$put(url, {
          sharing_key: shareKey[0].encryptedString,
          folder: { id: folder.id, name: collectionName },
          members
        })
        this.notify(this.$tc('data.notifications.update_success', 1, { type: this.$tc('type.folder', 1) }), 'success')
        this.closeDialog()
        this.$emit('updated-cipher')
      } catch (e) {
        this.notify(this.$tc('data.notifications.update_failed', 1, { type: this.$tc('type.folder', 1) }), 'warning')
        console.log(e)
      } finally {
        this.loading = false
      }
    },
    async shareFolder () {
      try {
        this.loading = true
        const collection = await this.$cryptoService.encrypt(this.folder.name, this.orgKey)
        const collectionName = collection.encryptedString
        const ciphers = await Promise.all(this.folder.ciphers.map(async cipher => {
          const cipherEnc = await this.$cipherService.encrypt(cipher, this.orgKey)
          const data = new CipherRequest(cipherEnc)
          return {
            id: cipher.id,
            ...data
          }
        }))
        const payload = {
          sharing_key: this.sharingKey,
          folder: {
            id: this.folder.id,
            name: collectionName,
            ciphers
          },
          members: this.members
        }
        const url = 'cystack_platform/pm/sharing'
        await this.$axios.$put(url, payload)
        this.notify(this.$tc('data.notifications.update_success', 1, { type: this.$tc('type.folder', 1) }), 'success')
        this.closeDialog()
        this.$emit('updated-cipher')
      } catch (e) {
        this.notify(this.$tc('data.notifications.update_failed', 1, { type: this.$tc('type.folder', 1) }), 'warning')
        console.log(e)
      } finally {
        this.loading = false
      }
    },
    async addMember () {
      const publicKey = await this.getPublicKey(this.user.username)
      const key = publicKey ? await this.generateMemberKey(publicKey, this.orgKey) : null
      this.members.push({
        ...this.user,
        key,
        status: 'pending'
      })
    },
    async stopSharing (row) {
      console.log(row)
      if (row.status === 'pending') {
        this.members = this.members.filter(member => member !== row)
        return
      }
      try {
        const personalKey = await this.$cryptoService.getEncKey()
        const folderEnc = await this.$folderService.encrypt(this.folder, personalKey)
        const data = new FolderRequest(folderEnc)
        const ciphers = await Promise.all(this.folder.ciphers.map(async cipher => {
          const cipherEnc = await this.$cipherService.encrypt(cipher, personalKey)
          const data = new CipherRequest(cipherEnc)
          return {
            id: cipher.id,
            ...data
          }
        }))
        await this.$axios.$post(`cystack_platform/pm/sharing/${this.folder.organizationId}/members/${row.id}/stop`, {
          folder: { ...data, id: this.folder.id, ciphers }
        })
        this.notify(this.$tc('data.notifications.update_success', 1, { type: this.$tc('type.folder', 1) }), 'success')
      } catch (error) {
        console.log(error)
        this.notify(this.$tc('data.notifications.update_failed', 1, { type: this.$tc('type.folder', 1) }), 'warning')
      }
    }
  }
}
</script>
