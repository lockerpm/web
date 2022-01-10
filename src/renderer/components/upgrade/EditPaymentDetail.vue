<template>
  <el-dialog
    ref="editPaymentDialog"
    :visible.sync="visible"
    width="435px"
    destroy-on-close
    top="5vh"
    custom-class="locker-dialog"
    :close-on-click-modal="false"
  >
    <div slot="title" class="" style="overflow: hidden">
      <h4>{{ $t('data.billing.edit_card_title') }}</h4>
    </div>
    <ValidationObserver ref="observer" tag="div" class="p-4 credit-drawer-body">
      <div class="grid grid-cols-2 gap-x-4">
        <div class="form-group col-span-2">
          <div class="text-lg font-semibold">
            {{ $t('data.billing.billing_address') }}
          </div>
        </div>
        <div class="form-group col-span-2">
          <ValidationProvider v-slot="{ errors }" rules="required|max:250" :name="$t('common.address')">
            <label>* {{ $t('common.address') }}</label>
            <input
              v-model="card.address"
              name="address"
              :class="errors.length?'is-invalid':''"
              type="text"
              class="form-control form-control-sm"
              :placeholder="$t('common.address_placeholder')"
            >
            <span class="invalid-feedback">{{ errors[0] }}</span>
          </ValidationProvider>
        </div>
        <div class="form-group">
          <ValidationProvider v-slot="{ errors }" rules="required|max:100" :name="$t('common.city')">
            <label>* {{ $t('common.city') }}</label>
            <input
              v-model="card.address_city"
              name="city"
              :class="errors.length?'is-invalid':''"
              type="text"
              class="form-control form-control-sm"
            >
            <span class="invalid-feedback">{{ errors[0] }}</span>
          </ValidationProvider>
        </div>
        <div class="form-group">
          <ValidationProvider v-slot="{ errors }" rules="max:100" :name="$t('common.state')">
            <label>{{ $t('common.state') }}</label>
            <input
              v-model="card.address_state"
              type="text"
              :class="errors.length?'is-invalid':''"
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
            <label>* {{ $t('common.country') }}</label>
            <el-select
              v-model="card.address_country"
              placeholder=""
              filterable
              class="w-full"
              size="small"
              :class="errors.length?'is-invalid':''"
              auto-complete="off"
            >
              <el-option
                v-for="country in countries"
                :key="country.country_code"
                :value="country.country_code"
                :label="country.country_name"
              >
                <span>
                  <span :class="`flag flag-${country.country_code.toLowerCase()}`" class="" />
                  {{ country.country_name }}
                </span>
              </el-option>
            </el-select>
            <span class="invalid-feedback">{{ errors[0] }}</span>
          </ValidationProvider>
        </div>
        <div class="form-group">
          <ValidationProvider v-slot="{ errors }" rules="numeric|max:10" :name="$t('common.state')">
            <label>{{ $t('common.zip') }}</label>
            <input
              v-model="card.address_zip"
              type="text"
              :class="errors.length?'is-invalid':''"
              class="form-control form-control-sm "
              name="zip"
            >
            <span class="invalid-feedback">{{ errors[0] }}</span>
          </ValidationProvider>
        </div>
      </div>
    </ValidationObserver>
    <div class="credit-drawer-footer">
      <div class="grid grid-cols-2 gap-x-4">
        <button
          class="btn btn-default btn-block w-full"
          :disabled="loading"
          @click="cancel"
        >
          {{ $t('common.cancel') }}
        </button>
        <button
          class="btn btn-primary btn-block w-full"
          :disabled="loading"
          @click="save"
        >
          {{ $t('common.save') }}
        </button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { ValidationProvider, ValidationObserver } from 'vee-validate'

export default {
  components: {
    ValidationProvider, ValidationObserver
  },
  props: {
    // card: {
    //   type: Object,
    //   default () {
    //     return {
    //       country: 'VN'
    //     }
    //   }
    // }
  },
  data () {
    return {
      visible: false,
      countries: [],
      loading: false,
      card: {
        country: 'VN'
      }
    }
  },
  created () {
    this.getCountries()
  },
  mounted () {
  },
  methods: {
    openDialog (card) {
      this.visible = true
      console.log(card)
      this.card = { ...card }
    },
    // beforeOpen () {
    //   // eslint-disable-next-line no-undef
    //   this.stripe = Stripe(process.env.stripeKey)
    //   this.elements = this.stripe.elements({})
    // },
    // handleOpen () {
    //   this.$nextTick(() => {
    //     this.cardNumber = this.elements.create('cardNumber', { classes: { base: 'form-control form-control-sm !py-[10px]' } })
    //     this.cardNumber.mount(this.$refs.cardNumber)
    //     this.cardExpiry = this.elements.create('cardExpiry', { classes: { base: 'form-control form-control-sm bg-white !py-[10px]' } })
    //     this.cardExpiry.mount(this.$refs.cardExpiry)
    //     this.cardCvc = this.elements.create('cardCvc', { classes: { base: 'form-control form-control-sm bg-white !py-[10px]' } })
    //     this.cardCvc.mount(this.$refs.cardCvc)
    //     this.cardNumber.on('change', event => {
    //       this.eventChangeNumber = event
    //     })
    //     this.cardExpiry.on('change', event => {
    //       this.eventChangeExpiry = event
    //     })
    //     this.cardCvc.on('change', event => {
    //       this.eventChangeCvc = event
    //     })
    //   })
    // },
    // handleClose () {
    //   this.cardNumber.destroy()
    //   this.cardExpiry.destroy()
    //   this.cardCvc.destroy()
    //   this.eventChangeNumber = {}
    //   this.eventChangeExpiry = {}
    //   this.eventChangeCvc = {}
    // },
    closeDialog () {
      this.visible = false
      this.$emit('close')
    },
    cancel () {
      this.$emit('handle-cancel')
      this.closeDialog()
    },
    async save () {
      const isValid = await this.$refs.observer.validate()
      console.log(isValid)
      if (isValid) {
        this.loading = true
        const data = {
          address: this.card.address,
          address_country: this.card.address_country,
          country: this.card.address_country,
          address_city: this.card.address_city,
          address_state: this.card.address_state || '',
          address_zip: this.card.address_zip || ''
        }
        const url = `cystack_platform/payments/cards/${this.card.id_card}/detail`
        this.$axios.$put(url, {
          ...data
        }).then(res => {
          this.notify(this.$t('data.billing.edit_card_success'), 'success')
          this.$emit('handle-done', res)
          this.closeDialog()
        })
          .catch(() => {
            this.notify(this.$t('data.billing.edit_card_failed'), 'warning')
          })
          .then(() => {
            this.loading = false
          })
      } else {
        this.loading = false
      }
    },
    getCountries () {
      this.$axios.$get('resources/countries')
        .then(res => {
          this.countries = res
        })
    }
  }
}
</script>

<style>

</style>
