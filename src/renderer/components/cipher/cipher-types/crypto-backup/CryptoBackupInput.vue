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
      :label="$t('common.password')"
      class="w-full"
      :disabled="isDeleted"
      is-password
    />
    <PasswordStrengthBar :score="passwordStrength.score" class="mt-2" />
    <div v-if="!isDeleted" class="text-right">
      <el-popover
        placement="right"
        width="280"
        trigger="click"
        popper-class="locker-pw-generator"
      >
        <PasswordGenerator @fill="fillPassword" />

        <button slot="reference" class="btn btn-clean !text-primary">
          {{ $t('data.ciphers.generate_random_password') }}
        </button>
      </el-popover>
    </div>
    <InputText
      v-model="cryptoWallet.pin"
      label="PIN"
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
import PasswordGenerator from '../../../password/PasswordGenerator'
import PasswordStrengthBar from '../../../password/PasswordStrengthBar'

export default {
  components: {
    InputSelectCryptoWallet,
    InputText,
    InputSeedPhrase,
    InputSelectCryptoNetworks,
    PasswordStrengthBar,
    PasswordGenerator
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
        pin: '',
        address: '',
        privateKey: '',
        seed: '',
        networks: []
      }
    }
  },

  computed: {
    passwordStrength () {
      return (
        this.$passwordGenerationService.passwordStrength(
          this.cryptoWallet.password,
          ['cystack']
        ) || {}
      )
    }
  },

  methods: {
    fillPassword (p) {
      this.cryptoWallet.password = p
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
    },

    loadData (data) {
      this.cryptoWallet = { ...data }
    },

    getData () {
      return this.cryptoWallet
    }
  }
}
</script>
