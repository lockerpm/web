<template>
  <div>
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
        <!-- Expire after -->
        <el-select v-model="expireAfter" placeholder="Select">
          <el-option
            v-for="item in expirationOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <!-- Expire after end -->

        <!-- Share with -->
        <el-select v-model="requireOtp" placeholder="Select">
          <el-option
            v-for="item in shareWithOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <!-- Share with end -->

        <!-- Emails -->
        <div v-if="shareOptions.require_otp">
          <!-- Input -->
          <el-input v-model="email">
            <el-button slot="append" :disabled="!email" @click="addEmail">
              Add
            </el-button>
          </el-input>
          <!-- Input end -->

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

          <!-- View once -->
          <el-checkbox v-model="viewOnce">View once</el-checkbox>
          <!-- View once end -->
        </div>
        <!-- Emails end -->
      </div>
      <!-- Body end -->

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
            {{ $t('common.share') }}
          </button>
        </div>
      </div>
      <!-- Footer end -->
    </el-dialog>

    <!-- Info dialog -->
    <QuickSharedCipherInfo ref="quickSharedCipherInfo" />
    <!-- Info dialog end -->
  </div>
</template>

<script>
import { CipherRequest } from '../../../jslib/src/models/request'
import { CipherType } from '../../../jslib/src/enums'
import Vnodes from '../../../components/Vnodes'
import { Utils } from '../../../jslib/src/misc/utils.ts'
import QuickSharedCipherInfo from './QuickSharedCipherInfo'

export default {
  components: { Vnodes, QuickSharedCipherInfo },

  data () {
    return {
      cipher: {
        collectionIds: [],
        organizationId: ''
      },
      shareOptions: {
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
      viewOnce: false,
      expireAfter: null,
      requireOtp: 0,
      email: ''
    }
  },

  computed: {
    expirationOptions () {
      return [
        {
          label: '1 hour',
          value: 60 * 60 * 1
        },
        {
          label: '24 hours',
          value: 60 * 60 * 24
        },
        {
          label: '7 days',
          value: 60 * 60 * 24 * 7
        },
        {
          label: '14 days',
          value: 60 * 60 * 24 * 14
        },
        {
          label: '30 days',
          value: 60 * 60 * 24 * 30
        },
        {
          label: 'No expires',
          value: null
        }
      ]
    },
    shareWithOptions () {
      return [
        {
          label: 'anyone',
          value: 0
        },
        {
          label: 'only some',
          value: 1
        }
      ]
    }
  },

  watch: {
    requireOtp (newVal) {
      this.shareOptions.require_otp = !!newVal
    }
  },

  methods: {
    async openDialog (cipher = {}) {
      this.dialogVisible = true
      this.cipher = { organizationId: '', ...cipher }
    },

    closeDialog () {
      this.dialogVisible = false
      this.shareOptions = {
        password: '',
        emails: [],
        require_otp: false,
        max_access_count: null,
        expired_date: null,
        key: '',
        each_email_access_count: null
      }
      this.viewOnce = false
      this.expireAfter = null
      this.email = ''
      this.requireOtp = 0
    },

    addEmail () {
      if (!this.shareOptions.emails.includes(this.email)) {
        this.shareOptions.emails.push(this.email)
      }
      this.email = ''
    },

    removeEmail (email) {
      this.shareOptions.emails = this.shareOptions.emails.filter(
        e => e !== email
      )
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
        const url = 'cystack_platform/pm/quick_shares'
        const payload = {
          cipher: data,
          cipher_id: cipher.id,
          key: encryptedSendKey.encryptedString,
          password: password ? Utils.fromBufferToB64(password) : null,
          max_access_count: this.shareOptions.max_access_count,
          expired_date: this.expireAfter
            ? Math.floor(Date.now() / 1000) + this.expireAfter
            : null,
          require_otp: this.require_otp,
          emails: this.require_otp ? this.shareOptions.emails : [],
          each_email_access_count: this.require_otp && this.viewOnce ? 1 : null
        }
        const res = await this.$axios.$post(url, payload)

        // Done
        this.notify(
          this.$t('data.notifications.update_share_success'),
          'success'
        )
        this.closeDialog()
        this.$refs.quickSharedCipherInfo.openDialog(res, cipher)
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
