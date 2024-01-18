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
              style="padding: 11px 20px; transition: all ease 0.2s"
              @click="addMember(searchInput)"
            >
              <p>@ &nbsp; {{ searchInput }}</p>
            </div>
            <div
              v-for="item in searchOptions"
              :key="item.id"
              class="w-full hover:bg-black-100 text-black cursor-pointer"
              style="padding: 11px 20px; transition: all ease 0.2s"
              @click="
                item.type === 'group'
                  ? addGroup(item.id)
                  : addMember(item.email)
              "
            >
              <p v-if="item.type === 'group'">
                <i class="fas fa-user-friends" /> &nbsp; {{ item.name }}
              </p>
              <p v-else>
                <i class="el-icon-user-solid" /> &nbsp; {{ item.full_name }} ({{
                  item.email
                }})
              </p>
            </div>
          </div>
        </el-popover>
      </div>
      <!-- Add member/group end -->
    </div>
    <!-- Select end -->

    <!-- Table -->
    <div>
      <el-table
        :data="[...newMembers, ...newGroups, ...members, ...groups]"
        style="width: 100%"
      >
        <!-- Name -->
        <el-table-column :label="$t('data.sharing.member')" width="200">
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
        <!-- Member role end -->

        <!-- Admin role -->
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
        <!-- Admin role end -->

        <!-- Status -->
        <el-table-column :label="$t('common.status')">
          <template slot-scope="scope">
            <template v-if="scope.row.type !== 'group'">
              <!-- Pending -->
              <span v-if="scope.row.status === 'pending'" class="italic">
                {{ shareInvitationStatus.pending }}
              </span>
              <!-- Pending end -->

              <!-- Other status -->
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
              <!-- Other status end -->

              <!-- Confirm user -->
              <span v-if="scope.row.status === 'accepted'">
                <!-- TODO -->
                <button
                  class="btn btn-outline-primary mt-2"
                  @click="$emit('confirm-user', { user: scope.row })"
                >
                  {{ $t('common.confirm') }}
                </button>
              </span>
              <!-- Confirm user end -->
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
          {{ isBelongToTeam ? $t('common.update') : $t('common.share') }}
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
      },
      originFolder: {},
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
      return this.originFolder.organizationId
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

    groups () {
      const share = this.myShares.find(
        s => s.id === this.folder.organizationId
      ) || { groups: [] }
      return (
        share.groups.map(group => {
          return {
            ...group,
            type: 'group',
            key: null
          }
        }) || []
      )
    },

    showDefaultOption () {
      return (
        !!this.searchInput &&
        this.validateEmail(this.searchInput) &&
        !this.searchOptions.length &&
        !this.isSelf({ email: this.searchInput })
      )
    }
  },

  watch: {
    searchInput (val) {
      clearTimeout(this.searchTimeout)
      if (val && val.trim()) {
        this.searchOptionsVisible =
          this.showDefaultOption || this.searchOptions.length > 0
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
    async openDialog (folder = {}) {
      this.dialogVisible = true
      this.searchInput = ''
      this.searchOptions = []
      this.newMembers = []
      this.newGroups = []
      this.originFolder = { organizationId: '', ...folder }
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
      this.newMembers = []
      this.newGroups = []
      this.dialogLoading = {
        addMember: false,
        addGroup: false
      }
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
      if (!this.newMembers.length && !this.newGroups.length) {
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
          members: this.newMembers,
          groups: this.newGroups
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

    async addMember (email) {
      this.searchInput = ''
      if (!this.validateEmail(email) || this.isShared({ email })) {
        return
      }
      const emails = [email]
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
      } catch (e) {
        console.log(e)
        this.notify(this.$t('errors.something_went_wrong'), 'error')
      } finally {
        this.dialogLoading.addMember = false
      }
    },

    async addGroup (id) {
      this.searchInput = ''
      const group = this.searchOptions.find(
        o => o.type === 'group' && o.id === id
      )
      if (!group || this.isShared(group)) {
        return
      }
      try {
        this.dialogLoading.addGroup = true
        const res = await this.$axios.$get(
          `cystack_platform/pm/enterprises/user_groups/${id}/members`
        )
        const members = await Promise.all(
          res.members
            .filter(m => !!m.email)
            .map(async m => {
              const publicKey = m.public_key
              const key = publicKey
                ? await this.generateMemberKey(publicKey, this.orgKey)
                : null
              return {
                username: m.email,
                key
              }
            })
        )
        this.newGroups = [
          ...this.newGroups,
          {
            id,
            name: group.name,
            role: 'member',
            type: 'group',
            isNew: true,
            members
          }
        ]
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

        // Close dialog if is last member to refresh item orgId
        if (this.members.length + this.groups.length <= 1) {
          this.closeDialog()
        }

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
      if (row.id && !row.isNew) {
        try {
          await this.$axios.$put(
            `cystack_platform/pm/sharing/${this.folder.organizationId}/${
              row.type === 'group' ? 'groups' : 'members'
            }/${row.id}`,
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
    },

    async searchGroups (query) {
      if (!this.currentOrg.id) {
        return
      }
      const res = await this.$axios.$post(
        `cystack_platform/pm/enterprises/${this.currentOrg.id}/members_groups/search`,
        {
          query
        }
      )
      this.searchOptions = [
        ...res.members.filter(m => !this.isSelf(m)),
        ...res.groups.map(g => ({ ...g, type: 'group' }))
      ]
      this.$nextTick(() => {
        this.searchOptionsVisible =
          this.showDefaultOption || this.searchOptions.length > 0
      })
    },

    isShared (item) {
      if (item.type === 'group') {
        return (
          !!this.groups.find(g => g.id === item.id) ||
          !!this.newGroups.find(g => g.id === item.id)
        )
      }
      return (
        !!this.members.find(m => m.username === item.email) ||
        !!this.newMembers.find(m => m.username === item.email)
      )
    },

    isSelf (item) {
      return item.email === this.currentUser.email
    }
  }
}
</script>
