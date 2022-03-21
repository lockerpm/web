<template>
  <!-- <el-dialog
    :visible.sync="dialogVisible"
    width="435px"
    destroy-on-close
    top="5vh"
    custom-class="locker-dialog"
    :close-on-click-modal="false"
  >
    <div slot="title">
      <div class="flex items-center">
        <div class="text-[34px] mr-3">
          <Vnodes :vnodes="getIconCipher(cipher, 20)" />
        </div>
        <div class="text-black-700 font-semibold">{{ cipher.name }}</div>
      </div>
    </div>
    <div class="text-left">
      <div
        v-if="isBelongToTeam"
        class="mb-3"
      >
        {{ $t('data.ciphers.choose_at_least_folder') }}
      </div>
      <div
        v-else
        class="mb-3"
      >
        {{ $t('data.ciphers.choose_a_team') }}
      </div>
      <InputSelectTeam
        v-if="!isBelongToTeam && dialogVisible"
        :label="$t('common.ownership')"
        :options="ownershipOptions"
        class="w-full"
        @change="handleChangeOrg"
      />
      <div
        v-if="cipher.organizationId"
        class="form-group"
      >
        <div class="flex items-center justify-between" />
        <label for="">{{ $t('data.ciphers.folders_team') }}</label>
        <el-checkbox-group
          v-model="cipher.collectionIds"
          :min="1"
        >
          <el-checkbox
            v-for="(item, index) in writeableCollections"
            :key="index"
            :label="item.id"
          >
            {{ item.name }}
          </el-checkbox>
        </el-checkbox-group>
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
          :disabled="loading || !cipher.collectionIds.length"
          @click="shareCipher(cipher)"
        >
          {{ isBelongToTeam ? $t('common.update') : $t('common.share') }}
        </button>
      </div>
    </div>
  </el-dialog> -->
  <el-dialog
    :visible.sync="dialogVisible"
    width="650px"
    destroy-on-close
    top="5vh"
    custom-class="locker-dialog"
    :close-on-click-modal="false"
  >
    <div slot="title">
      <div class="flex items-center">
        <template v-if="cipher.id">
          <div class="text-[34px] mr-3">
            <Vnodes :vnodes="getIconCipher(cipher, 20)" />
          </div>
          <div class="text-black-700 font-semibold">{{ cipher.name }}</div>
        </template>
        <template v-else>
          <div class="text-black-700 font-semibold">New share</div>
        </template>
      </div>
    </div>
    <div class="text-left">
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
      <div class="grid grid-cols-2 gap-x-2 mb-4">
        <div class="w-full">
          <div class="text-black-700 text-head-6 font-semibold">
            {{ $t('data.ciphers.add_recipient_emails') }}
          </div>
          <div>
            {{ $t('data.ciphers.add_recipient_emails_desc') }}
          </div>
        </div>
        <InputText
          v-model="user.username"
          label="Email"
          class="w-full !mb-4"
          :add-button="true"
          @add="addEmail"
          @keyupEnter="addEmail"
        />
      </div>
      <div
        v-if="members"
        class="w-full mb-4"
      >
        <el-tag
          v-for="(email, index) in members"
          :key="index"
          class="mr-3 mb-3 w-full !flex justify-between items-center"
          closable
          :disable-transitions="false"
          @close="handleClose(index)"
        >
          {{ email }}
        </el-tag>
      </div>
      <div class="grid grid-cols-3 gap-x-2 mb-4">
        <div class="col-span-2">
          <div class="text-black-700 text-head-6 font-semibold">
            {{ $t('data.ciphers.share_type') }}
          </div>
          <div>
            {{ $t('data.ciphers.share_type_desc') }}
          </div>
        </div>
        <InputSelect
          :label="$t('common.share_type')"
          initial-value="member"
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
          @click="cipher.id?shareItem(cipher):shareMultiple()"
        >
          {{ isBelongToTeam ? $t('common.update') : $t('common.share') }}
        </button>
      </div>
    </div>
  </el-dialog>
</template>

<script>

import InputSelectTeam from '../../components/input/InputSelectTeam'
import InputSelect from '../../components/input/InputSelect.vue'
import InputText from '../../components/input/InputText.vue'
import { CipherRequest } from '../../jslib/src/models/request'
import { CipherType } from '../../jslib/src/enums'
import Vnodes from '../../components/Vnodes'
import { Utils } from '../../jslib/src/misc/utils.ts'

