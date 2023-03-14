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
        <div class="text-[34px] mr-3">
          <Vnodes :vnodes="getIconCipher(cipher, 20)" />
        </div>
        <div class="text-black-700 font-semibold">{{ cipher.name }}</div>
      </div>
    </div>
    <!-- Title end -->

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
          @click="shareItem(cipher)"
        >
          {{ isBelongToTeam ? $t('common.update') : $t('common.share') }}
        </button>
      </div>
    </div>
    <!-- Footer end -->
  </el-dialog>
</template>

<script>
import { CipherRequest } from '../../jslib/src/models/request'
import { CipherType } from '../../jslib/src/enums'
import Vnodes from '../../components/Vnodes'
import { Utils } from '../../jslib/src/misc/utils.ts'

export default {
  components: { Vnodes },

  data () {
    return {
      cipher: {
        collectionIds: [],
        organizationId: ''
      },
      originCipher: {},
      password: '123',
      loading: false,
      dialogVisible: false
    }
  },

  computed: {
    isBelongToTeam () {
      // TODO
      return false
    }
  },

  methods: {
    async openDialog (cipher = {}) {
      this.dialogVisible = true
      this.originCipher = { organizationId: '', ...cipher }
      this.cipher = { organizationId: '', ...cipher }
    },

    closeDialog () {
      this.dialogVisible = false
    },

    async shareItem (cipher) {
      try {
        this.loading = true
        const type_ = cipher.type
        if ([7].includes(type_)) {
          cipher.type = CipherType.SecureNote
          cipher.secureNote.type = 0
        }

        // Prepare key
        const sendKey = await this.$cryptoFunctionService.randomBytes(16)
        const encKey = await this.$cryptoService.makeSendKey(sendKey)

        // Encrypt cipher
        const cipherEnc = await this.$cipherService.encrypt(cipher, encKey)
        const data = new CipherRequest(cipherEnc)
        data.type = type_
        this.cipher.type = type_

        // Encrypt other things
        const encryptedSendKey = await this.$cryptoService.encrypt(sendKey)
        const password = this.password
          ? await this.$cryptoFunctionService.pbkdf2(
            this.password,
            sendKey,
            'sha256',
            100000
          )
          : ''

        // Send api
        const url = 'cystack_platform/pm/quick-sharing'
        const payload = {
          sharing_key: encryptedSendKey.encryptedString,
          cipher: { id: cipher.id, ...data },
          password: Utils.fromBufferToB64(password)
        }
        console.log(url)
        console.log(payload)
        // await this.$axios.$put(url, payload)

        // Done
        this.notify(
          this.$t('data.notifications.update_share_success'),
          'success'
        )
        this.closeDialog()
        this.$emit('shared-cipher')
      } catch (e) {
        if (e.response && e.response.data && e.response.data.code === '7002') {
          this.notify(e.response.data.message, 'warning')
          this.$emit('upgrade-plan')
        }
        this.notify(this.$t('errors.something_went_wrong'), 'warning')
        console.log(e)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
