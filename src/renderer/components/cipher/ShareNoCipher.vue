<template>
  <div class="flex-column-fluid flex items-center justify-center">
    <div class="text-center mb-60">
      <div class="mb-5 p-5">
        <Vnodes
          :vnodes="
            getIconCipher(
              { type: CipherType[type] ? CipherType[type] : type },
              70
            )
          "
        />
      </div>
      <div class="text-head-5 font-semibold mb-2.5">
        {{ $t(`data.no_data.${type}.title`) }}
      </div>

      <div class="text-black-600 mb-8">
        {{
          isFreeUser && getRouteBaseName() !== 'shares'
            ? $t('errors.upgrade_to_use')
            : $t(`data.no_data.${type}.description`)
        }}
      </div>

      <div v-if="getRouteBaseName() !== 'shares'">
        <button
          class="btn btn-default"
          @click="isFreeUser ? upgradePlan() : $emit('add-share')"
        >
          {{
            isFreeUser ? $t('common.upgrade') : $t(`data.no_data.${type}.btn`)
          }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { CipherType } from '../../jslib/src/enums/cipherType.ts'
import Vnodes from '../../components/Vnodes'

export default {
  components: { Vnodes },
  props: {
    type: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      CipherType
    }
  },
  computed: {
    isFreeUser () {
      return this.currentPlan?.alias === 'pm_free'
    }
  },
  methods: {
    upgradePlan () {
      this.$router.push(this.localeRoute({ name: 'manage-plans' }))
    }
  }
}
</script>
