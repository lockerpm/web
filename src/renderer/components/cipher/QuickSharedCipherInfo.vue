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
      <div v-if="require_otp">
        <!-- Email list -->
        <div>
          <div
            v-for="item in shareOptions.emails"
            :key="item"
            class="w-full flex flex-row items-center"
          >
            <p class="flex-1 mr-2">
              {{ item }}
            </p>
            <a @click.prevent="removeEmail(item)">
              <i class="fa fa-trash-alt" />
            </a>
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
        <p v-if="shareOptions.expired_date">
          Expire on {{ $moment(shareOptions.expired_date * 1000).toString() }}
        </p>
      </div>

      <el-button
        v-clipboard:copy="shareUrl"
        v-clipboard:success="clipboardSuccessHandler"
        :disabled="!shareUrl"
      >
        Copy
      </el-button>
    </div>
    <!-- Footer end -->
  </el-dialog>
</template>

<script>
import Vnodes from '../../components/Vnodes'

export default {
  components: { Vnodes },

  data () {
    return {
      cipher: {
        collectionIds: [],
        organizationId: ''
      },
      shareOptions: {
        id: null,
        password: '',
        emails: [],
        require_otp: false,
        max_access_count: null,
        expired_date: null,
        key: '',
        each_email_access_count: null
      },
      loading: false,
      dialogVisible: false,
      decryptedKey: null
    }
  },

  computed: {
    shareUrl () {
      if (!this.decryptedKey) {
        return null
      }
      return `${process.env.baseUrl}/flash-share-item/${this.shareOptions.id}#${encodeURIComponent(this.decryptedKey)}`
    }
  },

  methods: {
    async openDialog (shareOptions, cipher = {}) {
      this.dialogVisible = true
      this.cipher = { organizationId: '', ...cipher }
      if (shareOptions) {
        this.shareOptions = { ...shareOptions }
        this.getShareInfo()
        this.decryptShareKey()
      }
    },

    closeDialog () {
      this.dialogVisible = false
    },

    async getShareInfo () {
      this.loading = true
      const res = await this.$axios.$get(`cystack_platform/pm/quick_shares/${this.shareOptions.id}`)
      this.shareOptions = { ...res }
      this.loading = false
    },

    async decryptShareKey () {
      this.decryptedKey = await this.$cryptoService.decrypt(this.shareOptions.key)
    },

    async removeEmail (email) {
      try {
        this.loading = true
        this.shareOptions.emails = this.shareOptions.emails.filter(e => e !== email)
        await this.$axios.$put(`cystack_platform/pm/quick_shares/${this.shareOptions.id}`, payload)
        this.notify(
          this.$t('data.notifications.update_share_success'),
          'success'
        )
      } catch (error) {
        this.notify(this.$t('errors.something_went_wrong'), 'warning')
        console.log(e)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
