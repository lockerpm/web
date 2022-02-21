<template>
  <div class="flex flex-col flex-grow relative">
    <div class="flex-grow lg:px-28 py-8 px-10 mb-20">
      <div class="flex items-center justify-between">
        <el-breadcrumb separator-class="el-icon-arrow-right">
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
              {{ folder.name }}
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
        <div class="header-actions">
          <button
            v-if="canManageItem(organizations, cipher)"
            class="btn btn-icon btn-xs btn-action"
            @click="addEdit"
          >
            <i class="fa fa-pen" />
          </button>
          <button
            v-if="canShareItem(organizations, cipher)"
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
      </div>
      <client-only>
        <div class="mt-20 mb-9 text-center">
          <div class="mb-4 text-[70px]">
            <Vnodes :vnodes="getIconCipher(cipher, 34)" />
          </div>
          <div class="text-head-4 font-medium">
            {{ cipher.name }}
          </div>
        </div>
        <div v-show="!editMode" class="cipher-items">
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
          <template v-if="cipher.type === CipherType.Card">
            <TextHaveCopy :label="$t('data.ciphers.card_holder')" :text="cipher.card.cardholderName" />
            <TextHaveCopy :label="$t('data.ciphers.brand')" :text="cipher.card.brand" />
            <TextHaveCopy :label="$t('data.ciphers.card_number')" :text="cipher.card.number" />
            <TextHaveCopy :label="$t('data.ciphers.expiration_month')" :text="cipher.card.expMonth" />
            <TextHaveCopy :label="$t('data.ciphers.expiration_year')" :text="cipher.card.expYear" />
            <TextHaveCopy :label="$t('data.ciphers.cvv')" :text="cipher.card.code" should-hide :view-password="cipher.viewPassword" />
          </template>
          <template v-if="cipher.type === CipherType.Identity">
            <TextHaveCopy :label="$t('data.ciphers.title')" :text="cipher.identity.title" />
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
          <template v-if="cipher.type === CipherType.CryptoAccount">
            <TextHaveCopy label="Email / Username" :text="cipher.cryptoAccount.username" />
            <TextHaveCopy
              :label="$t('data.ciphers.password')"
              :text="cipher.cryptoAccount.password"
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
              v-show="cipher.cryptoAccount.uris"
              class="grid md:grid-cols-6 cipher-item"
            >
              <div class="">{{ $t('data.ciphers.website_address') }}</div>
              <div class="col-span-4 font-semibold">
                {{ cipher.cryptoAccount.uris.uri }}
              </div>
              <div class="text-right">
                <button v-if="cipher.cryptoAccount.uris.canLaunch" class="btn btn-icon btn-xs btn-action" :title="$t('common.go_to_website')" @click="openNewTab(cipher.cryptoAccount.uris.uri)">
                  <i class="fas fa-external-link-square-alt" />
                </button>
              </div>
            </div>
            <TextHaveCopy :label="$t('data.ciphers.phone')" :text="cipher.cryptoAccount.phone" />
            <TextHaveCopy :label="$t('data.ciphers.recovery_email')" :text="cipher.cryptoAccount.emailRecovery" />
          </template>
          <template v-if="cipher.type === CipherType.CryptoWallet">
            <TextHaveCopy label="Email" :text="cipher.cryptoWallet.email" />
            <TextHaveCopy :label="$t('data.ciphers.seed')" :text="cipher.cryptoWallet.seed" />
          </template>
          <TextHaveCopy :label="$t('data.ciphers.notes')" :text="cipher.notes" />
          <div class="grid md:grid-cols-6 cipher-item">
            <div class="">{{ $t('data.ciphers.owned_by') }}</div>
            <div class="col-span-4 font-semibold flex items-center">
              <span>{{ isOwner(organizations, cipher)? $t('common.name') : getTeam(organizations, cipher.organizationId).name || $t('common.me') }}</span>
            </div>
          </div>
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
        </div>
      </client-only>
      <ShareCipher ref="shareCipher" @upgrade-plan="upgradePlan" />
      <MoveFolder ref="moveFolder" />
      <AddEditCipher ref="addEditCipherDialog" />
      <PremiumDialog ref="premiumDialog" />
      <div class="max-w-[585px] mx-auto">
        <AddEditCipher
          ref="addEditCipherDialog"
          @close="editMode=false"
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
import { CipherType } from '../../jslib/src/enums'
import TextHaveCopy from '../../components/cipher/TextHaveCopy'
import Vnodes from '../../components/Vnodes'
import ShareCipher from '../../components/cipher/ShareCipher'
import MoveFolder from '../folder/MoveFolder'
import PremiumDialog from '../../components/upgrade/PremiumDialog.vue'
CipherType.CryptoAccount = 6
CipherType.CryptoWallet = 7
export default {
  components: {
    TextHaveCopy,
    AddEditCipher,
    PasswordStrength,
    Vnodes,
    ShareCipher,
    MoveFolder,
    PremiumDialog
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
      editMode: false
    }
  },
  computed: {
    folder () {
      return find(this.folders, e => e.id === this.cipher.folderId) || {}
    },
    collection () {
      if (this.collections) {
        return find(this.collections, e => e.id === this.$route.params.tfolderId) || { name: 'Unassigned Folder', id: 'unassigned' }
      }
      return {}
    },
    cipher () {
      return find(this.ciphers, e => e.id === this.$route.params.id) || { collectionIds: [] }
    },
    passwordStrength () {
      if (this.cipher.login && this.cipher.type === CipherType.Login) {
        return this.$passwordGenerationService.passwordStrength(this.cipher.login.password, ['cystack']) || {}
      } else if (this.cipher.cryptoAccount) {
        return this.$passwordGenerationService.passwordStrength(this.cipher.cryptoAccount.password, ['cystack']) || {}
      }
      return {}
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
        const result = await this.$mySearchService.searchCiphers('', [null, deletedFilter], null) || []
        result.map(item => {
          if (item.type === CipherType.CryptoAccount) {
            try {
              item.cryptoAccount = JSON.parse(item.notes)
              item.notes = item.cryptoAccount ? item.cryptoAccount.notes : ''
            } catch (error) {
              console.log(error)
            }
          }
          if (item.type === CipherType.CryptoWallet) {
            try {
              item.cryptoWallet = JSON.parse(item.notes)
              item.notes = item.cryptoWallet ? item.cryptoWallet.notes : ''
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
        return await this.$folderService.getAllDecrypted() || []
      },
      watch: ['$store.state.syncedCiphersToggle']
    },
    collections: {
      async get () {
        let collections = await this.$collectionService.getAllDecrypted() || []
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
      // this.$refs.addEditCipherDialog.type = this.cipher.type === CipherType.CryptoAccount ? 'CryptoAccount' : this.cipher.type === CipherType.CryptoWallet ? 'CryptoWallet' : ''
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
    }
  }
}
</script>
