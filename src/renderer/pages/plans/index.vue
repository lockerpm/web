<template>
  <div class="flex flex-col flex-column-fluid relative bg-[#FBFBFC]">
    <div class="flex mb-5 border-b border-black-400 pt-3 lg:px-28 px-10">
      <template v-for="(item, index) in planMenu">
        <div
          :key="index"
          :class="step===index+1?'!text-black font-semibold border-b-2 border-primary pb-3':''"
          class="text-black-600 mr-8 last:mr-0 cursor-pointer"
          @click="step=index+1"
        >
          {{ $t(`sidebar.${item.label}`) }}
        </div>
      </template>
    </div>
    <div class="flex-column-fluid lg:px-28 py-10 px-10 mb-20">
      <div class="flex mb-5">
        <div class="">
          <!--Banner Upgrade to Premium -->
          <!-- <div v-if="currentPlan.alias === 'pm_free'" class="border border-black-200 rounded p-5 md:px-5 md:py-7 relative bg-gradient-to-r from-[#05A49F] to-[#1AB0AC] mb-6">
              <div class="flex items-center justify-between text-white">
                <div class="">
                  <div class="text-lg font-semibold mb-2">
                    Upgrade to Premium to unlock more features
                  </div>
                  <div class="flex items-center">
                    <Check />
                    <div class="ml-2">Check your overall passwords score</div>
                  </div>
                  <div class="flex items-center">
                    <Check />
                    <div class="ml-2">Detect if your password were in a breach</div>
                  </div>
                </div>
                <div class="mr-10">
                  <img src="~/assets/images/icons/callout-upgrade.svg" alt="">
                </div>
              </div>
            </div> -->
          <!-- Banner end -->

          <!-- Step title -->
          <div class="mb-4">
            <template v-if="step===1">
              <div class="text-head-3 font-semibold mb-2">
                Choose a plan
              </div>
              <div class="mb-2">Choose a plan that suits your need.</div>
              <div class="flex">
                <div class="font-semibold mr-3">Monthly</div>
                <el-switch v-model="periodSwitch" small @change="calcPrice" />
                <div class="font-semibold ml-3">Yearly</div>
              </div>
            </template>
            <template v-if="step===2">
              <div class="text-head-3 font-semibold mb-2">
                Payment
              </div>
              <div class="mb-2">Choose your payment method.</div>
            </template>
            <template v-if="step===3">
              <div class="text-head-3 font-semibold mb-2">
                Confirmation
              </div>
              <div class="mb-2">Your order has been confirmed!</div>
            </template>
          </div>
          <!-- Step title end-->

          <div class="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-x-6 gap-y-3">
            <div class="lg:col-span-3">
              <template v-if="step===1">
                <div class="grid lg:grid-cols-3 grid-cols-1 gap-x-6 gap-y-3">
                  <div
                    v-for="item in plans"
                    :key="item.id"
                    :class="selectedPlan.alias===item.alias?'!border-primary':''"
                    class="p-8 border border-black-200 rounded cursor-pointer hover:border-primary"
                    @click="selectPlan(item)"
                  >
                    <div class="h-full flex flex-col">
                      <div class="2xl:flex items-center text-center">
                        <span class="label label-black tracking-[1px] font-semibold uppercase !text-xs">
                          {{ getPlanName(item.name).name }}
                        </span>
                        <span class="text-black-600 ml-2">
                          {{ getPlanName(item.name).tag }}
                        </span>
                      </div>
                      <div class="mt-2.5 mb-6 2xl:flex items-center">
                        <div class="text-head-3 font-semibold text-center 2xl:mr-2">
                          <span v-if="language==='vi'">đ{{ item.price.vnd | formatNumber }}</span>
                          <span v-if="language==='en'">${{ item.price.usd | formatNumber }}</span>
                        </div>
                        <div class="text-center">
                          <span class="text-black-600">/ mo</span>
                          <span v-if="item.max_number" class="text-black-600">/ {{ $tc('data.plans.members',item.max_number ,{count: item.max_number}) }} </span>
                          <span v-else-if="item.alias === 'pm_business_premium'" class="text-black-600">/ {{ $tc('data.plans.members', 1, {count: 1}) }} </span>
                        </div>
                      </div>
                      <div class="mb-8 flex-grow">
                        <div
                          v-for="feature in features[item.alias]"
                          :key="feature"
                          class="flex items-center"
                        >
                          <Check class="text-primary" />
                          <div class="ml-2">{{ $t(`data.plans.features.${feature}`) }}</div>
                        </div>
                      </div>
                      <div v-if="item.alias !== 'pm_free'">
                        <button
                          v-if="currentPlan.alias === item.alias"
                          class="btn btn-default w-full"
                        >
                          Hiện tại
                        </button>
                      </div>
                      <div v-else-if="currentPlan.alias === 'pm_free'">
                        <button class="btn btn-primary w-full">
                          Hiện tại
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
              <template v-if="step===2">
                <div
                  v-if="paymentMethod==='card'"
                  class="border rounded p-5 border-black-200 cursor-pointer col-span-2"
                >
                  <div class="">
                    <el-radio-group v-model="selectedCard" class="w-full">
                      <el-radio
                        v-for="item in cards"
                        :key="item.id_card"
                        :label="item.id_card"
                        class="!flex mb-4 items-center"
                      >
                        <div class="flex items-center w-[200px]">
                          <div class="bg-[#f5f8fa] w-10 h-10 rounded flex items-center justify-center p-1 mr-4">
                            <img v-if="item.card_type === 'Visa'" src="~/assets/images/icons/cards/visa.svg" alt="">
                            <img v-else-if="item.card_type === 'MasterCard'" src="~/assets/images/icons/cards/master.svg" alt="">
                            <img v-else-if="item.card_type === 'American Express'" src="~/assets/images/icons/cards/amex.svg" alt="">
                            <img v-else-if="item.card_type === 'Discover'" src="~/assets/images/icons/cards/discover.svg" alt="">
                            <img v-else-if="item.card_type === 'JCB'" src="~/assets/images/icons/cards/jcb.svg" alt="">
                            <img v-else src="~/assets/images/icons/cards/card.svg" alt="">
                          </div>
                          <div class="">
                            <div class="text-black font-bold mb-2">{{ item.card_type }}</div>
                            <div class="flex items-center justify-between">
                              <div class="text-black-500 mr-10">{{ item.expire }}</div>
                              <div class="text-black-500 flex items-center">
                                <span class="bg-black-500 w-[4px] h-[4px] rounded-full mr-0.5" />
                                <span class="bg-black-500 w-[4px] h-[4px] rounded-full mr-0.5" />
                                <span class="bg-black-500 w-[4px] h-[4px] rounded-full mr-0.5" />
                                <span class="bg-black-500 w-[4px] h-[4px] rounded-full mr-0.5" />
                                <span>{{ item.last4 }}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </el-radio>
                    </el-radio-group>
                    <button
                      class="btn btn-default btn-xs"
                      @click="editBilling"
                    >
                      {{ $t('data.billing.add_btn') }}
                    </button>
                  </div>
                </div>
                <Payment v-if="paymentVisible" ref="payment" @handle-done="handleDone" @handle-cancel="handleCancel" />
              </template>
              <template v-if="step===3">
                <div>
                  step3
                </div>
              </template>
            </div>
            <div>
              <div
                class="pl-6 py-7 rounded"
                style="background: linear-gradient(90deg, rgba(219,223,225,0.16) 0%, rgba(219,223,225,0) 100%);"
              >
                <div class="text-[20px] font-semibold mb-6">
                  {{ $t('data.billing.upgrade_summary') }}
                </div>
                <div class="my-8 h-[1px] bg-[#E8EAED]" />
                <div class="flex items-center justify-between mb-4">
                  <div>
                    <div class="flex items-center">
                      <div class="label label-black tracking-[1px] font-semibold uppercase !text-xs">
                        {{ getPlanName(selectedPlan.name).name }}
                      </div>
                      <div class="text-black-600 ml-2">
                        {{ getPlanName(selectedPlan.name).tag }}
                      </div>
                    </div>
                    <div>
                      <span>{{ $t(`data.plans.price.${selectedPeriod.label}`) }}</span>
                      <span v-if="selectedPlan.id === 4"> x {{ $tc('data.plans.members', number_members, { count: number_members }) }}</span>
                    </div>
                  </div>
                  <div>
                    {{ result.price | formatNumber }} {{ result.currency }}
                  </div>
                </div>
                <div v-if="result.immediate_payment" class="flex items-center justify-between">
                  <div>
                    {{ $t('data.billing.charged_today') }}
                  </div>
                  <div>
                    {{ result.immediate_payment | formatNumber }} {{ result.currency }}
                  </div>
                </div>
                <div class="my-8 h-[1px] bg-[#E8EAED]" />
                <div class="flex items-center justify-between text-[20px] font-semibold">
                  <div>{{ $t('data.billing.total') }}</div>
                  <div>
                    {{ result.total_price | formatNumber }} {{ result.currency }}
                  </div>
                </div>
                <div class="my-8 h-[1px] bg-[#E8EAED]" />
                <div>
                  <ul class="mb-3">
                    <li>
                      {{ `You'll pay ${result.total_price || 0} ${result.currency || 'USD'} now, which is prorated for the current billing period.` }}
                    </li>
                    <li>
                      {{ `Your plan is billed ${result.duration || 'yearly'} and will renew for ${result.price || 0} ${result.currency || 'USD'} (plus any applicable taxes and minus any discounts) on Jan 24, 2022.` }}
                    </li>
                    <li>You can cancel any time before this date.</li>
                  </ul>
                  <button :disabled="step===2?selectedCard:false" class="btn btn-primary w-full" @click="step===1?toStep2():confirmPlan()">
                    {{ step===1?'Continue': 'Pay & Upgrade' }}
                  </button>
                </div>
              </div>
              <div class="flex mt-3">
                <div class="mr-2">
                  Have coupon code?
                </div>
                <el-switch v-model="havePromoCode" />
              </div>
              <div v-if="havePromoCode" class="flex">
                <el-input v-model="promo_code" change="mr-2" />
                <el-button type="primary" plain @click="calcPrice">Apply</el-button>
              </div>
              <div v-if="result.error_promo" class="text-danger">
                {{ result.error_promo.promo_code[0] }}
              </div>
            </div>
          </div>
          <el-dialog
            :visible.sync="dialogChange"
            width="675px"
            destroy-on-close
            top="15vh"
            custom-class="locker-dialog"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
          >
            <div slot="title">
              <div class="text-head-5 text-black-700 font-semibold truncate">
                Thay đổi gói đăng ký
              </div>
            </div>
            <div class="text-left text-black">
              <div class="flex items-center justify-between mb-5">
                <div class="text-head-6 text-black font-semibold">Gói hiện tại:</div>
                <div class="flex items-center">
                  <div class="label label-black tracking-[1px] font-semibold uppercase !text-xs">
                    {{ getPlanName(currentPlan.name).name }}
                  </div>
                  <div class="text-black-600 ml-2">
                    {{ getPlanName(currentPlan.name).tag }}
                  </div>
                </div>
              </div>

              <div class="flex items-center justify-between mb-5">
                <div class="text-head-6 text-black font-semibold">Gói đăng ký mới:</div>
                <div class="flex items-center">
                  <div class="label label-black tracking-[1px] font-semibold uppercase !text-xs">
                    {{ getPlanName(selectedPlan.name).name }}
                  </div>
                  <div class="text-black-600 ml-2">
                    {{ getPlanName(selectedPlan.name).tag }}
                  </div>
                </div>
              </div>
              <div class="my-4 h-[1px] bg-[#E8EAED]" />
              <div class="mb-5">
                <div class="font-semibold mb-6">
                  Choose subscription period
                </div>
                <div class="grid grid-cols-3 gap-x-6">
                  <div
                    v-for="(item) in periods"
                    :key="item.value"
                    class="transition-card py-5 px-3 border border-black-200 rounded text-center cursor-pointer"
                    :class="{'border-primary': selectedPeriod.label===item.label}"
                    @click="selectPeriod(item)"
                  >
                    <div class="font-semibold text-[1rem] mb-2.5">{{ $t(`data.plans.price.${item.label}`) }}</div>
                    <template v-if="selectedPlan[item.label]">
                      <div class="font-semibold">
                        <span>
                          <span class="text-head-5">{{ symbol }}{{ selectedPlan[item.label][currency]/item.value | formatNumber }}</span>
                          <span> / Mo </span>
                          <div v-if="selectedPlan.max_number" class="text-black-600">/ {{ selectedPlan.max_number }} members </div>
                          <div v-else-if="selectedPlan.alias === 'pm_business_premium'" class="text-black-600">/ 1 member </div>
                        </span>
                      </div>
                    </template>
                  </div>
                </div>
              </div>
              <div v-if="selectedPlan.alias === 'pm_business_premium'" class="mb-5">
                <div class="font-semibold mb-6">
                  Choose number of members
                </div>
                <el-input-number
                  v-model="number_members"
                  controls-position="right"
                  :min="currentPlan.max_number ? currentPlan.max_number : 1"
                  :max="1000"
                  @change="calcPrice"
                />
              </div>
              <div class="mb-5">
                <div class="font-semibold mb-5">
                  Select a payment method
                </div>
                <div class="grid gap-5">
                  <div
                    v-if="currentPlan.payment_method ==='wallet' || currentPlan.payment_method ==='banking'"
                    class="border rounded px-5 py-4 hover:border-primary cursor-pointer"
                    :class="{
                      'border-primary': paymentMethod === 'wallet',
                      'border-black-200': paymentMethod !== 'wallet'
                    }"
                    @click="selectMethod('wallet')"
                  >
                    <div class="text-lg  mb-2 flex items-center justify-between">
                      <span class="font-semibold">CyStack Wallet</span>
                      <span class="">{{ balance | formatNumber }} VND</span>
                    </div>
                    <div class=" flex items-center justify-between">
                      <span class="italic">*This is a payment method only for Vietnamese</span>
                      <a
                        href="https://id.cystack.net/wallet/vnd"
                        target="_blank"
                        class="btn btn-outline-primary rounded-full btn-xs hover:no-underline"
                      >
                        <i class="fa fa-plus" /> Topup
                      </a>
                    </div>
                  </div>
                  <div
                    v-if="currentPlan.payment_method==='card'"
                    class="border rounded p-5 border-black-200 cursor-pointer col-span-2"
                  >
                    <div class="">
                      <el-radio-group v-model="selectedCard" class="w-full">
                        <el-radio
                          v-for="item in cards"
                          :key="item.id_card"
                          :label="item.id_card"
                          class="!flex mb-4 items-center"
                        >
                          <div class="flex items-center w-[200px]">
                            <div class="bg-[#f5f8fa] w-10 h-10 rounded flex items-center justify-center p-1 mr-4">
                              <img v-if="item.card_type === 'Visa'" src="~/assets/images/icons/cards/visa.svg" alt="">
                              <img v-else-if="item.card_type === 'MasterCard'" src="~/assets/images/icons/cards/master.svg" alt="">
                              <img v-else-if="item.card_type === 'American Express'" src="~/assets/images/icons/cards/amex.svg" alt="">
                              <img v-else-if="item.card_type === 'Discover'" src="~/assets/images/icons/cards/discover.svg" alt="">
                              <img v-else-if="item.card_type === 'JCB'" src="~/assets/images/icons/cards/jcb.svg" alt="">
                              <img v-else src="~/assets/images/icons/cards/card.svg" alt="">
                            </div>
                            <div class="">
                              <div class="text-black font-bold mb-2">{{ item.card_type }}</div>
                              <div class="flex items-center justify-between">
                                <div class="text-black-500 mr-10">{{ item.expire }}</div>
                                <div class="text-black-500 flex items-center">
                                  <span class="bg-black-500 w-[4px] h-[4px] rounded-full mr-0.5" />
                                  <span class="bg-black-500 w-[4px] h-[4px] rounded-full mr-0.5" />
                                  <span class="bg-black-500 w-[4px] h-[4px] rounded-full mr-0.5" />
                                  <span class="bg-black-500 w-[4px] h-[4px] rounded-full mr-0.5" />
                                  <span>{{ item.last4 }}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </el-radio>
                      </el-radio-group>
                      <button
                        class="btn btn-default btn-xs"
                        @click="editBilling"
                      >
                        Thêm thẻ mới
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div class="text-lg">
                <div class="font-semibold mb-6">
                  Summary
                </div>
                <div v-if="result.next_billing_time" class="flex items-center justify-between">
                  <div>
                    {{ $t('data.billing.next_billing') }}:
                    <span class="font-semibold">{{ $moment(result.next_billing_time*1000).format('LL') }}</span>
                  </div>
                  <div>
                    {{ result.price | formatNumber }} {{ result.currency }}
                  </div>
                </div>
                <div v-if="result.immediate_payment" class="flex items-center justify-between">
                  <div>
                    {{ $t('data.billing.charged_today') }}
                  </div>
                  <div>
                    {{ result.immediate_payment | formatNumber }} {{ result.currency }}
                  </div>
                </div>
                <div class="my-4 h-[1px] bg-[#E8EAED]" />
                <div class="flex items-center justify-between text-[20px] font-semibold">
                  <div>Total</div>
                  <div>
                    {{ result.total_price | formatNumber }} {{ result.currency }}
                  </div>
                </div>
              </div>
            </div>
            <div slot="footer" class="dialog-footer flex items-center text-left">
              <div class="flex-grow" />
              <div>
                <button
                  class="btn btn-default"
                  :disabled="loading || loadingCalc"
                  @click="dialogChange = false"
                >
                  {{ $t('common.cancel') }}
                </button>
                <button
                  class="btn btn-primary"
                  :disabled="loading || loadingCalc"
                  @click="confirmPlan"
                >
                  {{ $t('common.confirm') }}
                </button>
              </div>
            </div>
          </el-dialog>
          <el-dialog
            :visible.sync="dialogThank"
            width="500px"
            custom-class="locker-dialog"
            :close-on-click-modal="false"
            :close-on-press-escape=" false"
          >
            <div slot="title">
              <div class="text-head-5 text-black-700 font-semibold truncate">
                {{ $t('data.billing.transfer_thank') }}
              </div>
            </div>
            <div class="text-black-700">
              <div class="text-lg mb-3">
                {{ $t('data.billing.transfer_thank_content', {plan: selectedPlan.name}) }}
              </div>
              <div class="text-lg">
                {{ $t('data.billing.transfer_thank_content_1') }}
              </div>
            </div>
            <div slot="footer">
              <div class="">
                <button class="btn btn-default w-full" @click="dialogThank = false">
                  {{ $t('common.close') }}
                </button>
              </div>
            </div>
          </el-dialog>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import debounce from 'lodash/debounce'
