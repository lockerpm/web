<template>
  <el-dialog
    ref="addMemberDialog"
    :visible.sync="visible"
    width="435px"
    destroy-on-close
    top="5vh"
    custom-class="locker-dialog"
    :close-on-click-modal="false"
  >
    <div
      slot="title"
      class=""
      style="overflow: hidden"
    >
      <h4>{{ $t('data.family_member.add_member') }}</h4>
    </div>
    <div class="setting-section">
      <div class="setting-section-header">
        <div>
          <div class="setting-title !text-sm">{{ $t('data.plans.type_email') }}</div>
        </div>
      </div>
      <div class="mt-4 mb-8">
        <div class="flex input-tags">
          <el-input
            v-model="inputEmail"
            change="mr-2"
            @keyup.enter.native="confirmInputEmail"
            @input="emailInput"
          >
            <!-- <div
              v-if="emails.length"
              slot="prepend"
            >
              <el-tag
                v-for="(email, index) in emails"
                :key="email"
                closable
                type="info"
                @close="handleClose(index)"
              >
                {{ email }}
              </el-tag>
            </div> -->
            <el-button
              slot="append"
              :disabled="!emails.length && !inputEmail"
              @click.prevent="confirmInputEmail"
            >
              {{ $t('common.add') }}
            </el-button>
          </el-input>
        </div>
      </div>
      <div v-if="family_members.length" class="my-5 px-4 py-6 bg-[#F6F6F6]">
        <template v-for="(email, index) in family_members">
          <div
            :key="index"
            class="flex justify-between mb-6"
          >
            <div class="flex items-center">
              <img
                src="~/assets/images/icons/Avatar.svg"
                class="mr-2"
              >
              <div>
                <p class="text-black">{{ email }}</p>
                <p class="text-black-500">Pending</p>
              </div>
            </div>
            <div>
              <button
                class="btn btn-default !text-danger mb-4 md:mb-0"
                @click="removeMember(index)"
              >
                {{ $t('common.remove') }}
              </button>
            </div>
          </div>
        </template>
      </div>

      <div
        v-if="errors.family_members"
        class="text-danger"
      >
        {{ errors.family_members[0] }}
      </div>
    </div>
    <div class="credit-drawer-footer">
      <div class="grid grid-cols-2 gap-x-4">
        <button
          class="btn btn-default btn-block w-full"
          :disabled="loading"
          @click="cancel"
        >
          {{ $t('common.cancel') }}
        </button>
        <button
          class="btn btn-primary btn-block w-full"
          :disabled="loading"
          @click="save"
        >
          {{ $t('common.invite') }}
        </button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  components: {
  },
  data () {
    return {
      visible: false,
      loading: false,
      inputEmail: '',
      family_members: [],
      errors: {},
      emails: []
    }
  },
  mounted () {
  },
  methods: {
    openDialog () {
      this.visible = true
    },
    closeDialog () {
      this.visible = false
      this.$emit('close')
    },
    cancel () {
      this.$emit('handle-cancel')
      this.closeDialog()
    },
    async save () {
      this.loading = true
      this.$axios.$post('/cystack_platform/pm/family/members', {
        family_members: this.family_members
      }).then(res => {
        this.notify(this.$t('data.notifications.add_member_success'), 'success')
        this.$emit('handle-done', res)
        this.closeDialog()
      })
        .catch(() => {
          this.notify(this.$t('data.notifications.add_member_failed'), 'warning')
        })
        .then(() => {
          this.loading = false
        })
    },
    confirmInputEmail () {
      // this.emails.forEach(email => {
      //   if (!this.family_members.includes(email)) {
      //     if (this.family_members.length === 5) {
      //       this.notify('You can\'t add more than 5 accounts.', 'warning')
      //       return
      //     }
      //     this.family_members.push(email)
      //   }
      // })
      const emailList = this.inputEmail.split(',')
      emailList.forEach(email => {
        email = email.trim()
        if (email && this.validateEmail(email) && !this.family_members.includes(email)) {
          if (this.family_members.length === 5) {
            this.notify('You can\'t add more than 5 accounts.', 'warning')
            return
          }
          this.family_members.push(email)
          this.inputEmail = ''
        }
      })
      this.emails = []
    },
    handleInputEmail () {
      const emailList = this.inputEmail.split(',')
      emailList.forEach(email => {
        email = email.trim()
        if (email && this.validateEmail(email) && !this.emails.includes(email)) {
          this.emails.push(email)
          this.inputEmail = ''
        }
      })
    },
    emailInput (value) {
      const lastChar = value.substr(value.length - 1)
      if ([',', ' '].includes(lastChar)) {
        this.handleInputEmail()
      }
    },
    removeMember (index) {
      this.family_members.splice(index, 1)
    }
  }
}
</script>

<style>
</style>
