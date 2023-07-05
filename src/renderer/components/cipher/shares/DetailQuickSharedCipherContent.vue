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
        <login-details
          v-if="cipher.type === CipherType.Login"
          :cipher="cipher"
          :is-public="isPublic"
          :hide-all="hideAll"
        />
        <!-- Password end -->

        <!-- Card -->
        <card-details
          v-if="cipher.type === CipherType.Card"
          :cipher="cipher"
          :is-public="isPublic"
          :hide-all="hideAll"
        />
        <!-- Card end -->

        <!-- Identity -->
        <identity-details
          v-if="cipher.type === CipherType.Identity"
          :cipher="cipher"
          :is-public="isPublic"
          :hide-all="hideAll"
        />
        <!-- Identity end -->

        <!-- Crypto wallet -->
        <crypto-backup-details
          v-if="cipher.type === CipherType.CryptoWallet && cipher.cryptoWallet"
          :cipher="cipher"
          :is-public="isPublic"
          :hide-all="hideAll"
        />
        <!-- Crypto wallet end -->

        <!-- Driver license -->
        <driver-license-details
          v-if="
            cipher.type === CipherType.DriverLicense && cipher.driverLicense
          "
          :cipher="cipher"
          :is-public="isPublic"
          :hide-all="hideAll"
        />
        <!-- Driver license end -->

        <!-- Citizen id -->
        <citizen-id-details
          v-if="cipher.type === CipherType.CitizenID && cipher.citizenId"
          :cipher="cipher"
          :is-public="isPublic"
          :hide-all="hideAll"
        />
        <!-- Citizen id end -->

        <!-- Passport -->
        <passport-details
          v-if="cipher.type === CipherType.Passport && cipher.passport"
          :cipher="cipher"
          :is-public="isPublic"
          :hide-all="hideAll"
        />
        <!-- Passport end -->

        <!-- SSN -->
        <ssn-details
          v-if="cipher.type === CipherType.SocialSecurityNumber && cipher.ssn"
          :cipher="cipher"
          :is-public="isPublic"
          :hide-all="hideAll"
        />
        <!-- SSN end -->

        <!-- Router -->
        <router-details
          v-if="cipher.type === CipherType.WirelessRouter && cipher.router"
          :cipher="cipher"
          :is-public="isPublic"
          :hide-all="hideAll"
        />
        <!-- Router end -->

        <!-- Server -->
        <server-details
          v-if="cipher.type === CipherType.Server && cipher.server"
          :cipher="cipher"
          :is-public="isPublic"
          :hide-all="hideAll"
        />
        <!-- Server end -->

        <!-- API -->
        <api-details
          v-if="cipher.type === CipherType.APICipher && cipher.api"
          :cipher="cipher"
          :is-public="isPublic"
          :hide-all="hideAll"
        />
        <!-- API end -->

        <!-- Database -->
        <database-details
          v-if="cipher.type === CipherType.Database && cipher.database"
          :cipher="cipher"
          :is-public="isPublic"
          :hide-all="hideAll"
        />
        <!-- Database end -->

        <!-- Notes -->
        <div>
          <TextHaveCopy
            v-if="!newCipherTypes.includes(cipher.type)"
            :label="$t('data.ciphers.notes')"
            :text="cipher.notes"
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
import { CipherType } from '../../../core/enums/cipherType'
import TextHaveCopy from '../../../components/cipher/TextHaveCopy'
import Vnodes from '../../../components/Vnodes'
import { FieldType } from '../../../jslib/src/enums/fieldType'
import LoginDetails from '../cipher-types/login/LoginDetails.vue'
import CardDetails from '../cipher-types/card/CardDetails.vue'
import IdentityDetails from '../cipher-types/identity/IdentityDetails.vue'
import CryptoBackupDetails from '../cipher-types/crypto-backup/CryptoBackupDetails.vue'
import DriverLicenseDetails from '../cipher-types/driver-license/DriverLicenseDetails.vue'
import CitizenIdDetails from '../cipher-types/citizen-id/CitizenIdDetails.vue'
import PassportDetails from '../cipher-types/passport/PassportDetails.vue'
import SsnDetails from '../cipher-types/ssn/SsnDetails.vue'
import RouterDetails from '../cipher-types/router/RouterDetails.vue'
import ServerDetails from '../cipher-types/server/ServerDetails.vue'
import ApiDetails from '../cipher-types/api/ApiDetails.vue'
import DatabaseDetails from '../cipher-types/database/DatabaseDetails.vue'

export default {
  components: {
    TextHaveCopy,
    Vnodes,
    LoginDetails,
    CardDetails,
    IdentityDetails,
    CryptoBackupDetails,
    DriverLicenseDetails,
    CitizenIdDetails,
    PassportDetails,
    SsnDetails,
    RouterDetails,
    ServerDetails,
    ApiDetails,
    DatabaseDetails
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
    cipher () {
      return this.parseNotesOfNewTypes(this.cipherData)
    }
  }
}
</script>
