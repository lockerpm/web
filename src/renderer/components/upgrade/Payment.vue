<template>
  <div>
    <ValidationObserver ref="observer" tag="div" class="credit-drawer-body">
      <p class="font-semibold text-[16px] mb-1">
        {{ $t('data.billing.payment_method') }}
      </p>

      <p class="mb-6">
        {{ $t('data.billing.intro') }}
      </p>

      <!-- Card info -->
      <div class="grid md:grid-cols-2 grid-cols-1 gap-x-8">
        <div class="form-group">
          <ValidationProvider
            v-slot="{ errors }"
            rules="required|alpha_spaces|max:100"
            :name="$t('common.cardholder')"
          >
            <label>{{ $t('common.cardholder') }}
              <span class="text-danger">*</span>
            </label>
            <input
              v-model="user.name"
              type="text"
              :class="errors.length ? 'is-invalid' : ''"
              class="form-control form-control-sm"
              :placeholder="$t('common.cardholder_placeholder')"
              name="cardholder"
            >
            <span class="invalid-feedback">{{ errors[0] }}</span>
          </ValidationProvider>
        </div>

        <div
          class="form-group"
          :class="eventChangeNumber.error ? 'has-danger' : ''"
        >
          <label>{{ $t('data.billing.card_number') }}
            <span class="text-danger">*</span>
          </label>
          <div class="input-group input-group-sm bg-white">
            <div class="input-group-prepend bg-black-200 !rounded-r-none">
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

        <div
          class="form-group"
          :class="eventChangeExpiry.error ? 'has-danger' : ''"
        >
          <label>{{ $t('data.billing.expiration') }}
            <span class="text-danger">*</span>
          </label>
          <div id="card-expiry" ref="cardExpiry" />
          <div v-if="eventChangeExpiry.error" class="invalid-feedback !block">
            {{ $t(`errors.${eventChangeExpiry.error.code}`) }}
          </div>
        </div>

        <div
          class="form-group"
          :class="eventChangeCvc.error ? 'has-danger' : ''"
        >
          <label>{{ $t('data.billing.cvc') }}
            <span class="text-danger">*</span>
          </label>
          <div id="card-cvc" ref="cardCvc" />
          <div v-if="eventChangeCvc.error" class="invalid-feedback !block">
            {{ $t(`errors.${eventChangeCvc.error.code}`) }}
          </div>
        </div>

        <!-- Strip desc -->
        <div class="form-group col-span-2">
          <img
            src="~assets/images/logo/stripe.svg"
            alt="Stripe"
            style="height: 30px"
          >
          <p class="mt-3" v-html="$t('data.billing.stripe_desc')" />
        </div>
        <!-- Strip desc end -->
      </div>
      <!-- Card info end -->

      <!-- Billing contact -->
      <div class="row mt-8">
        <p class="text-[16px] font-semibold mb-6">
          {{ $t('data.billing.billing_contact') }}
        </p>

        <div class="form-group col-12">
          <ValidationProvider
            v-slot="{ errors }"
            rules="required|alpha_spaces|max:100"
            :name="$t('common.name')"
          >
            <label>{{ $t('common.name') }}
              <span class="text-danger">*</span>
            </label>
            <input
              v-model="user.metadata.contact_name"
              name="name"
              :class="errors.length ? 'is-invalid' : ''"
              type="text"
              class="form-control form-control-sm"
            >
            <span class="invalid-feedback">{{ errors[0] }}</span>
          </ValidationProvider>
        </div>

        <div class="form-group col-12">
          <ValidationProvider
            v-slot="{ errors }"
            rules="email|required|max:100"
            :name="$t('common.email')"
          >
            <label>{{ $t('common.email') }}
              <span class="text-danger">*</span>
            </label>
            <input
              v-model="user.metadata.email"
              :class="errors.length ? 'is-invalid' : ''"
              name="email"
              type="text"
              class="form-control form-control-sm"
            >
            <span class="invalid-feedback">{{ errors[0] }}</span>
            <span class="text-[12px] text-black-600 mt-2">{{
              $t('data.billing.email_hint')
            }}</span>
          </ValidationProvider>
        </div>

        <div class="form-group col-12">
          <ValidationProvider
            v-slot="{ errors }"
            rules="max:100"
            :name="$t('common.company')"
          >
            <label>{{ $t('common.company') }} </label>
            <input
              v-model="user.metadata.company"
              name="company"
              :class="errors.length ? 'is-invalid' : ''"
              type="text"
              class="form-control form-control-sm"
            >
            <span class="invalid-feedback">{{ errors[0] }}</span>
          </ValidationProvider>
        </div>
      </div>
      <!-- Billing contact end -->

      <!-- Billing address -->
      <div class="grid md:grid-cols-2 grid-cols-1 gap-x-8 mt-8">
        <div class="form-group col-span-2">
          <p class="text-[16px] font-semibold">
            {{ $t('data.billing.billing_address') }}
          </p>
        </div>

        <div class="form-group col-span-2">
          <ValidationProvider
            v-slot="{ errors }"
            rules="required|max:250"
            :name="$t('common.address')"
          >
            <label>{{ $t('common.address') }}
              <span class="text-danger">*</span>
            </label>
            <input
              v-model="user.address"
              name="address"
              :class="errors.length ? 'is-invalid' : ''"
              type="text"
              class="form-control form-control-sm"
            >
            <span class="invalid-feedback">{{ errors[0] }}</span>
          </ValidationProvider>
        </div>

        <div class="form-group">
          <ValidationProvider
            v-slot="{ errors }"
            rules="required|max:100"
            :name="$t('common.city')"
          >
            <label>{{ $t('common.city') }}
              <span class="text-danger">*</span>
            </label>
            <input
              v-model="user.address_city"
              name="city"
              :class="errors.length ? 'is-invalid' : ''"
              type="text"
              class="form-control form-control-sm"
            >
            <span class="invalid-feedback">{{ errors[0] }}</span>
          </ValidationProvider>
        </div>

        <div class="form-group">
          <ValidationProvider
            v-slot="{ errors }"
            rules="max:100"
            :name="$t('common.state')"
          >
            <label>{{ $t('common.state') }} </label>
            <input
              v-model="user.address_state"
              type="text"
              :class="errors.length ? 'is-invalid' : ''"
              class="form-control form-control-sm"
              name="state"
            >
            <span class="invalid-feedback">{{ errors[0] }}</span>
          </ValidationProvider>
        </div>

        <div class="form-group">
          <ValidationProvider
            v-slot="{ errors }"
            rules="required"
            :name="$t('common.country')"
          >
            <label>{{ $t('common.country') }}
              <span class="text-danger">*</span>
            </label>
            <el-select
              v-model="user.address_country"
              placeholder=""
              filterable
              class="w-full"
              size="small"
              :class="errors.length ? 'is-invalid' : ''"
              auto-complete="off"
            >
              <el-option
                v-for="country in countries"
                :key="country.country_code"
                :value="country.country_code"
                :label="country.country_name"
              >
                <span>
                  <span
                    :class="`flag flag-${country.country_code.toLowerCase()}`"
                    class=""
                  />
                  {{ country.country_name }}
                </span>
              </el-option>
            </el-select>
            <span class="invalid-feedback">{{ errors[0] }}</span>
          </ValidationProvider>
        </div>

        <div class="form-group">
          <ValidationProvider
            v-slot="{ errors }"
            rules="numeric|max:10"
            :name="$t('common.zip')"
          >
            <label>{{ $t('common.zip') }} </label>
            <input
              v-model="user.address_zip"
              type="text"
              :class="errors.length ? 'is-invalid' : ''"
              class="form-control form-control-sm"
              name="zip"
            >
            <span class="invalid-feedback">{{ errors[0] }}</span>
          </ValidationProvider>
        </div>
      </div>
      <!-- Billing address end -->
    </ValidationObserver>

    <div class="credit-drawer-footer mt-8">
      <div class="flex">
        <el-button :disabled="loading" style="width: 150px" @click="cancel">
          {{ $t('common.cancel') }}
        </el-button>
        <el-button
          type="primary"
          :disabled="loading"
          style="width: 150px"
          @click="save"
        >
          {{ $t('common.save') }}
        </el-button>
      </div>
    </div>
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
    userInfo: {
      type: Object,
      default () {
        return {
          country: 'VN',
          metadata: {}
        }
      }
    }
  },
  data () {
    return {
      visible: false,
      eventChangeNumber: {},
      eventChangeExpiry: {},
      eventChangeCvc: {},
      stripe: null,
      elements: null,
      cardNumber: null,
      cardExpiry: null,
      cardCvc: null,
      card: {},
      countries: [],
      loading: false,
      user: {
        country: 'VN',
        metadata: {}
      }
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
  beforeDestroy () {
    this.handleClose()
  },
  methods: {
    cancel () {
      this.$emit('handle-cancel')
      this.handleClose()
    },
    handleClose () {
      this.cardNumber = {}
      this.cardExpiry = {}
      this.cardCvc = {}
      this.eventChangeNumber = {}
      this.eventChangeExpiry = {}
      this.eventChangeCvc = {}
    },
    async save () {
      const isValid = await this.$refs.observer.validate()
      console.log(isValid)
      if (isValid) {
        this.loading = true
        const tokenData = {
          name: this.user.name,
          address_line1: this.user.address,
          address_country: this.user.address_country,
          address_line2: this.user.address_country,
          address_city: this.user.address_city,
          address_state: this.user.address_state || '',
          address_zip: this.user.address_zip || '',
          metadata: {
            email: this.user.metadata.email,
            contact_name: this.user.metadata.contact_name,
            company: this.user.metadata.company
          }
        }
        this.stripe.createToken(this.cardNumber, tokenData).then(result => {
          if (result.token) {
            // Handle result.error or result.token
            const url = 'cystack_platform/payments/cards'
            this.$axios
              .$post(url, {
                token_card: result.token.id,
                metadata: {
                  email: this.user.metadata.email,
                  contact_name: this.user.metadata.contact_name,
                  company: this.user.metadata.company
                }
              })
              .then(res => {
                this.notify(this.$t('data.billing.add_card_success'), 'success')
                this.$emit('handle-done', res)
                this.handleClose()
              })
              .catch(() => {
                this.notify(
                  this.$t('data.billing.card_decline.generic_decline'),
                  'warning'
                )
              })
              .then(() => {
                this.loading = false
              })
          } else {
            this.loading = false
          }
        })
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

<style></style>
