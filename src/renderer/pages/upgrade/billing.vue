<template>
  <div>
    <div class="grid grid-cols-5 gap-6 mb-10">
      <div class="col-span-3 p-6 rounded border border-black-200 flex flex-col">
        <div class="flex justify-between mb-6 flex-grow">
          <div class="flex">
            <div class="label label-black tracking-[1px] font-semibold uppercase !text-xs">
              {{ getPlanName(currentPlan.name).name }}
            </div>
            <div class="text-black-600 ml-2">
              {{ getPlanName(currentPlan.name).tag }}
            </div>
          </div>
          <div class="flex items-center">
            <span v-if="currentPlan.price" class="text-head-1 font-semibold mr-2">
              <span v-if="language==='vi'">đ{{ currentPlan.price.vnd }}</span>
              <span v-if="language==='en'">${{ currentPlan.price.usd }}</span>
            </span>
            <span class="text-black-600">/ mo</span>
            <span v-if="currentPlan.max_number" class="ml-2 text-black-600">/ {{ currentPlan.max_number }} members </span>
            <span v-else-if="currentPlan.alias === 'pm_business_premium'" class="ml-2 text-black-600">/ 1 member </span>
          </div>
        </div>
        <div class="flex">
          <div class="flex-grow" />
          <div>
            <button class="btn btn-default">Cancel Subscription</button>
          </div>
        </div>
      </div>
      <div class="col-span-2 p-6 rounded border border-black-200">
        <div class="text-black-600 mb-1.5">Next payment</div>
        <div class="font-semibold mb-4">{{ $moment(currentPlan.next_billing_time * 1000).format('LLL') }}</div>
        <button class="btn btn-default">Manage Payments</button>
      </div>
    </div>
    <div class="text-head-5 font-semibold mb-4">Invoice</div>
    <div>
      <table class="table table-hover">
        <tbody>
          <tr v-for="item in invoices.results" :key="item.id">
            <td class="align-middle">
              <nuxt-link :to="{name: 'invoices-idInvoice', params: {idInvoice: item.id}}"
                         tag="a" target="_blank"
                         class="kt-link kt-font-dark kt-font-bold"
              >
                {{ $moment(item.created_time*1000).format('LL') }}
              </nuxt-link>
            </td>
            <td class="align-middle">
              ${{ item.total_price | formatPrice }}
            </td>
            <td class="align-middle text-right">
              <span class="font-weight-bold" :class="item.status.toLowerCase() ==='paid'?'kt-font-success':item.status.toLowerCase() ==='failed'?'kt-font-danger':'kt-font-warning'">{{ $t(`data.billing.${item.status.toLowerCase()}`) }}
              </span>
            </td>
            <td class="align-middle text-right">
            <!--                    <div v-if="item.status === 'past_due'">-->
            <!--                      <button class="btn btn-warning btn-sm btn-widest" :disabled="loadingPay" @click="payInvoice(item)">-->
            <!--                        {{ $t('common.pay') }}-->
            <!--                      </button>-->
            <!--                    </div>-->
            </td>
          </tr>
        </tbody>
      </table>
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
</template>

<script>
export default {
  data () {
    return {
      invoices: {},
      page: 1
    }
  },
  computed: {
    currentPlan () {
      return this.$store.state.currentPlan
    }
  },
  mounted () {
    this.getInvoices()
  },
  methods: {
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
    }
  }
}
</script>
