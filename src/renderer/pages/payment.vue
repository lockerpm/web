<template>
  <div class="bg-[#FBFBFC] h-screen">
    <HeaderPayment />
    <div class="max-w-6xl mx-auto relative">
      <div class="flex mb-5 border-b border-black-400 pt-3 lg:px-28 px-10">
        <template v-for="(item, index) in planMenu">
          <div
            :key="index"
            :class="[step===index+1?'!text-black font-semibold border-b-2 border-primary pb-3':'', index+1>step ? 'opacity-60 cursor-not-allowed' : '']"
            class="text-black-600 mr-8 last:mr-0 cursor-pointer"
            @click="index===0?step=index+1:()=>{}"
          >
            {{ $t(`sidebar.${item.label}`) }}
          </div>
        </template>
      </div>
      <div class="flex-column-fluid lg:px-28 py-10 px-10 mb-20">
        <div class="flex mb-5">
          <div class="w-full">
            <!-- Step title -->
            <div class="mb-6">
              <template v-if="step===1">
                <div class="text-head-3 font-semibold mb-2">
                  {{ $t('data.plans.choose_plan') }}
                </div>
                <div class="mb-8">{{ $t('data.plans.choose_plan_desc') }}</div>
                <div class="flex">
                  <button
                    class="btn-round btn-left-round"
                    :class="periodSwitch?'text-black':'text-primary'"
                    @click="periodSwitch=false"
                  >
                    {{ $t('data.plans.bill_monthly') }}
                  </button>
                  <button
                    class="btn-round btn-right-round"
                    :class="periodSwitch?'text-primary':'text-black'"
                    @click="periodSwitch=true"
                  >
                    {{ $t('data.plans.bill_annually') }} <br> {{ $t('data.plans.bill_annually_desc') }}
                  </button>
                </div>
              </template>
              <template v-if="step===2">
                <div class="text-head-3 font-semibold mb-2">
                  {{ $t('data.plans.payment') }}
                </div>
                <div class="mb-2">{{ $t('data.plans.choose_payment_method') }}</div>
              </template>
            </div>
            <!-- Step title end-->

            <!-- Choose a plan -->
            <template v-if="step===1">
              <div class="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-x-6 gap-y-3">
                <div
                  v-for="item in plans"
                  :key="item.id"
                  :class="selectedPlan.alias===item.alias?'!border-primary':''"
                  class="p-8 border border-black-200 rounded hover:border-primary flex flex-col justify-between"
                >
                  <div class="flex flex-col mb-6">
                    <div class="2xl:flex items-center text-center justify-center">
                      <span class="font-semibold !text-lg">
                        {{ getPlanName(item.name).name }}
                      </span>
                      <span class="text-black-600 ml-2">
                        {{ getPlanName(item.name).tag }}
                      </span>
                    </div>
                    <div class="mb-4 mt-2 text-primary">
                      <template v-if="item.alias==='pm_free'">
                        <div class="text-head-3 font-semibold text-center">
                          <!-- <span v-if="language==='vi'">đ{{ item.price.vnd | formatNumber }}</span> -->
                          <span>${{ item.price.usd | formatNumber }}</span>
                        </div>
                      </template>
                      <template v-else>
                        <div class="text-center">
                          <template>
                            <span :class="periodSwitch?'line-through text-sm text-black':'text-head-3 font-semibold'">${{ item.price.usd | formatNumber }}</span>
                            <span
                              v-if="periodSwitch"
                              class="text-head-3 font-semibold"
                            >${{ (item.yearly_price.usd / 12) | formatNumber }}</span>
                          </template>
                          <span>/ mo</span>
                          <span
                            v-if="item.max_number"
                            class=""
                          >/ {{ $tc('data.plans.members',item.max_number ,{count: item.max_number}) }} </span>
                          <span
                            v-else-if="item.alias === 'pm_business_premium'"
                            class="text-black-600"
                          >/ {{ $tc('data.plans.members', 1, {count: 1}) }} </span>
                        </div>
                      </template>
                      <div
                        v-if="periodSwitch"
                        class="flex items-center justify-center mt-1"
                      >
                        <div v-if="item.alias != 'pm_free'">
                          {{ $t('data.plans.price_12months') }} ${{ item.yearly_price.usd }} <span class="py-[1px] px-2 bg-primary text-white rounded-[20px]">{{ $t('data.plans.save') }} {{ discountPercentage(item) }}%</span>
                        </div>
                      </div>
                    </div>
                    <div class="text-black-600 mb-4">
                      {{ $t(`data.plans.descriptions.${item.alias}`) }}
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
                  </div>
                  <div class="w-full">
                    <button
                      :class="currentPlan.alias === item.alias? 'btn-default' : 'btn-primary'"
                      class="btn text-center w-full"
                      :disabled="item.alias === 'pm_free'"
                      @click="item.alias !=='pm_free' && currentPlan.alias!==item.alias?selectPlan(item): ''"
                    >
                      {{ currentPlan.alias === item.alias? $t('data.plans.current_plan') : $t('data.plans.choose_this_plan') }}
                    </button>
                    <!-- <div v-if="currentPlan.is_trailing && currentPlan.alias !== 'pm_free' && trialLeft>=0" :class="currentPlan.alias === item.alias ? 'opacity-1':'opacity-0'" class="text-sm text-black-500 text-center cursor-pointer" @click="selectPlan(item, true)">
                      {{ $t('data.plans.trial_left', {trialLeft}) }} <span class="text-primary font-semibold">{{ $t('data.plans.purchase_now') }}</span>
                    </div> -->
                  </div>
                </div>
              </div>
            </template>

            <!-- Payment -->
            <template v-if="step===2">
              <div class="setting-wrapper !mb-3">
                <div class="setting-section">
                  <div class="setting-section-header">
                    <div class="text-[20px] font-semibold">{{ $t('data.plans.order_summary') }}</div>
                  </div>
                </div>
                <div class="setting-section">
                  <div class="setting-section-header">
                    <div>
                      <div class="setting-title">{{ getPlanName(selectedPlan.name).name }} <span v-if="currentPlan.personal_trial_applied === false">({{ $t('data.plans.trial_included') }})</span></div>
                      <div class="setting-description">{{ $t(`data.plans.price.${selectedPeriod.label}`) }}</div>
                    </div>
                    <div>
                      <div class="font-semibold">
                        {{ result.price | formatNumber }} {{ result.currency }}
                      </div>
                    </div>
                  </div>
                  <div class="mt-4">
                    <button
                      v-if="!havePromoCode"
                      class="btn btn-default md:mb-0"
                      @click="havePromoCode=true"
                    >
                      {{ $t('data.plans.add_coupon') }}
                    </button>
                    <div
                      v-if="havePromoCode"
                      class="flex"
                    >
                      <el-input
                        v-model="promo_code"
                        change="mr-2"
                      >
                        <el-button
                          slot="append"
                          :disabled="!promo_code"
                          @click="calcPrice"
                        >
                          Apply
                        </el-button>
                      </el-input>
                    <!-- <el-button type="primary" plain @click="calcPrice">Apply</el-button> -->
                    </div>
                    <div
                      v-if="result.error_promo"
                      class="text-danger"
                    >
                      {{ result.error_promo.promo_code[0] }}
                    </div>
                  </div>
                  <div
                    v-if="result.discount !== 0"
                    class="setting-section-header text-primary mt-4"
                  >
                    <div>
                      <div class="setting-title">Discount</div>
                    </div>
                    <div>
                      <div class="font-semibold">
                        -{{ result.discount | formatNumber }} {{ result.currency }}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="setting-section text-head-5">
                  <div class="setting-section-header">
                    <div>
                      <div class="setting-title">{{ $t('data.billing.total') }}</div>
                      <div class="setting-description" />
                    </div>
                    <div class="font-semibold">
                      <span v-if="currentPlan.personal_trial_applied===false" class="text-head-7 text-black-500 line-through">{{ result.next_billing_payment ? result.next_billing_payment : result.price | formatNumber }} {{ result.currency }}</span>
                      {{ result.immediate_payment | formatNumber }} {{ result.currency }}<span v-if="currentPlan.personal_trial_applied===false">*</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="px-8 text-black-500 mb-6">
                <ul v-if="currentPlan.personal_trial_applied===false">
                  <!-- <li v-html="this.$t('data.billing.plan_details[0]', {total:this.result.total_price || 0, currency:this.result.currency || 'USD'})" /> -->
                  <li v-html="$t('data.billing.trial_summary[0]', {duration:result.duration || 'yearly', price:result.next_billing_payment ? result.next_billing_payment : result.price || 0, currency:result.currency || 'USD', next_bill:nextBill||''})" />
                  <li>{{ $t('data.billing.trial_summary[1]') }}</li>
                </ul>
                <ul v-else>
                  <!-- <li v-html="this.$t('data.billing.plan_details[0]', {total:this.result.total_price || 0, currency:this.result.currency || 'USD'})" /> -->
                  <li v-html="$t('data.billing.plan_details[1]', {duration:result.duration || 'yearly', price:result.next_billing_payment ? result.next_billing_payment : result.price || 0, currency:result.currency || 'USD', next_bill:nextBill||''})" />
                  <li>{{ $t('data.billing.plan_details[2]') }}</li>
                </ul>
              </div>
              <!-- FAMILY: Add member -->
              <div
                v-if="selectedPlan.alias === 'pm_family'"
                class="setting-wrapper"
              >
                <div class="setting-section">
                  <div class="setting-section-header">
                    <div class="text-[20px] font-semibold">{{ $t('data.plans.invite_people') }}</div>
                  </div>
                </div>
                <div class="setting-section">
                  <div class="setting-section-header">
                    <div>
                      <div class="setting-title !text-sm">{{ $t('data.plans.type_email') }}</div>
                    </div>
                  </div>
                  <div class="mt-4 mb-8">
                    <div
                      class="cs-field w-full"
                    >
                      <div class="input-tags">
                        <el-tag
                          v-for="(email, index) in emails"
                          :key="email"
                          closable
                          type="info"
                          class="my-auto"
                          @close="handleClose(index)"
                        >
                          {{ email }}
                        </el-tag>

                        <input
                          ref="inputEmail"
                          class="cs-input"
                          :value="inputEmail"
                          type="text"
                          @input="emailInput($event.target.value)"
                          @keyup.enter="confirmInputEmail"
                        >
                      </div>
                      <div class="text-info cursor-pointer self-end pb-2 font-semibold px-3" @click="confirmInputEmail">
                        {{ $t('common.add') }}
                      </div>
                    </div>
                  </div>

                  <div class="setting-section-header">
                    <div>
                      <div class="setting-title !text-sm">{{ `${$t('data.plans.list_member')} (${family_members.length + 1}/6)` }}</div>
                    </div>
                  </div>
                  <div class="mt-5 px-4 py-6 bg-[#F6F6F6]">
                    <div class="flex mb-6">
                      <div class="flex items-center">
                        <el-avatar
                          :size="35"
                          :src="currentUser.avatar"
                          class="mr-2"
                        />
                        <div>
                          <p class="text-black">{{ currentUser.email }} (You)</p>
                        </div>
                      </div>
                    </div>
                    <template v-for="(email, index) in family_members">
                      <div
                        :key="index"
                        class="flex justify-between mb-6"
                      >
                        <div class="flex items-center">
                          <img
                            src="~/assets/images/icons/Avatar.svg"
                            class="mr-2"
                          >
                          <div>
                            <p class="text-black">{{ email }}</p>
                            <p class="text-black-500">Pending</p>
                          </div>
                        </div>
                        <div>
                          <button
                            class="btn btn-default !text-danger mb-4 md:mb-0"
                            @click="removeMember(index)"
                          >
                            {{ $t('common.remove') }}
                          </button>
                        </div>
                      </div>
                    </template>
                  </div>

                  <div
                    v-if="errors.family_members"
                    class="text-danger"
                  >
                    {{ errors.family_members[0] }}
                  </div>
                </div>
              </div>

              <!-- Select card -->
              <div
                v-if="paymentMethod==='card' && cards.length"
                class="border rounded p-5 border-black-200 cursor-pointer mt-2"
              >
                <div class="">
                  <el-radio-group
                    v-model="selectedCard"
                    class="w-full"
                  >
                    <el-radio
                      v-for="item in cards"
                      :key="item.id_card"
                      :label="item.id_card"
                      class="!flex mb-4 items-center"
                    >
                      <div class="flex items-center w-[200px]">
                        <div class="bg-[#f5f8fa] w-10 h-10 rounded flex items-center justify-center p-1 mr-4">
                          <img
                            v-if="item.card_type === 'Visa'"
                            src="~/assets/images/icons/cards/visa.svg"
                            alt=""
                          >
                          <img
                            v-else-if="item.card_type === 'MasterCard'"
                            src="~/assets/images/icons/cards/master.svg"
                            alt=""
                          >
                          <img
                            v-else-if="item.card_type === 'American Express'"
                            src="~/assets/images/icons/cards/amex.svg"
                            alt=""
                          >
                          <img
                            v-else-if="item.card_type === 'Discover'"
                            src="~/assets/images/icons/cards/discover.svg"
                            alt=""
                          >
                          <img
                            v-else-if="item.card_type === 'JCB'"
                            src="~/assets/images/icons/cards/jcb.svg"
                            alt=""
                          >
                          <img
                            v-else
                            src="~/assets/images/icons/cards/card.svg"
                            alt=""
                          >
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

              <!-- Add card Component -->
              <Payment
                v-if="paymentVisible || !cards.length"
                ref="payment"
                @handle-done="handleDone"
                @handle-cancel="handleCancel"
              />

              <div class="mt-8">
                ``
                <el-button
                  :disabled="!selectedCard"
                  :loading="loading"
                  class="btn btn-primary w-full hover:!text-white"
                  @click="confirmPlan()"
                >
                  Pay & Upgrade
                </el-button>
              </div>
            </template>

            <!-- Confirmation -->
            <template v-if="step===3">
              <div class="setting-wrapper p-8 !mb-8 text-center">
                <img
                  src="~/assets/images/icons/CheckCircle.svg"
                  class="mx-auto"
                >
                <div class="text-black font-bold text-head-4 mt-1">
                  {{ $t('data.billing.payment_success') }}
                </div>
                <div
                  class="mt-3"
                  v-html="$t('data.billing.thankyou')"
                />
                <div class="mt-6">
                  <button
                    class="btn btn-primary"
                    @click="$router.push(localeRoute({name: 'vault'}))"
                  >
                    {{ $t('data.billing.back_to_home') }}
                  </button>
                </div>
              </div>
              <div class="setting-wrapper">
                <div class="setting-section">
                  <div class="setting-section-header">
                    <div class="text-head-5 font-semibold">{{ $t('data.plans.order_summary') }}</div>
                  </div>
                </div>
                <div class="setting-section">
                  <div class="setting-section-header">
                    <div>
                      <div class="setting-title">{{ getPlanName(selectedPlan.name).name }} <span v-if="currentPlan.personal_trial_applied === false">({{ $t('data.plans.trial_included') }})</span></div>
                      <div class="setting-description">{{ $t(`data.plans.price.${selectedPeriod.label}`) }}</div>
                    </div>
                    <div>
                      <div class="font-semibold">
                        {{ result.price | formatNumber }} {{ result.currency }}
                      </div>
                    </div>
                  </div>
                  <div
                    v-if="result.discount !== 0"
                    class="setting-section-header text-primary mt-4"
                  >
                    <div>
                      <div class="setting-title">Discount</div>
                    </div>
                    <div>
                      <div class="font-semibold">
                        -{{ result.discount | formatNumber }} {{ result.currency }}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="setting-section">
                  <div class="setting-section-header">
                    <div>
                      <div class="setting-title">{{ $t('data.billing.total') }}</div>
                    </div>
                    <div class="font-semibold">
                      {{ result.immediate_payment | formatNumber }} {{ result.currency }}
                    </div>
                  </div>
                </div>
              </div>
              <div
                id="import"
                class="text-[20px] font-semibold mb-4"
              >
                {{ $t('data.billing.billing_contact') }}
              </div>
              <div class="setting-wrapper">
                <div class="setting-section">
                  <div>
                    <div class="setting-title">{{ $t('common.name') }}</div>
                    <div class="setting-description">{{ billing.name }}</div>
                  </div>
                  <div
                    v-if="billing.email"
                    class="mt-4"
                  >
                    <div class="setting-title">{{ $t('common.email') }}</div>
                    <div class="setting-description">{{ billing.email }}</div>
                  </div>
                  <div
                    v-if="billing.company"
                    class="mt-4"
                  >
                    <div class="setting-title">{{ $t('common.name') }}</div>
                    <div class="setting-description">{{ billing.company }}</div>
                  </div>
                </div>
              </div>
              <div
                id="import"
                class="text-[20px] font-semibold mb-4"
              >
                {{ $t('data.billing.billing_address') }}
              </div>
              <div class="setting-wrapper">
                <div class="setting-section">
                  <div v-if="billing.address">
                    <div class="setting-title">{{ $t('common.address') }}</div>
                    <div class="setting-description">{{ billing.address }}</div>
                  </div>
                  <div
                    v-if="billing.address_city"
                    class="mt-4"
                  >
                    <div class="setting-title">{{ $t('common.city') }}</div>
                    <div class="setting-description">{{ billing.address_city }}</div>
                  </div>
                  <div
                    v-if="billing.address_country"
                    class="mt-4"
                  >
                    <div class="setting-title">{{ $t('common.country') }}</div>
                    <div class="setting-description">{{ billing.address_country }}</div>
                  </div>
                  <div
                    v-if="billing.address_zip"
                    class="mt-4"
                  >
                    <div class="setting-title">{{ $t('common.zip') }}</div>
                    <div class="setting-description">{{ billing.address_zip }}</div>
                  </div>
                </div>
              </div>
            </template>
            <el-dialog
              :visible.sync="dialogEnterMembers"
              width="675px"
              destroy-on-close
              top="15vh"
              custom-class="locker-dialog"
              :close-on-click-modal="false"
              :close-on-press-escape="false"
            >
              <div class="text-left">
                <div class="form-group flex justify-between">
                  <label for="">{{ $t('data.members.enter_email') }}</label>
                </div>
                <InputText
                  v-model="emails"
                  label="Emails"
                  class="w-full"
                  :error-text="errors.family_members && errors.family_members[0]"
                />
                <div class="!break-words !whitespace-normal font-normal text-black-500 mb-3 italic">
                  {{ $t(`data.members.invite_member.description`) }}
                </div>
              </div>
              <div
                slot="footer"
                class="dialog-footer flex items-center text-left"
              >
                <div class="flex-grow" />
                <div>
                  <button
                    class="btn btn-default"
                    @click="dialogEnterMembers = false"
                  >
                    Cancel
                  </button>
                  <button
                    class="btn btn-primary"
                    :disabled="loading"
                    @click="confirmPlan"
                  >
                    Save
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
                  <button
                    class="btn btn-default w-full"
                    @click="dialogThank = false"
                  >
                    {{ $t('common.close') }}
                  </button>
                </div>
              </div>
            </el-dialog>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import debounce from 'lodash/debounce'
