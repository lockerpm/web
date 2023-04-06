<template>
  <div class="setting-wrapper">
    <div class="setting-section">
      <div class="setting-section-header" @click="collapsed = !collapsed">
        <div class="text-head-5 font-semibold">
          {{ $t('data.settings.account_password') }}
        </div>
        <div>
          <a
            href="https://id.locker.io/security/password"
            target="_blank"
            class="mr-4 hidden lg:inline-block"
          >
            <button
              class="btn btn-outline-primary md:mb-0"
              @onclick="() => (collapsed = !collapsed)"
            >
              <span><i class="fas fa-hockey-puck mr-2" />{{
                $t('data.settings.change_password')
              }}</span>
            </button>
          </a>
          <i v-if="!collapsed" class="el-icon-arrow-right" />
          <i v-else class="el-icon-arrow-down" />
        </div>
      </div>
    </div>
    <div v-if="collapsed" class="setting-section">
      <a
        href="https://id.locker.io/security/password"
        target="_blank"
        class="mb-4 lg:hidden inline-block"
      >
        <button
          class="btn btn-outline-primary md:mb-0"
          @onclick="() => (collapsed = !collapsed)"
        >
          <span><i class="fas fa-hockey-puck mr-2" />{{
            $t('data.settings.change_password')
          }}</span>
        </button>
      </a>
      <el-row type="flex">
        <el-col :lg="12" :sm="16" :xs="24">
          <p>{{ $t('data.settings.change_password_desc') }}</p>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data () {
    return {
      collapsed: false
    }
  },
  computed: {},
  mounted () {},
  methods: {}
}
</script>
