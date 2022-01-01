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
          class="w-full col-span-2 !mb-4"
        />
        <InputSelect
          label="Role"
          initial-value="admin"
          class="w-full !mb-4"
          :options="roleOptions"
          @change="(v) => user.role = v"
        />
      </div>
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
          @click="shareItem(folder)"
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

export default {
  components: { InputSelect, InputText },
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
        username: '',
        role: 'admin'
      }
    }
  },
  computed: {
    ownershipOptions () {
      return this.teams.filter(e => ['owner', 'admin', 'manager'].includes(e.role))
    },
    roleOptions () {
      return [
        { label: 'Viewer', value: 'viewer' },
        { label: 'Editor', value: 'editor' },
        { label: 'Admin', value: 'admin' }
      ]
    }
  },
  methods: {
    async openDialog (folder = {}) {
      this.dialogVisible = true
      this.originFolder = { organizationId: '', ...folder }
      this.folder = { organizationId: '', ...folder }
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
    }
  }
}
</script>
