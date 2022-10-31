<template>
  <div class="flex flex-col flex-grow relative">
    <div class="flex-grow lg:px-28 py-8 px-10 mb-20">
      <div class="flex items-center justify-between">
        <!-- Breadcrumb -->
        <el-breadcrumb class="truncate" separator-class="el-icon-arrow-right">
          <template v-if="getRouteBaseName() === 'vault-folders-folderId-id'">
            <el-breadcrumb-item
              :to="localeRoute({name: 'vault'})"
            >
              {{ $t('sidebar.vault') }}
            </el-breadcrumb-item>
            <el-breadcrumb-item
              class="flex items-center"
              :to="localeRoute({name: 'vault-folders-folderId', params: $route.params})"
            >
              {{ folder.name || collection.name }}
            </el-breadcrumb-item>
          </template>
          <template v-else-if="getRouteBaseName() === 'vault-teams-teamId-tfolders-tfolderId-id'">
            <el-breadcrumb-item
              :to="localeRoute({name: 'vault'})"
            >
              {{ $t('sidebar.vault') }}
            </el-breadcrumb-item>
            <el-breadcrumb-item
              class="flex items-center"
              :to="localeRoute({name: 'vault-teams-teamId-tfolders-tfolderId', params: $route.params})"
            >
              {{ getTeam(teams, $route.params.teamId).name }} - {{ collection.name }}
            </el-breadcrumb-item>
          </template>
          <template v-else>
            <el-breadcrumb-item
              :to="localeRoute({name: routeName})"
            >
              {{ $t(`sidebar.${routeName}`) }}
            </el-breadcrumb-item>
          </template>
          <el-breadcrumb-item>
            {{ cipher.name }}
          </el-breadcrumb-item>
        </el-breadcrumb>
        <!-- Breadcrumb end -->

        <!-- Actions -->
        <div v-if="!isMasterPw" class="header-actions">
          <button
            v-if="canManageItem(organizations, cipher)"
            class="btn btn-icon btn-xs btn-action"
            @click="addEdit"
          >
            <i class="fa fa-pen" />
          </button>
          <button
            v-if="isOwner(organizations, cipher)"
            class="btn btn-icon btn-xs btn-action"
            @click="shareItem(cipher)"
          >
            <i class="fas fa-share-square" />
          </button>
          <el-dropdown trigger="click" :hide-on-click="false">
            <button class="btn btn-icon btn-xs btn-action">
              <i class="fas fa-ellipsis-h" />
            </button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="moveFolders([cipher.id])">
                {{ $t('common.move_folder') }}
              </el-dropdown-item>
              <el-dropdown-item v-if="isOwner(organizations, cipher)" @click.native="deleteCiphers([cipher.id])">
                <span class="text-danger">{{ $t('common.delete') }}</span>
              </el-dropdown-item>
              <el-dropdown-item v-else @click.native="leaveShare(cipher)">
                <span class="text-danger">{{ $t('data.ciphers.leave') }}</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <!-- Actions end -->
      </div>

      <client-only>
        <!-- Icon + name -->
        <div class="mt-20 mb-9 text-center">
          <div class="mb-4 text-[70px]">
            <Vnodes :vnodes="getIconCipher(cipher, 34)" />
          </div>
          <div class="text-head-4 font-medium truncate">
            {{ cipher.name }}
          </div>
        </div>
        <!-- Icon + name end -->

        <!-- Display cipher info -->
        <div v-show="!editMode" class="cipher-items">
          <!-- Password -->
          <template v-if="cipher.type === CipherType.Login">
            <TextHaveCopy label="Email / Username" :text="cipher.login.username" />
            <TextHaveCopy
              :label="$t('data.ciphers.password')"
              :text="cipher.login.password"
              :view-password="cipher.viewPassword"
              should-hide
            />
            <div class="grid md:grid-cols-6 cipher-item">
              <div class="">{{ $t('data.ciphers.password_security') }}</div>
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
              <div class="">{{ $t('data.ciphers.website_address') }}</div>
              <div class="col-span-4 font-semibold">
                {{ item.uri }}
              </div>
              <div class="text-right">
                <button v-if="item.canLaunch" class="btn btn-icon btn-xs btn-action" :title="$t('common.go_to_website')" @click="openNewTab(item.uri)">
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
              <div class="">{{ $t('data.ciphers.password_security') }}</div>
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
              <div class="">{{ $t('data.ciphers.website_address') }}</div>
              <div class="col-span-4 font-semibold">
                {{ item.uri }}
              </div>
              <div class="text-right">
                <button v-if="item.canLaunch" class="btn btn-icon btn-xs btn-action" :title="$t('common.go_to_website')" @click="openNewTab(item.uri)">
                  <i class="fas fa-external-link-square-alt" />
                </button>
              </div>
            </div>
          </template>
          <!-- Master Password end -->

          <!-- Card -->
          <template v-if="cipher.type === CipherType.Card">
            <TextHaveCopy :label="$t('data.ciphers.card_holder')" :text="cipher.card.cardholderName" />
            <TextHaveCopy :label="$t('data.ciphers.brand')" :text="cipher.card.brand" />
            <TextHaveCopy :label="$t('data.ciphers.card_number')" :text="cipher.card.number" />
            <TextHaveCopy :label="$t('data.ciphers.expiration_month')" :text="cipher.card.expMonth" />
            <TextHaveCopy :label="$t('data.ciphers.expiration_year')" :text="cipher.card.expYear" />
            <TextHaveCopy :label="$t('data.ciphers.cvv')" :text="cipher.card.code" should-hide :view-password="cipher.viewPassword" />
          </template>
          <!-- Card end -->

          <!-- Identity -->
          <template v-if="cipher.type === CipherType.Identity">
            <TextHaveCopy :label="$t('data.ciphers.title')" :text="cipher.identity.title?$t(`common.${cipher.identity.title}`):null" />
            <TextHaveCopy :label="$t('data.ciphers.first_name')" :text="cipher.identity.firstName" />
            <TextHaveCopy :label="$t('data.ciphers.last_name')" :text="cipher.identity.lastName" />
            <TextHaveCopy label="Username" :text="cipher.identity.username" />
            <TextHaveCopy label="Email" :text="cipher.identity.email" />
            <TextHaveCopy :label="$t('data.ciphers.company')" :text="cipher.identity.company" />
            <TextHaveCopy :label="$t('data.ciphers.ssn')" :text="cipher.identity.ssn" />
            <TextHaveCopy :label="$t('data.ciphers.passport')" :text="cipher.identity.passportNumber" />
            <TextHaveCopy :label="$t('data.ciphers.license')" :text="cipher.identity.licenseNumber" />
            <TextHaveCopy :label="$t('data.ciphers.address') + '1'" :text="cipher.identity.address1" />
            <TextHaveCopy :label="$t('data.ciphers.address') + '2'" :text="cipher.identity.address2" />
            <TextHaveCopy :label="$t('data.ciphers.city_town')" :text="cipher.identity.city" />
            <TextHaveCopy :label="$t('data.ciphers.state_province')" :text="cipher.identity.state" />
            <TextHaveCopy :label="$t('data.ciphers.zip')" :text="cipher.identity.postalCode" />
            <TextHaveCopy :label="$t('data.ciphers.country')" :text="cipher.identity.country" />
          </template>
          <!-- Identity end -->

          <!-- Crypto wallet -->
          <template v-if="cipher.type === CipherType.CryptoWallet && cipher.cryptoWallet">
            <div class="grid md:grid-cols-6 cipher-item">
              <div class="">{{ $t('data.ciphers.wallet_app') }}</div>
              <div class="col-span-4">
                <div v-if="cipher.cryptoWallet.walletApp" class="font-semibold flex items-center">
                  <img :src="cipher.cryptoWallet.walletApp.logo" alt="" class="mr-3 h-[34px] w-[34px] rounded-full"> {{ cipher.cryptoWallet.walletApp.name }}
                </div>
              </div>
            </div>
            <TextHaveCopy :label="$t('data.ciphers.username')" :text="cipher.cryptoWallet.username" />
            <TextHaveCopy
              :label="$t('data.ciphers.password_pin')"
              :text="cipher.cryptoWallet.password"
              :view-password="cipher.viewPassword"
              should-hide
            />

            <!-- <div class="grid md:grid-cols-6 cipher-item">
              <div class="">{{ $t('data.ciphers.password_security') }}</div>
              <div class="col-span-4 font-semibold">
                <PasswordStrength :score="passwordStrength.score" />
              </div>
            </div> -->
            <TextHaveCopy :label="$t('data.ciphers.wallet_address')" :text="cipher.cryptoWallet.address" />
            <TextHaveCopy
              :label="$t('data.ciphers.private_key')"
              :text="cipher.cryptoWallet.privateKey"
              :view-password="cipher.viewPassword"
              should-hide
            />
            <!-- <TextHaveCopy :label="$t('data.ciphers.seed')" :text="cipher.cryptoWallet.seed" /> -->
            <div class="grid md:grid-cols-6 cipher-item">
              <div class="">{{ $t('data.ciphers.seed') }}</div>
              <div class="col-span-4 font-semibold">
                <InputSeedPhrase
                  v-model="cipher.cryptoWallet.seed"
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
            <div class="grid md:grid-cols-6 cipher-item">
              <div class="">{{ $t('data.ciphers.networks') }}</div>
              <div class="col-span-4">
                <div v-if="cipher.cryptoWallet.networks && cipher.cryptoWallet.networks.length" class="grid md:grid-cols-3 gap-2">
                  <div v-for="network in cipher.cryptoWallet.networks" :key="network.alias" class="font-semibold flex items-center break-normal">
                    <img :src="network.logo" alt="" class="mr-3 h-[34px] w-[34px] rounded-full"> {{ network.name }}
                  </div>
                </div>
              </div>
            </div>
            <TextHaveCopy :label="$t('data.ciphers.notes')" :text="cipher.cryptoWallet.notes" :text-area="true" />
          </template>
          <!-- Crypto wallet end -->

          <!-- Notes -->
          <template>
            <TextHaveCopy v-if="![CipherType.CryptoWallet, CipherType.MasterPassword].includes(cipher.type)" :label="$t('data.ciphers.notes')" :text="cipher.notes" :text-area="true" />
            <TextHaveCopy
              v-if="cipher.type === CipherType.MasterPassword"
              :label="$t('data.ciphers.notes')"
              :text="$t('master_pw_item.desc')"
              :text-area="true"
            />
          </template>
          <!-- Notes end -->

          <!-- Custom fields -->
          <template v-for="(field, index) in cipher.fields">
            <TextHaveCopy v-if="field.name || field.value!=null" :key="index" :label="field.name" :text="field.value" :should-hide="field.type === FieldType.Hidden" />
          </template>
          <!-- Custom fields end -->

          <!-- Owner -->
          <template v-if="!isMasterPw">
            <div class="grid md:grid-cols-6 cipher-item">
              <div class="">{{ $t('data.ciphers.owned_by') }}</div>
              <div class="col-span-4 font-semibold flex items-center">
                <span>{{ isOwner(organizations, cipher)? $t('common.me') : getTeam(organizations, cipher.organizationId).name || $t('common.me') }}</span>
              </div>
            </div>
          </template>
          <!-- Owner end -->

          <!-- Folder -->
          <template v-if="!isMasterPw">
            <div class="grid md:grid-cols-6 cipher-item">
              <div class="">{{ $t('data.ciphers.folder') }}</div>
              <div class="col-span-4">
                <template v-if="cipher.collectionIds && cipher.collectionIds.length">
                  <div
                    v-for="item in cipher.collectionIds"
                    :key="item"
                    class="font-semibold flex items-center"
                  >
                    <img :src="item.id === 'unassigned' ? require('~/assets/images/icons/folderSolid.svg') : require('~/assets/images/icons/folderSolidShare.svg')" alt="" class="mr-3"> {{ findFolder(collections, item).name }}
                  </div>
                </template>
                <div v-if="cipher.folderId" class="font-semibold flex items-center">
                  <img src="~/assets/images/icons/folderSolid.svg" alt="" class="mr-3"> {{ findFolder(folders, cipher.folderId).name }}
                </div>
              </div>
            </div>
          </template>
          <!-- Folder end -->

          <!-- Share with -->
          <div v-if="shareMember.length > 0" class="grid md:grid-cols-6 cipher-item">
            <div class="">{{ $t('data.ciphers.shared_with') }}</div>
            <div :class="showMember?'gap-y-3 py-3': ''" class="col-span-4 flex flex-wrap">
              <div v-for="member in showMember? shareMember : shareMember.slice(0,3)" :key="member.id" :class="shareMember.length<=3 ? 'md:w-1/3 pr-3 w-full':'pr-3 md:w-1/4 w-full'" class="flex">
                <img :title="member.email" class="h-10 w-10 rounded-full" :src="member.avatar">
                <span class="ml-1 self-center whitespace-nowrap overflow-hidden overflow-ellipsis">{{ member.full_name }}</span>
                <!-- <div v-if="showMember" class="self-center ml-2">{{ member.email }}</div> -->
              </div>
              <div v-if="!showMember && shareMember.length>3" class="bg-[#C4C4C4] h-10 w-10 rounded-full mt-3 text-[20px] text-black font-semibold text-center py-2" @click="showMember=true">
                {{ shareMember.length >= 103 ? '99+' : `+${shareMember.length - 3}` }}
              </div>
              <div v-if="showMember" class="cursor-pointer text-primary self-center" @click="showMember=false">{{ $t('common.collapse') }}</div>
            </div>
          </div>
          <!-- Share with end -->
        </div>
        <!-- Display cipher info end -->
      </client-only>

      <ShareCipher ref="shareCipher" @upgrade-plan="upgradePlan" />
      <MoveFolder ref="moveFolder" />
      <AddEditCipher ref="addEditCipherDialog" @reset-selection="back" />
      <PremiumDialog ref="premiumDialog" />

      <div class="max-w-[585px] mx-auto">
        <AddEditCipher
          ref="addEditCipherDialog"
          @close="editMode=false"
          @reset-selection="back"
        />
      </div>
    </div>
  </div>
