<template>
  <div class="lg:w-2/3 mx-auto">
    <div class="text-head-5 font-semibold mb-2">
      {{ $t('data.settings.plans_billing') }}
    </div>
    <div class="text-lg text-black-600 mb-4">
      {{ $t('data.settings.plans_billing_desc') }}
    </div>

    <!-- SECTION 1: USER's PLAN -->
    <div class="setting-wrapper">
      <div class="setting-section">
        <div class="setting-section-header">
          <div class="text-head-5 font-semibold">{{ currentPlan.name }}</div>
          <!-- Free plan -->
          <div v-if="currentPlan.alias==='pm_free'">
            <button
              class="btn btn-primary mb-4 md:mb-0"
              @click="$router.push(localeRoute({name: 'manage-plans'}))"
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
          </div>
          <!-- Free plan end -->

          <!-- Lifetime plan -->
          <div v-else-if="currentPlan.alias==='pm_lifetime_premium'">
            <div />
          </div>
          <!-- Lifetime plan end -->

          <!-- Other plans -->
          <div v-else>
            <div class="">
              <div class="text-black-600 mb-1.5">
                {{ currentPlan.cancel_at_period_end ? $t('data.billing.cancel_at_period_end') : $t('data.billing.next_billing') }}:&nbsp;
                <span class="font-semibold">
                  {{ currentPlan.next_billing_time ? $moment(currentPlan.next_billing_time * 1000).format('LLL') : 'N/A' }}
                </span>
              </div>
              <div>
                <button
                  v-if="currentPlan.next_billing_time && !currentPlan.cancel_at_period_end"
                  class="btn btn-default float-right"
                  @click="cancelSub"
                >
                  {{ $t('data.billing.cancel_subscription') }}
                </button>
              </div>
            </div>
          </div>
          <!-- Other plans end -->
        </div>
        <!-- <div v-if="currentPlan.is_family" class="mt-4">
          <div class="flex justify-between">
            <div class="text-head-6 font-semibold">
              {{ $t('data.family_member.number_member') }} {{ familyMembers.length }} / 6
            </div>
            <div v-if="familyMembers.length<6 && currentPlan.alias === 'pm_family'" class="text-info cursor-pointer" @click="inviteMember">
              {{ $t('data.family_member.action') }}
            </div>
          </div>
          <div v-for="(member, index) in familyMembers" :key="index" class="py-4 border-b-[1px] border-[#eaeaf5]">
            <div class="flex items-center">
              <el-avatar :size="35" :src="member.avatar || require('~/assets/images/icons/Avatar.svg')" class="mr-2" />
              <div>
                <div class="text-sm font-semibold" :class="member.id?'':'text-primary'"><nobr>{{ member.full_name }}</nobr></div>
                <div class="text-xs text-black-600">{{ member.email }}</div>
              </div>
              <div v-if="member.id != null && currentPlan.alias === 'pm_family'" class="flex-grow">
                <button class="btn btn-default !text-danger float-right" @click="removeFamilyMember(member)">{{ $t('common.remove') }}</button>
              </div>
            </div>
          </div>
        </div> -->
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
            <template v-if="ciphers">
              <template v-if="ciphers.passwords">
                <div class="flex justify-between">
                  <div>
                    {{ $tc('type.Login', 2) }}
                  </div>
                  <div>
                    {{ ciphers.passwords.length }}/{{ limit.passwords }}
                  </div>
                </div>
                <el-progress :show-text="false" :percentage="ciphers.passwords.length*100/limit.passwords" :status="cipherStatus(ciphers.passwords.length/limit.passwords)" />
              </template>
              <template v-if="ciphers.notes">
                <div class="flex justify-between mt-4">
                  <div>
                    {{ $tc('type.SecureNote', 2) }}
                  </div>
                  <div>
                    {{ ciphers.notes.length }}/{{ limit.notes }}
                  </div>
                </div>
                <el-progress :show-text="false" :percentage="ciphers.notes.length*100/limit.notes" :status="cipherStatus(ciphers.notes.length/limit.notes)" />
              </template>
              <template v-if="ciphers.cards">
                <div class="flex justify-between mt-4">
                  <div>
                    {{ $tc('type.Card', 2) }}
                  </div>
                  <div>
                    {{ ciphers.cards.length }}/{{ limit.cards }}
                  </div>
                </div>
                <el-progress :show-text="false" :percentage="ciphers.cards.length*100/limit.cards" :status="cipherStatus(ciphers.cards.length/limit.cards)" />
              </template>
              <div v-if="ciphers.identities">
                <div class="flex justify-between mt-4">
                  <div>
                    {{ $tc('type.Identity', 2) }}
                  </div>
                  <div>
                    {{ ciphers.identities.length }}/{{ limit.identities }}
                  </div>
                </div>
                <el-progress :show-text="false" :percentage="ciphers.identities.length*100/limit.identities" :status="cipherStatus(ciphers.identities.length/limit.identities)" />
              </div>
              <div v-if="ciphers.crypto_backups">
                <div class="flex justify-between mt-4">
                  <div>
                    {{ $tc('type.CryptoBackup', 2) }}
                  </div>
                  <div>
                    {{ ciphers.crypto_backups.length }}/{{ limit.crypto_backups }}
                  </div>
                </div>
                <el-progress :show-text="false" :percentage="ciphers.crypto_backups.length*100/limit.crypto_backups" :status="cipherStatus(ciphers.crypto_backups.length/limit.crypto_backups)" />
              </div>
            </template>
          </div>
          <div v-else class="text-center font-semibold">
            {{ $t('common.unlimited') }}
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
            <div class="w-full">
              <div class="text-head-6 mb-3 w-full">
                {{ $t('data.settings.learn_about_secure_desc') }}
              </div>
              <div>
                <a
                  :href="`https://locker.io${locale==='vi'?'/vi':''}/security`"
                  target="_blank"
                >
                  <button class="btn btn-default !whitespace-normal text-left mb-4 md:mb-0 !bg-[#CBCBCB] hover:no-underline hover:text-current">
                    {{ $t('data.settings.learn_about_secure') }}
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
            <div class="md:flex hidden bg-[#f5f8fa] w-10 h-10 rounded items-center justify-center p-1 mr-4">
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
                @click="editCard(item)"
              >
                <i class="fa fa-edit" />
              </button>
            </div>
            <div class="">
              <button
                class="btn btn-icon !text-danger"
                @click="deleteCard(item)"
              >
                <i class="fa fa-trash" />
              </button>
            </div>
          </div>
        </div>
        <button
          class="btn btn-default btn-xs"
          @click="editBilling"
        >
          {{ $t('data.billing.add_btn') }}
        </button>
      </div>
    </div>
    <CardDrawer ref="drawer" @handle-done="handleDone" />
    <!-- <div class="setting-wrapper">
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
    </div> -->

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
    <EditPaymentDialog ref="editPaymentDialog" @handle-done="handleEditDone" />
    <AddMemberToFamilyPlan ref="addMemberDialog" /></addmembertofamilyplan>
  </div>
