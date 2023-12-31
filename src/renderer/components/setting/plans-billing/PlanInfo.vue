<template>
  <div class="mb-6">
    <el-collapse v-model="activeNames" class="setting-wrapper">
      <el-collapse-item name="1" class="border-black-50 border rounded">
        <template slot="title">
          <!-- Plan info -->
          <div
            class="flex justify-between w-full mr-6 ml-4 items-center py-8 flex-wrap"
          >
            <div class="text-head-5 font-semibold text-black">
              {{ $t('common.plan') }}: {{ currentPlan.name }}
            </div>
            <!-- Free plan -->
            <button
              v-if="isFreePlan"
              class="btn btn-primary my-2 sm:mt-0"
              @click="buyPremium()"
            >
              <div class="flex">
                <div class="mr-2">
                  <img src="~/assets/images/icons/flash_white.svg" alt="">
                </div>
                <div>
                  {{ $t('data.billing.buy_premium') }}
                </div>
              </div>
            </button>
            <!-- Free plan end -->

            <!-- Lifetime plan -->
            <div v-else-if="isLifeTime">
              <div />
            </div>
            <!-- Lifetime plan end -->

            <!-- Other plans -->
            <div v-else>
              <div>
                <div class="text-black-600 mb-1.5">
                  {{
                    currentPlan.cancel_at_period_end
                      ? $t('data.billing.cancel_at_period_end')
                      : $t('data.billing.next_billing')
                  }}:&nbsp;
                  <span class="font-semibold">
                    {{
                      currentPlan.next_billing_time
                        ? $moment(currentPlan.next_billing_time * 1000).format(
                          'LLL'
                        )
                        : 'N/A'
                    }}
                  </span>
                </div>
                <button
                  v-if="
                    currentPlan.next_billing_time &&
                      !currentPlan.cancel_at_period_end
                  "
                  class="btn btn-default float-right"
                  @click="cancelSub"
                >
                  {{ $t('data.billing.cancel_subscription') }}
                </button>
              </div>
            </div>
            <!-- Other plans end -->
          </div>
          <!-- Plan info end -->
        </template>

        <!-- Storage -->
        <div class="setting-section !border-t">
          <div class="grid grid-cols-1 sm:grid-cols-2">
            <!-- Left -->
            <div>
              <div class="setting-title mb-1">
                {{ $t('data.settings.plan_storage') }}
              </div>
              <div class="setting-description mb-3 sm:mb-0">
                {{ $t('data.settings.plan_storage_desc') }}
              </div>
            </div>
            <!-- Left -->

            <!-- Right limited -->
            <div v-if="isFreePlan">
              <template v-if="itemsStorage">
                <div v-for="(item, index) in itemsStorage" :key="index">
                  <div
                    class="flex justify-between"
                    :class="{ 'mt-4': index !== 0 }"
                  >
                    <div>
                      {{ $tc(`type.${item.type}`, 2) }}
                    </div>
                    <div>{{ item.total }}/{{ item.limit }}</div>
                  </div>
                  <el-progress
                    :show-text="false"
                    :percentage="(item.total * 100) / item.limit"
                    :status="getPercentageStatus(item.total / item.limit)"
                  />
                </div>
              </template>
            </div>
            <!-- Right limited end -->

            <!-- Right unlimited -->
            <div v-else class="sm:text-right font-semibold">
              {{ $t('common.unlimited') }}
            </div>
            <!-- Right unlimited end -->
          </div>
        </div>
        <!-- Storage end -->

        <!-- Utilities -->
        <div class="setting-section">
          <div class="setting-section-header">
            <div>
              <div class="setting-title">
                {{ $t('data.settings.utilities') }}
              </div>
            </div>
          </div>

          <div
            v-for="(item, index) in premiumFeatures.filter(
              item => !item.hidden
            )"
            :key="index"
            class="flex flex-col sm:flex-row items-center w-full border-b border-black-100 py-6"
          >
            <img
              :src="
                require(`~/assets/images/pages/settings/plans-billing/${item.img}`)
              "
              alt=""
              class="sm:mr-4 mr-0 h-[62px] mb-4 sm:mb-0"
            >

            <div class="flex-1 text-center sm:text-left">
              <div
                class="flex flex-wrap items-center mb-3 flex-col sm:flex-row"
              >
                <p
                  class="setting-title"
                  :class="{
                    'text-[#A5ABB3]': !item.active,
                    'mr-0 sm:mr-3 mb-2 sm:mb-0': !!item.label
                  }"
                >
                  {{ $t(`data.settings.extra_features.${item.i18nKey}.title`) }}
                </p>
                <div
                  v-if="!!item.label"
                  class="text-white font-semibold px-3 bg-black rounded"
                >
                  {{ item.label }}
                </div>
              </div>
              <p
                class="mb-4 setting-description"
                :class="!item.active ? '!text-[#A5ABB3]' : ''"
              >
                {{ $t(`data.settings.extra_features.${item.i18nKey}.desc`) }}
              </p>
              <a
                v-if="
                  !!$t(
                    `data.settings.extra_features.${item.i18nKey}.learn_more.url`
                  )
                "
                :href="
                  $t(
                    `data.settings.extra_features.${item.i18nKey}.learn_more.url`
                  ) || '#'
                "
                target="_blank"
                class="font-semibold"
              >{{
                 $t(
                   `data.settings.extra_features.${item.i18nKey}.learn_more.text`
                 )
               }}
                <i class="el-icon-right" /></a>
            </div>

            <button
              class="btn btn-primary ml-0 sm:ml-3 min-w-[220px] mt-4 sm:mt-0"
              @click="item.button.action"
            >
              <div class="flex justify-center items-center">
                <div class="mr-2">
                  <img
                    :src="
                      require(`~/assets/images/icons/pages/settings/${
                        item.button.icon || 'flash_white'
                      }.svg`)
                    "
                    alt=""
                    class="h-3"
                  >
                </div>
                <div>
                  {{
                    $t(`data.settings.extra_features.${item.i18nKey}.btn_text`)
                  }}
                </div>
              </div>
            </button>
          </div>
        </div>
        <!-- Utilities end -->
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script>
export default {
  data () {
    return {
      activeNames: ['1']
    }
  },
  computed: {
    currentPlan () {
      return this.$store.state.currentPlan
    },
    isFreePlan () {
      return this.currentPlan.alias === 'pm_free'
    },
    isPremiumPlan () {
      return this.currentPlan.alias === 'pm_premium'
    },
    isFamilyPlan () {
      return this.currentPlan.alias === 'pm_family'
    },
    isLifeTime () {
      return this.isLifeTimeUser
    },
    itemsStorage () {
      const planLimit = this.$store.state.itemsCount.plan_limit || {}
      const ciphersCount = this.$store.state.itemsCount.ciphers || {}

      const res = this.cipherTypesList
        .filter(c => !!c.freeLimit && !c.revertToNote)
        .map(c => ({
          type: c.type,
          limit: planLimit[c.type] || c.freeLimit,
          total: ciphersCount[c.type] || 0
        }))

      // Private email
      res.push({
        type: 'private_email',
        limit: planLimit.relay_addresses || 5,
        total: this.$store.state.itemsCount.relay_addresses?.total || 0
      })

      return res
    },
    premiumFeatures () {
      return [
        {
          img: 'feat-1.svg',
          i18nKey: 'feat1',
          hidden: !this.isFreePlan,
          button: {
            icon: '',
            action: () => {
              this.buyPremium()
            }
          }
        },
        {
          img: 'feat-2.svg',
          i18nKey: 'feat2',
          active: !this.isFreePlan,
          button: {
            icon: 'share',
            action: () => {
              if (this.isFreePlan) {
                this.buyPremium()
                return
              }
              this.$router.push(this.localeRoute('/shares/your-shares'))
            }
          }
        },
        {
          img: 'feat-3.svg',
          i18nKey: 'feat3',
          active: !this.isFreePlan,
          button: {
            icon: 'add',
            action: () => {
              if (this.isFreePlan) {
                this.buyPremium()
                return
              }
              this.$router.push(
                this.localeRoute('/settings/security#emergency-access')
              )
            }
          }
        },
        {
          img: 'feat-4.svg',
          i18nKey: 'feat4',
          active: !this.isFreePlan,
          button: {
            icon: 'check_circle',
            action: () => {
              if (this.isFreePlan) {
                this.buyPremium()
                return
              }
              this.$router.push(this.localeRoute('/tools/breach'))
            }
          }
        },
        {
          img: 'feat-5.svg',
          i18nKey: 'feat5',
          active: !this.isFreePlan,
          button: {
            icon: 'magnify',
            action: () => {
              if (this.isFreePlan) {
                this.buyPremium()
                return
              }
              this.$router.push(this.localeRoute('/tools/password-health'))
            }
          }
        },
        {
          img: 'feat-6.svg',
          i18nKey: 'feat6',
          active: !this.isFreePlan,
          button: {
            icon: 'email',
            action: () => {
              if (this.isFreePlan) {
                this.buyPremium()
                return
              }
              this.$router.push(this.localeRoute('/relay'))
            }
          }
        },
        {
          img: 'feat-7.svg',
          i18nKey: 'feat7',
          hidden: !this.isFreePlan,
          button: {
            icon: '',
            action: () => {
              this.buyPremium()
            }
          }
        },
        {
          img: 'feat-8.svg',
          i18nKey: 'feat8',
          label: 'FAMILY',
          active: this.isFamilyPlan,
          button: {
            icon: 'users_group',
            action: () => {
              if (!this.isFamilyPlan) {
                this.buyPremium('pm_family')
                return
              }
              this.$router.push(this.localeRoute('/settings/manage-member'))
            }
          }
        }
      ]
    }
  },

  methods: {
    getPercentageStatus (percentage) {
      if (percentage > 0.8) {
        return 'exception'
      }
      if (percentage > 0.5) {
        return 'warning'
      }
      return 'success'
    },

    buyPremium (plan = 'pm_premium') {
      this.$router.push(
        this.localeRoute({
          name: 'manage-plans',
          query: {
            plan
          }
        })
      )
    },

    cancelSub () {
      this.$confirm(
        this.$t('data.billing.confirm_unsubscribe', {
          date: this.$moment(this.currentPlan.next_billing_time * 1000).format(
            'LL'
          )
        }),
        this.$t('data.billing.cancel_subscription'),
        {
          confirmButtonText: 'OK',
          cancelButtonText: this.$t('common.cancel'),
          type: 'warning'
        }
      )
        .then(() => {
          this.$axios
            .$post('cystack_platform/pm/payments/plan/cancel')
            .then(() => {
              this.notify(
                this.$t('data.billing.unsubscribe_success', {
                  date: this.$moment(
                    this.currentPlan.next_billing_time * 1000
                  ).format('LL')
                }),
                'success'
              )
              this.$store.dispatch('LoadCurrentPlan')
            })
            .catch(() => {
              this.notify(this.$t('data.billing.subscribe_failed'), 'warning')
            })
        })
        .catch(() => {})
    }
  }
}
</script>