</template>

<script>
import debounce from 'lodash/debounce'
import find from 'lodash/find'
import AddEditCipher from '../../components/cipher/AddEditCipher'
import PasswordStrength from '../password/PasswordStrength'
import { CipherType } from '../../core/enums/cipherType'
import TextHaveCopy from '../../components/cipher/TextHaveCopy'
import Vnodes from '../../components/Vnodes'
import ShareCipher from '../../components/cipher/ShareCipher'
import MoveFolder from '../folder/MoveFolder'
import PremiumDialog from '../../components/upgrade/PremiumDialog.vue'
import { WALLET_APP_LIST } from '../../utils/crypto/applist/index'
import { CHAIN_LIST } from '../../utils/crypto/chainlist/index'
import { FieldType } from '../../jslib/src/enums/fieldType'
import InputSeedPhrase from '../input/InputSeedPhrase'

export default {
  components: {
    TextHaveCopy,
    AddEditCipher,
    PasswordStrength,
    Vnodes,
    ShareCipher,
    MoveFolder,
    PremiumDialog,
    InputSeedPhrase
  },
  props: {
    type: {
      type: String,
      default: ''
    },
    routeName: {
      type: String,
      default: 'passwords'
    }
  },
  data () {
    return {
      // cipher: {},
      showPassword: false,
      CipherType,
      editMode: false,
      showMember: false,
      FieldType
    }
  },
  computed: {
    isMasterPw () {
      return this.cipher.type === CipherType.MasterPassword
    },
    folder () {
      return find(this.folders, e => e.id === this.cipher.folderId) || {}
    },
    collection () {
      if (this.collections) {
        return find(this.collections, e => e.id === this.$route.params.folderId) || { name: 'Unassigned Folder', id: 'unassigned' }
      }
      return {}
    },
    cipher () {
      return find(this.ciphers, e => e.id === this.$route.params.id) || { collectionIds: [] }
    },
    passwordStrength () {
      if (this.cipher.login && [CipherType.Login, CipherType.MasterPassword].includes(this.cipher.type)) {
        return this.$passwordGenerationService.passwordStrength(this.cipher.login.password, ['cystack']) || {}
      } else if (this.cipher.cryptoWallet) {
        return this.$passwordGenerationService.passwordStrength(this.cipher.cryptoWallet.password, ['cystack']) || {}
      }
      return {}
    },
    shareMember () {
      const share = this.myShares.find(s => s.id === this.cipher.organizationId) || {}
      return share.members || []
    }
  },
  created () {
  },
  mounted () {
  },
  asyncComputed: {
    ciphers: {
      async get () {
        const deletedFilter = c => {
          return c.isDeleted === false
        }
        const result = await this.$searchService.searchCiphers('', [null, deletedFilter], null) || []
        result.map(item => {
          if (item.type === CipherType.CryptoWallet) {
            try {
              item.cryptoWallet = JSON.parse(item.notes)
              if (item.cryptoWallet) {
                item.cryptoWallet.walletApp = item.cryptoWallet.walletApp ? this.findWalletApp(WALLET_APP_LIST, item.cryptoWallet.walletApp.alias) : {}
                item.cryptoWallet.networks = item.cryptoWallet.networks ? item.cryptoWallet.networks.map(n => CHAIN_LIST.find(c => c.alias === n.alias)) : []
              }
              // item.notes = item.cryptoWallet ? item.cryptoWallet.notes : ''
            } catch (error) {
              console.log(error)
            }
          }
          return item
        })
        return result
      },
      watch: ['$store.state.syncedCiphersToggle']
    },
    organizations: {
      async get () {
        const result = await this.$userService.getAllOrganizations()
        return result
      },
      watch: ['ciphers']
    },
    folders: {
      async get () {
        let result = []
        try {
          result = await this.$folderService.getAllDecrypted() || []
        } catch (error) {
        }
        return result
      },
      watch: ['$store.state.syncedCiphersToggle']
    },
    collections: {
      async get () {
        let collections = []
        try {
          collections = await this.$collectionService.getAllDecrypted() || []
        } catch (error) {

        }
        collections = collections.filter(f => f.id)
        collections.forEach(f => {
          const ciphers = this.ciphers && (this.ciphers.filter(c => c.collectionIds.includes(f.id)) || [])
          f.ciphersCount = ciphers && ciphers.length
        })
        return collections
      },
      watch: ['$store.state.syncedCiphersToggle', 'ciphers']
    }
  },
  methods: {
    addEdit () {
      this.editMode = true
      this.$refs.addEditCipherDialog.openDialog(this.cipher, false, true)
    },
    shareItem (cipher) {
      this.$refs.shareCipher.openDialog(cipher)
    },
    moveFolders (ids) {
      const cipher = this.ciphers.find(c => c.id === ids[0])
      this.$refs.moveFolder.folderId = cipher ? cipher.folderId : null
      this.$refs.moveFolder.openDialog(ids)
    },
    deleteCiphers (ids) {
      this.$refs.addEditCipherDialog.deleteCiphers(ids)
    },
    async getCipher () {
      // this.folders = await this.getFolders()
      // this.$axios.$get(`cystack_platform/pm/ciphers/${this.$route.params.id}`)
      //   .then(async res => {
      //     res = new CipherResponse(res)
      //     const cipher = new Cipher(res, false)
      //     this.cipher = await cipher.decrypt()
      //     if (this.cipher.type === CipherType.Login) {
      //       this.passwordStrength = this.$passwordGenerationService.passwordStrength(this.cipher.login.password, ['cystack']) || {}
      //     }
      //   })
      //   .catch(e => {
      //     console.log(e)
      //     // this.$router.push(this.localeRoute({ name: 'passwords' }))
      //   })
    },
    checkPassword: debounce(function (password) {
      return this.$passwordGenerationService.passwordStrength(String(password), ['cystack']) || {}
    }, 600),
    findCollection (collections, id) {
      return find(collections, e => e.id === id) || { name: 'Unassigned Folder', id: 'unassigned' }
    },
    findFolder (folders, id) {
      return find(folders, e => e.id === id) || { name: this.$t('data.folders.no_folder'), id: 'unassigned' }
    },
    findWalletApp (walletList, alias) {
      return find(walletList, a => a.alias === alias)
    },
    async leaveShare (cipher) {
      this.$confirm(this.$tc('data.notifications.leave_share', 1), this.$t('common.warning'), {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(async () => {
        try {
          await this.$axios.$post(`cystack_platform/pm/sharing/${cipher.organizationId}/leave`)
          this.notify(this.$tc('data.notifications.update_success', 1, { type: this.$tc(`type.${CipherType[cipher.type]}`, 1) }), 'success')
          this.$router.back()
        } catch (error) {
          this.notify(this.$tc('data.notifications.update_failed', 1, { type: this.$tc(`type.${CipherType[cipher.type]}`, 1) }), 'warning')
          console.log(error)
        } finally {
          this.loading = false
        }
      }).catch(() => {

      })
    },
    upgradePlan () {
      this.$refs.shareCipher.closeDialog()
      this.$refs.premiumDialog.openDialog()
    },
    back () {
      this.$router.back()
    }
  }
}
</script>
