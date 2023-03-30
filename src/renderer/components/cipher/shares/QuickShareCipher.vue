<template>
  <div>
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
      <div v-if="hasInitialCipher" class="flex items-center">
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

      <!-- Select -->
      <div v-else class="text-left">
        <!-- Add cipher -->
        <div class="mb-4">
          <div class="w-full">
            <div class="text-black font-semibold mb-4">
              {{ $t('data.sharing.quick_share.choose_item') }}
            </div>
          </div>
          <InputSelect
            v-model="selectedCipherId"
            :placeholder="$t('data.sharing.search_inventory')"
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
      <div class="mt-4 border-t border-black-200 pt-6">
        <!-- Share with -->
        <div>
          <el-select v-model="requireOtp" placeholder="Select">
            <el-option
              v-for="item in shareWithOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>

          <div v-if="requireOtp">
            <p class="font-semibold mt-6 mb-3 text-black">
              {{ $t('data.sharing.quick_share.emails_label') }}
            </p>

            <!-- Input -->
            <el-input
              v-model="email"
              placeholder="Email"
              @keyup.enter.native="addEmail"
            >
              <el-button slot="append" :disabled="!email" @click="addEmail">
                {{ $t('common.add') }}
              </el-button>
            </el-input>
            <!-- Input end -->

            <p class="mt-3">
              {{ $t('data.sharing.quick_share.emails_desc') }}
            </p>

            <!-- Email list -->
            <div class="mt-3">
              <div
                v-for="item in emails"
                :key="item"
                class="w-full flex flex-row items-center py-2"
              >
                <p class="flex-1 mr-2">
                  {{ item }}
                </p>
                <a @click.prevent="removeEmail(item)">
                  <i class="fa fa-trash-alt h-5 text-black" />
                </a>
              </div>
            </div>
            <!-- Email list end -->
          </div>
        </div>
        <!-- Share with end -->

        <p class="font-semibold mt-6 mb-4 text-black">
          {{ $t('data.sharing.quick_share.expire_after') }}
        </p>

        <div class="flex items-center flex-wrap">
          <!-- Expire after -->
          <el-select
            v-model="expireAfter"
            placeholder="Select"
            class="max-w-[120px]"
          >
            <el-option
              v-for="item in expirationOptions"
              :key="item.value"
              :label="
                item.value
                  ? $moment.duration(item.value * 1000).humanize()
                  : item.label
              "
              :value="item.value"
            />
          </el-select>
          <!-- Expire after end -->

          <p class="text-black mx-3">or</p>

          <!-- Max access count -->
          <div class="flex">
            <el-input
              v-if="countAccess"
              v-model="maxAccessCount"
              placeholder="Max access count"
              type="number"
              class="mr-1 max-w-[100px]"
            />
            <el-select
              v-model="countAccess"
              placeholder="Select"
              class="max-w-[170px]"
            >
              <el-option
                v-for="item in accessCountOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
          <!-- Max access count end -->
        </div>
      </div>
      <!-- Body end -->

      <!-- Footer -->
      <div
        slot="footer"
        class="dialog-footer flex items-center border-t border-black-200"
      >
        <button
          class="btn btn-primary mt-4 w-full"
          :disabled="loading || !cipher.id || (requireOtp && !emails.length)"
          @click="shareItem(cipher)"
        >
          {{ $t('data.sharing.quick_share.get_link') }}
        </button>
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
      expireAfter: 60 * 60 * 24,
      requireOtp: 0,
      countAccess: 0,
      email: ''
    }
  },

  computed: {
    expirationOptions () {
      return [
        {
          unit: 'hours',
          value: 60 * 60 * 1
        },
        {
          label: 'hours',
          value: 60 * 60 * 24
        },
        {
          label: 'days',
          value: 60 * 60 * 24 * 7
        },
        {
          label: 'days',
          value: 60 * 60 * 24 * 14
        },
        {
          label: 'days',
          value: 60 * 60 * 24 * 30
        },
        {
          label: this.$t('data.sharing.quick_share.no_expires'),
          value: null
        }
      ]
    },
    shareWithOptions () {
      return [
        {
          label: this.$t('data.sharing.quick_share.anyone_with_link'),
          value: 0
        },
        {
          label: this.$t('data.sharing.quick_share.only_some'),
          value: 1
        }
      ]
    },
    accessCountOptions () {
      return [
        {
          label: this.$t('data.sharing.quick_share.unlimited'),
          value: 0
        },
        {
          label: this.$t('data.sharing.quick_share.times_access'),
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
      this.expireAfter = 60 * 60 * 24
      this.email = ''
      this.requireOtp = 0
      this.emails = []
      this.maxAccessCount = null
      this.eachEmailAccessCount = null
    },

    addEmail () {
      if (!this.email.trim()) {
        return
      }
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
        this.closeDialog()
        this.$refs.quickSharedCipherInfo.openDialog(cipher, {
          id: res.id,
          accessId: res.access_id,
          emails: sendRequest.emails,
          requireOtp: sendRequest.require_otp,
          expirationDate: sendRequest.expiration_date * 1000,
          key: sendView.key
        })
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
