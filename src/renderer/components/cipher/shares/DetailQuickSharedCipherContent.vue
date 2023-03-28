<template>
  <div>
    <client-only>
      <!-- Icon + name -->
      <div class="mt-20 mb-9 text-center">
        <div class="mb-4 text-[70px]">
          <Vnodes
            :vnodes="getIconCipher(isPublic && hideAll ? {} : cipher, 64)"
          />
        </div>
        <div class="text-head-4 font-medium truncate">
          {{ filterPassword(cipher.name, !isPublic || !hideAll) }}
        </div>
      </div>
      <!-- Icon + name end -->

      <!-- Show/hide item -->
      <div class="w-full flex">
        <button
          v-if="isPublic"
          class="btn mx-auto mb-6"
          @click="hideAll = !hideAll"
        >
          <i
            class="far mr-2"
            :class="{ 'fa-eye': !hideAll, 'fa-eye-slash': hideAll }"
          />
          {{
            hideAll
              ? $t('data.sharing.quick_share.show_info')
              : $t('data.sharing.quick_share.hide_info')
          }}
        </button>
      </div>
      <!-- Show/hide item end -->

      <!-- Display cipher info -->
      <div class="cipher-items">
        <!-- Password -->
        <template v-if="cipher.type === CipherType.Login">
          <TextHaveCopy
            label="Email / Username"
            :text="cipher.login.username"
            :should-hide="isPublic && hideAll"
          />
          <TextHaveCopy
            :label="$t('data.ciphers.password')"
            :text="cipher.login.password"
            :view-password="cipher.viewPassword"
            :should-hide="!isPublic || hideAll"
          />
          <div class="grid md:grid-cols-6 grid-cols-1 cipher-item">
            <p class="mr-4 break-normal">
              {{ $t('data.ciphers.password_security') }}
            </p>
            <div class="col-span-4 font-semibold">
              <PasswordStrength :score="passwordStrength.score" />
            </div>
          </div>
          <div
            v-for="(item, index) in cipher.login.uris"
            v-show="item.uri"
            :key="index"
            class="grid md:grid-cols-6 grid-cols-1 cipher-item"
          >
            <p class="mr-4 break-normal">
              {{ $t('data.ciphers.website_address') }}
            </p>
            <div class="col-span-4 font-semibold">
              {{ filterPassword(item.uri, !isPublic || !hideAll) }}
            </div>
            <div class="text-right">
              <button
                v-if="item.canLaunch"
                class="btn btn-icon btn-xs btn-action"
                :title="$t('common.go_to_website')"
                @click="openNewTab(item.uri)"
              >
                <i class="fas fa-external-link-square-alt" />
              </button>
            </div>
          </div>
        </template>
        <!-- Password end -->

        <!-- Master Password -->
        <template v-if="cipher.type === CipherType.MasterPassword">
          <div>
            <TextHaveCopy
              should-hide
              :label="$t('data.ciphers.password')"
              :text="cipher.login.password"
            />
          </div>
          <div class="grid md:grid-cols-6 cipher-item">
            <p class="break-normal mr-4">
              {{ $t('data.ciphers.password_security') }}
            </p>
            <div class="col-span-4 font-semibold">
              <PasswordStrength :score="passwordStrength.score" />
            </div>
          </div>
          <div
            v-for="(item, index) in cipher.login.uris"
            v-show="item.uri"
            :key="index"
            class="grid md:grid-cols-6 cipher-item"
          >
            <p class="break-normal mr-4">
              {{ $t('data.ciphers.website_address') }}
            </p>
            <div class="col-span-4 font-semibold">
              {{ item.uri }}
            </div>
            <div class="text-right">
              <button
                v-if="item.canLaunch"
                class="btn btn-icon btn-xs btn-action"
                :title="$t('common.go_to_website')"
                @click="openNewTab(item.uri)"
              >
                <i class="fas fa-external-link-square-alt" />
              </button>
            </div>
          </div>
        </template>
        <!-- Master Password end -->

        <!-- Card -->
        <template v-if="cipher.type === CipherType.Card">
          <TextHaveCopy
            :label="$t('data.ciphers.card_holder')"
            :text="cipher.card.cardholderName"
            :should-hide="isPublic && hideAll"
          />
          <TextHaveCopy
            :label="$t('data.ciphers.brand')"
            :text="cipher.card.brand"
            :should-hide="isPublic && hideAll"
          />
          <TextHaveCopy
            :label="$t('data.ciphers.card_number')"
            :text="cipher.card.number"
            :should-hide="isPublic && hideAll"
          />
          <TextHaveCopy
            :label="$t('data.ciphers.expiration_month')"
            :text="cipher.card.expMonth"
            :should-hide="isPublic && hideAll"
          />
          <TextHaveCopy
            :label="$t('data.ciphers.expiration_year')"
            :text="cipher.card.expYear"
            :should-hide="isPublic && hideAll"
          />
          <TextHaveCopy
            :label="$t('data.ciphers.cvv')"
            :text="cipher.card.code"
            :view-password="cipher.viewPassword"
            :should-hide="!isPublic || hideAll"
          />
        </template>
        <!-- Card end -->

        <!-- Identity -->
        <template v-if="cipher.type === CipherType.Identity">
          <TextHaveCopy
            :label="$t('data.ciphers.title')"
            :text="
              cipher.identity.title
                ? $t(`common.${cipher.identity.title}`)
                : null
            "
            :should-hide="isPublic && hideAll"
          />
          <TextHaveCopy
            :label="$t('data.ciphers.first_name')"
            :text="cipher.identity.firstName"
            :should-hide="isPublic && hideAll"
          />
          <TextHaveCopy
            :label="$t('data.ciphers.last_name')"
            :text="cipher.identity.lastName"
            :should-hide="isPublic && hideAll"
          />
          <TextHaveCopy
            label="Username"
            :text="cipher.identity.username"
            :should-hide="isPublic && hideAll"
          />
          <TextHaveCopy
            label="Email"
            :text="cipher.identity.email"
            :should-hide="isPublic && hideAll"
          />
          <TextHaveCopy
            :label="$t('data.ciphers.company')"
            :text="cipher.identity.company"
            :should-hide="isPublic && hideAll"
          />
          <TextHaveCopy
            :label="$t('data.ciphers.ssn')"
            :text="cipher.identity.ssn"
            :should-hide="isPublic && hideAll"
          />
          <TextHaveCopy
            :label="$t('data.ciphers.passport')"
            :text="cipher.identity.passportNumber"
            :should-hide="isPublic && hideAll"
          />
          <TextHaveCopy
            :label="$t('data.ciphers.license')"
            :text="cipher.identity.licenseNumber"
            :should-hide="isPublic && hideAll"
          />
          <TextHaveCopy
            :label="$t('data.ciphers.address') + '1'"
            :text="cipher.identity.address1"
            :should-hide="isPublic && hideAll"
          />
          <TextHaveCopy
            :label="$t('data.ciphers.address') + '2'"
            :text="cipher.identity.address2"
            :should-hide="isPublic && hideAll"
          />
          <TextHaveCopy
            :label="$t('data.ciphers.city_town')"
            :text="cipher.identity.city"
            :should-hide="isPublic && hideAll"
          />
          <TextHaveCopy
            :label="$t('data.ciphers.state_province')"
            :text="cipher.identity.state"
            :should-hide="isPublic && hideAll"
          />
          <TextHaveCopy
            :label="$t('data.ciphers.zip')"
            :text="cipher.identity.postalCode"
            :should-hide="isPublic && hideAll"
          />
          <TextHaveCopy
            :label="$t('data.ciphers.country')"
            :text="cipher.identity.country"
            :should-hide="isPublic && hideAll"
          />
        </template>
        <!-- Identity end -->

        <!-- Crypto wallet -->
        <template
          v-if="cipher.type === CipherType.CryptoWallet && cipher.cryptoWallet"
        >
          <div class="grid md:grid-cols-6 grid-cols-1 cipher-item">
            <p class="break-normal mr-4">{{ $t('data.ciphers.wallet_app') }}</p>
            <div class="col-span-4">
              <div
                v-if="cipher.cryptoWallet.walletApp"
                class="font-semibold flex items-center"
              >
                <img
                  v-if="!isPublic || !hideAll"
                  :src="cipher.cryptoWallet.walletApp.logo"
                  alt=""
                  class="mr-3 h-[34px] w-[34px] rounded-full"
                >
                {{
                  filterPassword(
                    cipher.cryptoWallet.walletApp.name,
                    !isPublic || !hideAll
                  )
                }}
              </div>
            </div>
          </div>
          <TextHaveCopy
            :label="$t('data.ciphers.username')"
            :text="cipher.cryptoWallet.username"
            :should-hide="isPublic && hideAll"
          />
          <TextHaveCopy
            :label="$t('data.ciphers.password_pin')"
            :text="cipher.cryptoWallet.password"
            :view-password="cipher.viewPassword"
            :should-hide="!isPublic || hideAll"
          />

          <TextHaveCopy
            :label="$t('data.ciphers.wallet_address')"
            :text="cipher.cryptoWallet.address"
            :should-hide="isPublic && hideAll"
          />
          <TextHaveCopy
            :label="$t('data.ciphers.private_key')"
            :text="cipher.cryptoWallet.privateKey"
            :view-password="cipher.viewPassword"
            :should-hide="!isPublic || hideAll"
          />
          <div class="grid md:grid-cols-6 grid-cols-1 cipher-item">
            <p class="break-normal mr-4">{{ $t('data.ciphers.seed') }}</p>
            <div class="col-span-4 font-semibold">
              <InputSeedPhrase
                :value="
                  filterPassword(
                    cipher.cryptoWallet.seed,
                    !isPublic || !hideAll
                  )
                "
                :label="$t('data.ciphers.seed')"
                :edit-mode="false"
                :disabled="true"
                class="w-full !my-3"
              />
            </div>
            <div class="text-right">
              <button
                v-clipboard:copy="cipher.cryptoWallet.seed"
                v-clipboard:success="clipboardSuccessHandler"
                class="btn btn-icon btn-xs btn-action"
              >
                <i class="far fa-copy" />
              </button>
            </div>
          </div>
          <div class="grid md:grid-cols-6 grid-cols-1 cipher-item">
            <p class="break-normal mr-4">{{ $t('data.ciphers.networks') }}</p>
            <div class="col-span-4">
              <div
                v-if="
                  cipher.cryptoWallet.networks &&
                    cipher.cryptoWallet.networks.length
                "
                class="grid md:grid-cols-3 gap-2"
              >
                <div
                  v-for="network in cipher.cryptoWallet.networks"
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
            :text="cipher.cryptoWallet.notes"
            :text-area="true"
          />
        </template>
        <!-- Crypto wallet end -->

        <!-- Notes -->
        <div>
          <TextHaveCopy
            v-if="
              ![CipherType.CryptoWallet, CipherType.MasterPassword].includes(
                cipher.type
              )
            "
            :label="$t('data.ciphers.notes')"
            :text="cipher.notes"
            :text-area="true"
          />
          <TextHaveCopy
            v-if="cipher.type === CipherType.MasterPassword"
            :label="$t('data.ciphers.notes')"
            :text="$t('master_pw_item.desc')"
            :text-area="true"
            :should-hide="isPublic && hideAll"
          />
        </div>
        <!-- Notes end -->

        <!-- Custom fields -->
        <template v-for="(field, index) in cipher.fields">
          <TextHaveCopy
            v-if="field.name || field.value != null"
            :key="index"
            :label="field.name"
            :text="field.value"
            :should-hide="
              field.type === FieldType.Hidden || (isPublic && hideAll)
            "
          />
        </template>
        <!-- Custom fields end -->

        <!-- Share with -->
        <div v-if="emails.length > 0" class="grid md:grid-cols-6 cipher-item">
          <p class="break-normal mr-4">{{ $t('data.ciphers.shared_with') }}</p>
          <div
            :class="showMember ? 'gap-y-3 py-3' : ''"
            class="col-span-4 flex flex-wrap"
          >
            <div
              v-for="item in showMember ? emails : emails.slice(0, 3)"
              :key="item"
              :class="
                emails.length <= 3
                  ? 'md:w-1/3 pr-3 w-full'
                  : 'pr-3 md:w-1/4 w-full'
              "
              class="flex"
            >
              <span
                class="ml-1 self-center whitespace-nowrap overflow-hidden overflow-ellipsis"
              >{{ item.email }}</span>
            </div>
            <div
              v-if="!showMember && emails.length > 3"
              class="bg-[#C4C4C4] h-10 w-10 rounded-full mt-3 text-[20px] text-black font-semibold text-center py-2"
              @click="showMember = true"
            >
              {{ emails.length >= 103 ? '99+' : `+${emails.length - 3}` }}
            </div>
            <div
              v-if="showMember"
              class="cursor-pointer text-primary self-center"
              @click="showMember = false"
            >
              {{ $t('common.collapse') }}
            </div>
          </div>
        </div>
        <!-- Share with end -->
      </div>
      <!-- Display cipher info end -->
    </client-only>
  </div>
