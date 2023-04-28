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
              class="btn btn-primary"
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
          <div class="grid grid-cols-2">
            <!-- Left -->
            <div>
              <div class="setting-title mb-1">
                {{ $t('data.settings.plan_storage') }}
              </div>
              <div class="setting-description">
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
            class="flex items-center w-full border-b border-black-100 py-6"
          >
            <img
              :src="
                require(`~/assets/images/pages/settings/plans-billing/${item.img}`)
              "
              alt=""
              class="mr-4 h-[62px]"
            >

            <div class="flex-1">
              <p
                class="setting-title mb-3"
                :class="isFreePlan ? '!text-[#A5ABB3]' : ''"
              >
                {{ item.title }}
              </p>
              <p
                class="mb-4 setting-description"
                :class="isFreePlan ? '!text-[#A5ABB3]' : ''"
              >
                {{ item.desc }}
              </p>
              <a
                :href="item.learnMore.url"
                target="_blank"
                class="font-semibold"
              >{{ item.learnMore.text }} <i class="el-icon-right" /></a>
            </div>

            <button
              class="btn btn-primary ml-3 min-w-[220px]"
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
                  {{ item.button.text }}
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
          title: 'Out of space to store your passwords?',
          desc: 'Upgrade to Premium plan from only $1.29/month for UNLIMITED STORAGE and more.',
          learnMore: {
            text: 'Learn more about Premium Plan',
            url: ''
          },
          button: {
            icon: '',
            text: 'Upgrade to Premium',
            action: () => {
              //
            }
          }
        },
        {
          img: 'feat-2.svg',
          title: 'Secure Item Sharing',
          desc: 'Item sharing is easier and safer with Locker Premium. Share item inside and outside Locker, and customize your shares.',
          learnMore: {
            text: 'Learn how to share your item',
            url: ''
          },
          button: {
            icon: '',
            text: 'Share Item Now',
            action: () => {
              //
            }
          }
        },
        {
          img: 'feat-3.svg',
          title: 'Emergency Access',
          desc: 'Add your trusted contacts so they can access to your items in Emergency Cases!',
          learnMore: {
            text: 'Learn more about Emergency Access',
            url: ''
          },
          button: {
            icon: '',
            text: 'Add Trusted contacts',
            action: () => {
              //
            }
          }
        },
        {
          img: 'feat-4.svg',
          title: 'Data Breach Scanner',
          desc: 'Check and get informed if your data has been leaked in any breach!',
          learnMore: {
            text: 'Try scanning your email',
            url: ''
          },
          button: {
            icon: '',
            text: 'Check Breached Data',
            action: () => {
              //
            }
          }
        },
        {
          img: 'feat-5.svg',
          title: 'Password Health Detection',
          desc: 'Identify any passwords that are weak, reused or exposed to safeguard your online accounts.',
          learnMore: {
            text: 'Learn more about Password Health',
            url: ''
          },
          button: {
            icon: '',
            text: 'Identify Weak Password',
            action: () => {
              //
            }
          }
        },
        {
          img: 'feat-6.svg',
          title: 'Private Email',
          desc: 'Generate aliases and keep your true email private. Come with extra security features!',
          learnMore: {
            text: 'Learn more about Private Email',
            url: ''
          },
          button: {
            icon: '',
            text: 'Get Unlimited Aliases',
            action: () => {
              //
            }
          }
        },
        {
          img: 'feat-7.svg',
          title: 'Logged-on devices',
          desc: 'Go Premium to unlock unlimited devices support!',
          learnMore: {
            text: 'Learn more about supported devices',
            url: ''
          },
          button: {
            icon: '',
            text: 'Upgrade to Premium',
            action: () => {
              //
            }
          }
        },
        {
          img: 'feat-8.svg',
          title: '6 Family Members',
          desc: 'Keep your family and friends safe online with Locker Family Plan. Pay less, use more!',
          learnMore: {
            text: 'Learn more about Family Plan',
            url: ''
          },
          button: {
            icon: '',
            text: 'See How',
            action: () => {
              //
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
<style>
.setting-wrapper .el-collapse-item__header {
  height: auto !important;
}
</style>
