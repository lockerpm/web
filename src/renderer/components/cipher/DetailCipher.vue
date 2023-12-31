<template>
  <div class="flex flex-col flex-grow relative">
    <div class="flex-grow lg:px-28 py-8 md:px-10 px-4 mb-20">
      <div class="flex items-center justify-between">
        <!-- Breadcrumb -->
        <el-breadcrumb class="truncate" separator-class="el-icon-arrow-right">
          <template v-if="getRouteBaseName() === 'vault-folders-folderId-id'">
            <el-breadcrumb-item :to="localeRoute({ name: 'vault' })">
              {{ $t('sidebar.vault') }}
            </el-breadcrumb-item>
            <el-breadcrumb-item
              class="flex items-center"
              :to="
                localeRoute({
                  name: 'vault-folders-folderId',
                  params: $route.params
                })
              "
            >
              {{ folder.name || collection.name }}
            </el-breadcrumb-item>
          </template>
          <template v-else>
            <el-breadcrumb-item :to="localeRoute({ name: routeName })">
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
          <!-- Edit -->
          <button
            v-if="canManageItem(organizations, cipher) && !cipher.isDeleted"
            class="btn btn-icon btn-xs btn-action"
            @click="addEdit"
          >
            <i class="fa fa-pen" />
          </button>
          <!-- Edit end -->

          <!-- Share -->
          <el-dropdown
            v-if="
              isCipherShareable(cipher, organizations) ||
                isCipherQuickShareable(cipher)
            "
            trigger="click"
            :hide-on-click="false"
          >
            <button class="btn btn-icon btn-xs hover:bg-black-400 mr-3">
              <i class="far fa-share-square" />
            </button>
            <el-dropdown-menu slot="dropdown">
              <!-- Normal share -->
              <el-tooltip
                :content="$t('data.sharing.share_desc')"
                placement="top"
              >
                <el-dropdown-item
                  v-if="isCipherShareable(cipher, organizations)"
                  @click.native="shareItem(cipher)"
                >
                  {{ $t('common.in_app_share') }}
                </el-dropdown-item>
              </el-tooltip>
              <!-- Normal share end -->

              <!-- Quick share -->
              <el-tooltip
                :content="$t('data.sharing.quick_share_desc')"
                placement="bottom"
              >
                <el-dropdown-item
                  v-if="isCipherQuickShareable(cipher)"
                  @click.native="quickShareItem(cipher)"
                >
                  {{ $t('common.get_share_link') }}
                </el-dropdown-item>
              </el-tooltip>
              <!-- Quick share end -->
            </el-dropdown-menu>
          </el-dropdown>
          <!-- Share end -->

          <!-- More -->
          <el-dropdown trigger="click" :hide-on-click="false">
            <button class="btn btn-icon btn-xs btn-action">
              <i class="fas fa-ellipsis-h" />
            </button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="moveFolders([cipher.id])">
                {{ $t('common.move_folder') }}
              </el-dropdown-item>

              <template v-if="isOwner(organizations, cipher)">
                <template v-if="cipher.isDeleted">
                  <el-dropdown-item @click.native="restoreCiphers([cipher.id])">
                    <span class="text-primary">{{ $t('common.restore') }}</span>
                  </el-dropdown-item>

                  <el-dropdown-item @click.native="deleteCiphers([cipher.id])">
                    <span class="text-danger">{{
                      $t('common.permanently_delete')
                    }}</span>
                  </el-dropdown-item>
                </template>

                <el-dropdown-item
                  v-else
                  @click.native="moveTrashCiphers([cipher])"
                >
                  <span class="text-danger">{{ $t('common.delete') }}</span>
                </el-dropdown-item>
              </template>

              <el-dropdown-item v-else @click.native="handleLeaveShare(cipher)">
                <span class="text-danger">{{ $t('data.ciphers.leave') }}</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <!-- More end -->
        </div>
        <!-- Actions end -->
      </div>

      <client-only>
        <!-- Icon + name -->
        <div class="mt-20 mb-9 text-center">
          <div
            class="mb-4 text-[70px]"
            :class="{ 'filter grayscale': cipher.isDeleted }"
          >
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
          <login-details
            v-if="cipher.type === CipherType.Login"
            :cipher="cipher"
          />
          <!-- Password end -->

          <!-- Master Password -->
          <master-pw-details
            v-if="cipher.type === CipherType.MasterPassword"
            :cipher="cipher"
          />
          <!-- Master Password end -->

          <!-- Card -->
          <card-details
            v-if="cipher.type === CipherType.Card"
            :cipher="cipher"
          />
          <!-- Card end -->

          <!-- Identity -->
          <identity-details
            v-if="cipher.type === CipherType.Identity"
            :cipher="cipher"
          />
          <!-- Identity end -->

          <!-- Crypto wallet -->
          <crypto-backup-details
            v-if="
              cipher.type === CipherType.CryptoWallet && cipher.cryptoWallet
            "
            :cipher="cipher"
          />
          <!-- Crypto wallet end -->

          <!-- Driver license -->
          <driver-license-details
            v-if="
              cipher.type === CipherType.DriverLicense && cipher.driverLicense
            "
            :cipher="cipher"
          />
          <!-- Driver license end -->

          <!-- Citizen id -->
          <citizen-id-details
            v-if="cipher.type === CipherType.CitizenID && cipher.citizenId"
            :cipher="cipher"
          />
          <!-- Citizen id end -->

          <!-- Passport -->
          <passport-details
            v-if="cipher.type === CipherType.Passport && cipher.passport"
            :cipher="cipher"
          />
          <!-- Passport end -->

          <!-- SSN -->
          <ssn-details
            v-if="cipher.type === CipherType.SocialSecurityNumber && cipher.ssn"
            :cipher="cipher"
          />
          <!-- SSN end -->

          <!-- Router -->
          <router-details
            v-if="cipher.type === CipherType.WirelessRouter && cipher.router"
            :cipher="cipher"
          />
          <!-- Router end -->

          <!-- Server -->
          <server-details
            v-if="cipher.type === CipherType.Server && cipher.server"
            :cipher="cipher"
          />
          <!-- Server end -->

          <!-- API -->
          <api-details
            v-if="cipher.type === CipherType.APICipher && cipher.api"
            :cipher="cipher"
          />
          <!-- API end -->

          <!-- Database -->
          <database-details
            v-if="cipher.type === CipherType.Database && cipher.database"
            :cipher="cipher"
          />
          <!-- Database end -->

          <!-- Notes -->
          <div>
            <TextHaveCopy
              v-if="
                ![...newCipherTypes, CipherType.MasterPassword].includes(
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
              :should-hide="field.type === FieldType.Hidden"
            />
          </template>
          <!-- Custom fields end -->

          <!-- Owner -->
          <template v-if="!isMasterPw">
            <div class="grid md:grid-cols-6 cipher-item">
              <p class="!break-normal mr-4">
                {{ $t('data.ciphers.owned_by') }}
              </p>
              <div class="col-span-4 font-semibold flex items-center">
                <span>{{
                  isOwner(organizations, cipher)
                    ? $t('common.me')
                    : getTeam(organizations, cipher.organizationId).name ||
                      $t('common.me')
                }}</span>
              </div>
            </div>
          </template>
          <!-- Owner end -->

          <!-- Folder -->
          <template v-if="!isMasterPw">
            <div class="grid md:grid-cols-6 cipher-item">
              <p class="!break-normal mr-4">{{ $t('data.ciphers.folder') }}</p>
              <div class="col-span-4">
                <template
                  v-if="cipher.collectionIds && cipher.collectionIds.length"
                >
                  <div
                    v-for="item in cipher.collectionIds"
                    :key="item"
                    class="font-semibold flex items-center"
                  >
                    <img
                      :src="
                        item.id === 'unassigned'
                          ? require('~/assets/images/icons/folderSolid.svg')
                          : require('~/assets/images/icons/folderSolidShare.svg')
                      "
                      alt=""
                      class="mr-3"
                    >
                    {{ findFolder(collections, item).name }}
                  </div>
                </template>
                <div
                  v-if="cipher.folderId"
                  class="font-semibold flex items-center"
                >
                  <img
                    src="~/assets/images/icons/folderSolid.svg"
                    alt=""
                    class="mr-3"
                  >
                  {{ findFolder(folders, cipher.folderId).name }}
                </div>
              </div>
            </div>
          </template>
          <!-- Folder end -->

          <!-- Created time -->
          <template v-if="!isMasterPw">
            <div class="grid md:grid-cols-6 cipher-item">
              <p class="!break-normal mr-4">
                {{ $t('data.ciphers.created_time') }}
              </p>
              <div class="col-span-4 font-semibold flex items-center">
                <span class="break-normal">{{
                  $moment(cipher.creationDate).fromNow()
                }}</span>
              </div>
            </div>
          </template>
          <!-- Created time end -->

          <!-- Updated time -->
          <template v-if="!isMasterPw">
            <div class="grid md:grid-cols-6 cipher-item">
              <p class="!break-normal mr-4">
                {{ $t('data.ciphers.updated_time') }}
              </p>
              <div class="col-span-4 font-semibold flex items-center">
                <span class="break-normal">{{
                  $moment(cipher.revisionDate).fromNow()
                }}</span>
              </div>
            </div>
          </template>
          <!-- Updated time end -->

          <!-- Share with -->
          <div
            v-if="shareMember.length > 0"
            class="grid md:grid-cols-6 cipher-item"
          >
            <p class="!break-normal mr-4">
              {{ $t('data.ciphers.shared_with') }}
            </p>
            <div
              :class="showMember ? 'gap-y-3 py-3' : ''"
              class="col-span-4 flex flex-wrap"
            >
              <div
                v-for="member in showMember
                  ? shareMember
                  : shareMember.slice(0, 3)"
                :key="member.id"
                :class="
                  shareMember.length <= 3
                    ? 'md:w-1/3 pr-3 w-full'
                    : 'pr-3 md:w-1/4 w-full'
                "
                class="flex"
              >
                <img
                  :title="member.email"
                  class="h-10 w-10 rounded-full"
                  :src="member.avatar"
                >
                <span
                  class="ml-1 self-center whitespace-nowrap overflow-hidden overflow-ellipsis"
                >{{ member.full_name }}</span>
                <!-- <div v-if="showMember" class="self-center ml-2">{{ member.email }}</div> -->
              </div>
              <div
                v-if="!showMember && shareMember.length > 3"
                class="bg-[#C4C4C4] h-10 w-10 rounded-full mt-3 text-[20px] text-black font-semibold text-center py-2"
                @click="showMember = true"
              >
                {{
                  shareMember.length >= 103
                    ? '99+'
                    : `+${shareMember.length - 3}`
                }}
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

      <ShareCipher ref="shareCipher" @upgrade-plan="upgradePlan" />
      <QuickShareCipher ref="quickShareCipher" />
      <MoveFolder ref="moveFolder" />

      <div class="max-w-[585px] mx-auto">
        <AddEditCipher
          ref="addEditCipherDialog"
          :type="type || cipher.type"
          :organizations="organizations"
          @close="editMode = false"
          @reset-selection="back"
        />
      </div>
    </div>
  </div>
</template>

<script>
import find from 'lodash/find'
import AddEditCipher from '../../components/cipher/AddEditCipher'
import { CipherType } from '../../jslib/src/enums/cipherType'
import TextHaveCopy from '../../components/cipher/TextHaveCopy'
import Vnodes from '../../components/Vnodes'
import ShareCipher from '../../components/cipher/shares/your-shares/ShareCipher'
import QuickShareCipher from '../../components/cipher/shares/quick-shares/QuickShareCipher'
import MoveFolder from '../folder/MoveFolder'
import { FieldType } from '../../jslib/src/enums/fieldType'
import LoginDetails from './cipher-types/login/LoginDetails.vue'
import MasterPwDetails from './cipher-types/login/MasterPwDetails.vue'
import CardDetails from './cipher-types/card/CardDetails.vue'
import IdentityDetails from './cipher-types/identity/IdentityDetails.vue'
import CryptoBackupDetails from './cipher-types/crypto-backup/CryptoBackupDetails.vue'
import DriverLicenseDetails from './cipher-types/driver-license/DriverLicenseDetails.vue'
import CitizenIdDetails from './cipher-types/citizen-id/CitizenIdDetails.vue'
import PassportDetails from './cipher-types/passport/PassportDetails.vue'
import SsnDetails from './cipher-types/ssn/SsnDetails.vue'
import RouterDetails from './cipher-types/router/RouterDetails.vue'
import ServerDetails from './cipher-types/server/ServerDetails.vue'
import ApiDetails from './cipher-types/api/ApiDetails.vue'
import DatabaseDetails from './cipher-types/database/DatabaseDetails.vue'

export default {
  components: {
    TextHaveCopy,
    AddEditCipher,
    Vnodes,
    ShareCipher,
    QuickShareCipher,
    MoveFolder,
    LoginDetails,
    MasterPwDetails,
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
        return (
          find(this.collections, e => e.id === this.$route.params.folderId) || {
            name: 'Unassigned Folder',
            id: 'unassigned'
          }
        )
      }
      return {}
    },
    cipher () {
      return (
        find(this.ciphers, e => e.id === this.$route.params.id) || {
          collectionIds: []
        }
      )
    },
    shareMember () {
      const share =
        this.myShares.find(s => s.id === this.cipher.organizationId) || {}
      return share.members || []
    }
  },
  asyncComputed: {
    ciphers: {
      async get () {
        const filterById = c => {
          return c.id === this.$route.params.id
        }
        let result =
          (await this.$searchService.searchCiphers('', [filterById], null)) ||
          []
        result = result.map(item => {
          const i = this.parseNotesOfNewTypes(item)
          return i
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
          result = (await this.$folderService.getAllDecrypted()) || []
        } catch (error) {}
        return result
      },
      watch: ['$store.state.syncedCiphersToggle']
    },
    collections: {
      async get () {
        let collections = []
        try {
          collections = (await this.$collectionService.getAllDecrypted()) || []
        } catch (error) {}
        collections = collections.filter(f => f.id)
        collections.forEach(f => {
          const ciphers =
            this.ciphers &&
            (this.ciphers.filter(c => c.collectionIds.includes(f.id)) || [])
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
    quickShareItem (cipher) {
      this.$refs.quickShareCipher.openDialog(cipher)
    },
    moveFolders (ids) {
      const cipher = this.ciphers.find(c => c.id === ids[0])
      this.$refs.moveFolder.folderId = cipher ? cipher.folderId : null
      this.$refs.moveFolder.openDialog(ids)
    },
    deleteCiphers (ids) {
      this.$refs.addEditCipherDialog.deleteCiphers(ids)
    },
    moveTrashCiphers (cs) {
      this.$refs.addEditCipherDialog.moveTrashCiphers(cs)
    },
    restoreCiphers (ids) {
      this.$refs.addEditCipherDialog.restoreCiphers(ids)
    },
    findFolder (folders, id) {
      return (
        find(folders, e => e.id === id) || {
          name: this.$t('data.folders.no_folder'),
          id: 'unassigned'
        }
      )
    },
    async handleLeaveShare (cipher) {
      this.$confirm(
        this.$tc('data.notifications.leave_share', 1),
        this.$t('common.warning'),
        {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }
      )
        .then(async () => {
          const isSuccess = await this.leaveShare(cipher)
          if (isSuccess) {
            this.back()
          }
        })
        .catch(() => {})
    },
    upgradePlan () {
      this.$refs.shareCipher.closeDialog()
    },
    back () {
      if (!['/', '/lock'].includes(this.$store.state.previousPath)) {
        this.$router.back()
      }
    }
  }
}
</script>
