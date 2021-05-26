<template>
  <div class="flex flex-col flex-column-fluid relative">
    Trang user
    <button class="btn btn-primary" @click="postUser">open</button>
    <div class="flex-column-fluid lg:px-28 py-10 px-10 mb-20">
      <client-only>
        <el-table
          :data="members"
          style="width: 100%"
        >
          <el-table-column
            prop="date"
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
              {{ scope.row.status }}
            </template>
          </el-table-column>
          <el-table-column
            label="Role"
            align="right"
          >
            <template slot-scope="scope">
              {{ scope.row.role }}
            </template>
          </el-table-column>
          <el-table-column
            label="Access time"
            align="right"
          >
            <template slot-scope="scope">
              {{ $moment(scope.row.access_time * 1000).fromNow() }}
            </template>
          </el-table-column>
          <el-table-column
            align="right"
          >
            <template slot-scope="scope">
              <el-dropdown trigger="click" :hide-on-click="false">
                <button class="btn btn-icon btn-xs hover:bg-black-400">
                  <i class="fas fa-ellipsis-h" />
                </button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    v-if="scope.row.status === 'accepted'"
                    @click.native="confirmUser(scope.row)"
                  >
                    <span class="text-success">{{ $t('common.confirm') }}</span>
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-if="scope.row.status === 'confirmed'"
                    @click.native="putUser(scope.row)"
                  >
                    {{ $t('common.edit') }}
                  </el-dropdown-item>
                  <el-dropdown-item>
                    {{ $t('common.groups') }}
                  </el-dropdown-item>
                  <el-dropdown-item @click.native="deleteUser(scope.row)">
                    <span class="text-danger">
                      {{ $t('common.remove') }}
                    </span>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
      </client-only>
    </div>
    <AddEditUser ref="addEditUser" @done="getUsers" />
  </div>
</template>

<script>
import AddEditUser from '../../../components/user/AddEditUser'
export default {
  components: {
    AddEditUser
  },
  data () {
    return {
      members: []
    }
  },
  mounted () {
    this.getUsers()
  },
  methods: {
    postUser () {
      this.$refs.addEditUser.openDialog({})
    },
    getUsers () {
      this.$axios.$get(`cystack_platform/pm/teams/${this.$route.params.teamId}/members`)
        .then(res => {
          this.members = res
        })
    },
    putUser (user) {
      this.$refs.addEditUser.openDialog(user)
    },
    deleteUser (user) {
      this.$refs.addEditUser.deleteUser(user)
    },
    async generateOrgKey (publicKey) {
      const pk = new Uint8Array(Buffer.from(publicKey, 'base64'))
      const orgKey = await this.$cryptoService.getOrgKey(this.$route.params.teamId)
      const key = await this.$cryptoService.rsaEncrypt(orgKey.key, pk.buffer)
      return key.encryptedString
    },
    async getPublicKey (user) {
      const { public_key: publicKey } = await this.$axios.$get(`cystack_platform/pm/teams/${this.$route.params.teamId}/members/${user.id}/public_key`)
      return publicKey
    },
    async confirmUser (user) {
      try {
        const publicKey = await this.getPublicKey(user)
        const key = await this.generateOrgKey(publicKey)
        await this.$axios.$post(`cystack_platform/pm/teams/${this.$route.params.teamId}/members/${user.id}`, {
          key
        })
        this.getUsers()
        this.notify(this.$t('data.notifications.confirm_member_success'), 'success')
      } catch (e) {
        console.log(e)
        this.notify(this.$t('data.notifications.confirm_member_failed'), 'warning')
      }
    }
  }
}
</script>
