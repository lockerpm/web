<template>
  <div class="w-full">
    <div class="text-head-4 font-semibold mb-2">
      {{ $t('data.settings.account') }}
    </div>
    <div class="text-lg text-black-600 mb-4">
      {{ $t('data.settings.account_desc') }}
    </div>
    <YourProfile />
    <Preferences />
    <DangerZone />
  </div>
</template>

<script>
import YourProfile from '../../components/setting/YourProfile.vue'
import Preferences from '../../components/setting/Preferences.vue'
import DangerZone from '../../components/setting/DangerZone.vue'

export default {
  components: {
    YourProfile,
    Preferences,
    DangerZone
  },
  data () {
    return {}
  },
  computed: {},
  async mounted () {},
  asyncComputed: {},
  methods: {}
}
</script>