import find from 'lodash/find'
import HeaderPayment from '../components/HeaderPayment'
import Check from '~/components/icons/check'
import InputText from '~/components/input/InputText'
import Payment from '~/components/upgrade/Payment'
export default {
  components: { Check, Payment, InputText, HeaderPayment },
  layout: 'blank',
  middleware: ['NotHaveAccountService'],
  data () {
    return {
      step: 1,
      plans: [],
      features: {
        pm_free: [
          'secure_data',
          'sync_devices',
          'auto_fill',
          'biometric_login',
          'password_generator'
        ],
        pm_premium: [
          'free_features',
          'unlimited_storage',
          'password_health',
          'data_breach',
          'emergency_access',
          'share_passwords'
        ],
        pm_family: [
          'free_features',
          'unlimited_storage',
          'password_health',
          'data_breach',
          'emergency_access',
          'share_passwords'
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
      paymentVisible: false,
      dialogEnterMembers: false,
      emails: [],
      inputEmail: '',
      family_members: [],
      errors: {}
    }
  },
  head () {
    return {
      script: [
        { src: 'https://js.stripe.com/v3/' }
      ]
    }
  },
  computed: {
    nextBill () {
      const now = new Date().getTime()
      const nextBill = this.result.next_billing_time ? this.$moment(this.result.next_billing_time * 1000).format('DD MMM YYYY') : this.result.duration === 'yearly' ? this.$moment(now).add(1, 'years').format('DD MMM YYYY') : this.$moment(now).add(1, 'months').format('DD MMM YYYY')
      return nextBill
    },
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
    },
    billing () {
      return this.cards.find(item => item.id_card === this.selectedCard)
    },
    trialLeft () {
      const now = this.$moment()
      return this.$moment(this.currentPlan.next_billing_time * 1000).diff(now, 'days')
    }
  },
  beforeDestroy () {
    clearInterval(this.intervalBalance)
  },
  mounted () {
    this.getPlans()
    this.getCards()
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
      this.paymentVisible = false
      this.getCards()
      this.$nextTick(() => {
        this.selectedCard = card.id_card
      })
    },
    async getCards () {
      this.cards = await this.$axios.$get('cystack_platform/payments/cards')
    },
    calcPrice: debounce(function () {
      // const currency = this.paymentMethod === 'card' ? 'USD' : 'VND'
      const currency = 'USD'
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
            this.notify(this.$t('data.notifications.error_occurred'), 'warning')
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
    selectPlan (plan, purchase = false) {
      this.$confirm(purchase ? this.$t('data.notifications.purchase_plan', { duration: this.periodSwitch ? `1 ${this.$t('common.year')}` : `1 ${this.$t('common.month')}` }) : this.$t('data.notifications.switch_plan', { currentPlan: this.currentPlan.name, chosenPlan: plan.name }), this.$t('common.warning'), {
        confirmButtonText: this.$t('common.proceed'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(() => {
        this.selectedPlan = plan
        if (this.currentPlan.alias !== 'pm_free') {
          this.dialogChange = true
          if (this.currentPlan.alias === 'pm_family') {
            this.number_members = 6
          }
        } else {
          this.number_members = 1
        }
        this.selectMethod('card')
        this.calcPrice()
        this.step = 2
      })
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
        this.family_members = this.selectedPlan.alias === 'pm_family' ? this.family_members : []
        const data = await this.$axios.$post('cystack_platform/pm/payments/plan', {
          plan_alias: this.selectedPlan.alias,
          duration: this.selectedPeriod.duration,
          payment_method: this.paymentMethod,
          id_card: this.selectedCard,
          promo_code: this.promo_code,
          number_members: this.number_members,
          family_members: this.family_members,
          bank_id: this.bank.id
        })
        this.$store.dispatch('LoadCurrentPlan')
        this.step = 3
        this.dialogChange = false
        if (this.paymentMethod === 'banking') {
          this.order = data
          this.dialogTransfer = true
        } else {
          this.notify(this.$t('data.notifications.upgrade_success'), 'success')
        }
      } catch (e) {
        console.log(e)
        this.notify(this.$t('data.notifications.error_occurred'), 'warning')
      } finally {
        this.loading = false
      }
    },
    postDeposit (order) {
      this.$axios.$post(`cystack_platform/pm/payments/invoices/${order.payment_id}/processing`)
        .then(res => {
          this.dialogTransfer = false
          this.dialogThank = true
        })
    },
    // toStep2 () {
    //   this.step = 2
    //   this.dialogEnterMembers = false
    //   this.family_members = this.emails.split(',').map(item => item.trim()).filter(item => item.length)
    //   this.selectMethod('card')
    // },
    addMember () {
      this.dialogEnterMembers = true
    },
    handleInputEmail () {
      const emailList = this.inputEmail.split(',')
      emailList.forEach(email => {
        email = email.trim()
        if (email && this.validateEmail(email) && !this.emails.includes(email)) {
          this.emails.push(email)
          this.inputEmail = ''
        }
      })
    },
    handleClose (index) {
      this.emails.splice(index, 1)
    },
    // emailInput (value) {
    //   const lastChar = value.substr(value.length - 1)
    //   if ([',', ' '].includes(lastChar)) {
    //     this.handleInputEmail()
    //   }
    // },
    emailInput (value) {
      this.inputEmail = value
      const lastChar = value.substr(value.length - 1)
      if ([',', ' '].includes(lastChar)) {
        this.handleInputEmail()
      }
    },
    confirmInputEmail () {
      this.emails.forEach(email => {
        if (!this.family_members.includes(email)) {
          if (this.family_members.length === 5) {
            this.notify(this.$t('errors.7012'), 'warning')
            return
          }
          this.family_members.push(email)
        }
      })
      const emailList = this.inputEmail.split(',')
      emailList.forEach(email => {
        email = email.trim()
        if (email && this.validateEmail(email)) {
          if (this.family_members.length === 5) {
            this.notify(this.$t('errors.7012'), 'warning')
            return
          }
          if (!this.family_members.includes(email)) {
            this.family_members.push(email)
          }
          this.inputEmail = ''
        } else if (email && !this.validateEmail(email)) {
          this.notify('Invalid email', 'warning')
        }
      })
      this.emails = []
    },
    removeMember (index) {
      this.family_members.splice(index, 1)
    },
    discountPercentage (plan) {
      const fullPrice = plan.price.usd * 12
      const discount = fullPrice - plan.yearly_price.usd
      const discountPercentage = discount * 100 / fullPrice
      if (!Number.isNaN(discountPercentage)) {
        return Math.ceil(discountPercentage)
      }
      return 0
    },
    async startTrial (plan) {
      try {
        await this.$axios.$post('cystack_platform/pm/payments/trial', { trial_plan: plan.alias })
        this.$store.dispatch('LoadCurrentPlan')
        this.notify(this.$t('data.notifications.upgrade_success'), 'success')
      } catch (error) {
        this.notify(this.$t('data.notifications.error_occurred'), 'warning')
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.input-tags .el-input-group__prepend {
  @apply p-0 bg-white;
}
/* .input-tags .el-input__inner{
  @apply border-l-0;
}
.el-input__inner:focus ~ .el-input-group__prepend {
  @apply border-primary;
  background-color: black !important;
} */
.cs-field {
  //width: 100%;
  min-height: 40px;
  display: flex;
  padding-left: 12px;
  position: relative;
  border-radius: 2px;
  border: solid 1px #e6e8f4;
  &.is-hover, &.is-focus {
    @apply border-primary bg-white;
    label {
      @apply text-primary
    }
  }
  &.is-error {
    @apply border-danger mb-8 last:mb-8 #{!important};
    label, .cs-helper-text {
      @apply text-danger
    }
  }
  &.is-password.is-focus, &.is-password.have-value {
    button.btn {
      @apply absolute p-0.5;
      top: 19px;
      right: 13px;
    }
    .cs-input {
      padding-right: 48px;
    }
  }
  &.is-focus label, &.have-value label {
    font-size: 12px;
    line-height: 19px;
    top: 5px;
    left: 11px;
  }
  &.is-focus .cs-textarea, &.have-value .cs-textarea {
    padding-top: 8px;
    margin-top: 8px;
  }
  &.is-disabled {
    cursor: not-allowed;
    input, button, input:hover, button:hover {
      cursor: not-allowed!important;
      user-select: none;
    }
  }
  .cs-input, .cs-textarea {
    align-self: center;
    padding-left: 2px !important;
    width: 100%;
    padding-bottom: 0px;
    padding-top: 0px;
    font-size: 14px;
    line-height: 19px;
    border: none;
    flex: 1;
    color: #161922;
    height: 32px;
    background-color: inherit;
    min-width: 150px;
  }
  .input-tags {
    flex-grow: 1;
    display: flex;
    flex-wrap: wrap;
    align-self: center;
    gap: 2px;
    padding: 2px 0px;
  }
}
</style>
