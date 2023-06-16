<template>
  <div>
    <ValidationObserver ref="observer" tag="div" class="credit-drawer-body">
      <!-- Card number -->
      <div
        class="form-group !mb-0"
        :class="eventChangeNumber.error ? 'has-danger' : ''"
      >
        <p class="text-black mb-2">
          <span class="text-danger">*</span> {{ $t('data.billing.card_info') }}
        </p>
        <div class="input-group input-group-sm bg-white !rounded-b-none">
          <div
            class="input-group-prepend bg-black-200 !rounded-r-none !rounded-b-none"
          >
            <span class="input-group-text">
              <i
                v-if="eventChangeNumber.brand === 'visa'"
                class="fab fa-cc-visa"
                style="font-size: 1.5em"
              />
              <i
                v-else-if="eventChangeNumber.brand === 'amex'"
                class="fab fa-cc-amex"
                style="font-size: 1.5em"
              />
              <i
                v-else-if="eventChangeNumber.brand === 'jcb'"
                class="fab fa-cc-jcb"
                style="font-size: 1.5em"
              />
              <i
                v-else-if="eventChangeNumber.brand === 'mastercard'"
                class="fab fa-cc-mastercard"
                style="font-size: 1.5em"
              />
              <i
                v-else-if="eventChangeNumber.brand === 'diners'"
                class="fab fa-cc-diners-club"
                style="font-size: 1.5em"
              />
              <i
                v-else-if="eventChangeNumber.brand === 'discover'"
                class="fab fa-cc-discover"
                style="font-size: 1.5em"
              />
              <i
                v-else
                class="far fa-credit-card"
                :class="eventChangeNumber.brand ? 'm--font-danger' : ''"
                style="font-size: 1.5em"
              />
            </span>
          </div>
          <div id="card-number" ref="cardNumber" />
        </div>
        <div v-if="eventChangeNumber.error" class="invalid-feedback !block">
          {{ $t(`errors.${eventChangeNumber.error.code}`) }}
        </div>
      </div>
      <!-- Card number end -->

      <!-- Expiry and CVV -->
      <div class="grid grid-cols-2">
        <div
          class="form-group"
          :class="eventChangeExpiry.error ? 'has-danger' : ''"
        >
          <div
            id="card-expiry"
            ref="cardExpiry"
            class="!rounded-t-none !border-t-0 !rounded-r-none !border-r-0"
          />
          <div v-if="eventChangeExpiry.error" class="invalid-feedback !block">
            {{ $t(`errors.${eventChangeExpiry.error.code}`) }}
          </div>
        </div>

        <div
          class="form-group"
          :class="eventChangeCvc.error ? 'has-danger' : ''"
        >
          <div
            id="card-cvc"
            ref="cardCvc"
            class="!rounded-t-none !border-t-0 !rounded-l-none"
          />
          <div v-if="eventChangeCvc.error" class="invalid-feedback !block">
            {{ $t(`errors.${eventChangeCvc.error.code}`) }}
          </div>
        </div>
      </div>
      <!-- Expiry and CVV end-->

      <!-- Card name -->
      <div class="form-group">
        <ValidationProvider
          v-slot="{ errors }"
          rules="required|alpha_spaces|max:100"
          :name="$t('common.cardholder')"
        >
          <p class="text-black mb-2">
            <span class="text-danger">*</span>
            {{ $t('data.billing.name_on_card') }}
          </p>
          <input
            v-model="cardUser"
            type="text"
            :class="errors.length ? 'is-invalid' : ''"
            class="form-control form-control-sm"
            :placeholder="$t('common.cardholder_placeholder')"
            name="cardholder"
          >
          <span class="invalid-feedback">{{ errors[0] }}</span>
        </ValidationProvider>
      </div>
      <!-- Card name end -->

      <!-- Country -->
      <div>
        <p class="text-black mb-2">
          {{ $t('common.country') }}
        </p>
        <el-select v-model="country" filterable class="w-full">
          <el-option
            v-for="item in countries"
            :key="item.country_code"
            :label="item.country_name"
            :value="item.country_code"
          />
        </el-select>
      </div>
      <!-- Country end -->
    </ValidationObserver>

    <slot name="before-submit" />

    <div class="w-full mt-6 mb-4">
      <el-button
        type="primary"
        class="w-full"
        :loading="loading"
        :disabled="btnDisabled"
        @click="handleSubscribe"
      >
        {{ $t('common.subscribe') }}
      </el-button>
    </div>

    <p class="text-[12px] leading-4">
      {{ $t('data.billing.by_confirm_you_allow') }}
    </p>
  </div>