export default {
  components: { InputSelectTeam, Vnodes, InputSelect, InputText },
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
        username: '',
        role: 'member',
        hide_passwords: false
      },
      members: [],
      ciphers: []
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
        { label: this.$t('data.ciphers.only_use'), value: 'member-hide_passwords' },
        { label: this.$t('data.ciphers.viewable'), value: 'member' },
        { label: this.$t('data.ciphers.editable'), value: 'admin' }
      ]
    }
  },
  methods: {
    addEmail () {
      const emails = this.user.username.split(',').map(item => item.trim()).filter(item => item.length)
      this.members = this.members.concat(emails)
      this.user.username = ''
    },
    handleClose (index) {
      console.log(index)
      this.members.splice(index, 1)
    },
    async openDialog (cipher = {}) {
      this.dialogVisible = true
      this.members = []
      this.originCipher = { organizationId: '', ...cipher }
      this.cipher = { organizationId: '', ...cipher }
      await this.handleChangeOrg(this.cipher.organizationId)
    },
    closeDialog () {
      this.members = []
      this.dialogVisible = false
    },
    async shareCipher (cipher) {
      if (this.checkPolicies(cipher)) {
        try {
          this.loading = true
          const cipherEnc = await this.$cipherService.encrypt(cipher)
          const data = new CipherRequest(cipherEnc)
          const url = this.isBelongToTeam ? `cystack_platform/pm/ciphers/${cipher.id}` : `cystack_platform/pm/ciphers/${cipher.id}/share`
          await this.$axios.$put(url, {
            ...data,
            score: this.passwordStrength.score,
            collectionIds: cipher.collectionIds
            // view_password: cipher.viewPassword
          })
          this.notify(this.$tc('data.notifications.update_success', 1, { type: this.$tc(`type.${CipherType[this.cipher.type]}`, 1) }), 'success')
          this.closeDialog()
          this.$emit('shared-cipher')
        } catch (e) {
          this.notify(this.$tc('data.notifications.update_failed', 1, { type: this.$tc(`type.${CipherType[this.cipher.type]}`, 1) }), 'warning')
          console.log(e)
        } finally {
          this.loading = false
        }
      }
    },
    async generateOrgKey (publicKey) {
      const pk = new Uint8Array(Buffer.from(publicKey, 'base64'))
      const orgKey = await this.$cryptoService.getOrgKey('095ccf45-983d-4fc1-951c-ad330073de93')
      const key = await this.$cryptoService.rsaEncrypt(orgKey.key, pk.buffer)
      return key.encryptedString
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
      const allCollections = await this.$collectionService.getAllDecrypted()
      return allCollections.filter(c => !c.readOnly && c.organizationId === orgId)
    },
    async getTeamPolicies (teamId) {
      this.policies = await this.$axios.$get(`cystack_platform/pm/teams/${teamId}/policy`)
    },
    checkPolicies (cipher) {
      if (cipher.type === CipherType.Login) {
        if (this.policies.min_password_length && cipher.login.password.length < this.policies.min_password_length) {
          this.notify(this.$t('data.notifications.min_password_length', { length: this.policies.min_password_length }), 'warning')
          return false
        }
        if (this.policies.max_password_length && cipher.login.password.length > this.policies.max_password_length) {
          this.notify(this.$t('data.notifications.max_password_length', { length: this.policies.max_password_length }), 'warning')
          return false
        }
        if (this.policies.password_composition) {
          if (this.policies.require_special_character) {
            const reg = /(?=.*[!@#$%^&*])/
            const check = reg.test(cipher.login.password)
            if (!check) {
              this.notify(this.$t('data.notifications.requires_special'), 'warning')
              return false
            }
          }
          if (this.policies.require_lower_case) {
            const reg = /[a-z]/
            const check = reg.test(cipher.login.password)
            if (!check) {
              this.notify(this.$t('data.notifications.requires_lowercase'), 'warning')
              return false
            }
          }
          if (this.policies.require_upper_case) {
            const reg = /[A-Z]/
            const check = reg.test(cipher.login.password)
            if (!check) {
              this.notify(this.$t('data.notifications.requires_uppercase'), 'warning')
              return false
            }
          }
          if (this.policies.require_digit) {
            const reg = /[1-9]/
            const check = reg.test(cipher.login.password)
            if (!check) {
              this.notify(this.$t('data.notifications.requires_number'), 'warning')
              return false
            }
          }
          if (this.policies.avoid_ambiguous_character) {
            const ambiguousCharacters = ['I', 'l', '1', 'O', '0']
            const check = ambiguousCharacters.some(c => cipher.login.password.includes(c))
            if (check) {
              this.notify(this.$t('data.notifications.avoid_ambiguous'), 'warning')
              return false
            }
          }
        }
      }
      return true
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
      try {
        this.loading = true
        let orgKey = null
        let shareKey = null
        if (cipher.organizationId) { // check if the cipher is shared
          orgKey = await this.$cryptoService.getOrgKey(cipher.organizationId)
        } else {
          shareKey = await this.$cryptoService.makeShareKey()
          orgKey = shareKey[1]
        }

        const cipherEnc = await this.$cipherService.encrypt(cipher, orgKey)
        const data = new CipherRequest(cipherEnc)
        if (this.user.role === 'member-hide_passwords') {
          this.user.role = 'member'
          this.user.hide_passwords = true
        } else {
          this.user.hide_passwords = false
        }
        const emails = this.user.username.split(',').map(item => item.trim()).filter(item => item.length)
        this.members = this.members.concat(emails)
        if (!this.members.length) {
          return
        }
        this.user.username = ''
        const members = await Promise.all(this.members.map(async email => {
          const publicKey = await this.getPublicKey(email)
          return {
            username: email,
            role: this.user.role,
            hide_passwords: this.user.hide_passwords,
            key: publicKey ? await this.generateMemberKey(publicKey, orgKey) : null
          }
        }))
        const url = 'cystack_platform/pm/sharing'
        await this.$axios.$put(url, {
          sharing_key: shareKey ? shareKey[0].encryptedString : null,
          cipher: { id: cipher.id, ...data },
          members
        })
        this.notify(this.$tc('data.notifications.update_success', 1, { type: this.$tc(`type.${CipherType[cipher.type]}`, 1) }), 'success')
        this.closeDialog()
        this.$emit('shared-cipher')
      } catch (e) {
        if (e.response && e.response.data && e.response.data.code === '7002') {
          this.notify(e.response.data.message, 'warning')
          this.$emit('upgrade-plan')
        }
        this.notify(this.$tc('data.notifications.update_failed', 1, { type: this.$tc(`type.${CipherType[cipher.type]}`, 1) }), 'warning')
        console.log(e)
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
      // console.log(this.ciphers)
      // this.ciphers.forEach(cipher => {
      //   promises.push(this.shareItem(cipher))
      // })
      // await Promise.all(promises)
      try {
        this.loading = true
        if (this.user.role === 'member-hide_passwords') {
          this.user.role = 'member'
          this.user.hide_passwords = true
        }
        const emails = this.user.username.split(',').map(item => item.trim()).filter(item => item.length)
        this.members = this.members.concat(emails)
        if (!this.members.length) {
          return
        }
        this.members = await Promise.all(this.members.map(async email => {
          const publicKey = await this.getPublicKey(email)
          return {
            email,
            publicKey
          }
        }))
        let orgKey = null
        let shareKey = null
        shareKey = await this.$cryptoService.makeShareKey()
        orgKey = shareKey[1]
        this.ciphers.forEach(cipher => {
          promises.push(this.encryptCipher(cipher, orgKey, sharedCiphers))
        })
        this.user.username = ''
        await Promise.all(promises)
        const url = 'cystack_platform/pm/sharing/multiple'
        await this.$axios.$put(url, {
          sharing_key: shareKey ? shareKey[0].encryptedString : null,
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
    async encryptCipher (cipher, orgKey, sharedCiphers) {
      let _orgKey = orgKey
      if (cipher.organizationId) { // check if the cipher is shared
        console.log(cipher.organizationId)
        _orgKey = await this.$cryptoService.getOrgKey(cipher.organizationId)
      }
      const cipherEnc = await this.$cipherService.encrypt(cipher, _orgKey)
      const data = new CipherRequest(cipherEnc)
      const members = await Promise.all(this.members.map(async user => {
        return {
          username: user.email,
          role: this.user.role,
          hide_passwords: this.user.hide_passwords,
          key: user.publicKey ? await this.generateMemberKey(user.publicKey, _orgKey) : null
        }
      }))
      sharedCiphers.push({ cipher: { id: cipher.id, ...data }, members })
      return sharedCiphers
    }
  }
}
</script>
