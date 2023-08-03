<template>
  <div>
    <InputSelect
      v-if="!initialValue"
      :label="$t('data.ciphers.otp.otp_option')"
      :initial-value="option"
      :options="options"
      @change="changeOption"
    />
    <InputSelect
      v-if="option === 'select' && !initialValue"
      :initial-value="notes"
      :label="$t('data.ciphers.otp.select_placeholder')"
      :required="true"
      :options="otps"
      :filterable="true"
      @change="changeOtp"
    />
    <InputText
      v-else-if="option === 'new' || initialValue"
      v-model="notes"
      :label="$t('data.ciphers.otp.secret_key')"
      :required="true"
      @input="changeOtp"
    />
    <div class="flex items-center justify-between mt-3">
      <div v-if="otp" class="flex items-center">
        <p class="text-primary font-bold text-[24px] mr-3">
          {{ otp }}
        </p>
        <circular-count-down-timer
          :circles="[
            {
              id: 'main',
              steps: otpData.period,
              size: 24,
              showValue: false,
              stepLength: -1,
              value: start,
              strokeWidth: 3,
              strokeColor: '#268334'
            }
          ]"
          :interval="1000"
          :size="24"
          main-circle-id="main"
          @update="countdown"
        />
        <!-- Copy -->
        <button
          v-clipboard:copy="otp"
          v-clipboard:success="clipboardSuccessHandler"
          class="btn btn-icon btn-xs hover:bg-black-400"
        >
          <i class="far fa-clone" />
        </button>
        <!-- Copy end -->
      </div>
      <button
        v-if="initialValue"
        class="btn btn-icon !text-danger"
        @click="removeOtp"
      >
        <i class="fa fa-trash-alt" />
      </button>
    </div>
  </div>
</template>

<script>
import orderBy from 'lodash/orderBy'
import { FieldType } from '../../../../core/enums/fieldType'
import { CipherType } from '../../../../core/enums/cipherType.ts'

import InputText from '../../../input/InputText.vue'
import InputSelect from '../../../input/InputSelect.vue'

import { parseOTPUri, getTOTP } from '../../../../utils/totp/index.ts'

export default {
  components: {
    InputText,
    InputSelect
  },
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      FieldType,
      option: null,
      notes: this.value,
      otp: '',
      start: 0,
      initialValue: this.value,
      otpSearchText: '',
      options: [
        {
          label: this.$t('data.ciphers.otp.no_otp'),
          value: null
        },
        {
          label: this.$t('data.ciphers.otp.add_new'),
          value: 'new'
        },
        {
          label: this.$t('data.ciphers.otp.select'),
          value: 'select'
        }
      ]
    }
  },
  asyncComputed: {
    otps: {
      async get () {
        let result = []
        try {
          const filter = c => c.type === CipherType.TOTP
          result =
            (await this.$searchService.searchCiphers(
              this.otpSearchText,
              [filter],
              null
            )) || []
        } catch (error) {}
        result =
          orderBy(result, [c => c.name && c.name.toLowerCase()], []) || []
        return result.map(r => ({
          label: r.name,
          value: r.notes
        }))
      },
      watch: ['$store.state.syncedCiphersToggle', 'otpSearchText']
    }
  },

  computed: {
    otpData () {
      if (this.notes) {
        return parseOTPUri(this.notes)
      }
      return null
    }
  },

  mounted () {
    this.changeOtp(this.value)
  },

  methods: {
    countdown (val) {
      this.start = val.main
      if (val.main === 0) {
        this.start = this.getRemainingTime(this.otpData.period)
        setTimeout(() => {
          this.otp = getTOTP(this.otpData)
        }, 100)
      }
    },
    getRemainingTime (period = 30) {
      return period + 1 - (Math.floor(new Date().getTime() / 1000) % period)
    },
    changeOption (option) {
      this.option = option
      this.changeOtp(null)
    },
    changeOtp (notes) {
      this.notes = notes
      this.$emit('change', notes)
      this.$emit('createNewOtp', !!notes && this.option === 'new')
      if (this.notes) {
        this.start = this.getRemainingTime(this.otpData.period)
        this.otp = getTOTP(this.otpData)
      } else {
        this.start = 0
        this.otp = ''
      }
    },
    removeOtp () {
      this.initialValue = null
      this.notes = null
      this.$emit('change', null)
      this.changeOption(null)
      this.$emit('createNewOtp', false)
    }
  }
}
</script>

<style lang="scss" scoped></style>
