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

    <!-- Select -->
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
      <div class="mb-4">
        <InputText
          v-model="searchInput"
          :disabled="dialogLoading.addGroup || dialogLoading.addMember"
          :label="$t('data.sharing.enter_email_or_group')"
          class="w-full col-span-3"
        />

        <el-popover
          v-model="searchOptionsVisible"
          placement="bottom"
          trigger="manual"
          width="100%"
          style="width: 100%"
        >
          <div style="margin: -12px; padding: 10px 0">
            <div
              v-if="showDefaultOption"
              class="w-full hover:bg-black-100 text-black cursor-pointer"
              style="padding: 11px 20px; transition: all ease .2s"
              @click="addMember(searchInput)"
            >
              <p>
                @ &nbsp; {{ searchInput }}
              </p>
            </div>
            <div
              v-for="item in searchOptions"
              :key="item.id"
              class="w-full hover:bg-black-100 text-black cursor-pointer"
              style="padding: 11px 20px; transition: all ease .2s"
              @click="item.type === 'group' ? addGroup(item.id) : addMember(item.email)"
            >
              <p v-if="item.type === 'group'">
                <i class="fas fa-user-friends" /> &nbsp; {{ item.name }}
              </p>
              <p v-else>
                <i class="el-icon-user-solid" /> &nbsp; {{ item.full_name }} ({{ item.email }})
              </p>
            </div>
          </div>
        </el-popover>
      </div>
      <!-- Add member/group end -->
    </div>
    <!-- Select end -->

    <!-- Member + group table -->
    <div>
      <el-table
        :data="[...newMembers, ...newGroups, ...members, ...groups]"
        style="width: 100%"
      >
        <!-- Name -->
        <el-table-column
          :label="$t('data.sharing.member')"
          width="200"
        >
          <template slot-scope="scope">
            <div v-if="scope.row.type === 'group'">
              <i class="fas fa-user-friends" /> &nbsp; {{ scope.row.name }}
            </div>
            <div v-else>
              {{ scope.row.email || scope.row.username }}
            </div>
          </template>
        </el-table-column>
        <!-- Name end -->

        <!-- Member role -->
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
        <!-- Member role end -->

        <!-- Admin role -->
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
        <!-- Admin role end -->

        <!-- Status -->
        <el-table-column :label="$t('common.status')">
          <template slot-scope="scope">
            <template v-if="scope.row.type !== 'group'">
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
          </template>
        </el-table-column>
        <!-- Status end -->

        <!-- Delete -->
        <el-table-column width="50">
          <template slot-scope="scope">
            <span class="cursor-pointer" @click="stopSharing(scope.row)">
              <i class="el-icon-delete" />
            </span>
          </template>
        </el-table-column>
        <!-- Delete end -->
      </el-table>
    </div>
    <!-- Member + group table end -->

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
      },
      ciphers: [],
      originCipher: {},
      loading: false,
      dialogVisible: false,
      newMembers: [],
      newGroups: [],
      orgKey: null,
      sharingKey: null,
      dialogLoading: {
        addMember: false,
        addGroup: false
      },
      searchOptionsVisible: false,
      searchTimeout: null,
      searchInput: '',
      searchOptions: []
    }
  },

  computed: {
    isBelongToTeam () {
      return this.originCipher.organizationId
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

    groups () {
      const share = this.myShares.find(s => s.id === this.cipher.organizationId) || { groups: [] }
      return share.groups.map(group => {
        return {
          ...group,
          type: 'group',
          key: null
        }
      }) || []
    },

    showDefaultOption () {
      return !!this.searchInput &&
        this.validateEmail(this.searchInput) &&
        !this.searchOptions.length &&
        !this.isSelf({ email: this.searchInput })
    }
  },

  watch: {
    searchInput (val) {
      clearTimeout(this.searchTimeout)
      if (val && val.trim()) {
        this.searchOptionsVisible = this.showDefaultOption || this.searchOptions.length > 0
        this.searchTimeout = setTimeout(() => {
          this.searchGroups(val)
        }, 200)
      } else {
        this.searchOptionsVisible = false
        this.searchOptions = []
      }
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
      this.searchInput = ''
      this.searchOptions = []
      this.newMembers = []
      this.newGroups = []
      this.originCipher = { organizationId: '', ...cipher }
      this.cipher = { organizationId: '', ...cipher }
      if (this.cipher.organizationId) {
        this.orgKey = await this.$cryptoService.getOrgKey(this.cipher.organizationId)
      } else {
        const shareKey = await this.$cryptoService.makeShareKey()
        this.sharingKey = shareKey ? shareKey[0].encryptedString : null
        this.orgKey = shareKey[1]
      }
    },

    closeDialog () {
      this.newMembers = []
      this.newGroups = []
      this.dialogLoading = {
        addMember: false,
        addGroup: false
      }
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

    async shareItem (cipher) {
      if (!this.newMembers.length && !this.newGroups.length) {
        this.closeDialog()
        return
      }
      try {
        this.loading = true
        const type_ = cipher.type
        if ([7].includes(type_)) {
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
          members: this.newMembers,
          groups: this.newGroups
        })
        this.notify(this.$t('data.notifications.update_share_success'), 'success')
        this.closeDialog()
        this.$emit('shared-cipher')
      } catch (e) {
        if (e.response && e.response.data && e.response.data.code === '7002') {
          this.notify(e.response.data.message, 'warning')
          this.$emit('upgrade-plan')
        }
        this.notify(this.$t('errors.something_went_wrong'), 'warning')
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
        this.ciphers.forEach(cipher => {
          promises.push(this.encryptCipher(cipher, sharedCiphers))
        })
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
      sharedCiphers.push({
        cipher: { id: cipher.id, ...data },
        members: this.newMembers,
        groups: this.newGroups
      })
      return sharedCiphers
    },

    async addMember (email) {
      if (!this.validateEmail(email) || this.isShared({ email })) {
        this.searchInput = ''
        return
      }
      const emails = [email]
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
        this.searchInput = ''
      } catch (e) {
        console.log(e)
        this.notify(this.$t('errors.something_went_wrong'), 'error')
      } finally {
        this.dialogLoading.addMember = false
      }
    },

    async addGroup (id) {
      this.searchInput = ''
      const group = this.searchOptions.find(o => o.type === 'group' && o.id === id)
      if (!group || this.isShared(group)) {
        return
      }
      try {
        this.dialogLoading.addGroup = true
        const res = await this.$axios.$get(`cystack_platform/pm/enterprises/user_groups/${id}/members`)
        const members = await Promise.all(res.members.map(async m => {
          const publicKey = m.public_key
          const key = publicKey ? await this.generateMemberKey(publicKey, this.orgKey) : null
          return {
            username: m.email,
            key
          }
        }))
        this.newGroups = [...this.newGroups, {
          id,
          name: group.name,
          role: 'member',
          type: 'group',
          isNew: true,
          members
        }]
      } catch (e) {
        console.log(e)
        this.notify(this.$t('errors.something_went_wrong'), 'error')
      } finally {
        this.dialogLoading.addGroup = false
      }
    },

    async stopSharing (row) {
      if (row.status === 'pending') {
        this.newMembers = this.newMembers.filter(member => member !== row)
        return
      }
      if (row.type === 'group' && row.isNew) {
        this.newGroups = this.newGroups.filter(group => group !== row)
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
        await this.$axios.$post(`cystack_platform/pm/sharing/${this.cipher.organizationId}/${row.type === 'group' ? 'groups' : 'members'}/${row.id}/stop`, {
          folder: null,
          cipher: { ...data, id: this.cipher.id }
        })
        this.notify(this.$t('data.notifications.stop_share_success'), 'success')
        await this.getMyShares()
      } catch (error) {
        this.notify(this.$t('errors.something_went_wrong'), 'warning')
      }
    },

    async getMyShares () {
      this.$store.dispatch('LoadMyShares')
    },

    async updatePermission (row, role) {
      if (row.id && !row.isNew) {
        try {
          await this.$axios.$put(`cystack_platform/pm/sharing/${this.cipher.organizationId}/${row.type === 'group' ? 'groups' : 'members'}/${row.id}`, {
            role
          })
          this.notify(this.$t('data.notifications.update_share_success'), 'success')
          await this.getMyShares()
          this.$emit('updated-cipher')
        } catch (error) {
          this.notify(this.$t('errors.something_went_wrong'), 'warning')
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
      const res = await this.$axios.$post(`cystack_platform/pm/enterprises/${this.currentOrg.id}/members_groups/search`, {
        query
      })
      this.searchOptions = [
        ...res.members.filter(m => !this.isSelf(m)),
        ...res.groups.map(g => ({ ...g, type: 'group' }))
      ]
      this.$nextTick(() => {
        this.searchOptionsVisible = this.showDefaultOption || this.searchOptions.length > 0
      })
    },

    isShared (item) {
      if (item.type === 'group') {
        return !!this.groups.find(g => g.id === item.id)
      }
      return !!this.members.find(m => m.email === item.email)
    },

    isSelf (item) {
      return item.email === this.currentUser.email
    }
  }
}
</script>
