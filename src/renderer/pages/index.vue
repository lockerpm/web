<template>
  <div class="flex flex-col relative">
    <div class="flex-grow lg:px-28 pt-5 px-10">
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
      </div>
    </div>
    <div class="border-t-1 bg-black-300 fixed bottom-0 flex items-center justify-center border-0 border-t py-2 w-[calc(100%-15rem)] bg-grey-500 border-black-600">
      <span class="mr-3">Bạn còn 14 ngày trong thời gian dùng thử.</span>
      <button class="btn btn-primary" @click="createKey">Nâng cấp ngay</button>
    </div>
  </div>
</template>

<script>
// import { cryptoService } from '../jslib/init'
export default {
  data () {
    return {
      cryptoService: null
    }
  },
  mounted () {
  },
  methods: {
    // async createKey () {
    //   // eslint-disable-next-line new-cap
    //   const masterPassword = '1234567891'
    //   try {
    //     const key = await cryptoService.makeKey(masterPassword, 'sonnh1995@gmail.com', 0, 100000)
    //     console.log(key)
    //     const encKey = await cryptoService.makeEncKey(key)
    //     console.log(encKey)
    //     const hashedPassword = await cryptoService.hashPassword(masterPassword, key)
    //     console.log(hashedPassword)
    //     const keys = await cryptoService.makeKeyPair(encKey[0])
    //     console.log(keys)
    //     this.postRegister(hashedPassword, null, encKey[1].encryptedString, 0, 100000, '', keys)
    //   } catch (e) {
    //     console.log(e)
    //   }
    // },
    // postRegister (masterPasswordHash, masterPasswordHint, key, kdf, kdfIterations, referenceData, keys) {
    //   this.$axios.$post('cystack_platform/pm/users/register', {
    //     name: 'Nguyen Hong Son',
    //     email: 'sonnh1995@gmail.com',
    //     masterPasswordHash,
    //     masterPasswordHint,
    //     key,
    //     kdf,
    //     kdfIterations,
    //     referenceData,
    //     keys: {
    //       public_key: keys[0],
    //       encryptedPrivateKey: key[0].encryptedString
    //     }
    //   })
    //     .then(res => {
    //       console.log(res)
    //     })
    // }
  }
}
</script>