</template>
<script>
import { ValidationProvider, ValidationObserver } from 'vee-validate'

export default {
  components: {
    ValidationProvider,
    ValidationObserver
  },

  props: {
    email: {
      type: String,
      default: () => ''
    },
    onAddCardSuccess: {
      type: Function,
      default: () => () => {}
    },
    isBtnDisable: {
      type: Boolean,
      default: () => false
    }
  },

  data () {
    return {
      eventChangeNumber: {},
      eventChangeExpiry: {},
      eventChangeCvc: {},
      cardNumber: null,
      cardExpiry: null,
      cardCvc: null,
      countries: [],
      cardUser: '',
      country: 'VN',
      stripe: null,
      elements: null,
      loading: false
    }
  },

  computed: {
    btnDisabled () {
      return this.isBtnDisable || this.loading || !this.cardUser
    }
  },

  created () {
    this.getCountries()
  },

  mounted () {
    // eslint-disable-next-line no-undef
    this.stripe = Stripe(this.$config.stripeKey)
    this.elements = this.stripe.elements({})
    this.$nextTick(() => {
      this.cardNumber = this.elements.create('cardNumber', {
        classes: { base: 'form-control form-control-sm !py-[10px]' }
      })
      this.cardNumber.mount(this.$refs.cardNumber)
      this.cardExpiry = this.elements.create('cardExpiry', {
        classes: { base: 'form-control form-control-sm bg-white !py-[10px]' }
      })
      this.cardExpiry.mount(this.$refs.cardExpiry)
      this.cardCvc = this.elements.create('cardCvc', {
        classes: { base: 'form-control form-control-sm bg-white !py-[10px]' }
      })
      this.cardCvc.mount(this.$refs.cardCvc)
      this.cardNumber.on('change', event => {
        this.eventChangeNumber = event
      })
      this.cardExpiry.on('change', event => {
        this.eventChangeExpiry = event
      })
      this.cardCvc.on('change', event => {
        this.eventChangeCvc = event
      })
    })
  },

  methods: {
    clearInput () {
      this.cardUser = ''
      this.country = 'VN'
      this.cardNumber = {}
      this.cardExpiry = {}
      this.cardCvc = {}
      this.eventChangeNumber = {}
      this.eventChangeExpiry = {}
      this.eventChangeCvc = {}
    },

    async handleSubscribe () {
      const tokenId = await this.save()
      if (tokenId) {
        this.loading = true
        const isSuccess = await this.onAddCardSuccess({
          tokenId,
          country: this.country
        })
        if (isSuccess) {
          this.clearInput()
        }
        this.loading = false
      }
    },

    async save () {
      const isValid = await this.$refs.observer.validate()
      if (!isValid) {
        return
      }

      this.loading = true
      const tokenData = {
        name: this.cardUser,
        address_country: this.country,
        metadata: {
          email: this.email
        }
      }

      try {
        const result = await this.stripe.createToken(this.cardNumber, tokenData)
        if (result.error) {
          switch (result.error.type) {
          case 'validation_error':
            this.notify(
              this.$t('data.billing.card_decline.validation_error'),
              'warning'
            )
            break
          default:
            this.notify(
              this.$t('data.billing.card_decline.generic_decline'),
              'warning'
            )
          }
          return
        }

        return result.token.id
      } catch (error) {
        this.notify(this.$t('errors.something_went_wrong'), 'warning')
      } finally {
        this.loading = false
      }
    },

    getCountries () {
      this.$axios.$get('resources/countries').then(res => {
        this.countries = res
      })
    }
  }
}
</script>
