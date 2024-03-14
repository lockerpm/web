import Vue from 'vue'
import { v1 as uuidv1 } from 'uuid'

Vue.mixin({
  methods: {
    /**
     *
     * @param { planId: string; value: number; currency?: string; coupon?: string } params
     */
    trackGAPurchase (params) {
      const { planId, value, currency, coupon } = params

      function capitalize (str) {
        return str.charAt(0).toUpperCase() + str.slice(1)
      }

      const transactionId = `${planId}-${uuidv1()}`
      const planName = planId.split('_').map(word => capitalize(word)).join(' ')

      if (process.client) {
        try {
          window.dataLayer = window.dataLayer || []
          window.dataLayer.push({ ecommerce: null }) // Clear the previous ecommerce object.
          window.dataLayer.push({
            event: 'purchase',
            ecommerce: {
              transaction_id: transactionId,
              value,
              currency: currency || 'USD',
              coupon: coupon || undefined,
              items: [
                {
                  item_id: planId,
                  item_name: planName
                }
              ]
            }
          })
        } catch (e) {
          console.log('GA error', e)
        }
      }
    }
  }
})
