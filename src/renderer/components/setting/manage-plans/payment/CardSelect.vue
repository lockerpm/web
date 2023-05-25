<template>
  <div>
    <h3 class="font-semibold text-[18px] mb-8">
      {{ $t('data.plans.payment_step.step_2') }}
    </h3>

    <!-- Select card -->
    <div class="border rounded p-5 border-black-200 cursor-pointer mt-2">
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
        <button class="btn btn-default btn-xs" @click="addCard">
          {{ $t('data.billing.add_btn') }}
        </button>
      </div>
    </div>
    <!-- Select card end -->

    <!-- Add card Component -->
    <div class="mt-8">
      <Payment
        v-if="addCardVisible"
        ref="payment"
        @handle-done="handleAddCardDone"
        @handle-cancel="handleAddCardCancel"
      />
    </div>
    <!-- Add card end -->
  </div>
</template>
<script>
import Payment from '~/components/upgrade/Payment'

export default {
  components: {
    Payment
  },

  props: {
    setCardId: {
      type: Function,
      default: () => () => {}
    }
  },

  data () {
    return {
      paymentMethod: 'card',
      selectedCard: '',
      cards: [],
      addCardVisible: false
    }
  },

  watch: {
    selectedCard (val) {
      this.setCardId(val)
    }
  },

  mounted () {
    this.getCards()
  },

  methods: {
    async getCards () {
      const res = await this.$axios.$get('cystack_platform/payments/cards')
      if (res.length) {
        this.selectedCard = res[0].id_card
        this.setCardId(res[0].id_card)
      } else {
        this.addCardVisible = true
      }
      this.cards = res
    },

    addCard () {
      this.addCardVisible = true
    },

    handleAddCardCancel () {
      this.addCardVisible = false
    },

    handleAddCardDone (card) {
      this.addCardVisible = false
      this.getCards()
      this.$nextTick(() => {
        this.selectedCard = card.id_card
        this.setCardId(card.id_card)
      })
    }
  }
}
</script>
