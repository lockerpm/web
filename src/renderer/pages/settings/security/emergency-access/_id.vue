<template>
  <div v-loading="loading" class="flex flex-col flex-column-fluid relative">
    <div class="flex-column-fluid py-10 mb-20">
      <client-only>
        <!-- <div
          class="mb font-medium"
        >
          Vault
        </div> -->
        <div class="mb-5">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item
              :to="localeRoute({ name: 'settings-security' })"
            >
              {{ $t('data.emergency_access.emergency_access') }}
            </el-breadcrumb-item>
            <el-breadcrumb-item>
              {{ emergencyAccess ? emergencyAccess.full_name : '' }}
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <el-table
          ref="multipleTable"
          :data="ciphers || []"
          style="width: 100%"
          row-class-name="hover-table-row"
        >
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
          <el-table-column label="" align="right" width="200">
            <template slot-scope="scope">
              <div class="col-actions">
                <button
                  v-if="scope.row.login.canLaunch"
                  class="btn btn-icon btn-xs hover:bg-black-400"
                  :title="$t('common.go_to_website')"
                  @click="openNewTab(scope.row.login.uri)"
                >
                  <i class="fas fa-external-link-square-alt" />
                </button>
                <el-dropdown trigger="click" :hide-on-click="false">
                  <button class="btn btn-icon btn-xs hover:bg-black-400">
                    <i class="fas fa-ellipsis-h" />
                  </button>
                  <el-dropdown-menu slot="dropdown">
                    <template
                      v-if="
                        !scope.row.isDeleted &&
                          scope.row.type === CipherType.Login
                      "
                    >
                      <el-dropdown-item
                        v-clipboard:copy="scope.row.login.username"
                        v-clipboard:success="clipboardSuccessHandler"
                        divided
                      >
                        {{ $t('common.copy') }} {{ $t('common.username') }}
                      </el-dropdown-item>
                      <el-dropdown-item
                        v-clipboard:copy="scope.row.login.password"
                        v-clipboard:success="clipboardSuccessHandler"
                      >
                        {{ $t('common.copy') }} {{ $t('common.password') }}
                      </el-dropdown-item>
                    </template>
                    <template
                      v-if="
                        !scope.row.isDeleted &&
                          scope.row.type === CipherType.SecureNote
                      "
                    >
                      <el-dropdown-item
                        v-clipboard:copy="scope.row.notes"
                        v-clipboard:success="clipboardSuccessHandler"
                        divided
                      >
                        {{ $t('common.copy') }} {{ $t('common.note') }}
                      </el-dropdown-item>
                    </template>
                    <template
                      v-if="scope.row.type === 7 && scope.row.cryptoWallet"
                    >
                      <el-dropdown-item
                        v-clipboard:copy="scope.row.cryptoWallet.seed"
                        v-clipboard:success="clipboardSuccessHandler"
                      >
                        {{ $t('common.copy') }} {{ $t('data.ciphers.seed') }}
                      </el-dropdown-item>
                      <el-dropdown-item
                        v-clipboard:copy="scope.row.cryptoWallet.address"
                        v-clipboard:success="clipboardSuccessHandler"
                      >
                        {{ $t('common.copy') }}
                        {{ $t('data.ciphers.wallet_address') }}
                      </el-dropdown-item>
                      <el-dropdown-item
                        v-clipboard:copy="scope.row.cryptoWallet.privateKey"
                        v-clipboard:success="clipboardSuccessHandler"
                      >
                        {{ $t('common.copy') }}
                        {{ $t('data.ciphers.private_key') }}
                      </el-dropdown-item>
                      <el-dropdown-item
                        v-clipboard:copy="scope.row.cryptoWallet.password"
                        v-clipboard:success="clipboardSuccessHandler"
                      >
                        {{ $t('common.copy') }}
                        {{ $t('data.ciphers.password_pin') }}
                      </el-dropdown-item>
                    </template>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </client-only>
    </div>
    <ViewGrantorCipher ref="addEditCipherDialog" :type="type" />
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'
import { CipherType } from '@/jslib/src/enums'
import Vnodes from '@/components/Vnodes'
import ViewGrantorCipher from '@/components/setting/ViewGrantorCipher'
import { Cipher } from '@/core/models/domain/cipher'
import { CipherData } from '@/core/models/data/cipherData'
import { SymmetricCryptoKey } from '@/jslib/src/models/domain/symmetricCryptoKey'
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
      return this.list_granted.find(item => item.id === this.$route.params.id)
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
      let ciphers = response.ciphers
      ciphers = ciphers.filter(cipher =>
        [
          CipherType.Login,
          CipherType.SecureNote,
          CipherType.Card,
          CipherType.Identity,
          7
        ].includes(cipher.type)
      )
      const decCiphers = []
      const oldKeyBuffer = await this.$cryptoService.rsaDecrypt(
        response.key_encrypted
      )
      const oldEncKey = new SymmetricCryptoKey(oldKeyBuffer)

      const promises = []
      ciphers.forEach(cipherResponse => {
        const cipherData = new CipherData(cipherResponse)
        const cipher = new Cipher(cipherData)
        promises.push(cipher.decrypt(oldEncKey).then(c => decCiphers.push(c)))
      })

      await Promise.all(promises)
      decCiphers.map(item => {
        if (item.type === 7) {
          try {
            item.cryptoWallet = JSON.parse(item.notes)
            // item.notes = item.cryptoWallet ? item.cryptoWallet.notes : ''
          } catch (error) {
            console.log(error)
          }
        }
        return {
          ...item
        }
      })
      decCiphers.sort(this.$cipherService.getLocaleSortingFunction())

      return decCiphers
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
