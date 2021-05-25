<template>
  <el-dialog
    :visible.sync="dialogVisible"
    width="435px"
    destroy-on-close
    top="5vh"
    custom-class="locker-dialog"
    :close-on-click-modal="false"
  >
    <div slot="title">
      <div class="text-black-700 font-semibold">
        Mời người dùng
      </div>
    </div>
    <div class="text-left">
      <div class="form-group">
        <label for="">Gửi tới</label>
        <input v-model="username" type="text" class="form-control">
        <div class="invalid-feedback">
          {{ errors.name && errors.name[0] }}
        </div>
      </div>
      <div class="form-group">
        <el-radio-group v-model="role">
          <el-radio v-for="item in roleOptions"
                    :key="item.value" :label="item.value"
                    class="flex"
          >
            <div>{{ item.label }}</div>
            <div>{{ item.description }}</div>
          </el-radio>
        </el-radio-group>
        {{ collections }}
      </div>
    </div>
    <div slot="footer" class="dialog-footer flex items-center text-left">
      <div class="flex-grow" />
      <div>
        <button class="btn btn-default"
                @click="dialogVisible = false"
        >
          Cancel
        </button>
        <button class="btn btn-primary"
                :disabled="loading"
                @click="shareItem(cipher)"
        >
          {{ $t('common.share') }}
        </button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import filter from 'lodash/filter'
import uniq from 'lodash/uniq'

export default {
  data () {
    return {
      loading: false,
      dialogVisible: false,
      errors: {},
      redirect: false,
      username: '',
      role: '',
      collections: [],
      roleOptions: [
        {
          label: 'Admin',
          value: 'admin',
          description: 'Admins can access and manage all items, collections and users in your organization'
        },
        {
          label: 'Manager',
          value: 'manager',
          description: 'Managers can access and manage assigned collections in your organization.'
        },
        {
          label: 'Member',
          value: 'member',
          description: 'A regular user with access to assigned collections in your team.'
        }
      ]
    }
  },
  computed: {
    ownershipOptions () {
      return this.teams.filter(e => ['owner', 'admin'].includes(e.role))
    }
  },
  asyncComputed: {
    collections: {
      async get () {
        const collections = await this.$collectionService.getAllDecrypted() || []
        return collections.filter(c => !c.readOnly && c.organizationId === this.currentOrg.organization_id)
      },
      watch: ['currentOrg']
    }
  },
  methods: {
    async openDialog () {
      this.dialogVisible = true
    },
    closeDialog () {
      this.dialogVisible = false
    },
    async inviteUser (cipher) {
      try {
        this.loading = true
        const members = await Promise.all(this.members.map(async e => {
          const name = (await this.$cryptoService.encrypt(e, orgKey)).encryptedString
          return {
            username: e,
            name
          }
        }))
        const response = await this.$axios.$post(`cystack_platform/pm/ciphers/${cipher.id}/share`, {
          members
        })
        const keys = await Promise.all(response.members_public_key.map(async member => {
          const key = await this.generateOrgKey(member.public_key)
          return { ...member, key }
        }))

        await this.putShareKeys(cipher.id, keys)
        await this.getSyncData()

        this.closeDialog()
      } catch (e) {
        console.log(e)
        this.errors = (e.response && e.response.data && e.response.data.details) || {}
      } finally {
        this.loading = false
      }
    },
    async generateOrgKey (publicKey) {
      const pk = new Uint8Array(Buffer.from(publicKey, 'base64'))
      const orgKey = await this.$cryptoService.getOrgKey('095ccf45-983d-4fc1-951c-ad330073de93')
      const key = await this.$cryptoService.rsaEncrypt(orgKey.key, pk.buffer)
      return key.encryptedString
    }
  }
}
</script>
