<template>
  <div>
    <div class="mb-4 text-black-700 text-head-6 font-semibold">
      {{ $t('data.ciphers.card_details') }}
    </div>
    <ValidationProvider
      v-slot="{ errors: err }"
      rules="required"
      :name="$t('data.ciphers.card_holder')"
    >
      <InputText
        :value="cardholderName"
        :label="$t('data.ciphers.card_holder')"
        class="w-full !mb-2"
        :error-text="err && err.length && err[0]"
        :disabled="isDeleted"
        @input="val => $emit('update:cardholderName', val)"
      />
    </ValidationProvider>
    <InputText
      :value="number"
      :label="$t('data.ciphers.card_number')"
      class="w-full"
      :disabled="isDeleted"
      :suffix-icon="currentCard ? currentCard.icon : ''"
      :icon-type="currentCard ? currentCard.iconType : ''"
      @input="changeCardNumber"
    />
    <div class="grid grid-cols-2 gap-2">
      <InputSelect
        :label="$t('data.ciphers.expiration_month')"
        :initial-value="expMonth"
        class="w-full"
        :disabled="isDeleted"
        :options="cardExpMonthOptions"
        @change="val => $emit('update:expMonth', val)"
      />
      <InputText
        :value="expYear"
        :label="$t('data.ciphers.expiration_year')"
        class="w-full !mb-2"
        :disabled="isDeleted"
        @input="val => $emit('update:expYear', val)"
      />
    </div>
    <InputText
      :value="code"
      :label="$t('data.ciphers.cvv')"
      is-password
      class="w-full"
      :disabled="isDeleted"
      @input="val => $emit('update:code', val)"
    />
  </div>
</template>
<script>
import { ValidationProvider } from 'vee-validate'
import InputText from '../../../input/InputText'
import InputSelect from '../../../input/InputSelect'
import { detectCardBrand } from '../../../../utils/common'

export default {
  components: { ValidationProvider, InputText, InputSelect },

  props: {
    isDeleted: {
      type: Boolean,
      default: () => false
    },
    errors: {
      type: Object,
      default: () => ({})
    },
    cardholderName: {
      type: String,
      default: () => ''
    },
    number: {
      type: String,
      default: () => ''
    },
    brand: {
      type: String,
      default: () => ''
    },
    expMonth: {
      type: String,
      default: () => ''
    },
    expYear: {
      type: String,
      default: () => ''
    },
    code: {
      type: String,
      default: () => ''
    }
  },

  computed: {
    currentCard () {
      return this.cardBrandOptions.find(c => c.value && c.value === this.brand)
    }
  },

  methods: {
    changeCardNumber (number) {
      this.$emit('update:number', number)
      const cardLabel = detectCardBrand(number)
      const brandOption = this.cardBrandOptions.find(o => o.label === cardLabel)
      if (brandOption) {
        this.$emit('update:brand', brandOption.value)
      } else if (cardLabel) {
        this.$emit('update:brand', 'Other')
      } else {
        this.$emit('update:brand', null)
      }
    }
  }
}
</script>
<style scoped></style>
