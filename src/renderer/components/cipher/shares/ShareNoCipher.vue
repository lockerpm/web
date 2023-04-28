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
          isFreeUser && isYourShares
            ? $t('errors.upgrade_to_use')
            : isQuickShares
              ? $t('data.sharing.quick_share.empty_desc')
              : $t(`data.no_data.${type}.description`)
        }}
      </div>

      <div v-if="!isSharedWithYou">
        <button
          class="btn btn-default"
          @click="
            isFreeUser && isYourShares ? upgradePlan() : $emit('add-share')
          "
        >
          {{
            isFreeUser && isYourShares
              ? $t('common.upgrade')
              : $t(`data.no_data.${type}.btn`)
          }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { CipherType } from '../../../jslib/src/enums/cipherType.ts'
import Vnodes from '../../../components/Vnodes'

export default {
  components: { Vnodes },
  data () {
    return {
      CipherType
    }
  },
  computed: {
    isFreeUser () {
      return this.currentPlan?.alias === 'pm_free'
    },
    isSharedWithYou () {
      return this.getRouteBaseName() === 'shares-index-index'
    },
    isYourShares () {
      return this.getRouteBaseName() === 'shares-index-index-your-shares'
    },
    isQuickShares () {
      return this.getRouteBaseName() === 'shares-index-index-quick-shares'
    },
    type () {
      switch (this.getRouteBaseName()) {
      case 'passwords':
        return 'Login'
      case 'notes':
        return 'SecureNote'
      case 'cards':
        return 'Card'
      case 'identities':
        return 'Identity'
      case 'vault':
        return 'Vault'
      case 'shares-index-index':
      case 'shares-index-index-your-shares':
      case 'shares-index-index-quick-shares':
        return 'Shares'
      case 'trash':
        return 'Trash'
      default:
        return null
      }
    }
  },
  methods: {
    upgradePlan () {
      this.$router.push(this.localeRoute({ name: 'manage-plans' }))
    }
  }
}
</script>
