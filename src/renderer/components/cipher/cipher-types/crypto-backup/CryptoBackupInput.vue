<template>
  <div>
    <InputSelectCryptoWallet
      :label="$t('data.ciphers.wallet_app')"
      :disabled="isDeleted"
      class="w-full"
      :initial-value="
        cryptoWallet.walletApp ? cryptoWallet.walletApp.alias : null
      "
      @change="handleChangeCryptoWallet"
    />
    <InputText
      v-model="cryptoWallet.username"
      :label="$t('data.ciphers.username')"
      class="w-full"
      :disabled="isDeleted"
      :is-password="false"
    />
    <InputText
      v-model="cryptoWallet.password"
      :label="$t('data.ciphers.password_pin')"
      class="w-full"
      :disabled="isDeleted"
      is-password
    />
    <InputText
      v-model="cryptoWallet.address"
      :label="$t('data.ciphers.wallet_address')"
      class="w-full"
      :disabled="isDeleted"
    />
    <InputText
      v-model="cryptoWallet.privateKey"
      :label="$t('data.ciphers.private_key')"
      class="w-full"
      :disabled="isDeleted"
      is-password
    />
    <!-- <InputText
            v-model="cryptoWallet.seed"
            :label="$t('data.ciphers.seed')"
            class="w-full !mb-1"
            :error-text="err && err.length && err[0]"
            :disabled="isDeleted"
            is-textarea=""
          /> -->
    <div class="cs-field w-full">
      <label>
        {{ $t('data.ciphers.seed') }}
      </label>
    </div>
    <InputSeedPhrase
      v-model="cryptoWallet.seed"
      :edit-mode="cipherId ? true : false"
      class="w-full !mb-3"
      @set-seed="setSeed"
    />
    <!-- <div class="py-1 px-3 text-xs mb-3" style="background: rgba(242, 232, 135, 0.3);">
            {{ $t('data.ciphers.seed_phrase_desc') }}
          </div> -->
    <InputSelectCryptoNetworks
      :label="$t('data.ciphers.networks')"
      :disabled="isDeleted"
      class="w-full !pt-6"
      :initial-value="
        cryptoWallet.networks ? cryptoWallet.networks.map(n => n.alias) : []
      "
      @change="handleChangeCryptoNetworks"
    />
  </div>
</template>
<script>
import InputSelectCryptoWallet from '../../../input/InputSelectCryptoWallet'
import InputText from '../../../input/InputText'
import InputSeedPhrase from '../../../input/InputSeedPhrase'
import InputSelectCryptoNetworks from '../../../input/InputSelectCryptoNetworks'
import { WALLET_APP_LIST } from '../../../../utils/crypto/applist/index'
import { CHAIN_LIST } from '../../../../utils/crypto/chainlist/index'

export default {
  components: {
    InputSelectCryptoWallet,
    InputText,
    InputSeedPhrase,
    InputSelectCryptoNetworks
  },

  props: {
    cipherId: {
      type: String,
      default: () => ''
    },
    isDeleted: {
      type: Boolean,
      default: () => false
    }
  },

  data () {
    return {
      cryptoWallet: {
        walletApp: {
          name: '',
          alias: ''
        },
        username: '',
        password: '',
        address: '',
        privateKey: '',
        seed: '',
        networks: [],
        notes: ''
      }
    }
  },

  watch: {
    cryptoWallet: {
      deep: true,
      handler (val) {
        this.$emit('update:cryptoWallet', val)
      }
    }
  },

  methods: {
    setInitialData (data) {
      this.cryptoWallet = { ...data }
    },

    handleChangeCryptoWallet (v) {
      const selectedApp = WALLET_APP_LIST.find(a => a.alias === v)
      this.cryptoWallet.walletApp = {
        name: selectedApp.name,
        alias: selectedApp.alias
      }
    },

    setSeed (v) {
      this.cryptoWallet.seed = v
    },

    handleChangeCryptoNetworks (v) {
      const selectedNetworks = v.map(alias =>
        CHAIN_LIST.find(n => n.alias === alias)
      )
      this.cryptoWallet.networks = selectedNetworks.map(selectedNetwork => {
        return {
          name: selectedNetwork.name,
          alias: selectedNetwork.alias
        }
      })
    }
  }
}
</script>
