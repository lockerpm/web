<template>
  <div class="setting-wrapper">
    <div class="setting-section">
      <div class="setting-section-header">
        <div class="text-[20px] font-semibold">
          {{ $t('data.plans.invite_people') }}
        </div>
      </div>
    </div>
    <div class="setting-section">
      <div class="setting-section-header">
        <div>
          <div class="setting-title !text-sm">
            {{ $t('data.plans.type_email') }}
          </div>
        </div>
      </div>
      <div class="mt-4 mb-8">
        <div class="cs-field w-full">
          <div class="input-tags">
            <el-tag
              v-for="(email, index) in emails"
              :key="email"
              closable
              type="info"
              class="my-auto"
              @close="handleClose(index)"
            >
              {{ email }}
            </el-tag>

            <input
              ref="inputEmail"
              class="cs-input"
              :value="inputEmail"
              type="text"
              @input="emailInput($event.target.value)"
              @keyup.enter="confirmInputEmail"
            >
          </div>
          <div
            class="text-info cursor-pointer self-end pb-2 font-semibold px-3"
            @click="confirmInputEmail"
          >
            {{ $t('common.add') }}
          </div>
        </div>
      </div>

      <div class="setting-section-header">
        <div>
          <div class="setting-title !text-sm">
            {{
              `${$t('data.plans.list_member')} (${family_members.length + 1}/6)`
            }}
          </div>
        </div>
      </div>
      <div class="mt-5 px-4 py-6 bg-[#F6F6F6]">
        <div class="flex mb-6">
          <div class="flex items-center">
            <el-avatar :size="35" :src="currentUser.avatar" class="mr-2" />
            <div>
              <p class="text-black">{{ currentUser.email }} (You)</p>
            </div>
          </div>
        </div>
        <template v-for="(email, index) in family_members">
          <div :key="index" class="flex justify-between mb-6">
            <div class="flex items-center">
              <img src="~/assets/images/icons/Avatar.svg" class="mr-2">
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

      <div v-if="errors.family_members" class="text-danger">
        {{ errors.family_members[0] }}
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      emails: [],
      inputEmail: '',
      family_members: []
    }
  },
  methods: {
    handleClose (index) {
      this.emails.splice(index, 1)
    },

    emailInput (value) {
      this.inputEmail = value
      const lastChar = value.substr(value.length - 1)
      if ([',', ' '].includes(lastChar)) {
        this.handleInputEmail()
      }
    },

    handleInputEmail () {
      const emailList = this.inputEmail.split(',')
      emailList.forEach(email => {
        email = email.trim()
        if (
          email &&
          this.validateEmail(email) &&
          !this.emails.includes(email)
        ) {
          this.emails.push(email)
          this.inputEmail = ''
        }
      })
    },

    removeMember (index) {
      this.family_members.splice(index, 1)
    },

    confirmInputEmail () {
      this.emails.forEach(email => {
        if (!this.family_members.includes(email)) {
          if (this.family_members.length === 5) {
            this.notify(this.$t('errors.7012'), 'warning')
            return
          }
          this.family_members.push(email)
        }
      })
      const emailList = this.inputEmail.split(',')
      emailList.forEach(email => {
        email = email.trim()
        if (email && this.validateEmail(email)) {
          if (this.family_members.length === 5) {
            this.notify(this.$t('errors.7012'), 'warning')
            return
          }
          if (!this.family_members.includes(email)) {
            this.family_members.push(email)
          }
          this.inputEmail = ''
        } else if (email && !this.validateEmail(email)) {
          this.notify('Invalid email', 'warning')
        }
      })
      this.emails = []
    }
  }
}
</script>
