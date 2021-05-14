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
      </div>
      <div class="mt-20 text-center">
        <div>
          <button class="btn btn-default" @click="logout">Logout</button>
          <button class="btn btn-default" @click="lock">Lock</button>
        </div>
      </div>
    </div>
    <div class="border-t-1 bg-black-300 fixed bottom-0 flex items-center justify-center border-0 border-t py-2 w-[calc(100%-15rem)] bg-grey-500 border-black-600">
      <span class="mr-3">Bạn còn 14 ngày trong thời gian dùng thử.</span>
      <button class="btn btn-primary" @click="deleted = !deleted">Nâng cấp ngay</button>
    </div>
  </div>
</template>

<script>
export default {
  components: {
  },
  data () {
    return {
      cryptoService: null,
      data: {},
      deleted: false,
      filter: null,
      searchText: ''
    }
  },
  created () {
  },
  mounted () {
  }
}
</script>
