import Vue from 'vue'

Vue.mixin({
  computed: {
    // ----------------- CARD -----------------

    cardBrandOptions () {
      return [
        { label: '----', value: null, icon: '' },
        { label: 'Visa', value: 'Visa', icon: 'fab fa-cc-visa' },
        {
          label: 'Mastercard',
          value: 'Mastercard',
          icon: 'fab fa-cc-mastercard'
        },
        { label: 'American Express', value: 'Amex', icon: 'fab fa-cc-amex' },
        { label: 'Discover', value: 'Discover', icon: 'fab fa-cc-discover' },
        {
          label: 'Diners Club',
          value: 'Diners Club',
          icon: 'fab fa-cc-diners-club'
        },
        { label: 'JCB', value: 'JCB', icon: 'fab fa-cc-jcb' },
        {
          label: 'Maestro',
          value: 'Maestro',
          icon: require('~/assets/images/icons/cards/meastro.svg'),
          iconType: 'img'
        },
        {
          label: 'UnionPay',
          value: 'UnionPay',
          icon: require('~/assets/images/icons/cards/unionpay.svg'),
          iconType: 'img'
        },
        { label: this.$t('other'), value: 'Other', icon: 'fas fa-credit-card' }
      ]
    },

    cardExpMonthOptions () {
      return [
        { label: '----', value: null },
        { label: '01 - ' + this.$t('january'), value: '1' },
        { label: '02 - ' + this.$t('february'), value: '2' },
        { label: '03 - ' + this.$t('march'), value: '3' },
        { label: '04 - ' + this.$t('april'), value: '4' },
        { label: '05 - ' + this.$t('may'), value: '5' },
        { label: '06 - ' + this.$t('june'), value: '6' },
        { label: '07 - ' + this.$t('july'), value: '7' },
        { label: '08 - ' + this.$t('august'), value: '8' },
        { label: '09 - ' + this.$t('september'), value: '9' },
        { label: '10 - ' + this.$t('october'), value: '10' },
        { label: '11 - ' + this.$t('november'), value: '11' },
        { label: '12 - ' + this.$t('december'), value: '12' }
      ]
    },

    // ----------------- IDENTITY -----------------

    identityTitleOptions () {
      return [
        { label: '-- ' + this.$t('common.select') + ' --', value: null },
        { label: this.$t('common.mr'), value: 'mr' },
        { label: this.$t('common.mrs'), value: 'mrs' },
        { label: this.$t('common.ms'), value: 'ms' },
        { label: this.$t('common.dr'), value: 'dr' }
      ]
    }
  },

  methods: {}
})
