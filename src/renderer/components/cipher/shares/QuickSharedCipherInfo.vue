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

    <!-- Body -->
    <div>
      <!-- Emails -->
      <div v-if="send.requireOtp">
        <!-- Email list -->
        <div>
          <div
            v-for="item in send.emails"
            :key="item.email"
            class="w-full flex flex-row items-center"
          >
            <p class="flex-1 mr-2">
              {{ item }}
            </p>
          </div>
        </div>
        <!-- Email list end -->
      </div>
      <!-- Emails end -->
    </div>
    <!-- Body end -->

    <!-- Footer -->
    <div slot="footer" class="dialog-footer flex items-center justify-between">
      <div>
        <p v-if="send.expirationDate">
          Expire on {{ $moment(send.expirationDate).toString() }}
        </p>
      </div>

      <a @click.prevent="stopSharing()">
        <i class="fa fa-trash-alt" />
      </a>

      <el-button
        v-clipboard:copy="url"
        v-clipboard:success="clipboardSuccessHandler"
        :disabled="!url"
      >
        Copy
      </el-button>
    </div>
    <!-- Footer end -->
  </el-dialog>
</template>

<script>
import Vnodes from '../../../components/Vnodes'
import { Utils } from '../../../jslib/src/misc/utils.ts'

export default {
  components: { Vnodes },

  data () {
    return {
      cipher: {
        collectionIds: [],
        organizationId: ''
      },
      send: {
        id: '',
        emails: [],
        requireOtp: null,
        expirationDate: null,
        key: null
      },
      loading: false,
      dialogVisible: false,
      url: ''
    }
  },

  methods: {
    async openDialog (cipher = {}, send = {}) {
      this.dialogVisible = true
      this.cipher = { organizationId: '', ...cipher }
      this.send = send
      this.url = this.getPublicShareUrl(
        send.id,
        Utils.fromBufferToUrlB64(send.key)
      )
    },

    closeDialog () {
      this.dialogVisible = false
    },

    async stopSharing () {
      this.loading = true
      const isSuccess = await this.stopQuickSharing(this.send)
      this.loading = false
      if (isSuccess) {
        this.closeDialog()
      }
    }
  }
}
</script>
