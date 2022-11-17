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
      <div class="flex items-center">
        <template v-if="cipher.id">
          <div class="text-[34px] mr-3">
            <Vnodes :vnodes="getIconCipher(cipher, 20)" />
          </div>
          <div class="text-black-700 font-semibold">{{ cipher.name }}</div>
        </template>
        <template v-else>
          <div class="text-black-700 font-semibold">{{ $t('data.sharing.new_share') }}</div>
        </template>
      </div>
    </div>
    <!-- Title end -->

    <div class="text-left">
      <!-- Add cipher/folder -->
      <div
        v-if="!cipher.id"
        class="grid grid-cols-2 gap-x-2 mb-4"
      >
        <div class="w-full">
          <div class="text-black-700 text-head-6 font-semibold">
            {{ $t('data.ciphers.choose_file_folder') }}
          </div>
          <div>
            {{ $t('data.ciphers.choose_file_folder_desc') }}
          </div>
        </div>
        <InputSelect
          v-model="ciphers"
          placeholder="Search Inventory ..."
          :multiple="true"
          :collapse-tags="true"
          :filterable="true"
          class="w-full !mb-4"
          :options="cipherOptions"
          :key-label="'name'"
          :key-value="'id'"
          @change="(v) => ciphers = v"
        />
      </div>
      <!-- Add cipher/folder end -->

      <!-- Add member/group -->
      <el-select
        v-model="user.username"
        remote
        filterable
        placeholder="Email or group"
        :filter-method="searchGroups"
      >
        <el-option
          v-for="item in groups"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>

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
      <!-- Add member/group end -->
    </div>

    <!-- Member table -->
    <div>
      <el-table
        :data="newMembers.concat(members)"
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
            <el-radio
              label="member"
              :value="scope.row.role"
              @change="(v) => { if (v === 'admin') {updatePermission(scope.row, 'member')}}"
            >
              <span />
            </el-radio>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('common.edit')"
          width="100"
        >
          <template slot-scope="scope">
            <el-radio
              label="admin"
              :value="scope.row.role"
              @change="(v) => { if (v === 'member') {updatePermission(scope.row, 'admin')}}"
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
              :class="{'label-primary-light': scope.row.status === 'confirmed',
                       'label-info': scope.row.status === 'accepted',
                       'label-warning-light': scope.row.status === 'invited',
                       'label-danger-light': scope.row.status === 'expired',
                       'label-success': !scope.row.status
              }"
            >
              {{ shareInvitationStatus[`${scope.row.status || 'shared'}`] }}
            </span>
            <span v-if="scope.row.status === 'accepted'"><button class="btn btn-outline-primary mt-2" @click="confirmUser(scope.row)">{{ $t('common.confirm') }}</button></span>
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
    <!-- Member table end -->

    <!-- Footer -->
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
          @click="cipher.id ? shareItem(cipher) : shareMultiple()"
        >
          {{ isBelongToTeam ? $t('common.update') : $t('common.share') }}
        </button>
      </div>
    </div>
    <!-- Footer end -->
  </el-dialog>
</template>

<script>
import InputSelect from '../../components/input/InputSelect.vue'
import InputText from '../../components/input/InputText.vue'
import { CipherRequest } from '../../jslib/src/models/request'
import { CipherType } from '../../jslib/src/enums'
import Vnodes from '../../components/Vnodes'
import { Utils } from '../../jslib/src/misc/utils.ts'

