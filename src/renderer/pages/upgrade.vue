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
              <div class="ml-2">Share password with people you trust people you trust</div>
            </div>
            <div class="flex items-center">
              <Check />
              <div class="ml-2">Share password with people you trust people you trust</div>
            </div>
          </div>
          <div class="mr-10">
            <img src="~/assets/images/icons/callout-upgrade.svg" alt="">
          </div>
        </div>
      </div>
      <div class="grid grid-cols-3 gap-x-6">
        <div v-for="item in plans" :key="item.id"
             class="p-8 border border-black-200 rounded"
        >
          <div>
            <div class="label label-black tracking-[1px] font-semibold uppercase !text-xs">
              {{ item.name }}
            </div>
            <div class="mt-2.5 mb-6 flex items-center">
              <span class="text-head-1 font-semibold mr-2">{{ item.price }}</span>
              <span class="text-black-600">/ {{ item.unit }}</span>
            </div>
            <div class="mb-8">
              <div v-for="feature in item.features" :key="feature"
                   class="flex items-center"
              >
                <Check class="text-primary" />
                <div class="ml-2">{{ feature }}</div>
              </div>
            </div>
            <div>
              <button class="btn btn-primary w-full">Choose Plan</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Check from '../components/icons/check'
export default {
  components: { Check },
  computed: {
    plans () {
      return [
        {
          id: 'personal',
          name: 'Personal',
          price: '$0.99',
          unit: 'mo',
          features: [
            'store_password',
            'cards_and_notes',
            'password_generator',
            'sync_devices',
            'password_health',
            'data_breach'
          ]
        },
        {
          id: 'business',
          name: 'Business',
          price: '$0.99',
          unit: 'mo',
          features: [
            'store_password',
            'cards_and_notes',
            'password_generator',
            'sync_devices',
            'password_health',
            'data_breach'
          ]
        },
        {
          id: 'family',
          name: 'Family',
          price: '$0.99',
          unit: 'mo',
          features: [
            'store_password',
            'cards_and_notes',
            'password_generator',
            'sync_devices',
            'password_health',
            'data_breach'
          ]
        }
      ]
    }
  }
}
</script>
