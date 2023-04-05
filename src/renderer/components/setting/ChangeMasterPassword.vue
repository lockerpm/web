<template>
  <div class="setting-wrapper">
    <div class="setting-section">
      <div class="setting-section-header cursor-pointer" @click="collapsed = !collapsed">
        <div class="text-head-5 font-semibold">
          {{ $t('data.settings.master_password') }}
        </div>
        <div>
          <button
            class="btn btn-outline-primary md:mb-0 mr-4"
            @click="changeMasterPassword"
          >
            <span><i class="fas fa-key mr-2" />{{ $t('data.settings.change_master_password') }}</span>
          </button>
          <i v-if="!collapsed" class="el-icon-arrow-right" />
          <i v-else class="el-icon-arrow-down" />
        </div>
      </div>
      <ChangeMasterPassword ref="changeMasterPassword" />
    </div>
    <div v-if="collapsed" class="setting-section">
      <el-row type="flex">
        <el-col :lg="12" :sm="16" :xs="24">
          <p>{{ $t('data.settings.learn_about_secure_desc') }}</p>
        </el-col>
      </el-row>
      <p class="mt-6">
        <a
          :href="locale === 'vi' ? 'https://support.locker.io/vi/articles/Master-Password-la-gi-1a351c28139449c39a46d0378730e3a5?content=Thay_doi_mat_khau_chinh' : 'https://support.locker.io/articles/Master-Password-6557a15044fd4f2c9ff7327b74f82aea?content=Change_Master_Password'"
          target="_blank"
        >
          {{ $t('data.settings.learn_about_secure') }} <i class="ml-1 el-icon-right" />
        </a>
      </p>
    </div>
  </div>
</template>

<script>
import ChangeMasterPassword from '../user/ChangeMasterPassword.vue'

export default {
  components: {
    ChangeMasterPassword
  },
  data () {
    return {
      collapsed: false
    }
  },
  computed: {
  },
  mounted () {
  },
  methods: {
    changeMasterPassword () {
      this.collapsed = !this.collapsed
      this.$refs.changeMasterPassword.openDialog()
    }
  }
}
</script>
