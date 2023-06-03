<template>
  <div
    id="header-default"
    class="lg:px-28 md:px-10 px-4 h-[60px] flex justify-end items-center border-0 border-b border-black-200 relative"
  >
    <el-dropdown trigger="click">
      <div class="flex items-center">
        <el-avatar :size="35" :src="currentUser.avatar" class="mr-2" />
        <div>
          <div class="text-sm font-semibold">
            <nobr>
              {{ currentUser.full_name }}
              <i class="el-icon-caret-bottom el-icon--right" />
            </nobr>
          </div>
          <div class="text-xs text-black-600">{{ currentPlan.name }}</div>
        </div>
      </div>
      <el-dropdown-menu slot="dropdown" class="min-w-[200px]">
        <el-dropdown-item
          class="text-warning md:hidden"
          icon="fa fa-tasks"
          @click.native="go('manage-plans')"
        >
          {{ $t('common.manage_plans') }}
        </el-dropdown-item>
        <el-dropdown-item
          class="text-warning md:hidden"
          icon="fa fa-user-friends"
          @click.native="go('settings-referral')"
        >
          {{ $t('data.settings.referral') }}
        </el-dropdown-item>
        <el-dropdown-item
          class="text-warning"
          icon="fa fa-user-circle"
          @click.native="go('settings-account')"
        >
          {{ $t('data.profile_menu.account_settings') }}
        </el-dropdown-item>
        <el-dropdown-item class="text-warning" icon="far fa-life-ring">
          <a
            class="hover:no-underline text-current hover:text-current"
            :href="
              locale === 'vi'
                ? 'https://support.locker.io/vi'
                : 'https://support.locker.io'
            "
            target="_blank"
          >
            {{ $t('data.profile_menu.support_center') }}
          </a>
        </el-dropdown-item>
        <el-dropdown-item class="text-warning" icon="far fa-comment">
          <a
            class="hover:no-underline text-current hover:text-current"
            href="https://forum.locker.io"
            target="_blank"
          >
            {{ $t('data.profile_menu.feedback') }}
          </a>
        </el-dropdown-item>
        <el-dropdown-item icon="fas fa-lock" @click.native="lock">
          {{ $t('data.profile_menu.lock') }}
        </el-dropdown-item>
        <el-dropdown-item icon="fas fa-sign-out-alt" @click.native="logout">
          {{ $t('data.profile_menu.logout') }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
export default {
  asyncComputed: {
    async locked () {
      return await this.$vaultTimeoutService.isLocked()
    }
  },
  computed: {
    currentPlan () {
      return this.$store.state.currentPlan
    }
  },
  methods: {
    go (name) {
      this.$router.push(this.localeRoute({ name }))
    }
  }
}
</script>
<style scoped>
/* Enter and leave animations can use different */
/* durations and timing functions.              */
.slide-fade-enter-active {
  transition: all 0.2s ease;
}
.slide-fade-leave-active {
  transition: all 0.4s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
.el-dropdown-menu.notification {
  @apply max-h-[90vh];
  overflow-y: scroll;
}
</style>
