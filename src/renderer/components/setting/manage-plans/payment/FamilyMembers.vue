<template>
  <div class="mt-8">
    <h3 class="font-semibold text-[18px] mb-2">
      {{ $t('data.plans.payment_step.family.invite_member') }}
    </h3>

    <p class="mb-3">
      {{ $t('data.plans.payment_step.family.invite_member_desc') }}
    </p>

    <div class="flex items-center">
      <el-input
        v-model="emailInput"
        class="mr-3"
        @keyup.enter.native="addMember"
      />
      <el-button type="primary" @click="addMember">
        {{ $t('common.add') }}
      </el-button>
    </div>

    <p class="mt-3 mb-6">
      {{ $t('data.plans.payment_step.family.invite_member_desc_2') }}
    </p>

    <p class="font-semibold text-[18px] mb-3">
      {{ $t('data.plans.payment_step.family.list_member') }}
    </p>

    <p class="py-1">
      {{ currentUser.email }}
    </p>

    <div
      v-for="(item, index) in members"
      :key="index"
      class="flex justify-between py-1"
    >
      <p>
        {{ item }}
      </p>
      <a @click.prevent="removeMember(item)">
        <i class="el-icon-close" />
      </a>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    members: {
      type: Array,
      default: () => []
    },
    setMembers: {
      type: Function,
      default: () => () => {}
    }
  },

  data () {
    return {
      emailInput: ''
    }
  },
  methods: {
    removeMember (email) {
      this.setMembers(this.members.filter(e => e !== email))
    },

    addMember () {
      const emails = []
      const newEmails = []

      this.emailInput.split(',').forEach(item => {
        const email = item?.trim()
        if (email && this.validateEmail(email) && !emails.includes(email)) {
          emails.push(email)
        }
      })
      this.emailInput = ''

      emails.forEach(email => {
        if (!this.members.includes(email)) {
          if (this.members.length + newEmails.length >= 5) {
            this.notify(this.$t('errors.7012'), 'warning')
            return
          }
          newEmails.push(email)
        }
      })

      this.setMembers([...this.members, ...newEmails])
    }
  }
}
</script>
