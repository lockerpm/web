<template>
  <div class="lg:w-3/4">
    <div class="text-head-5 font-semibold mb-2">
      {{ $t('data.settings.plans_billing') }}
    </div>
    <div class="text-lg text-black-600 mb-8">
      {{ $t('data.settings.plans_billing_desc') }}
    </div>

    <!-- SECTION 1: USER's PLAN -->
    <plan-info />

    <!-- SECTION 2: PAYMENT METHODS -->
    <div class="setting-wrapper">
      <div class="setting-section">
        <div class="setting-section-header">
          <div class="text-head-5 font-semibold">
            {{ $t('data.billing.payment_method') }}
          </div>
        </div>
      </div>
      <div class="setting-section">
        <div
          v-for="item in cards"
          :key="item.id_card"
          class="!flex mb-4 items-center"
        >
          <div class="flex items-center md:w-[400px] w-[250px]">
            <div
              class="md:flex hidden bg-[#f5f8fa] w-10 h-10 rounded items-center justify-center p-1 mr-4"
            >
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
              <img v-else src="~/assets/images/icons/cards/card.svg" alt="">
            </div>
            <div class="mr-10">
              <div class="text-black font-bold mb-2">{{ item.card_type }}</div>
              <div class="flex items-center justify-between">
                <div class="text-black-500 mr-10">{{ item.expire }}</div>
                <div class="text-black-500 flex items-center">
                  <span
                    class="bg-black-500 w-[4px] h-[4px] rounded-full mr-0.5"
                  />
                  <span
                    class="bg-black-500 w-[4px] h-[4px] rounded-full mr-0.5"
                  />
                  <span
                    class="bg-black-500 w-[4px] h-[4px] rounded-full mr-0.5"
                  />
                  <span
                    class="bg-black-500 w-[4px] h-[4px] rounded-full mr-0.5"
                  />
                  <span>{{ item.last4 }}</span>
                </div>
              </div>
            </div>
            <div class="mr-4">
              <button class="btn btn-icon" @click="editCard(item)">
                <i class="fa fa-edit" />
              </button>
            </div>
            <div>
              <button
                class="btn btn-icon !text-danger"
                @click="deleteCard(item)"
              >
                <i class="fa fa-trash" />
              </button>
            </div>
          </div>
        </div>
        <button class="btn btn-default btn-xs" @click="editBilling">
          {{ $t('data.billing.add_btn') }}
        </button>
      </div>
    </div>

    <!-- SECTION 3: INVOICES -->
    <div class="setting-wrapper">
      <div class="setting-section">
        <div class="setting-section-header">
          <div class="text-head-5 font-semibold">
            {{ $t('data.billing.billing_documents') }}
          </div>
        </div>
      </div>
      <div class="setting-section">
        <div>
          <el-table :data="invoices.results" style="width: 100%">
            <el-table-column label="ID">
              <template slot-scope="scope">
                {{ scope.row.payment_id }}
              </template>
            </el-table-column>
            <el-table-column :label="$t('common.created_date')">
              <template slot-scope="scope">
                {{ $moment(scope.row.created_time * 1000).format('LLL') }}
              </template>
            </el-table-column>
            <el-table-column :label="$t('common.plan')">
              <template slot-scope="scope">
                {{ getPlanByAlias(plans, scope.row.plan).name }}
              </template>
            </el-table-column>
            <el-table-column label="">
              <template slot-scope="scope">
                {{ $t(`common.${scope.row.duration}`) }}
              </template>
            </el-table-column>
            <el-table-column prop="total_price" label="" align="right">
              <template slot-scope="scope">
                {{ scope.row.total_price | formatNumber }}
              </template>
            </el-table-column>
            <el-table-column prop="status" label="" align="right">
              <template slot-scope="scope">
                {{ $t(`data.billing.${scope.row.status}`) }}
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            v-if="invoices.count > 5"
            id="_main_pag"
            :pager-count="5"
            class="text-right mt-3"
            layout="prev, pager, next"
            :total="invoices.count"
            :current-page="page"
            @current-change="handlePageChange"
          />
        </div>
      </div>
    </div>

    <CardDrawer ref="drawer" @handle-done="handleDone" />
    <EditPaymentDialog ref="editPaymentDialog" @handle-done="handleEditDone" />
    <AddMemberToFamilyPlan ref="addMemberDialog" />
  </div>
</template>

<script>
import find from 'lodash/find'
import EditPaymentDialog from '../../components/upgrade/EditPaymentDetail.vue'
import AddMemberToFamilyPlan from '../../components/setting/AddMemberToFamilyPlan.vue'
import CardDrawer from '../../components/upgrade/CardDrawer'
import PlanInfo from '../../components/setting/plans-billing/PlanInfo.vue'

export default {
  components: {
    EditPaymentDialog,
    AddMemberToFamilyPlan,
    CardDrawer,
    PlanInfo
  },
  middleware: ['BlockEnterpriseMember'],
  data () {
    return {
      cards: [],
      invoices: {},
      page: 1,
      plans: [],
      familyMembers: [],
      inviteDialogVisible: false
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
      this.$axios.$get(url).then(res => {
        this.invoices = res
      })
    },
    payInvoice (item) {
      this.loadingPay = true
      this.$store.commit('UPDATE_LOADING', true)
      const url = `cystack_platform/pm/payments/invoices/${item.id}`
      this.$axios
        .$post(url)
        .then(() => {
          this.notify(this.$t('data.billing.pay_success'), 'success')
          item.status = 'paid'
        })
        .catch(error => {
          const isHandled = this.handleApiError(error?.response)
          if (!isHandled) {
            this.notify(this.$t('data.billing.pay_failed'), 'warning')
          }
        })
        .then(() => {
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

    deleteCard (card) {
      this.$confirm(
        this.$t('data.billing.confirm_delete_card_all'),
        this.$t('data.billing.confirm_delete_card'),
        {
          confirmButtonText: 'OK',
          cancelButtonText: this.$t('common.cancel'),
          type: 'warning'
        }
      )
        .then(() => {
          this.$axios
            .$delete(`cystack_platform/payments/cards/${card.id_card}`)
            .then(() => {
              this.notify(
                this.$t('data.billing.delete_card_success'),
                'success'
              )
              this.getCards()
            })
            .catch(() => {
              this.notify(this.$t('data.billing.delete_card_failed'), 'warning')
            })
        })
        .catch(() => {})
    },
    editCard (card) {
      this.$refs.editPaymentDialog.openDialog(card)
    },
    handleEditDone () {
      this.getCards()
    },
    handleDone () {
      this.getCards()
    },
    editBilling () {
      this.$refs.drawer.openDrawer({
        country: 'VN',
        metadata: {}
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
