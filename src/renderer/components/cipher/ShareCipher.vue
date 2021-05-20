<template>
  <el-dialog
    :visible.sync="dialogVisible"
    width="435px"
    destroy-on-close
    top="5vh"
    custom-class="locker-dialog"
  >
    <div slot="title">
      <div class="flex items-center">
        <div class="text-[34px] mr-3" v-html="getIconCipher(cipher, 20)" />
        <div class="text-black-700 font-semibold">{{ cipher.name }}</div>
      </div>
    </div>
    <div class="text-left">
      <div class="form-group">
        <label for="">Gửi tới</label>
        <el-select
          v-model="members"
          multiple
          filterable
          allow-create
          placeholder="example@cystack.net"
          class="w-full"
          @change="checkEmail"
        >
          <el-option
            v-for="(item, index) in inputedMembers"
            :key="index"
            :label="item"
            :value="item"
          />
        </el-select>
        <div class="invalid-feedback">
          {{ errors.name && errors.name[0] }}
        </div>
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
                :disabled="loading || !members.length"
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
      cipher: {},
      loading: false,
      dialogVisible: false,
      errors: {},
      redirect: false,
      email: '',
      members: [],
      inputedMembers: []
    }
  },
  computed: {
    shouldRedirect () {
      return this.getRouteBaseName() === 'dashboard'
    }
  },
  methods: {
    openDialog (cipher = {}) {
      this.dialogVisible = true
      this.cipher = { ...cipher }
    },
    closeDialog () {
      this.dialogVisible = false
    },
    async shareItem (cipher) {
      try {
        this.loading = true
        const orgKey = await this.$cryptoService.getOrgKey(this.currentUserPw.default_personal_id)
        const members = this.members.map(async e => {
          const name = (await this.$cryptoService.encrypt(e, orgKey)).encryptedString
          return {
            username: e,
            name
          }
        })
        await this.$axios.$post(`cystack_platform/pm/ciphers/${cipher.id}/share`, {
          members
        })
        await this.getSyncData()
        this.closeDialog()
      } catch (e) {
        this.errors = (e.response && e.response.data && e.response.data.details) || {}
      } finally {
        this.loading = false
      }
    },
    checkEmail (item) {
      const emailCheck = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i
      this.members = filter(item, e => {
        if (emailCheck.test(e)) {
          this.inputedMembers.push(e)
          return true
        }
        return false
      })
      this.inputedMembers = uniq(this.inputedMembers)
    }
  }
}
</script>