export default {
  components: { Vnodes, InputSelect, InputText },
  props: {
    cipherOptions: {
      type: Array,
      default: () => new Array([])
    }
  },
  data () {
    return {
      CipherType,
      cipher: {
        collectionIds: [],
        organizationId: ''
        // viewPassword: true
      },
      originCipher: {},
      loading: false,
      dialogVisible: false,
      errors: {},
      writeableCollections: [],
      policies: {
        min_password_length: null,
        max_password_length: null,
        password_composition: false,
        failed_login_attempts: null,
        failed_login_duration: 0,
        failed_login_block_time: 0
      },
      user: {
        id: null,
        username: '',
        role: 'member',
        hide_passwords: false
      },
      newMembers: [],
      ciphers: [],
      orgKey: null,
      sharingKey: null,
      dialogLoading: {
        addMember: false
      },
      groups: []
    }
  },
  computed: {
    ownershipOptions () {
      return this.teams.filter(e => ['owner', 'admin', 'manager'].includes(e.role))
    },
    isBelongToTeam () {
      return this.originCipher.organizationId
    },
    passwordStrength () {
      if (this.cipher.login) {
        return this.$passwordGenerationService.passwordStrength(this.cipher.login.password, ['cystack']) || {}
      }
      return {}
    },
    roleOptions () {
      return [
        // { label: this.$t('data.ciphers.only_use'), value: 'member-hide_passwords' },
        { label: this.$t('data.ciphers.viewable'), value: 'member' },
        { label: this.$t('data.ciphers.editable'), value: 'admin' }
      ]
    },
    shareInvitationStatus () {
      return this.$t('data.sharing')
    },
    members () {
      const share = this.myShares.find(s => s.id === this.cipher.organizationId) || { members: [] }
      return share.members.map(member => {
        return {
          ...member,
          username: member.email,
          status: member.status,
          role: member.role,
          id: member.id,
          key: null
        }
      }) || []
    },

    isMemberEmailInputValid () {
      const emails = this.user.username.split(',').map(item => item.trim()).filter(item => item.length)
      if (!emails.length) {
        return false
      }
      return emails.every(this.validateEmail)
    }
  },
  methods: {
    handleClose (index) {
      this.newMembers.splice(index, 1)
    },
    beforeDestroy () {
      this.orgKey = null
      this.sharingKey = null
    },
    async openDialog (cipher = {}) {
      this.dialogVisible = true
      this.newMembers = []
      this.originCipher = { organizationId: '', ...cipher }
      this.cipher = { organizationId: '', ...cipher }
      if (this.cipher.organizationId) {
        this.orgKey = await this.$cryptoService.getOrgKey(this.cipher.organizationId)
      } else {
        const shareKey = await this.$cryptoService.makeShareKey()
        this.sharingKey = shareKey ? shareKey[0].encryptedString : null
        this.orgKey = shareKey[1]
      }
      // await this.handleChangeOrg(this.cipher.organizationId)
    },
    closeDialog () {
      this.newMembers = []
      this.dialogVisible = false
    },
    async handleChangeOrg (orgId) {
      this.$set(this.cipher, 'organizationId', orgId)
      this.cipher.folderId = null
      if (orgId) {
        // await this.getTeamPolicies(orgId)
        this.writeableCollections = await this.getWritableCollections(orgId)
        if (this.writeableCollections.length && !this.isBelongToTeam) {
          this.cipher.collectionIds = [this.writeableCollections[0].id]
        }
      } else {
        this.cipher.collectionIds = []
      }
    },
    async getWritableCollections (orgId) {
      let allCollections = []
      try {
        allCollections = await this.$collectionService.getAllDecrypted()
      } catch (error) {

      }
      return allCollections.filter(c => !c.readOnly && c.organizationId === orgId)
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
    async shareItem (cipher) {
      if (!this.newMembers.length) {
        this.closeDialog()
        return
      }
      try {
        this.loading = true
        const type_ = cipher.type
        if (type_ === 7) {
          cipher.type = CipherType.SecureNote
          cipher.secureNote.type = 0
        }
        const cipherEnc = await this.$cipherService.encrypt(cipher, this.orgKey)
        const data = new CipherRequest(cipherEnc)
        data.type = type_
        this.cipher.type = type_
        const url = 'cystack_platform/pm/sharing'
        await this.$axios.$put(url, {
          sharing_key: this.sharingKey,
          cipher: { id: cipher.id, ...data },
          members: this.newMembers
        })
        this.notify(this.$tc('data.notifications.update_success', 1, { type: this.$tc(`type.${cipher.type}`, 1) }), 'success')
        this.closeDialog()
        this.$emit('shared-cipher')
      } catch (e) {
        if (e.response && e.response.data && e.response.data.code === '7002') {
          this.notify(e.response.data.message, 'warning')
          this.$emit('upgrade-plan')
        }
        this.notify(this.$tc('data.notifications.update_failed', 1, { type: this.$tc(`type.${cipher.type}`, 1) }), 'warning')
        // console.log(e)
      } finally {
        this.loading = false
      }
    },
    async shareMultiple () {
      const promises = []
      if (this.ciphers.length > 20) {
        this.notify(this.$t('data.notifications.share_less_than_20'), 'warning')
        return
      }
      this.ciphers = this.ciphers.map(cipherId => this.cipherOptions.find(cipher => cipher.id === cipherId))
      const sharedCiphers = []
      try {
        this.loading = true
        // if (this.user.role === 'member-hide_passwords') {
        //   this.user.role = 'member'
        //   this.user.hide_passwords = true
        // }
        // const emails = this.user.username.split(',').map(item => item.trim()).filter(item => item.length)
        // this.newMembers = this.newMembers.concat(emails)
        // if (!this.newMembers.length) {
        //   return
        // }
        // const membersWithKey = await Promise.all(this.newMembers.map(async email => {
        //   const publicKey = await this.getPublicKey(email)
        //   return {
        //     email,
        //     publicKey
        //   }
        // }))
        this.ciphers.forEach(cipher => {
          promises.push(this.encryptCipher(cipher, sharedCiphers))
        })
        this.user.username = ''
        await Promise.all(promises)
        const url = 'cystack_platform/pm/sharing/multiple'
        await this.$axios.$put(url, {
          sharing_key: this.sharingKey,
          ciphers: sharedCiphers
        })
        this.notify(this.$tc('data.notifications.share_success', this.ciphers.length), 'success')
        this.closeDialog()
        this.$emit('shared-cipher')
      } catch (e) {
        if (e.response && e.response.data && e.response.data.code === '7002') {
          this.notify(e.response.data.message, 'warning')
          this.$emit('upgrade-plan')
        }
        this.notify(this.$tc('data.notifications.share_failed', this.ciphers.length), 'warning')
        console.log(e)
      } finally {
        this.members = []
        this.loading = false
      }
    },
    async encryptCipher (cipher, sharedCiphers) {
      let _orgKey = this.orgKey
      if (cipher.organizationId) { // check if the cipher is shared
        // console.log(cipher.organizationId)
        _orgKey = await this.$cryptoService.getOrgKey(cipher.organizationId)
      }
      const type_ = cipher.type
      if (type_ === 7) {
        cipher.type = CipherType.SecureNote
        cipher.secureNote.type = 0
      }
      const cipherEnc = await this.$cipherService.encrypt(cipher, _orgKey)
      const data = new CipherRequest(cipherEnc)
      data.type = type_
      cipher.type = type_
      sharedCiphers.push({ cipher: { id: cipher.id, ...data }, members: this.newMembers })
      return sharedCiphers
    },
    async addMember () {
      if (!this.isMemberEmailInputValid) {
        return
      }
      const emails = this.user.username.split(',').map(item => item.trim()).filter(item => item.length)
      if (!emails.length) {
        return
      }
      try {
        this.dialogLoading.addMember = true
        const members = await Promise.all(emails.map(async email => {
          const publicKey = await this.getPublicKey(email)
          const key = publicKey ? await this.generateMemberKey(publicKey, this.orgKey) : null
          return {
            id: null,
            username: email,
            key,
            status: 'pending',
            role: 'member'
          }
        }))
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
        const type_ = this.cipher.type
        if (type_ === 7) {
          this.cipher.type = CipherType.SecureNote
          this.cipher.secureNote.type = 0
        }
        const personalKey = await this.$cryptoService.getEncKey()
        const cipherEnc = await this.$cipherService.encrypt(this.cipher, personalKey)
        const data = new CipherRequest(cipherEnc)
        data.type = type_
        this.cipher.type = type_
        await this.$axios.$post(`cystack_platform/pm/sharing/${this.cipher.organizationId}/members/${row.id}/stop`, {
          folder: null,
          cipher: { ...data, id: this.cipher.id }
        })
        this.notify(this.$tc('data.notifications.update_success', 1, { type: this.$tc(`type.${this.cipher.type}`, 1) }), 'success')
        await this.getMyShares()
      } catch (error) {
        this.notify(this.$tc('data.notifications.update_failed', 1, { type: this.$tc(`type.${this.cipher.type}`, 1) }), 'warning')
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
          await this.$axios.$put(`cystack_platform/pm/sharing/${this.cipher.organizationId}/members/${row.id}`, {
            role
          })
          this.notify(this.$tc('data.notifications.update_success', 1, { type: this.$tc(`type.${this.cipher.type}`, 1) }), 'success')
          await this.getMyShares()
          this.$emit('updated-cipher')
        } catch (error) {
          this.notify(this.$tc('data.notifications.update_failed', 1, { type: this.$tc(`type.${this.cipher.type}`, 1) }), 'warning')
          console.log(error)
        }
      } else {
        row.role = role
      }
    },
    async confirmUser (user) {
      try {
        this.loading = true
        const publicKey = await this.getPublicKey(user.email)
        const key = await this.generateMemberKey(publicKey, this.orgKey)
        await this.$axios.$post(`pm/sharing/${this.cipher.organizationId}/members/${user.id}`, {
          key
        })
        await this.getMyShares()
        this.notify(this.$t('data.notifications.confirm_member_success'), 'success')
      } catch (e) {
        this.notify(this.$t('data.notifications.confirm_member_failed'), 'warning')
      } finally {
        this.loading = false
      }
    },
    async searchGroups (query) {
      const defaultOptions = []
      if (query) {
        defaultOptions.push({
          name: `"${query}"`
        })
      }
      this.groups = defaultOptions
      const res = await this.$axios.$get('cystack_platform/pm/enterprises/user_groups', {
        params: {
          q: query
        }
      })
      this.groups = [...defaultOptions, ...res]
    }
  }
}
</script>
