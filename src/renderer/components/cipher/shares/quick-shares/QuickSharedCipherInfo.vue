<template>
  <el-dialog
    :visible.sync="dialogVisible"
    width="650px"
    destroy-on-close
    top="5vh"
    custom-class="locker-dialog"
    :close-on-click-modal="false"
    :title="$t('common.get_share_link')"
  >
    <!-- Cipher info -->
    <div class="flex items-center border-t border-black-200 pt-4 mb-3">
      <!-- Icon -->
      <div>
        <div
          class="text-[34px] mr-3 flex-shrink-0"
          :class="{
            'filter grayscale': cipher.isDeleted
          }"
        >
          <Vnodes :vnodes="getIconCipher(cipher, 34)" />
        </div>
      </div>
      <!-- Icon end -->

      <!-- Name -->
      <div class="flex flex-col">
        <p class="text-black font-semibold truncate flex items-center">
          {{ cipher.name }}
        </p>
        <div v-if="cipher.subTitle">
          {{ cipher.subTitle || 'N/A' }}
        </div>
      </div>
      <!-- Name end -->
    </div>
    <!-- Cipher info end -->

    <!-- Body -->
    <div>
      <p class="mb-2">{{ $t('data.sharing.quick_share.receiver') }}</p>

      <!-- Emails -->
      <div class="border border-black-200 py-3 px-4">
        <!-- No one -->
        <div v-if="!send.requireOtp">
          <p class="text-black">{{ $t('data.sharing.quick_share.anyone') }}</p>
        </div>
        <!-- No one end -->

        <!-- Email list -->
        <div v-else class="flex flex-row flex-wrap w-full -mb-2">
          <div
            v-for="item in send.emails"
            :key="item.email"
            class="bg-success-50 px-2 py-1 mr-2 mb-2"
          >
            <p class="text-primary">
              {{ item }}
            </p>
          </div>
        </div>
        <!-- Email list end -->
      </div>
      <!-- Emails end -->

      <!-- Expiration date -->
      <div v-if="send.expirationDate" class="text-center mt-7">
        <p>
          {{ $t('data.sharing.quick_share.expire_on') }}
          {{ $moment(send.expirationDate).format('MMMM D, YYYY hh:mm a') }}
        </p>
      </div>
      <!-- Expiration date end -->
    </div>
    <!-- Body end -->

    <!-- Footer -->
    <div slot="footer" class="dialog-footer flex items-center justify-between">
      <el-button
        v-clipboard:copy="url"
        v-clipboard:success="clipboardSuccessHandler"
        :disabled="!url"
        type="primary"
        class="w-full"
      >
        {{ $t('data.sharing.quick_share.copy_link') }}
      </el-button>
    </div>
    <!-- Footer end -->
  </el-dialog>
</template>

<script>
import Vnodes from '~/components/Vnodes'
import { Utils } from '~/core/misc/utils.ts'

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
        accessId: '',
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
        send.accessId,
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
