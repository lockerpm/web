<template>
  <div class="md:w-2/3 mx-auto">
    <div class="text-head-5 font-semibold mb-2">
      {{ $t('data.settings.plans_billing') }}
    </div>
    <div class="text-lg text-black-600 mb-4">
      {{ $t('data.settings.plans_billing_desc') }}
    </div>
    <div class="setting-wrapper">
      <div class="setting-section">
        <div class="setting-section-header">
          <div class="text-head-5 font-semibold">{{ currentPlan.name }}</div>
          <div v-if="currentPlan.alias==='pm_free'">
            <button
              class="btn btn-primary mb-4 md:mb-0"
              @click="$router.push(localeRoute({name: 'plans'}))"
            >
              <div class="flex">
                <div class="mr-2">
                  <img src="~/assets/images/icons/flash_white.svg" alt="">
                </div>
                <div>
                  Buy Premium
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
      <div class="setting-section">
        <div class="grid grid-cols-2">
          <div>
            <div class="setting-title">
              {{ $t('data.settings.plan_storage') }}
            </div>
            <div class="setting-description">{{ $t('data.settings.plan_storage_desc') }}</div>
          </div>
          <div v-if="currentPlan.alias==='pm_free'">
            <el-progress :percentage="50" />
          </div>
          <div v-else>
            Unlimited
          </div>
        </div>
      </div>
      <div class="setting-section">
        <div class="setting-section-header">
          <div>
            <div class="setting-title">{{ $t('data.settings.extra_security') }}</div>
            <div class="setting-description">{{ $t('data.settings.extra_security_desc') }}</div>
          </div>
        </div>
        <div class="bg-[#F0F0F0] mt-8 py-5 pl-5 pr-10">
          <div class="flex">
            <div class="px-3 text-lg">
              <i class="fas fa-lightbulb" />
            </div>
            <div>
              <div class="text-head-6 mb-3">
                {{ $t('data.settings.learn_about_secure_desc') }}
              </div>
              <div>
                <a href="#">
                  <button
                    class="btn btn-default mb-4 md:mb-0 !bg-[#CBCBCB]"
                  >
                    <span>{{ $t('data.settings.learn_about_secure') }}</span>
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="setting-section">
        <div class="setting-section-header">
          <div>
            <div class="setting-title">{{ $t('data.settings.utilities') }}</div>
            <div class="setting-description">{{ $t('data.settings.utilities_desc') }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="setting-wrapper">
      <div class="setting-section">
        <div class="setting-section-header">
          <div class="text-head-5 font-semibold">
            Payment method
          </div>
        </div>
      </div>
      <div class="setting-section">
        <div
          v-for="item in cards"
          :key="item.id_card"
          class="!flex mb-4 items-center"
        >
          <div class="flex items-center w-[300px]">
            <div class="bg-[#f5f8fa] w-10 h-10 rounded flex items-center justify-center p-1 mr-4">
              <img v-if="item.card_type === 'Visa'" src="~/assets/images/icons/cards/visa.svg" alt="">
              <img v-else-if="item.card_type === 'MasterCard'" src="~/assets/images/icons/cards/master.svg" alt="">
              <img v-else-if="item.card_type === 'American Express'" src="~/assets/images/icons/cards/amex.svg" alt="">
              <img v-else-if="item.card_type === 'Discover'" src="~/assets/images/icons/cards/discover.svg" alt="">
              <img v-else-if="item.card_type === 'JCB'" src="~/assets/images/icons/cards/jcb.svg" alt="">
              <img v-else src="~/assets/images/icons/cards/card.svg" alt="">
            </div>
            <div class="mr-10">
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
            <div class="mr-4">
              <button
                class="btn btn-icon"
              >
                <i class="fa fa-edit" />
              </button>
            </div>
            <div class="">
              <button
                class="btn btn-icon !text-danger"
              >
                <i class="fa fa-trash" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="setting-wrapper">
      <div class="setting-section">
        <div class="setting-section-header">
          <div class="text-head-5 font-semibold">
            Billing Details
          </div>
        </div>
      </div>
      <div class="setting-section">
        <div class="text-black-600 mb-1.5">
          {{ currentPlan.cancel_at_period_end ? $t('data.billing.cancel_at_period_end') : $t('data.billing.next_billing') }}
        </div>
        <div class="font-semibold">
          {{ currentPlan.next_billing_time ? $moment(currentPlan.next_billing_time * 1000).format('LLL') : 'N/A' }}
        </div>
        <button
          v-if="currentPlan.next_billing_time && !currentPlan.cancel_at_period_end"
          class="btn btn-default mt-4"
          @click="cancelSub"
        >
          {{ $t('data.billing.cancel_subscription') }}
        </button>
      </div>
    </div>
    <div class="setting-wrapper">
      <div class="setting-section">
        <div class="setting-section-header">
          <div class="text-head-5 font-semibold">
            Billing Documents
          </div>
        </div>
      </div>
      <div class="setting-section">
        <div>
          <el-table
            :data="invoices.results"
            style="width: 100%"
          >
            <el-table-column
              label="ID"
            >
              <template slot-scope="scope">
                {{ scope.row.payment_id }}
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('common.created_date')"
            >
              <template slot-scope="scope">
                {{ $moment(scope.row.created_time*1000).format('LLL') }}
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('common.plan')"
            >
              <template slot-scope="scope">
                {{ getPlanByAlias(plans, scope.row.plan).name }}
              </template>
            </el-table-column>
            <el-table-column
              label=""
            >
              <template slot-scope="scope">
                {{ $t(`common.${scope.row.duration}`) }}
              </template>
            </el-table-column>
            <el-table-column
              prop="total_price"
              label=""
              align="right"
            >
              <template slot-scope="scope">
                {{ scope.row.total_price | formatNumber }}
              </template>
            </el-table-column>
            <el-table-column
              prop="status"
              label=""
              align="right"
            >
              <template slot-scope="scope">
                {{ $t(`data.billing.${scope.row.status}`) }}
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            v-if="invoices.count > 10"
            id="_main_pag"
            class="text-right mt-3"
            layout="prev, pager, next"
            :total="invoices.count"
            :current-page="page"
            @current-change="handlePageChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import find from 'lodash/find'
export default {
  data () {
    return {
      cards: [],
      invoices: {},
      page: 1,
      plans: []
    }
  },
  computed: {
    currentPlan () {
      return this.$store.state.currentPlan
    }
  },
  mounted () {
    this.getCards()
    this.getInvoices()
    this.getPlans()
    this.$store.dispatch('LoadCurrentPlan')
  },
  methods: {
    async getCards () {
      this.cards = await this.$axios.$get('cystack_platform/payments/cards')
    },
    getPlanName (text) {
      if (text) {
        const [name, tag] = text.split(' ')
        return { name, tag }
      }
      return { name: '', tag: '' }
    },
    getInvoices (page = 1) {
      this.page = page
      const url = `cystack_platform/pm/payments/invoices?page=${page}`
      this.$axios.$get(url)
        .then(res => {
          this.invoices = res
        })
    },
    payInvoice (item) {
      this.loadingPay = true
      this.$store.commit('UPDATE_LOADING', true)
      const url = `cystack_platform/pm/payments/invoices/${item.id}`
      this.$axios.$post(url)
        .then(res => {
          this.notify(this.$t('data.billing.pay_success'), 'success')
          item.status = 'paid'
        })
        .catch(error => {
          if (error.response) {
            if (error.response.data) {
              if (error.response.data.code === '7009') {
                this.notify(this.$t('data.error_code.7009'), 'warning')
              }
            }
          } else {
            this.notify(this.$t('data.billing.pay_failed'), 'warning')
          }
        }).then(() => {
          this.loadingPay = false
          this.$store.commit('UPDATE_LOADING', false)
        })
    },
    handlePageChange (page) {
      this.getInvoices(page)
    },
    async getPlans () {
      this.plans = await this.$axios.$get('resources/cystack_platform/pm/plans')
    },
    getPlanByAlias (plans, alias) {
      return find(plans, e => e.alias === alias) || {}
    },
    cancelSub () {
      this.$confirm(this.$t('data.billing.confirm_unsubscribe', { date: this.$moment(this.currentPlan.next_billing_time * 1000).format('LL') }), this.$t('data.billing.cancel_subscription'), {
        confirmButtonText: 'OK',
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(() => {
        this.$axios.$post('cystack_platform/pm/payments/plan/cancel')
          .then(res => {
            this.notify(this.$t('data.billing.unsubscribe_success', { date: this.$moment(this.currentPlan.next_billing_time * 1000).format('LL') }), 'success')
            this.$store.dispatch('LoadCurrentPlan')
          })
          .catch(() => {
            this.notify(this.$t('data.billing.subscribe_failed'), 'warning')
          })
      }).catch(() => {
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
