<template>
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
      </div>
    </div>
    <div class="text-left">
      <div class="grid grid-cols-3 gap-x-2 mb-4">
        <div class="col-span-2">
          <div class="text-black-700 text-head-6 font-semibold">
            {{ $t('common.user') }}
          </div>
          <div>{{ user.email }}</div>
        </div>
        <InputSelect
          :label="$t('common.share_type')"
          :initial-value="user.role"
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
          @click="updateRole()"
        >
          {{ $t('common.update') }}
        </button>
      </div>
    </div>
  </el-dialog>
</template>

<script>

import InputSelect from '../../components/input/InputSelect.vue'
import { CipherType } from '../../jslib/src/enums'
import Vnodes from '../../components/Vnodes'

export default {
  components: { Vnodes, InputSelect },
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
      user: {
        username: '',
        role: 'admin',
        hide_passwords: false
      },
      members: [],
      ciphers: []
    }
  },
  computed: {
    roleOptions () {
      return [
        // { label: this.$t('data.ciphers.only_use'), value: 'member-hide_passwords' },
        { label: this.$t('data.ciphers.viewable'), value: 'member' },
        { label: this.$t('data.ciphers.editable'), value: 'admin' }
      ]
    }
  },
  methods: {
    async openDialog (cipher = {}) {
      this.dialogVisible = true
      this.cipher = { organizationId: '', ...cipher }
      this.user = cipher.user
      if (this.user.role === 'member' && this.user.hide_passwords === true) {
        this.user.role = 'member-hide_passwords'
      }
    },
    closeDialog () {
      this.dialogVisible = false
    },
    async updateRole () {
      try {
        if (this.user.role === 'member-hide_passwords') {
          this.user.role = 'member'
          this.user.hide_passwords = true
        } else {
          this.user.hide_passwords = false
        }
        await this.$axios.$put(`cystack_platform/pm/sharing/${this.cipher.organizationId}/members/${this.cipher.user.id}`, {
          role: this.user.role,
          hide_passwords: this.user.hide_passwords
        })
        this.notify(this.$tc('data.notifications.update_success', 1, { type: this.$tc(`type.${CipherType[this.cipher.type]}`, 1) }), 'success')
        this.closeDialog()
      } catch (error) {
        this.notify(this.$tc('data.notifications.update_failed', 1, { type: this.$tc(`type.${CipherType[this.cipher.type]}`, 1) }), 'warning')
        console.log(error)
      }
    }
  }
}
</script>