</template>

<script>
import find from 'lodash/find'
import PasswordStrength from '../../password/PasswordStrength'
import { CipherType } from '../../../core/enums/cipherType'
import TextHaveCopy from '../../../components/cipher/TextHaveCopy'
import Vnodes from '../../../components/Vnodes'
import { WALLET_APP_LIST } from '../../../utils/crypto/applist/index'
import { CHAIN_LIST } from '../../../utils/crypto/chainlist/index'
import { FieldType } from '../../../jslib/src/enums/fieldType'
import InputSeedPhrase from '../../input/InputSeedPhrase'

export default {
  components: {
    TextHaveCopy,
    PasswordStrength,
    Vnodes,
    InputSeedPhrase
  },
  props: {
    cipherData: {
      type: Object,
      default: () => ({})
    },
    emails: {
      type: Array,
      default: () => []
    },
    isPublic: {
      type: Boolean,
      default: () => false
    }
  },
  data () {
    return {
      showPassword: false,
      CipherType,
      showMember: false,
      FieldType,
      hideAll: true
    }
  },
  computed: {
    isMasterPw () {
      return this.cipher.type === CipherType.MasterPassword
    },
    cipher () {
      const item = { ...this.cipherData }
      if (item.type === CipherType.CryptoWallet) {
        try {
          item.cryptoWallet = JSON.parse(item.notes)
          if (item.cryptoWallet) {
            item.cryptoWallet.walletApp = item.cryptoWallet.walletApp
              ? this.findWalletApp(
                WALLET_APP_LIST,
                item.cryptoWallet.walletApp.alias
              )
              : {}
            item.cryptoWallet.networks = item.cryptoWallet.networks
              ? item.cryptoWallet.networks.map(n =>
                CHAIN_LIST.find(c => c.alias === n.alias)
              )
              : []
          }
        } catch (error) {
          console.log(error)
        }
      }
      return item
    },
    passwordStrength () {
      if (!this.$passwordGenerationService) {
        return {}
      }
      if (
        this.cipher.login &&
        [CipherType.Login, CipherType.MasterPassword].includes(this.cipher.type)
      ) {
        return (
          this.$passwordGenerationService.passwordStrength(
            this.cipher.login.password,
            ['cystack']
          ) || {}
        )
      } else if (this.cipher.cryptoWallet) {
        return (
          this.$passwordGenerationService.passwordStrength(
            this.cipher.cryptoWallet.password,
            ['cystack']
          ) || {}
        )
      }
      return {}
    }
  },

  methods: {
    findWalletApp (walletList, alias) {
      return find(walletList, a => a.alias === alias)
    }
  }
}
</script>