</template>

<script>
import find from 'lodash/find'
import EditPaymentDialog from '../../components/upgrade/EditPaymentDetail.vue'
import { CipherType } from '../../jslib/src/enums'
import AddMemberToFamilyPlan from '../../components/setting/AddMemberToFamilyPlan.vue'
import CardDrawer from '../../components/upgrade/CardDrawer'
export default {
  components: {
    EditPaymentDialog,
    AddMemberToFamilyPlan,
    CardDrawer
  },
  middleware: ['BlockEnterpriseMember'],
  data () {
    return {
      cards: [],
      invoices: {},
      page: 1,
      plans: [],
      limit: {
        passwords: 100,
        notes: 50,
        cards: 5,
        identities: 10,
        crypto_backups: 5
      },
      familyMembers: [],
      inviteDialogVisible: false
    }
  },
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
    ciphers () {
      const allCiphers = this.allCiphers || []
      return {
        passwords: allCiphers.filter(cipher => cipher.type === CipherType.Login) || [],
        notes: allCiphers.filter(cipher => cipher.type === CipherType.SecureNote) || [],
        cards: allCiphers.filter(cipher => cipher.type === CipherType.Card) || [],
        identities: allCiphers.filter(cipher => cipher.type === CipherType.Identity) || [],
        crypto_backups: allCiphers.filter(cipher => cipher.type === 7) || []
      }
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
    },
    deleteCard (card) {
      this.$confirm(this.$t('data.billing.confirm_delete_card_all'), this.$t('data.billing.confirm_delete_card'), {
        confirmButtonText: 'OK',
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(() => {
        this.$axios.$delete(`cystack_platform/payments/cards/${card.id_card}`)
          .then(() => {
            this.notify(this.$t('data.billing.delete_card_success'), 'success')
            this.getCards()
          })
          .catch(() => {
            this.notify(this.$t('data.billing.delete_card_failed'), 'warning')
          })
      }).catch(() => {
      })
    },
    editCard (card) {
      this.$refs.editPaymentDialog.openDialog(card)
    },
    handleEditDone () {
      this.getCards()
    },
    cipherStatus (percentage) {
      if (percentage > 0.8) {
        return 'exception'
      }
      if (percentage > 0.5) {
        return 'warning'
      }
      return 'success'
    },
    handleDone (card) {
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

<style lang="scss" scoped>

</style>
