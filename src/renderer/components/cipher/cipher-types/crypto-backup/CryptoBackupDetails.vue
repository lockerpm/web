<template>
  <div>
    <div class="grid md:grid-cols-6 cipher-item">
      <div class="">{{ $t('data.ciphers.wallet_app') }}</div>
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
      :label="$t('data.ciphers.password_pin')"
      :text="cryptoWallet.password"
      :view-password="cipher.viewPassword"
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
      <div class="">{{ $t('data.ciphers.seed') }}</div>
      <div class="col-span-4 font-semibold">
        <InputSeedPhrase
          :value="filterPassword(cryptoWallet.seed, !isPublic || !hideAll)"
          :label="$t('data.ciphers.seed')"
          :edit-mode="false"
          :disabled="true"
          class="w-full !my-3"
        />
      </div>
      <div class="text-right">
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
      <div class="">{{ $t('data.ciphers.networks') }}</div>
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
      :text="filterPassword(cryptoWallet.notes, !isPublic || !hideAll)"
      :text-area="true"
    />
  </div>
</template>
<script>
import find from 'lodash/find'
import { CipherView } from '../../../../core/models/view/cipherView'
import TextHaveCopy from '@/components/cipher/TextHaveCopy'
import InputSeedPhrase from '@/components/input/InputSeedPhrase'
import { WALLET_APP_LIST } from '@/utils/crypto/applist/index'
import { CHAIN_LIST } from '@/utils/crypto/chainlist/index'

export default {
  components: {
    TextHaveCopy,
    InputSeedPhrase
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
    }
  },

  methods: {
    findWalletApp (walletList, alias) {
      return find(walletList, a => a.alias === alias)
    }
  }
}
</script>
