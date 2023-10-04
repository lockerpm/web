<template>
  <div>
    <div class="grid md:grid-cols-6 cipher-item">
      <p class="!break-normal mr-4">{{ $t('data.ciphers.wallet_app') }}</p>
      <div class="col-span-4">
        <div
          v-if="cryptoWallet.walletApp"
          class="font-semibold flex items-center"
        >
          <img
            v-if="!isPublic || !hideAll"
            :src="cryptoWallet.walletApp.logo"
            alt=""
            class="mr-3 h-[34px] w-[34px] rounded-full"
          >
          {{
            filterPassword(cryptoWallet.walletApp.name, !isPublic || !hideAll)
          }}
        </div>
      </div>
    </div>
    <TextHaveCopy
      :label="$t('data.ciphers.username')"
      :text="cryptoWallet.username"
      :should-hide="isPublic && hideAll"
    />
    <TextHaveCopy
      :label="$t('common.password')"
      :text="cryptoWallet.password"
      :view-password="cipher.viewPassword"
      :should-hide="!isPublic || hideAll"
    />
    <div class="grid md:grid-cols-6 cipher-item">
      <p class="!break-normal mr-4">
        {{ $t('data.ciphers.password_strength') }}
      </p>
      <div class="col-span-4 font-semibold">
        <PasswordStrength :score="passwordStrength.score" />
      </div>
    </div>
    <TextHaveCopy
      label="PIN"
      :text="cryptoWallet.pin"
      :should-hide="!isPublic || hideAll"
    />
    <TextHaveCopy
      :label="$t('data.ciphers.wallet_address')"
      :text="cryptoWallet.address"
      :should-hide="isPublic && hideAll"
    />
    <TextHaveCopy
      :label="$t('data.ciphers.private_key')"
      :text="cryptoWallet.privateKey"
      :view-password="cipher.viewPassword"
      :should-hide="!isPublic || hideAll"
    />
    <div class="grid md:grid-cols-6 cipher-item">
      <p class="!break-normal mr-4">
        {{ $t('data.ciphers.seed') }}
      </p>
      <div class="col-span-4 font-semibold">
        <InputSeedPhrase
          :value="
            filterPassword(cryptoWallet.seed, !isPublic || !hideAll || showSeed)
          "
          :label="$t('data.ciphers.seed')"
          :edit-mode="false"
          :disabled="true"
          class="w-full !my-3"
        />
      </div>
      <div class="text-right">
        <button
          v-if="isPublic && hideAll"
          class="btn btn-icon btn-xs btn-action"
          @click="showSeed = !showSeed"
        >
          <i
            class="far"
            :class="{ 'fa-eye': !showSeed, 'fa-eye-slash': showSeed }"
          />
        </button>
        <button
          v-clipboard:copy="cryptoWallet.seed"
          v-clipboard:success="clipboardSuccessHandler"
          class="btn btn-icon btn-xs btn-action"
        >
          <i class="far fa-copy" />
        </button>
      </div>
    </div>
    <div class="grid md:grid-cols-6 cipher-item">
      <p class="!break-normal mr-4">{{ $t('data.ciphers.networks') }}</p>
      <div class="col-span-4">
        <div
          v-if="cryptoWallet.networks && cryptoWallet.networks.length"
          class="grid md:grid-cols-3 gap-2"
        >
          <div
            v-for="network in cryptoWallet.networks"
            :key="network.alias"
            class="font-semibold flex items-center break-normal"
          >
            <img
              v-if="!isPublic || !hideAll"
              :src="network.logo"
              alt=""
              class="mr-3 h-[34px] w-[34px] rounded-full"
            >
            {{ filterPassword(network.name, !isPublic || !hideAll) }}
          </div>
        </div>
      </div>
    </div>
    <TextHaveCopy
      :label="$t('data.ciphers.notes')"
      :text="cryptoWallet.notes"
      :text-area="true"
      :should-hide="isPublic && hideAll"
    />
  </div>
</template>
<script>
import find from 'lodash/find'
import { CipherView } from '../../../../jslib/src/models/view/cipherView'
import TextHaveCopy from '@/components/cipher/TextHaveCopy'
import InputSeedPhrase from '@/components/input/InputSeedPhrase'
import { WALLET_APP_LIST } from '@/utils/crypto/applist/index'
import { CHAIN_LIST } from '@/utils/crypto/chainlist/index'
import PasswordStrength from '@/components/password/PasswordStrength'

export default {
  components: {
    TextHaveCopy,
    InputSeedPhrase,
    PasswordStrength
  },

  props: {
    cipher: {
      type: [CipherView, Object],
      default: () => ({ cryptoWallet: {} })
    },
    isPublic: {
      type: Boolean,
      default: () => false
    },
    hideAll: {
      type: Boolean,
      default: () => false
    }
  },

  data () {
    return {
      showSeed: false
    }
  },

  computed: {
    cryptoWallet () {
      const item = { ...this.cipher.cryptoWallet }
      item.walletApp = item.walletApp
        ? this.findWalletApp(WALLET_APP_LIST, item.walletApp.alias)
        : {}
      item.networks = item.networks
        ? item.networks.map(n => CHAIN_LIST.find(c => c.alias === n.alias))
        : []
      return item
    },

    passwordStrength () {
      return (
        this.$passwordGenerationService.passwordStrength(
          this.cryptoWallet?.password,
          ['cystack']
        ) || {}
      )
    }
  },

  watch: {
    hideAll (val) {
      if (val) {
        this.showUri = false
      }
    }
  },

  methods: {
    findWalletApp (walletList, alias) {
      return find(walletList, a => a.alias === alias)
    }
  }
}
</script>
