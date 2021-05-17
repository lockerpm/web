<template>
  <div class="lg:px-28 px-10 h-[60px] flex items-center border-0 border-b border-black-200">
    <div class="flex-grow" >
      <div class="text-black-600"><i class="fa fa-search mr-4"></i>Tìm kiếm</div>
    </div>
    <div class="">
      <el-dropdown trigger="click">
        <div class="flex items-center">
          <el-avatar :size="35" :src="currentUser.avatar" class="mr-2" />
          <div>
            <div class="text-sm font-semibold">{{ currentUser.full_name }} <i class="el-icon-caret-bottom el-icon--right" /></div>
            <div class="text-xs text-black-600">Trial user</div>
          </div>
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item icon="el-icon-plus">Action 1 aaaaaaaaaaaaaaaa</el-dropdown-item>
          <el-dropdown-item icon="el-icon-circle-plus">Action 2</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
export default {

}
</script>
