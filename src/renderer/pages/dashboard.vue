<template>
  <div class="flex flex-col relative">
    <div class="flex-grow lg:px-28 pt-5 px-10 mb-20">
      <div class="py-8 px-6 bg-black-300 border border-grey-400 rounded">
        <div class="font-semibold">Chào mừng bạn đến mới CyPass Manager</div>
        <div class="text-black-500">
          Bạn có thể lưu trữ mật khẩu, ghi chú, hồ sơ để mua sắm trực tuyến và thậm chí cả tài liệu một cách an toàn.
          Và bất kể bạn làm việc ở đâu, kho tiền của bạn luôn đồng bộ hóa mọi thứ, vì vậy bạn có thể luôn ngăn nắp và tiết kiệm thời gian.
        </div>
      </div>
      <div class="mt-20 text-center">
        <img src="~/assets/images/dashboard-logo.svg" style="height: 56px" class="mb-5 mx-auto">
        <div class="text-2xl font-semibold mb-3.5">Hãy bắt đầu nào</div>
        <div class="text-sm text-black-500 mb-9">Thêm mục đầu tiên của bạn. Bạn sẽ tìm thấy nó ở đây bất cứ khi nào bạn cần.</div>
        <button class="btn btn-default mr-4">Thêm danh mục</button>
        <button class="btn btn-default">Nhập danh mục</button>
        <div>
          <button class="btn btn-default" @click="getSyncData">Sync Server</button>
          <button class="btn btn-default" @click="getCiphers">getCiphers</button>
          <button class="btn btn-default" @click="logout">Logout</button>
          <button class="btn btn-default" @click="test">Test</button>
        </div>
        <div>
          <addEditCipher />
        </div>
      </div>
      <div>
        <pre>{{ ciphers }}</pre>
      </div>
    </div>
    <div class="border-t-1 bg-black-300 fixed bottom-0 flex items-center justify-center border-0 border-t py-2 w-[calc(100%-15rem)] bg-grey-500 border-black-600">
      <span class="mr-3">Bạn còn 14 ngày trong thời gian dùng thử.</span>
      <button class="btn btn-primary" @click="createKey">Nâng cấp ngay</button>
    </div>
  </div>
</template>

<script>
import addEditCipher from '../components/cipher/addEditCipher'
export default {
  components: {
    addEditCipher
  },
  middleware: 'LoggedIn',
  data () {
    return {
      cryptoService: null,
      data: {},
      deleted: true,
      filter: null,
      searchText: ''
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
          console.log(c.isDeleted)
          return c.isDeleted === this.deleted
        }
        return await this.$searchService.searchCiphers(this.searchText, [this.filter, deletedFilter], null)
      },
      watch: ['$store.state.syncedCiphers']
    }
  },
  methods: {
    async createKey () {
      // eslint-disable-next-line new-cap
      const masterPassword = '12345678'
      try {
        const key = await this.$cryptoService.makeKey(masterPassword, 'sonnh1995@gmail.com', 0, 100000)
        console.log(key)
        const encKey = await this.$cryptoService.makeEncKey(key)
        console.log(encKey)
        const hashedPassword = await this.$cryptoService.hashPassword(masterPassword, key)
        console.log(hashedPassword)
        const keys = await this.$cryptoService.makeKeyPair(encKey[0])
        console.log(keys)
        this.postRegister(hashedPassword, 'Tôi thích điền gì kệ tôi', encKey[1].encryptedString, 0, 100000, '', keys)
      } catch (e) {
        console.log(e)
      }
    },
    postRegister (masterPasswordHash, masterPasswordHint, key, kdf, kdfIterations, referenceData, keys) {
      this.$axios.$post('cystack_platform/pm/users/register', {
        name: 'Nguyen Hong Son',
        email: 'sonnh1995@gmail.com',
        master_password_hash: masterPasswordHash,
        master_password_hint: masterPasswordHint,
        key,
        kdf,
        kdfIterations,
        referenceData,
        keys: {
          public_key: keys[0],
          encrypted_private_key: keys[1].encryptedString
        }
      })
        .then(res => {
          console.log(res)
        })
    },
    getSyncData () {
      this.$axios.$get('cystack_platform/pm/sync')
        .then(async res => {
          this.data = res
          const userId = await this.$userService.getUserId()

          await this.$syncService.syncProfile(res.profile)
          await this.$syncService.syncFolders(userId, res.folders)
          await this.$syncService.syncCollections(res.collections)
          await this.$syncService.syncCiphers(userId, res.ciphers)
          await this.$syncService.syncSends(userId, res.sends)
          await this.$syncService.syncSettings(userId, res.domains)
          await this.$syncService.syncPolicies(res.policies)
        })
    },
    async getCiphers () {
      console.log(await this.$cipherService.getAllDecrypted())
      console.log(await this.$cipherService.getAll())
    },
    async test () {
      const locked = await this.$vaultTimeoutService.isLocked()
      console.log(locked)
    }
  }
}
</script>
