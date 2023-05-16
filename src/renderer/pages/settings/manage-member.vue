<template>
  <div class="w-full">
    <div class="grid grid-cols-5 gap-x-6">
      <div class="setting-wrapper md:col-span-3 col-span-5">
        <div class="setting-section">
          <div class="setting-section-header">
            <div class="setting-description mb-6 mr-3 self-start pt-3">
              Family
            </div>
            <div>
              <div v-if="locale === 'vi'">
                <span
                  v-if="currentPlan && currentPlan.yearly_price"
                  class="text-head-3 font-semibold"
                >${{
                  (currentPlan.yearly_price.usd / 12) | formatNumber
                }}</span>/tháng/6 người*
              </div>
              <div v-else>
                <span
                  v-if="currentPlan && currentPlan.yearly_price"
                  class="text-head-3 font-semibold"
                >${{
                  (currentPlan.yearly_price.usd / 12) | formatNumber
                }}</span>/mo/6 users*
              </div>
              <div
                v-if="currentPlan && currentPlan.price"
                class="setting-description"
              >
                {{
                  $t('data.family_member.bill_annually_desc', {
                    monthlyPrice: '$' + currentPlan.price.usd
                  })
                }}
              </div>
            </div>
          </div>
          <div>
            <div class="font-semibold mb-3">
              {{
                $t('data.family_member.number_member_detail', {
                  currentNumber: familyMembers.length,
                  planMember: 6
                })
              }}
            </div>
            <el-progress
              :show-text="false"
              :percentage="(familyMembers.length * 100) / 6"
            />
          </div>
        </div>
      </div>
      <div class="setting-wrapper md:col-span-2 col-span-5">
        <div class="setting-section">
          <div>
            <div class="setting-description mb-1">
              {{ $t('data.billing.next_billing') }}
            </div>
            <div class="font-semibold mb-4">
              {{
                currentPlan.next_billing_time
                  ? $moment(currentPlan.next_billing_time * 1000).format('LLL')
                  : 'N/A'
              }}
            </div>
            <div class="w-full">
              <button
                class="btn btn-default"
                @click="
                  $router.push(localeRoute({ name: 'settings-plans-billing' }))
                "
              >
                {{ $t('data.billing.manage_payments') }}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="setting-wrapper hidden" />
    </div>
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
        <div class="mt-4 mb-3">
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
                @keyup.enter="handleInputEmail"
              >
            </div>
            <div
              v-if="currentPlan.alias === 'pm_family'"
              class="text-info cursor-pointer self-end pb-2 font-semibold px-3"
              @click="save"
            >
              {{ $t('data.family_member.action') }}
            </div>
          </div>
        </div>
        <div class="setting-description mb-6">
          {{ $t('data.family_member.list_member_title') }}
        </div>

        <div class="setting-section-header">
          <div>
            <div class="setting-title !text-sm">
              {{
                `${$t('data.plans.list_member')} (${familyMembers.length}/6)`
              }}
            </div>
          </div>
        </div>
        <div class="mt-5 px-4 py-6 bg-[#F6F6F6] flex flex-col gap-y-6">
          <template v-for="(member, index) in familyMembers">
            <div :key="index" class="flex justify-between flex-wrap">
              <div class="flex items-center">
                <el-avatar
                  :size="35"
                  :src="
                    member.avatar || require('~/assets/images/icons/Avatar.svg')
                  "
                  class="mr-2"
                />
                <div>
                  <div
                    class="text-sm font-semibold"
                    :class="member.id ? '' : 'text-primary'"
                  >
                    <nobr v-if="member.full_name">
                      {{ member.full_name }}
                      {{
                        currentUser.email === member.email
                          ? ` (${$t('common.you')})`
                          : ''
                      }}
                    </nobr>
                    <nobr v-else>
                      {{ $t('data.family_member.unknown') }}
                      <el-tooltip placement="right" effect="light">
                        <div slot="content" class="max-w-[250px]">
                          {{ $t('data.family_member.unknown_tooltip') }}
                          <span class="text-info font-semibold">
                            <a
                              :href="
                                locale === 'vi'
                                  ? 'https://support.locker.io/vi/articles/Goi-Family-d570fc79895e4011bf3ba07ca8de3f9a'
                                  : 'https://support.locker.io/articles/Upgrading-to-Family-Plan-f832b3db0cca4cd0b1a4819e177bb849'
                              "
                              target="_blank"
                            >
                              {{ $t('data.family_member.learn_more') }}
                            </a>
                          </span>
                        </div>
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M10 17.5C14.1421 17.5 17.5 14.1421 17.5 10C17.5 5.85786 14.1421 2.5 10 2.5C5.85786 2.5 2.5 5.85786 2.5 10C2.5 14.1421 5.85786 17.5 10 17.5Z"
                            stroke="#072245"
                            stroke-width="1.32739"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M10.896 14.0625C10.896 14.5574 10.4949 14.9585 10 14.9585C9.50514 14.9585 9.10398 14.5574 9.10398 14.0625C9.10398 13.5676 9.50514 13.1665 10 13.1665C10.4949 13.1665 10.896 13.5676 10.896 14.0625Z"
                            fill="black"
                            stroke="#072245"
                            stroke-width="0.082962"
                          />
                          <path
                            d="M10 11.25V10.625C10.4326 10.625 10.8556 10.4967 11.2153 10.2563C11.575 10.016 11.8554 9.67433 12.021 9.27462C12.1866 8.87491 12.2299 8.43507 12.1455 8.01074C12.0611 7.58641 11.8527 7.19663 11.5468 6.89071C11.2409 6.58478 10.8511 6.37644 10.4268 6.29203C10.0024 6.20763 9.56259 6.25095 9.16288 6.41651C8.76317 6.58208 8.42153 6.86246 8.18116 7.22219C7.94079 7.58192 7.8125 8.00485 7.8125 8.4375"
                            stroke="#072245"
                            stroke-width="1.32739"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      </el-tooltip>
                    </nobr>
                  </div>
                  <div class="text-xs text-black-600">{{ member.email }}</div>
                </div>
              </div>
              <div v-if="member.id != null">
                <button
                  class="btn btn-default !text-danger mb-4 md:mb-0"
                  @click="removeFamilyMember(member)"
                >
                  {{ $t('common.remove') }}
                </button>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      familyMembers: [],
      loading: false,
      inputEmail: '',
      family_members: [],
      emails: []
    }
  },
  async fetch ({ redirect, store }) {
    await store.dispatch('LoadCurrentPlan')
    if (
      store.state.currentPlan &&
      store.state.currentPlan.alias !== 'pm_family'
    ) {
      redirect(302, '/manage-plans')
    }
  },
  computed: {
    currentPlan () {
      return this.$store.state.currentPlan
    }
  },
  mounted () {
    this.getFamilyMember()
  },
  methods: {
    async getFamilyMember () {
      try {
        this.familyMembers =
          (await this.$axios.$get('/cystack_platform/pm/family/members')) || []
      } catch (e) {}
    },
    removeFamilyMember (member) {
      this.$confirm(
        this.$t('data.family_member.confirm_delete_member_all', {
          email: member.email
        }),
        this.$t('data.family_member.confirm_delete_member'),
        {
          confirmButtonText: 'OK',
          cancelButtonText: this.$t('common.cancel'),
          type: 'warning'
        }
      )
        .then(() => {
          this.$axios
            .$delete(`/cystack_platform/pm/family/members/${member.id}`)
            .then(() => {
              this.notify(
                this.$t('data.notifications.delete_member_success'),
                'success'
              )
              this.getFamilyMember()
            })
            .catch(() => {
              this.notify(
                this.$t('data.notifications.delete_member_failed'),
                'warning'
              )
            })
        })
        .catch(() => {})
    },
    async save () {
      this.loading = true
      this.handleInputEmail()
      this.$axios
        .$post('/cystack_platform/pm/family/members', {
          family_members: this.emails
        })
        .then(() => {
          this.emails = []
          this.notify(
            this.$t('data.notifications.add_member_success'),
            'success'
          )
          this.getFamilyMember()
        })
        .catch(e => {
          if (
            e.response &&
            e.response.data &&
            e.response.data.code === '7012'
          ) {
            this.notify(this.$t('errors.7012'), 'warning')
          } else {
            this.notify(
              this.$t('data.notifications.add_member_failed'),
              'warning'
            )
          }
        })
        .then(() => {
          this.loading = false
        })
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
    emailInput (value) {
      this.inputEmail = value
      const lastChar = value.substr(value.length - 1)
      if ([',', ' '].includes(lastChar)) {
        this.handleInputEmail()
      }
    },
    handleClose (index) {
      this.emails.splice(index, 1)
    }
  }
}
</script>

