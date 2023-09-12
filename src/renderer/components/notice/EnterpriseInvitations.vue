<template>
  <div
    v-if="enterpriseInvitations.length"
    class="flex-column-fluid lg:px-28 py-10 md:px-10 px-4"
  >
    <el-dialog
      :visible.sync="dialogVisible"
      width="700px"
      destroy-on-close
      top="5vh"
      custom-class="enterprise-invitations-dialog"
      :close-on-click-modal="false"
    >
      <div slot="title">
        <div class="flex items-center justify-center">
          <p class="enterprise-invitations-dialog__title">
            {{ $t('data.enterprise.popup.title') }}
          </p>
        </div>
      </div>
      <div
        v-for="invitation in enterpriseInvitations.slice(0, 1)"
        :key="invitation.id"
        class="enterprise-invitations-dialog__content"
      >
        <p class="text-center">{{ $t('data.enterprise.popup.subtitle') }}</p>
        <div
          class="flex items-center my-3 rounded-xl bg-black-200 invitation-info"
        >
          <div class="invitation-info__left py-2 pl-10 pr-2 w-1/2">
            <p class="text-xs mb-2">
              {{ $t('data.enterprise.popup.oragnization') }}
            </p>
            <div class="flex items-center">
              <i class="fas fa-city mr-3" />
              <span class="text-black-700 text-lg">
                {{ invitation.enterprise.name }}
              </span>
            </div>
          </div>
          <div
            class="invitation-info__center h-14 border-l border-solid border-black-400"
          />
          <div class="invitation-info__right py-2 pl-10 pr-2 w-1/2">
            <p class="text-xs mb-2">
              {{ $t('data.enterprise.popup.inviter') }}
            </p>
            <div class="flex items-center">
              <i class="fas fa-user mr-3" />
              <p class="text-black-700 text-lg">
                {{ invitation.owner }}
              </p>
            </div>
          </div>
        </div>
        <div class="invitation-info__left mobile p-3 pl-5 w-full mb-4 mt-3">
          <p class="text-xs mb-2">
            {{ $t('data.enterprise.popup.oragnization') }}
          </p>
          <div class="flex items-center">
            <i class="fas fa-city mr-3" />
            <span class="text-black-700 text-lg">
              {{ invitation.enterprise.name }}
            </span>
          </div>
        </div>
        <div class="invitation-info__right mobile p-3 pl-5 mb-4 w-full">
          <p class="text-xs mb-2">{{ $t('data.enterprise.popup.inviter') }}</p>
          <div class="flex items-center">
            <i class="fas fa-user mr-3" />
            <p class="text-black-700 text-lg">
              {{ invitation.owner }}
            </p>
          </div>
        </div>
        <div class="invitation-info__content">
          <p class="font-bold">
            {{ $t('data.enterprise.popup.accept.title') }}
          </p>
          <ul class="list-disc pl-7 py-4">
            <li
              v-for="item in $t('data.enterprise.popup.accept.list')"
              :key="item"
            >
              {{ item }}
            </li>
          </ul>
          <p class="font-bold mt-2">
            {{ $t('data.enterprise.popup.decline.title') }}
          </p>
          <ul class="pt-4">
            <li
              v-for="item in $t('data.enterprise.popup.decline.list')"
              :key="item"
            >
              {{ item }}
            </li>
          </ul>
        </div>
      </div>
      <div slot="footer" class="dialog-footer flex items-center text-left">
        <div class="flex-grow" />
        <div class="btns">
          <button
            class="btn btn-default"
            :disabled="loading"
            @click="putInvitation('reject')"
          >
            {{ $t('common.decline') }}
          </button>
          <button
            class="btn btn-primary"
            :disabled="loading"
            @click="putInvitation('confirmed')"
          >
            {{ $t('common.accept') }}
          </button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loading: false,
      dialogVisible: true,
      invitations: []
    }
  },
  methods: {
    async putInvitation (status) {
      try {
        this.loading = true
        await this.$axios.$put(
          `cystack_platform/pm/enterprises/members/invitations/${this.enterpriseInvitations[0]?.id}`,
          {
            status
          }
        )
        this.notify(this.$t('common.success'), 'success')
        if (status === 'confirmed') {
          this.$store.dispatch('LoadCurrentUserPw')
          this.$store.dispatch('LoadTeams').then(this.loadEnterprisePolicies)
        }
      } catch (e) {
        this.notify(this.$t('common.failed'), 'warning')
        console.log(e)
      } finally {
        this.$store.dispatch('LoadEnterpriseInvitations')
        this.loading = false
      }
    }
  }
}
</script>

<style lang="scss">
.enterprise-invitations-dialog {
  &__title {
    font-size: 40px;
    line-height: 48px;
  }
  .el-dialog__header {
    padding: 20px 80px;
  }
  .el-dialog__body {
    padding: 20px 80px;
  }
  .el-dialog__footer {
    padding: 20px 80px;
  }
  .invitation-info {
    &__left,
    &__right {
      i {
        font-size: 24px;
      }
      &.mobile {
        display: none;
      }
    }
  }
}
@media (max-width: 640px) {
  .enterprise-invitations-dialog {
    width: 90% !important;
    &__title {
      font-size: 24px;
      line-height: 32px;
    }
    .el-dialog__header {
      padding: 16px 20px;
    }
    .el-dialog__body {
      padding: 16px 20px;
    }
    .el-dialog__footer {
      padding: 16px 20px;
    }
    .invitation-info {
      display: none;
      &__left,
      &__right {
        &.mobile {
          display: block !important;
          width: 100%;
          border-radius: 8px 10px 10px 8px;
        }
      }
      &__left {
        &.mobile {
          background: rgba(44, 142, 93, 0.05);
          border-left: 6px solid #2c8e5d;
        }
      }
      &__right {
        &.mobile {
          background: rgba(58, 75, 222, 0.05);
          border-left: 6px solid #3a4bde;
        }
      }
      &__content {
        background: #f1f1f1;
        border-radius: 12px;
        padding: 16px;
      }
    }
  }
  .dialog-footer {
    .flex-grow {
      display: none;
    }
    .btns {
      width: 100%;
      display: block;
      .btn {
        width: 100% !important;
        margin-bottom: 12px;
        &:last-child {
          margin-bottom: 0px;
        }
      }
    }
  }
}
</style>
