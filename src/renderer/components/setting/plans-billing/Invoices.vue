<template>
  <div class="mb-6">
    <el-collapse v-model="activeNames" class="setting-wrapper">
      <el-collapse-item name="1" class="border-black-50 border rounded">
        <!-- Header -->
        <template slot="title">
          <div
            class="flex justify-between w-full mr-6 ml-4 items-center py-8 flex-wrap"
          >
            <div class="text-head-5 font-semibold text-black">
              {{ $t('data.billing.billing_documents') }}
            </div>
          </div>
        </template>
        <!-- Header end -->

        <!-- Body -->
        <div class="setting-section !border-t">
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
        <!-- Body end -->
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script>
import find from 'lodash/find'

export default {
  data () {
    return {
      invoices: {
        results: [],
        count: 0
      },
      page: 1,
      plans: [],
      activeNames: ['1']
    }
  },

  mounted () {
    this.getInvoices()
    this.getPlans()
  },

  methods: {
    async getPlans () {
      this.plans = await this.$axios.$get('resources/cystack_platform/pm/plans')
    },

    getInvoices (page = 1) {
      this.page = page
      const url = `cystack_platform/pm/payments/invoices?page=${page}`
      this.$axios.$get(url).then(res => {
        this.invoices = res
      })
    },

    handlePageChange (page) {
      this.getInvoices(page)
    },

    getPlanByAlias (plans, alias) {
      return find(plans, e => e.alias === alias) || {}
    }
  }
}
</script>
