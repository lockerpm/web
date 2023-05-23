<template>
  <div>
    <!-- Select card -->
    <div
      v-if="paymentMethod === 'card' && cards.length"
      class="border rounded p-5 border-black-200 cursor-pointer mt-2"
    >
      <div>
        <el-radio-group v-model="selectedCard" class="w-full">
          <el-radio
            v-for="item in cards"
            :key="item.id_card"
            :label="item.id_card"
            class="!flex mb-4 items-center"
          >
            <div class="flex items-center w-[200px]">
              <div
                class="bg-[#f5f8fa] w-10 h-10 rounded flex items-center justify-center p-1 mr-4"
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
              <div>
                <div class="text-black font-bold mb-2">
                  {{ item.card_type }}
                </div>
                <div class="flex items-center justify-between">
                  <div class="text-black-500 mr-10">
                    {{ item.expire }}
                  </div>
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
            </div>
          </el-radio>
        </el-radio-group>
        <button class="btn btn-default btn-xs" @click="editBilling">
          {{ $t('data.billing.add_btn') }}
        </button>
      </div>
    </div>

    <!-- Add card Component -->
    <Payment
      v-if="paymentVisible || !cards.length"
      ref="payment"
      @handle-done="handleDone"
      @handle-cancel="handleCancel"
    />

    <div class="mt-8">
      <el-button
        :disabled="!selectedCard"
        :loading="loading"
        class="btn btn-primary w-full hover:!text-white"
        @click="confirmPlan()"
      >
        {{ $t('data.billing.pay_and_upgrade') }}
      </el-button>
    </div>
    <!-- Payment end -->
  </div>
</template>
<script>
export default {
  data () {
    return {
      paymentMethod: 'card',
      selectedCard: '',
      cards: [],
      paymentVisible: false
    }
  },

  mounted () {
    this.getCards()
  },

  methods: {
    async getCards () {
      this.cards = await this.$axios.$get('cystack_platform/payments/cards')
    },
    editBilling () {
      this.paymentVisible = true
    },
    handleCancel () {
      this.paymentVisible = false
    },
    handleDone (card) {
      this.paymentVisible = false
      this.getCards()
      this.$nextTick(() => {
        this.selectedCard = card.id_card
      })
    }
  }
}
</script>