<style lang="scss" scoped>
.cs-field {
  min-height: 40px;
  display: flex;
  padding-left: 12px;
  position: relative;
  border-radius: 2px;
  border: solid 1px #e6e8f4;
  &.is-hover,
  &.is-focus {
    @apply border-primary bg-white;
    label {
      @apply text-primary;
    }
  }
  &.is-error {
    @apply border-danger mb-8 last:mb-8 #{!important};
    label,
    .cs-helper-text {
      @apply text-danger;
    }
  }
  &.is-password.is-focus,
  &.is-password.have-value {
    button.btn {
      @apply absolute p-0.5;
      top: 19px;
      right: 13px;
    }
    .cs-input {
      padding-right: 48px;
    }
  }
  &.is-focus label,
  &.have-value label {
    font-size: 12px;
    line-height: 19px;
    top: 5px;
    left: 11px;
  }
  &.is-focus .cs-textarea,
  &.have-value .cs-textarea {
    padding-top: 8px;
    margin-top: 8px;
  }
  &.is-disabled {
    cursor: not-allowed;
    input,
    button,
    input:hover,
    button:hover {
      cursor: not-allowed !important;
      user-select: none;
    }
  }
  .cs-input,
  .cs-textarea {
    align-self: center;
    padding-left: 2px !important;
    width: 100%;
    padding-bottom: 0px;
    padding-top: 0px;
    font-size: 14px;
    line-height: 19px;
    border: none;
    flex: 1;
    color: #161922;
    height: 32px;
    background-color: inherit;
    min-width: 150px;
  }
  .input-tags {
    flex-grow: 1;
    display: flex;
    flex-wrap: wrap;
    align-self: center;
    gap: 2px;
    padding: 2px 0px;
  }
}
</style>
