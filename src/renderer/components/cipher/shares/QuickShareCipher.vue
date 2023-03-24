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
        <div v-if="hasInitialCipher" class="flex items-center">
          <div class="text-[34px] mr-3">
            <Vnodes :vnodes="getIconCipher(cipher, 20)" />
          </div>
          <div class="text-black-700 font-semibold">{{ cipher.name }}</div>
        </div>

        <div v-else>
          <div class="text-black-700 font-semibold">New quick share</div>
        </div>
      </div>
      <!-- Title end -->

      <!-- Select -->
      <div class="text-left">
        <!-- Add cipher -->
        <div v-if="!hasInitialCipher" class="grid grid-cols-2 gap-x-2 mb-4">
          <div class="w-full">
            <div class="text-black-700 text-head-6 font-semibold">
              Choose item to quick share
            </div>
            <div>Pick one that belong to you</div>
          </div>
          <InputSelect
            v-model="selectedCipherId"
            placeholder="Search Inventory ..."
            :collapse-tags="true"
            :filterable="true"
            class="w-full !mb-4"
            :options="cipherOptions"
            :key-label="'name'"
            :key-value="'id'"
            @change="v => (selectedCipherId = v)"
          />
        </div>
        <!-- Add cipher end -->
      </div>
      <!-- Select end -->

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

        <!-- Max access count -->
        <div>
          <el-input
            v-if="countAccess"
            v-model="maxAccessCount"
            placeholder="Max access count"
          />
          <el-select v-model="countAccess" placeholder="Select">
            <el-option
              v-for="item in accessCountOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <!-- Max access count end -->

        <!-- Emails -->
        <div v-if="requireOtp">
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
              v-for="item in emails"
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
      <div slot="footer" class="dialog-footer flex items-center text-left">
        <div class="flex-grow" />
        <div>
          <button class="btn btn-default" @click="dialogVisible = false">
            {{ $t('common.cancel') }}
          </button>
          <button
            class="btn btn-primary"
            :disabled="loading || !cipher.id"
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
import find from 'lodash/find'
import { CipherType } from '../../../jslib/src/enums'
import Vnodes from '../../../components/Vnodes'
import { SendView } from '../../../core/models/view/sendView'
import { Send } from '../../../core/models/domain/send'
import { SendRequest } from '../../../core/models/request/sendRequest'
import InputSelect from '../../input/InputSelect.vue'
import QuickSharedCipherInfo from './QuickSharedCipherInfo'

export default {
  components: { Vnodes, QuickSharedCipherInfo, InputSelect },

  props: {
    cipherOptions: {
      type: Array,
      default: () => new Array([])
    }
  },

  data () {
    return {
      hasInitialCipher: false,
      selectedCipherId: null,
      cipher: {
        collectionIds: [],
        organizationId: ''
      },
      password: '',
      emails: [],
      maxAccessCount: 1,
      eachEmailAccessCount: null,
      loading: false,
      dialogVisible: false,
      viewOnce: false,
      expireAfter: null,
      requireOtp: 0,
      countAccess: 0,
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
    },
    accessCountOptions () {
      return [
        {
          label: 'unlimited',
          value: 0
        },
        {
          label: 'count',
          value: 1
        }
      ]
    }
  },

  watch: {
    selectedCipherId (val) {
      if (val) {
        this.cipher = find(this.cipherOptions, e => e.id === val)
      } else {
        this.cipher = {
          collectionIds: [],
          organizationId: ''
        }
      }
    }
  },

  methods: {
    async openDialog (cipher = {}) {
      this.dialogVisible = true
      this.cipher = { organizationId: '', ...cipher }
      if (cipher.id) {
        this.hasInitialCipher = true
      }
    },

    closeDialog () {
      this.dialogVisible = false
      this.viewOnce = false
      this.expireAfter = null
      this.email = ''
      this.requireOtp = 0
      this.emails = []
      this.maxAccessCount = null
      this.eachEmailAccessCount = null
    },

    addEmail () {
      if (!this.emails.includes(this.email)) {
        this.emails.push(this.email)
      }
      this.email = ''
    },

    removeEmail (email) {
      this.emails = this.emails.filter(e => e !== email)
    },

    async shareItem (cipher) {
      try {
        this.loading = true
        const type_ = cipher.type
        if ([7].includes(type_)) {
          cipher.type = CipherType.SecureNote
          cipher.secureNote.type = 0
        }
        const send = new Send()
        send.cipher = cipher
        send.cipherId = cipher.id
        send.password = this.password
        send.maxAccessCount = this.countAccess ? this.maxAccessCount : null
        send.expirationDate = this.expireAfter
          ? new Date(Date.now() + this.expireAfter * 1000)
          : null
        send.requireOtp = !!this.requireOtp
        send.emails = this.requireOtp ? this.emails : []
        send.eachEmailAccessCount =
          !!this.requireOtp && this.viewOnce ? 1 : null

        const sendView = new SendView(send)

        // TODO: have to put cipherView directly here
        sendView.cipher = cipher
        const sendEnc = await this.$sendService.encrypt(sendView)
        const sendRequest = new SendRequest(sendEnc)
        sendRequest.cipher.type = type_
        cipher.type = type_

        // Send api
        const url = 'cystack_platform/pm/quick_shares'
        const res = await this.$axios.$post(url, sendRequest)

        // Done
        this.notify(
          this.$t('data.notifications.update_share_success'),
          'success'
        )
        this.closeDialog()
        this.$refs.quickSharedCipherInfo.openDialog(cipher, {
          id: res.id,
          emails: sendRequest.emails,
          requireOtp: sendRequest.require_otp,
          expirationDate: sendRequest.expired_date * 1000,
          key: sendView.key
        })
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