import find from 'lodash/find'
import Payment from '../../components/upgrade/Payment'
import Check from '../../components/icons/check'

export default {
  components: { Check, Payment },
  data () {
    return {
      step: 1,
      plans: [],
      features: {
        pm_free: [
          'store_password',
          'cards_and_notes',
          'password_generator',
          'sync_devices'
        ],
        pm_personal_premium: [
          'store_password',
          'cards_and_notes',
          'password_generator',
          'sync_devices',
          'password_health',
          'data_breach'
        ],
        pm_family_discount: [
          'store_password',
          'cards_and_notes',
          'password_generator',
          'sync_devices',
          'password_health',
          'data_breach'
        ],
        pm_business_premium: [
          'store_password',
          'cards_and_notes',
          'password_generator',
          'sync_devices',
          'password_health',
          'data_breach',
          'shares_passwords',
          'admin_panel',
          'activity_logs'
        ]
      },
      selectedPlan: {
        half_yearly_price: {},
        price: {},
        yearly_price: {},
        name: ''
      },
      periods: [
        {
          label: 'yearly_price',
          value: 12,
          duration: 'yearly'
        },
        {
          label: 'price',
          value: 1,
          duration: 'monthly'
        }],
      cards: [],
      type: 'yearly_price',
      paymentMethod: 'card',
      selectedCard: '',
      duration: 'yearly',
      promo_code: '',
      havePromoCode: false,
      periodSwitch: true,
      number_members: 1,
      result: {},
      balance: 0,
      dialogChange: false,
      loadingChange: false,
      loading: false,
      dialogTopup: false,
      loadingCalc: false,
      intervalBalance: null,
      banks: [],
      bank: '',
      dialogTransfer: false,
      order: {
        bank: {}
      },
      loadingDeposited: false,
      dialogThank: false,
      planMenu: [
        {
          label: 'choose_plan'
        },
        {
          label: 'payment'
        },
        {
          label: 'confirmation'
        }
      ],
      paymentVisible: false
    }
  },
  computed: {
    currency () {
      return this.language === 'vi' ? 'vnd' : 'usd'
    },
    symbol () {
      return this.currency === 'vnd' ? 'đ' : '$'
    },
    shouldDisableBtn () {
      if (this.loading || this.loadingCalc) return true
      if (this.paymentMethod === 'card' && this.cards.length === 0) return true
      return false
    },
    currentPlan () {
      return this.$store.state.currentPlan
    },
    selectedPeriod () {
      return this.periodSwitch
        ? {
          label: 'yearly_price',
          value: 12,
          duration: 'yearly'
        }
        : {
          label: 'price',
          value: 1,
          duration: 'monthly'
        }
    }
  },
  beforeDestroy () {
    clearInterval(this.intervalBalance)
  },
  mounted () {
    this.getPlans()
    this.getCards()
    this.getBalance()
    this.getBanks()
    this.intervalBalance = setTimeout(() => {
      this.getBalance()
    }, 10000)
    this.$store.dispatch('LoadCurrentPlan')
  },
  methods: {
    async getPlans () {
      this.plans = await this.$axios.$get('resources/cystack_platform/pm/plans')
    },
    async getPlan () {
      this.plan = await this.$axios.$get('cystack_platform/pm/payments/plan')
    },
    getPlanName (text) {
      if (text) {
        const [name, tag] = text.split(' ')
        return { name, tag }
      }
      return { name: '', tag: '' }
    },
    editBilling () {
      // this.$refs.payment.open({
      //   country: 'VN',
      //   metadata: {}
      // })
      this.paymentVisible = true
    },
    handleCancel () {
      this.paymentVisible = false
    },
    handleDone (card) {
      this.getCards()
      this.$nextTick(() => {
        this.selectedCard = card.id_card
      })
    },
    async genOrgKey () {
      const shareKey = await this.$cryptoService.makeShareKey()
      const orgKey = shareKey[0].encryptedString
      const collection = await this.$cryptoService.encrypt('defaultCollection', shareKey[1])
      const collectionName = collection.encryptedString
      console.log('orgKey', orgKey)
      console.log('collectionName', collectionName)
    },
    async getCards () {
      this.cards = await this.$axios.$get('cystack_platform/payments/cards')
    },
    calcPrice: debounce(function () {
      const currency = this.paymentMethod === 'card' ? 'USD' : 'VND'
      this.loadingCalc = true
      const url = 'cystack_platform/pm/payments/calc'
      this.$axios.$post(url, {
        plan_alias: this.selectedPlan.alias,
        promo_code: this.promo_code,
        duration: this.selectedPeriod.duration,
        number_members: this.number_members,
        currency
      }).then(res => {
        this.result = res
      })
        .catch(error => {
          if (error.response && error.response.data && error.response.code === '7009') {
            this.notify(this.$t('data.error_code.7009'))
          }
        })
        .then(() => {
          this.loadingCalc = false
        })
    }, 300),
    selectPeriod (period) {
      // this.selectedPeriod = period
      if (this.currentPlan.alias !== 'pm_free') {
        this.selectMethod(this.currentPlan.payment_method === 'banking' ? 'wallet' : this.currentPlan.payment_method)
      } else {
        this.number_members = 1
        this.selectMethod('card')
      }
      this.calcPrice()
    },
    selectPlan (plan) {
      this.selectedPlan = plan
      if (this.currentPlan.alias !== 'pm_free') {
        this.dialogChange = true
        this.selectPeriod(find(this.periods, e => e.duration === this.currentPlan.duration))
        if (this.currentPlan.alias === 'pm_family') {
          this.number_members = 6
        }
      } else {
        this.number_members = 1
        // this.step = 2
        this.selectPeriod(this.selectPeriod)
      }
      this.calcPrice()
    },
    selectMethod (method) {
      this.paymentMethod = method
      if (method === 'card' && this.cards.length) {
        const card = find(this.cards, e => e.default) || {}
        this.selectedCard = card.id_card
      }
      this.calcPrice()
    },
    async confirmPlan () {
      if (this.paymentMethod === 'wallet' && this.result.total_price > this.balance) {
        this.dialogTopup = true
        return
      }
      try {
        this.loading = true
        const shareKey = await this.$cryptoService.makeShareKey()
        const orgKey = shareKey[0].encryptedString
        const collection = await this.$cryptoService.encrypt('defaultCollection', shareKey[1])
        const collectionName = collection.encryptedString

        const data = await this.$axios.$post('cystack_platform/pm/payments/plan', {
          plan_alias: this.selectedPlan.alias,
          duration: this.selectedPeriod.duration,
          payment_method: this.paymentMethod,
          id_card: this.selectedCard,
          promo_code: this.promo_code,
          number_members: this.number_members,
          key: orgKey,
          collection_name: collectionName,
          bank_id: this.bank.id
        })
        this.$store.dispatch('LoadCurrentPlan')
        this.step = 1
        this.dialogChange = false
        if (this.paymentMethod === 'banking') {
          this.order = data
          this.dialogTransfer = true
        } else {
          this.notify('Nâng cấp thành công', 'success')
        }
      } catch {
        this.notify('Có lỗi xảy ra. Vui lòng thử lại', 'warning')
      } finally {
        this.loading = false
      }
    },
    async getBalance () {
      const { balance } = await this.$axios.$get('sso/me/wallet/VND')
      this.balance = balance
    },
    confirmChange () {},
    getBanks () {
      this.$axios.$get('resources/wallet/banks')
        .then(res => {
          this.banks = res
          if (res && res.length) {
            this.bank = res[0]
          }
        })
        .finally(() => {
        })
    },
    postDeposit (order) {
      this.$axios.$post(`cystack_platform/pm/payments/invoices/${order.payment_id}/processing`)
        .then(res => {
          this.dialogTransfer = false
          this.dialogThank = true
        })
    },
    toStep2 () {
      this.step = 2
      this.selectMethod('card')
    }
  }
}
</script>
