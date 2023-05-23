<template>
  <div class="flex-column-fluid lg:px-28 py-10 px-10 mb-20">
    <div class="flex mb-5">
      <div class="w-full">
        <!-- Confirmation -->
        <div class="setting-wrapper p-8 !mb-8 text-center">
          <img src="~/assets/images/icons/CheckCircle.svg" class="mx-auto">
          <div class="text-black font-bold text-head-4 mt-1">
            {{ $t('data.billing.payment_success') }}
          </div>
          <div class="mt-3" v-html="$t('data.billing.thankyou')" />
          <div class="mt-6">
            <button
              class="btn btn-primary"
              @click="$router.push(localeRoute({ name: 'vault' }))"
            >
              {{ $t('data.billing.back_to_home') }}
            </button>
          </div>
        </div>
        <div class="setting-wrapper">
          <div class="setting-section">
            <div class="setting-section-header">
              <div class="text-head-5 font-semibold">
                {{ $t('data.plans.order_summary') }}
              </div>
            </div>
          </div>
          <div class="setting-section">
            <div class="setting-section-header">
              <div>
                <div class="setting-title">
                  {{ getPlanName(selectedPlan.name).name }}
                  <span v-if="currentPlan.personal_trial_applied === false">({{ $t('data.plans.trial_included') }})</span>
                </div>
                <div class="setting-description">
                  {{ $t(`data.plans.price.${selectedPeriod.label}`) }}
                </div>
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
                  -{{ result.discount | formatNumber }}
                  {{ result.currency }}
                </div>
              </div>
            </div>
          </div>
          <div class="setting-section">
            <div class="setting-section-header">
              <div>
                <div class="setting-title">
                  {{ $t('data.billing.total') }}
                </div>
              </div>
              <div class="font-semibold">
                {{ result.immediate_payment | formatNumber }}
                {{ result.currency }}
              </div>
            </div>
          </div>
        </div>
        <div id="import" class="text-[20px] font-semibold mb-4">
          {{ $t('data.billing.billing_contact') }}
        </div>
        <div class="setting-wrapper">
          <div class="setting-section">
            <div>
              <div class="setting-title">{{ $t('common.name') }}</div>
              <div class="setting-description">{{ billing.name }}</div>
            </div>
            <div v-if="billing.email" class="mt-4">
              <div class="setting-title">{{ $t('common.email') }}</div>
              <div class="setting-description">{{ billing.email }}</div>
            </div>
            <div v-if="billing.company" class="mt-4">
              <div class="setting-title">{{ $t('common.name') }}</div>
              <div class="setting-description">{{ billing.company }}</div>
            </div>
          </div>
        </div>
        <div id="import" class="text-[20px] font-semibold mb-4">
          {{ $t('data.billing.billing_address') }}
        </div>
        <div class="setting-wrapper">
          <div class="setting-section">
            <div v-if="billing.address">
              <div class="setting-title">{{ $t('common.address') }}</div>
              <div class="setting-description">{{ billing.address }}</div>
            </div>
            <div v-if="billing.address_city" class="mt-4">
              <div class="setting-title">{{ $t('common.city') }}</div>
              <div class="setting-description">
                {{ billing.address_city }}
              </div>
            </div>
            <div v-if="billing.address_country" class="mt-4">
              <div class="setting-title">{{ $t('common.country') }}</div>
              <div class="setting-description">
                {{ billing.address_country }}
              </div>
            </div>
            <div v-if="billing.address_zip" class="mt-4">
              <div class="setting-title">{{ $t('common.zip') }}</div>
              <div class="setting-description">
                {{ billing.address_zip }}
              </div>
            </div>
          </div>
        </div>
        <!-- Confirmation end -->
      </div>
    </div>
  </div>
</template>
