<template>
  <div class="flex flex-col flex-column-fluid relative bg-[#FBFBFC]">
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
          <div class="mb-6">
            <template v-if="step===1">
              <div class="text-head-3 font-semibold mb-2">
                {{ $t('data.plans.choose_plan') }}
              </div>
              <div class="mb-8">{{ $t('data.plans.choose_plan_desc') }}</div>
              <div class="flex">
                <!-- <div class="font-semibold mr-3">Monthly</div>
                <el-switch v-model="periodSwitch" small @change="calcPrice" />
                <div class="font-semibold ml-3">Yearly</div> -->
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
            <!-- <template v-if="step===3">
              <div class="text-head-3 font-semibold mb-2">
                Confirmation
              </div>
              <div class="mb-2">Your order has been confirmed!</div>
            </template> -->
          </div>
          <!-- Step title end-->

          <!-- Choose a plan -->
          <template v-if="step===1">
            <div class="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-x-6 gap-y-3">
              <div
                v-for="item in plans"
                :key="item.id"
                :class="selectedPlan.alias===item.alias?'!border-primary':''"
                class="p-8 border border-black-200 rounded cursor-pointer hover:border-primary relative"
              >
                <!-- @click="item.alias !=='pm_free' && currentPlan.alias !== 'pm_family' && currentPlan.alias!==item.alias?selectPlan(item):''" -->
                <div class="flex flex-col mb-6">
                  <div class="2xl:flex items-center text-center justify-center">
                    <!-- <span class="label label-black tracking-[1px] font-semibold uppercase !text-xs">
                      {{ getPlanName(item.name).name }}
                    </span> -->
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
                        <!-- <template v-if="language==='vi'">
                          <span :class="periodSwitch?'line-through text-sm text-black':'text-head-3 font-semibold'">đ{{ item.price.vnd | formatNumber }}</span>
                          <span v-if="periodSwitch" class="text-head-3 font-semibold">đ{{ (item.yearly_price.vnd / 12) | formatNumber }}</span>
                        </template> -->
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
                        {{ $t('data.plans.price_12months') }} ${{ item.price.usd * 12 }} <span class="py-[1px] px-2 bg-primary text-white rounded-[20px]">{{ $t('data.plans.save') }} {{ discountPercentage(item) }}%</span>
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
                <div class="absolute bottom-4 w-full pr-16">
                  <button
                    :class="currentPlan.alias === item.alias? 'btn-default' : 'btn-primary'"
                    class="btn text-center w-full"
                    :disabled="item.alias==='pm_free' || currentPlan.alias==='pm_family' || currentPlan.alias==='pm_premium' && item.alias==='pm_family'"
                    @click="item.alias !=='pm_free' && currentPlan.alias !== 'pm_family' && currentPlan.alias!==item.alias?selectPlan(item):''"
                  >
                    {{ currentPlan.alias === item.alias? $t('data.plans.current_plan') : $t('data.plans.choose_plan') }}
                  </button>
                </div>
              </div>
            </div>
          </template>

          <!-- Payment -->
          <template v-if="step===2">
            <div class="setting-wrapper">
              <div class="setting-section">
                <div class="setting-section-header">
                  <div class="text-[20px] font-semibold">{{ $t('data.plans.order_summary') }}</div>
                </div>
              </div>
              <div class="setting-section">
                <div class="setting-section-header">
                  <div>
                    <div class="setting-title">{{ getPlanName(selectedPlan.name).name }}</div>
                    <div class="setting-description">{{ $t(`data.plans.price.${selectedPeriod.label}`) }}</div>
                  </div>
                  <div>
                    <div class="font-semibold">
                      {{ result.price | formatNumber }} {{ result.currency }}
                    </div>
                    <!-- <div v-else-if="result.plan" class="font-semibold">
                      {{ result.currency === 'USD'?result.plan.price.usd*12:result.plan.price.vnd*12 | formatNumber }} {{ result.currency }}
                    </div> -->
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
              <div class="setting-section">
                <div class="setting-section-header">
                  <div>
                    <div class="setting-title">{{ $t('data.billing.total') }}</div>
                    <div class="setting-description">
                      <ul class="mb-3">
                        <!-- <li v-html="this.$t('data.billing.plan_details[0]', {total:this.result.total_price || 0, currency:this.result.currency || 'USD'})" /> -->
                        <li v-html="$t('data.billing.plan_details[1]', {duration:result.duration || 'yearly', price:result.price || 0, currency:result.currency || 'USD', next_bill:nextBill||''})" />
                        <li>{{ $t('data.billing.plan_details[2]') }}</li>
                      </ul>
                    </div>
                  </div>
                  <div class="font-semibold">
                    {{ result.immediate_payment | formatNumber }} {{ result.currency }}
                  </div>
                </div>
              </div>
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
                  <div class="flex input-tags">
                    <el-input
                      v-model="inputEmail"
                      change="mr-2"
                      @keyup.enter.native="confirmInputEmail"
                      @input="emailInput"
                    >
                      <div
                        v-if="emails.length"
                        slot="prepend"
                      >
                        <el-tag
                          v-for="(email, index) in emails"
                          :key="email"
                          closable
                          type="info"
                          @close="handleClose(index)"
                        >
                          {{ email }}
                        </el-tag>
                      </div>
                      <el-button
                        slot="append"
                        :disabled="!emails.length && !inputEmail"
                        @click="confirmInputEmail"
                      >
                        {{ $t('common.add') }}
                      </el-button>
                    </el-input>
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
              <!-- <button :disabled="step===2 && !selectedCard || step===1 && !selectedPlan.alias || step ===3" class="btn btn-primary w-full" @click="step===1?selectedPlan.alias==='pm_family'?addMember():toStep2():confirmPlan()">
                {{ step===1?'Continue': 'Pay & Upgrade' }}
              </button> -->
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
              <!-- <div class="text-black font-bold mb-2">Order details</div>
              <div class="flex justify-between text-head-6 font-semibold">
                <div>
                  {{ selectedPlan.name }} ( {{ result.duration==='yearly'?'12 months':'1 month' }})
                </div>
                <div>
                  {{ result.total_price }} {{ result.currency }}
                </div>
              </div> -->
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
                    <div class="setting-title">{{ getPlanName(selectedPlan.name).name }}</div>
                    <div class="setting-description">{{ $t(`data.plans.price.${selectedPeriod.label}`) }}</div>
                  </div>
                  <div>
                    <div class="font-semibold">
                      {{ result.price | formatNumber }} {{ result.currency }}
                    </div>
                    <!-- <div v-else-if="result.plan" class="font-semibold">
                      {{ result.currency === 'USD'?result.plan.price.usd*12:result.plan.price.vnd*12 | formatNumber }} {{ result.currency }}
                    </div> -->
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
          <!-- <div v-if="step!==3">
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
                  <div v-if="result.duration === 'monthly'" class="font-semibold">
                    {{ result.price | formatNumber }} {{ result.currency }}
                  </div>
                  <div v-else-if="result.plan" class="font-semibold">
                    {{ result.currency === 'USD'?result.plan.price.usd*12:result.plan.price.vnd*12 | formatNumber }} {{ result.currency }}
                  </div>
                </div>
                <div v-if="result.duration && result.duration==='yearly' && result.plan" class="flex items-center justify-between text-primary">
                  <div>
                    {{ $t('data.billing.yearly_discount', {discount: discountPercentage + '%'}) }}
                  </div>
                  <div class="font-semibold">
                    -{{ result.currency === 'USD'?(result.plan.price.usd*12-result.price):(result.plan.price.vnd*12-result.price) | formatNumber }} {{ result.currency }}
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
                    <li v-html="this.$t('data.billing.plan_details[0]', {total:this.result.total_price || 0, currency:this.result.currency || 'USD'})">
                    </li>
                    <li v-html="this.$t('data.billing.plan_details[1]', {duration:this.result.duration || 'yearly', price:this.result.price || 0, currency:this.result.currency || 'USD', next_bill:this.nextBill||''})">
                    </li>
                    <li>You can cancel any time before this date.</li>
                  </ul>
                  <button :disabled="step===2 && !selectedCard || step===1 && !selectedPlan.alias || step ===3" class="btn btn-primary w-full" @click="step===1?selectedPlan.alias==='pm_family'?addMember():toStep2():confirmPlan()">
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
            </div> -->
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
</template>

