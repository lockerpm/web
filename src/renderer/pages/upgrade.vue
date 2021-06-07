<template>
  <div class="flex flex-col flex-column-fluid relative">
    <div class="flex-column-fluid lg:px-28 py-10 px-10">
      <div class="border border-black-200 rounded p-5 md:px-5 md:py-7 relative bg-gradient-to-r from-[#05A49F] to-[#1AB0AC] mb-6">
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
      </div>
      <div class="grid grid-cols-4 gap-x-6">
        <div v-for="item in plans" :key="item.id"
             class="p-8 border border-black-200 rounded"
        >
          <div class="h-full flex flex-col">
            <div class="flex items-center">
              <div class="label label-black tracking-[1px] font-semibold uppercase !text-xs">
                {{ getPlanName(item.name).name }}
              </div>
              <div class="text-black-600 ml-2">
                {{ getPlanName(item.name).tag }}
              </div>
            </div>
            <div class="mt-2.5 mb-6 flex items-center">
              <span class="text-head-1 font-semibold mr-2">
                <span v-if="language==='vi'">đ{{ item.price.vnd }}</span>
                <span v-if="language==='en'">${{ item.price.usd }}</span>
              </span>
              <span class="text-black-600">/ mo</span>
              <span v-if="item.max_number" class="ml-2 text-black-600">/ {{ item.max_number }} members </span>
            </div>
            <div class="mb-8 flex-grow">
              <div v-for="feature in features[item.id]" :key="feature"
                   class="flex items-center"
              >
                <Check class="text-primary" />
                <div class="ml-2">{{ feature }}</div>
              </div>
            </div>
            <div>
              <button v-if="currentUser.current_plan === item.name"
                      class="btn btn-primary w-full"
                      disabled
              >
                Hiện tại
              </button>
              <button v-else class="btn btn-primary w-full"
                      @click="selectedPlan = item"
              >
                Lựa chọn
              </button>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div class="head-4 font-semibold mb-2.5">Get rid of password</div>
        <div class="text-black-600 mb-12">
          Securely store, organize, and access your passwords from anywhere.
        </div>
        <div class="mb-10">
          <div class="text-[20px] font-semibold mb-6">
            Choose subscription period
          </div>
          <div class="grid grid-cols-3 gap-x-6">
            <div v-for="(item) in priceType"
                 :key="item.value"
                 class="pt-[70px] pb-5 px-3 border border-black-200 rounded text-center cursor-pointer"
                 :class="{'border-primary': type===item.label}"
                 @click="type = item.label"
            >
              <div class="font-semibold text-[1rem] mb-2.5">{{ item.label }}</div>
              <template v-if="selectedPlan[item.label]">
                <div class="font-semibold mb-10">
                  <span>
                    <span class="text-head-1">{{ symbol }}{{ selectedPlan[item.label][currency]/item.value | formatNumber }}</span> / Mo
                  </span>
                </div>
                <div v-if="item.value !== 1">
                  <span class="text-danger line-through">
                    {{ symbol }}{{ selectedPlan.price[currency]*item.value |formatNumber }}</span>
                  <span class="text-black-600">
                    {{ symbol }}{{ selectedPlan[item.label][currency] |formatNumber }}
                    <span v-if="item.value===6"> for the first 6 months</span>
                    <span v-if="item.value===12"> for the first year</span>
                  </span>
                </div>
              </template>
            </div>
            <div>a</div>
            <div>a</div>
          </div>
        </div>
        <div>
          <div class="text-[20px] font-semibold mb-6">
            Select a payment method
          </div>
          <div class="grid grid-cols-2">
            <div class="border border-black-200 rounded px-5 py-4">
              <div class="text-lg font-semibold">Credits Cards</div>
              <div>
                Ảnh
                <button class="btn btn-primary" @click="editBilling">
                  Test
                </button>
              </div>
            </div>
            <div>a</div>
          </div>
        </div>
        <CardDrawer ref="drawer" :user="user" @handle-done="handleDone" />
      </div>
    </div>
  </div>
</template>

<script>
import CardDrawer from '../components/upgrade/CardDrawer'
import Check from '../components/icons/check'
export default {
  components: { Check, CardDrawer },
  data () {
    return {
      plans: [],
      features: {
        1: [
          'store_password',
          'cards_and_notes',
          'password_generator',
          'sync_devices'
        ],
        2: [
          'store_password',
          'cards_and_notes',
          'password_generator',
          'sync_devices',
          'password_health',
          'data_breach'
        ],
        3: [
          'store_password',
          'cards_and_notes',
          'password_generator',
          'sync_devices',
          'password_health',
          'data_breach'
        ],
        4: [
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
        yearly_price: {}
      },
      priceType: [{
        label: 'yearly_price',
        value: 12
      }, {
        label: 'half_yearly_price',
        value: 6
      }, {
        label: 'price',
        value: 1
      }],
      type: 'yearly_price',
      paymentMethod: 'card'
    }
  },
  computed: {
    currency () {
      return this.language === 'vi' ? 'vnd' : 'usd'
    },
    symbol () {
      return this.currency === 'vnd' ? 'đ' : '$'
    }
  },
  mounted () {
    this.getPlans()
  },
  methods: {
    async getPlans () {
      this.plans = await this.$axios.$get('resources/cystack_platform/pm/plans')
    },
    getPlanName (text) {
      const [name, tag] = text.split(' ')
      return { name, tag }
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
