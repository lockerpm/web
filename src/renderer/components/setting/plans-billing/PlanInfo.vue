<template>
  <div class="mb-6">
    <el-collapse class="setting-wrapper">
      <el-collapse-item name="1">
        <template slot="title">
          <!-- Plan info -->
          <div
            class="flex justify-between w-full mr-6 ml-4 items-center py-8 flex-wrap"
          >
            <div class="text-head-5 font-semibold text-black">
              {{ currentPlan.name }}
            </div>
            <!-- Free plan -->
            <button
              v-if="currentPlan.alias === 'pm_free'"
              class="btn btn-primary my-2 sm:mt-0"
              @click="buyPremium"
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
            <div v-else-if="currentPlan.alias === 'pm_lifetime_premium'">
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
            <div v-if="currentPlan.alias === 'pm_free'">
              <template v-if="cipherStorage">
                <div v-for="(item, index) in cipherStorage" :key="index">
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
                    :status="cipherStatus(item.total / item.limit)"
                  />
                </div>
              </template>
            </div>
            <!-- Right limited end -->

            <!-- Right unlimited -->
            <div v-else class="text-center font-semibold">
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
            v-for="(item, index) in premiumFeatures"
            :key="index"
            class="flex flex-col sm:flex-row items-center w-full border-b border-black-100 py-6"
          >
            <img
              :src="
                require(`~/assets/images/pages/settings/plans-billing/${item.img}`)
              "
              alt=""
              class="mr-4 h-[62px] mb-4 sm:mb-0"
            >

            <div class="flex-1 text-center sm:text-left">
              <p
                class="setting-title mb-3"
                :class="isFreePlan ? '!text-[#A5ABB3]' : ''"
              >
                {{ $t(`data.settings.extra_features.${item.i18nKey}.title`) }}
              </p>
              <p
                class="mb-4 setting-description"
                :class="isFreePlan ? '!text-[#A5ABB3]' : ''"
              >
                {{ $t(`data.settings.extra_features.${item.i18nKey}.desc`) }}
              </p>
              <a
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
              @click="isFreePlan ? buyPremium : item.button.action"
            >
              <div class="flex justify-center items-center">
                <div class="mr-2">
                  <img
                    src="~/assets/images/icons/flash_white.svg"
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
  asyncComputed: {
    allCiphers: {
      async get () {
        this.loading = true
        let result = await this.$cipherService.getAllDecrypted()
        result = result.filter(cipher => cipher.organizationId === null)
        return result
      },
      watch: ['$store.state.syncedCiphersToggle']
    }
  },

  computed: {
    currentPlan () {
      return this.$store.state.currentPlan
    },
    isFreePlan () {
      return this.currentPlan.alias === 'pm_free'
    },
    cipherStorage () {
      const allCiphers = this.allCiphers || []
      return this.cipherTypesList
        .filter(c => !!c.freeLimit)
        .map(c => ({
          type: c.type,
          limit: c.freeLimit,
          total: allCiphers.filter(cipher => cipher.type === c.type).length
        }))
    },
    premiumFeatures () {
      return [
        {
          img: 'feat-1.svg',
          i18nKey: 'feat1',
          button: {
            icon: '',
            action: () => {
              //
            }
          }
        },
        {
          img: 'feat-2.svg',
          i18nKey: 'feat2',
          button: {
            icon: '',
            action: () => {
              this.$router.push(this.localeRoute('/shares'))
            }
          }
        },
        {
          img: 'feat-3.svg',
          i18nKey: 'feat3',
          button: {
            icon: '',
            action: () => {
              this.$router.push(
                // TODO: define this params
                this.localeRoute('/security?tab=emergency-access')
              )
            }
          }
        },
        {
          img: 'feat-4.svg',
          i18nKey: 'feat4',
          button: {
            icon: '',
            action: () => {
              this.$router.push(this.localeRoute('/tools/breach'))
            }
          }
        },
        {
          img: 'feat-5.svg',
          i18nKey: 'feat5',
          button: {
            icon: '',
            action: () => {
              this.$router.push(this.localeRoute('/tools/password-health'))
            }
          }
        },
        {
          img: 'feat-6.svg',
          i18nKey: 'feat6',
          button: {
            icon: '',
            action: () => {
              this.$router.push(this.localeRoute('/relay'))
            }
          }
        },
        {
          img: 'feat-7.svg',
          i18nKey: 'feat7',
          button: {
            icon: '',
            action: () => {
              //
            }
          }
        },
        {
          img: 'feat-8.svg',
          i18nKey: 'feat8',
          button: {
            icon: '',
            action: () => {
              this.$router.push(this.localeRoute('/settings/family-members'))
            }
          }
        }
      ]
    }
  },

  methods: {
    cipherStatus (percentage) {
      if (percentage > 0.8) {
        return 'exception'
      }
      if (percentage > 0.5) {
        return 'warning'
      }
      return 'success'
    },

    buyPremium () {
      this.$router.push(localeRoute({ name: 'manage-plans' }))
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