<script>
import debounce from 'lodash/debounce'
import find from 'lodash/find'
import numeral from 'numeral'
import Payment from '../../components/upgrade/Payment'
import Check from '../../components/icons/check'
import InputText from '../../components/input/InputText'
export default {
  components: { Check, Payment, InputText },
  data () {
    return {
      step: 1,
      plans: [],
      features: {
        pm_free: [
          'secure_data',
          'auto_fill',
          'password_generator',
          'sync_devices'
        ],
        pm_premium: [
          'unlimited_storage',
          'data_breach',
          'emergency_access',
          'share_passwords'
        ],
        pm_family: [
          'unlimited_storage',
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
    // async genOrgKey () {
    //   const shareKey = await this.$cryptoService.makeShareKey()
    //   const orgKey = shareKey[0].encryptedString
    //   const collection = await this.$cryptoService.encrypt('defaultCollection', shareKey[1])
    //   const collectionName = collection.encryptedString
    //   console.log('orgKey', orgKey)
    //   console.log('collectionName', collectionName)
    // },
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
        // this.selectPeriod(find(this.periods, e => e.duration === this.currentPlan.duration))
        if (this.currentPlan.alias === 'pm_family') {
          this.number_members = 6
        }
      } else {
        this.number_members = 1
        // this.step = 2
        // this.selectPeriod(this.selectPeriod)
      }
      this.selectMethod('card')
      this.calcPrice()
      this.step = 2
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
        this.family_members = this.selectedPlan.alias === 'pm_family' ? this.family_members : []
        const data = await this.$axios.$post('cystack_platform/pm/payments/plan', {
          plan_alias: this.selectedPlan.alias,
          duration: this.selectedPeriod.duration,
          payment_method: this.paymentMethod,
          id_card: this.selectedCard,
          promo_code: this.promo_code,
          number_members: this.number_members,
          key: orgKey,
          collection_name: collectionName,
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
          this.notify('Nâng cấp thành công', 'success')
        }
      } catch {
        this.notify('Có lỗi xảy ra. Vui lòng thử lại', 'warning')
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
    emailInput (value) {
      const lastChar = value.substr(value.length - 1)
      if ([',', ' '].includes(lastChar)) {
        this.handleInputEmail()
      }
    },
    confirmInputEmail () {
      this.emails.forEach(email => {
        if (!this.family_members.includes(email)) {
          if (this.family_members.length === 5) {
            this.notify('You can\'t add more than 5 accounts.', 'warning')
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
            this.notify('You can\'t add more than 5 accounts.', 'warning')
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
        return numeral(discountPercentage).format('0,0')
      }
      return 0
    }
  }
}
</script>
<style>
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
</style>
