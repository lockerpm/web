<template>
  <div class="mb-6">
    <el-collapse class="setting-wrapper">
      <el-collapse-item name="1">
        <!-- Header -->
        <template slot="title">
          <div
            class="flex justify-between w-full mr-6 ml-4 items-center py-8 flex-wrap"
          >
            <div class="text-head-5 font-semibold text-black">
              {{ $t('data.billing.payment_method') }}
            </div>
          </div>
        </template>
        <!-- Header end -->

        <!-- Body -->
        <div class="setting-section !border-t">
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
                <div class="text-black font-bold mb-2">
                  {{ item.card_type }}
                </div>
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
        <!-- Body end -->
      </el-collapse-item>
    </el-collapse>

    <!-- Dialogs -->

    <EditPaymentDialog
      ref="editPaymentDialog"
      @handle-done="handleEditCardDone"
    />

    <CardDrawer ref="drawer" @handle-done="handleAddCardDone" />

    <!-- Dialogs end -->
  </div>
</template>
<script>
import EditPaymentDialog from '@/components/upgrade/EditPaymentDetail.vue'
import CardDrawer from '@/components/upgrade/CardDrawer'

export default {
  components: {
    EditPaymentDialog,
    CardDrawer
  },

  data () {
    return {
      cards: []
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
      this.$refs.drawer.openDrawer({
        country: 'VN',
        metadata: {}
      })
    },

    handleAddCardDone () {
      this.getCards()
    },

    editCard (card) {
      this.$refs.editPaymentDialog.openDialog(card)
    },

    handleEditCardDone () {
      this.getCards()
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
    }
  }
}
</script>
