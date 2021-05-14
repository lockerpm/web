<template>
  <div class="flex flex-col relative">
    <div class="flex-grow lg:px-28 pt-5 px-10 mb-20">
      <div class="flex items-center justify-between">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="localeRoute({name: 'passwords'})">
            Passwords
          </el-breadcrumb-item>
          <el-breadcrumb-item>{{ cipher.name }}</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="header-actions">
          <button class="btn btn-icon btn-xs btn-action"
                  @click="addEdit"
          >
            <i class="fa fa-pen" />
          </button>
          <button class="btn btn-icon btn-xs btn-action">
            <i class="fas fa-share-square" />
          </button>
          <el-dropdown trigger="click" :hide-on-click="false">
            <button class="btn btn-icon btn-xs btn-action">
              <i class="fas fa-ellipsis-h" />
            </button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                {{ $t('common.move_folder') }}
              </el-dropdown-item>
              <el-dropdown-item>
                <span class="text-danger">{{ $t('common.delete') }}</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <client-only>
        <div class="mt-20 mb-9 text-center">
          <div class="mb-4 text-[70px]" v-html="getIconCipher(cipher)" />
          <div class="text-head-4 font-medium">
            {{ cipher.name }}
          </div>
        </div>
        <div class="cipher-items">
          <div class="grid md:grid-cols-6 cipher-item">
            <div class="">Email or Username</div>
            <div class="col-span-4 font-semibold">
              {{ cipher.login.username }}
            </div>
            <div class="text-right">
              <button v-clipboard:copy="cipher.login.username"
                      v-clipboard:success="clipboardSuccessHandler"
                      class="btn btn-icon btn-xs btn-action"
              >
                <i class="far fa-copy" />
              </button>
            </div>
          </div>
          <div class="grid md:grid-cols-6 cipher-item">
            <div class="">Password</div>
            <div class="col-span-4 font-semibold">
              {{ cipher.login.password | filterPassword(showPassword) }}
            </div>
            <div class="text-right">
              <button class="btn btn-icon btn-xs btn-action" @click="showPassword = !showPassword">
                <i class="far"
                   :class="{'fa-eye': !showPassword, 'fa-eye-slash': showPassword}"
                />
              </button>
              <button v-clipboard:copy="cipher.login.password"
                      v-clipboard:success="clipboardSuccessHandler"
                      class="btn btn-icon btn-xs btn-action"
              >
                <i class="far fa-copy" />
              </button>
            </div>
          </div>
          <div class="grid md:grid-cols-6 cipher-item">
            <div class="">Password Security</div>
            <div class="col-span-4 font-semibold">
              <PasswordStrength :score="passwordStrength.score" />
            </div>
          </div>
          <div class="grid md:grid-cols-6 cipher-item">
            <div class="">Website Address</div>
            <div class="col-span-4 font-semibold">
              {{ cipher.login && cipher.login.uris && cipher.login.uris.length && cipher.login.uris[0]._uri }}
            </div>
            <div class="text-right">
              <button class="btn btn-icon btn-xs btn-action" @click="openNewTab(cipher.login && cipher.login.uris && cipher.login.uris.length && cipher.login.uris[0]._uri)">
                <i class="fas fa-external-link-square-alt" />
              </button>
            </div>
          </div>
        </div>
      </client-only>
    </div>
    <AddEditCipher ref="addEditCipherDialog" @updated-cipher="getCipher" />
  </div>
</template>

<script>
import debounce from 'lodash/debounce'
import AddEditCipher from '../../components/cipher/AddEditCipher'
import PasswordStrength from '../../components/cipher/PasswordStrength'
import { Cipher } from '../../jslib/src/models/domain/cipher.ts'
import { CipherRequest } from '../../jslib/src/models/request/cipherRequest.ts'
import { CipherType } from '../../jslib/src/enums/cipherType.ts'

export default {
  components: {
    AddEditCipher, PasswordStrength
  },
  data () {
    return {
      data: {},
      deleted: false,
      filter: null,
      searchText: '',
      cipher: new Cipher({ type: CipherType.Login }),
      showPassword: false,
      passwordStrength: {}
    }
  },
  created () {
  },
  mounted () {
    this.getCipher()
  },
  asyncComputed: {
    ciphers: {
      async get () {
        const deletedFilter = c => {
          return c.isDeleted === this.deleted
        }
        return await this.$searchService.searchCiphers(this.searchText, [this.filter, deletedFilter], null) || []
      },
      watch: ['$store.state.syncedCiphersToggle', 'deleted', 'searchText', 'filter']
    }
  },
  methods: {
    addEdit () {
      this.$refs.addEditCipherDialog.openDialog(this.cipher)
    },
    async test (id) {
      const res = await this.$cipherService.get(id)
      const cipher = new Cipher(res, true)
      console.log(cipher)
    },
    getCipher () {
      this.$axios.$get(`cystack_platform/pm/ciphers/${this.$route.params.id}`)
        .then(async res => {
          const cipher = new Cipher(res, false)
          this.cipher = await cipher.decrypt()
          this.passwordStrength = this.$passwordGenerationService.passwordStrength(this.cipher.login.password, ['cystack'])
        })
        .catch(() => {
          this.$router.push(this.localeRoute({ name: 'passwords' }))
        })
    },
    async putCipher () {
      this.cipher.name = 'Update from locker 2'
      const cipherEnc = await this.$cipherService.encrypt(this.cipher)
      const data = new CipherRequest(cipherEnc)
      this.$axios.$put(`cystack_platform/pm/ciphers/${this.$route.params.id}`, data)
        .then(res => {
          console.log(res)
        })
    },
    checkPassword: debounce(function (password) {
      console.log(password)
      return this.$passwordGenerationService.passwordStrength(String(password), ['cystack']) || {}
    }, 600)
  }
}
</script>
