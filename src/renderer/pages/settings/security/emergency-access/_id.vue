<template>
  <div v-loading="loading" class="flex flex-col flex-column-fluid relative">
    <div class="flex-column-fluid py-10 mb-20">
      <client-only>
        <!-- Breadcrumb -->
        <div class="mb-5">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item
              :to="localeRoute({ name: 'settings-security' })"
            >
              {{ $t('data.emergency_access.emergency_access') }}
            </el-breadcrumb-item>
            <el-breadcrumb-item>
              {{ emergencyAccess.full_name }}
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <!-- Breadcrumb end -->

        <!-- Cipher table -->
        <el-table
          ref="multipleTable"
          :data="ciphers || []"
          style="width: 100%"
          row-class-name="hover-table-row"
        >
          <!-- Icon + name -->
          <el-table-column prop="name" label="" show-overflow-tooltip>
            <template slot-scope="scope">
              <div class="flex items-center">
                <div class="text-[34px] mr-3 flex-shrink-0">
                  <Vnodes :vnodes="getIconCipher(scope.row, 34)" />
                </div>
                <div class="flex flex-col">
                  <a
                    class="text-black font-semibold truncate flex items-center"
                    @click="addEdit(scope.row)"
                  >
                    {{ scope.row.name }}
                    <img
                      v-if="scope.row.organizationId"
                      src="~/assets/images/icons/shares.svg"
                      alt="Shared"
                      :title="$t('common.shared_with_you')"
                      class="inline-block ml-2"
                    >
                  </a>
                  <div>
                    {{
                      scope.row.type === 7 && scope.row.cryptoWallet
                        ? scope.row.cryptoWallet.username
                        : scope.row.subTitle
                    }}
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <!-- Icon + name end -->

          <!-- Actions -->
          <el-table-column label="" align="right" width="200">
            <template slot-scope="scope">
              <div class="col-actions">
                <!-- Open URL in new tab -->
                <button
                  v-if="scope.row.login.canLaunch"
                  class="btn btn-icon btn-xs hover:bg-black-400"
                  :title="$t('common.go_to_website')"
                  @click="openNewTab(scope.row.login.uri)"
                >
                  <i class="fas fa-external-link-square-alt" />
                </button>
                <!-- Open URL in new tab end -->

                <!-- Copy -->
                <el-dropdown
                  v-if="
                    !scope.row.isDeleted && getCopyableValues(scope.row).length
                  "
                  trigger="click"
                  :hide-on-click="false"
                >
                  <button class="btn btn-icon btn-xs hover:bg-black-400">
                    <i class="far fa-clone" />
                  </button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      v-for="(copyKey, index) in getCopyableValues(scope.row)"
                      :key="index"
                      v-clipboard:copy="copyKey.value"
                      v-clipboard:success="clipboardSuccessHandler"
                      :disabled="!copyKey.value"
                    >
                      {{ $t('common.copy') }} {{ $t(copyKey.label) }}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                <!-- Copy end -->
              </div>
            </template>
          </el-table-column>
          <!-- Actions end -->
        </el-table>
        <!-- Cipher table -->
      </client-only>
    </div>

    <ViewGrantorCipher ref="addEditCipherDialog" />
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'
import { CipherMapper } from '../../../../constants'
import { CipherType } from '@/core/enums'
import Vnodes from '@/components/Vnodes'
import ViewGrantorCipher from '@/components/setting/emergency-access/ViewGrantorCipher'
import { Cipher } from '@/core/models/domain/cipher'
import { CipherData } from '@/core/models/data/cipherData'
import { SymmetricCryptoKey } from '@/core/models/domain/symmetricCryptoKey'
import { EncString } from '@/core/models/domain/encString'

export default {
  components: {
    Vnodes,
    ViewGrantorCipher
  },

  data () {
    return {
      id: null,
      ciphers: [],
      CipherType,
      loading: false,
      list_granted: []
    }
  },

  computed: {
    emergencyAccess () {
      return (
        this.list_granted.find(item => item.id === this.$route.params.id) || {}
      )
    }
  },

  mounted () {
    if (this.$route.params.id === null) {
      return this.$router.push(
        this.localePath('settings/security/emergency-access')
      )
    }
    this.id = this.$route.params.id
    this.load()
    this.getListGranted()
  },

  methods: {
    async load () {
      try {
        this.loading = true
        const data = await this.$axios.$post(
          `/cystack_platform/pm/emergency_access/${this.id}/view`
        )
        this.ciphers = await this.getAllCiphers(data)
      } catch (error) {
      } finally {
        this.loading = false
      }
    },

    async getAllCiphers (response) {
      const allowedCipherTypes = Object.values(CipherMapper)
        .filter(i => !i.hideFromCipherList && !i.noCreate)
        .map(i => i.type)

      // Get enc key
      let encKey
      try {
        const keyBuffer = await this.$cryptoService.rsaDecrypt(
          response.key_encrypted
        )
        encKey = new SymmetricCryptoKey(keyBuffer)
      } catch (error) {
        this.notify('Invalid key, cannot decrypt data', 'warning')
        return
      }

      // Decrypt orgs
      const orgMap = {}
      try {
        const privateKey = await this.$cryptoService.decryptToBytes(
          new EncString(response.private_key),
          encKey
        )
        const promises = []
        const _getOrgKey = async (id, key) => {
          const decKeyBuffer = await this.$cryptoService.rsaDecrypt(
            key,
            privateKey
          )
          orgMap[id] = new SymmetricCryptoKey(decKeyBuffer)
        }
        response.organizations.forEach(org => {
          promises.push(_getOrgKey(org.id, org.key))
        })
        await Promise.allSettled(promises)
      } catch (error) {
        //
      }

      // Decrypt ciphers
      const decCiphers = []

      try {
        const ciphers = response.ciphers.filter(cipher =>
          allowedCipherTypes.includes(cipher.type)
        )
        const promises = []
        const _decryptCipher = async cipherResponse => {
          const cipherData = new CipherData(cipherResponse)
          const cipher = new Cipher(cipherData)
          const decCipher = await cipher.decrypt(
            orgMap[cipherResponse.organization_id] || encKey
          )
          decCiphers.push(decCipher)
        }
        ciphers.forEach(cipherResponse => {
          promises.push(_decryptCipher(cipherResponse))
        })
        await Promise.allSettled(promises)
      } catch (error) {
        //
      }

      // Done, process new types and sort
      const res = decCiphers.map(item => {
        const i = this.parseNotesOfNewTypes(item)
        return i
      })
      res.sort(this.$cipherService.getLocaleSortingFunction())
      return res
    },

    addEdit (cipher) {
      this.$refs.addEditCipherDialog.openDialog(cloneDeep(cipher))
    },

    getListGranted () {
      this.$axios
        .$get('cystack_platform/pm/emergency_access/granted')
        .then(res => {
          this.list_granted = res
        })
        .catch(() => {
          this.list_granted = []
        })
    }
  }
}
</script>

<style lang="scss" scoped></style>
