<template>
  <div>
    <!-- Form -->
    <div v-if="!showSuccess">
      <h2 class="landing-font-38 font-semibold mb-6">
        {{ $t('education.form.title') }}
      </h2>

      <!-- Pack selector -->
      <div>
        <div class="items-center py-4 pl-9 landing-font-16 hidden sm:flex">
          <a
            v-for="item in packs"
            :key="item.id"
            class="mr-20 text-black"
            :class="{
              'font-semibold': selectedPack === item.id,
              'text-primary': selectedPack === item.id
            }"
            @click.prevent="selectedPack = item.id"
          >
            {{ $t(`education.packs.${item.id}`) }}</a>
        </div>

        <div class="flex sm:hidden mb-4">
          <el-select v-model="selectedPack" class="w-full">
            <el-option
              v-for="item in packs"
              :key="item.id"
              :label="$t(`education.packs.${item.id}`)"
              :value="item.id"
            />
          </el-select>
        </div>
      </div>
      <!-- Pack selector end -->

      <!-- Student/Teacher -->
      <div
        v-if="selectedPack === 'student'"
        class="rounded border border-black-50 p-10"
      >
        <!-- Need create account? -->
        <el-checkbox
          v-model="needCreateAccount"
          class="w-full"
          :class="needCreateAccount ? 'mb-2' : 'mb-6'"
        >
          {{ $t('promo.buy13.form.need_create_account') }}
        </el-checkbox>
        <!-- Need create account? end -->

        <p v-if="needCreateAccount" class="mb-4 text-black-500">
          {{ $t('education.form.create_account_desc') }}
        </p>

        <div class="mb-4">
          <p class="text-black mb-1">
            <span class="text-danger">*</span>
            {{
              needCreateAccount
                ? $t('education.form.school_email')
                : 'Locker Email'
            }}
          </p>
          <p v-if="needCreateAccount" class="text-black-500">
            {{ $t('education.form.email_need_create_desc') }}
          </p>
          <p v-else class="text-black-500">
            {{ $t('education.form.email_desc') }}
          </p>
          <el-input v-model="form.email" class="mt-2" />
        </div>

        <template v-if="needCreateAccount">
          <!-- Password -->
          <div class="mb-4">
            <p class="text-black mb-2">
              <span class="text-danger">*</span>
              {{ $t('promo.buy13.form.create_pw') }}
            </p>
            <el-input v-model="form.password" type="password" />
          </div>
          <!-- Password end -->

          <!-- Confirm Password -->
          <div class="mb-4">
            <p class="text-black mb-2">
              <span class="text-danger">*</span>
              {{ $t('promo.buy13.form.confirm_pw') }}
            </p>
            <el-input v-model="form.confirmPassword" type="password" />
          </div>
          <!-- Confirm Password end -->

          <!-- Fullname -->
          <div class="mb-4">
            <p class="text-black mb-2">
              <span class="text-danger">*</span>
              {{ $t('common.fullname') }}
            </p>
            <el-input v-model="form.fullName" />
          </div>
          <!-- Fullname end -->
        </template>

        <div v-if="!needCreateAccount" class="mb-4">
          <p class="text-black mb-1">{{ $t('education.form.school_email') }}</p>
          <p class="mb-2 text-black-500">
            {{ $t('education.form.school_email_desc') }}
          </p>
          <el-input v-model="form.schoolEmail" />
        </div>

        <div class="mb-4">
          <p class="text-black mb-2">
            <span class="text-danger">*</span>
            {{ $t('common.country') }}
          </p>
          <el-select
            v-model="form.country"
            clearable
            filterable
            placeholder="Select"
            class="w-full"
          >
            <el-option
              v-for="item in countries"
              :key="item.country_code"
              :label="item.country_name"
              :value="item.country_code"
            />
          </el-select>
        </div>

        <div class="mb-4">
          <p class="text-black mb-2">
            <span class="text-danger">*</span>
            {{ $t('education.form.school_name') }}
          </p>
          <!-- <p class="mb-2 text-black-500">
            {{ $t('education.form.school_name_desc') }}
          </p> -->
          <el-input v-model="form.schoolName" />
        </div>

        <!-- Agree? -->
        <div v-if="needCreateAccount" class="mb-4">
          <el-checkbox v-model="form.agreeTerms">
            <span v-html="$t('lifetime.redeem_page.form.agree_terms')" />
          </el-checkbox>
        </div>
        <!-- Agree? end -->

        <div class="mt-10 flex justify-end">
          <el-button
            :loading="isLoading"
            :disabled="isLoading || !isBtnActive"
            type="primary"
            @click="handleSubmit"
          >
            {{ $t('common.submit') }}
          </el-button>
        </div>
      </div>
      <!-- Student/Teacher end -->

      <!-- Others -->
      <div v-else class="flex flex-col items-center text-center pt-20">
        <p class="landing-font-28 max-w-[544px]">
          {{ $t('education.form.contact.p1') }}
          <nuxt-link to="/contact">
            {{
              $t('education.form.contact.btn')
            }}
          </nuxt-link>
          {{ $t('education.form.contact.p2') }}
        </p>
        <img
          src="~assets/images/pages/education/launching.svg"
          alt="CTA"
          class="w-full max-w-[320px]"
        >
      </div>
      <!-- Others end -->
    </div>
    <!-- Form end -->

    <!-- Success -->
    <div v-else>
      <div class="max-w-xl mx-auto rounded-md shadow py-4">
        <p class="landing-font-28 font-semibold mb-4 px-6">
          {{ $t('education.form.success.title') }}
        </p>
        <hr class="border-black-50">
        <p class="my-6 landing-font-16 px-6">
          {{
            $t('education.form.success.desc', {
              email: form.schoolEmail || form.email
            })
          }}
        </p>
        <hr class="border-black-50">
        <div class="flex justify-end mt-4 px-6">
          <el-button type="primary" @click="$emit('close')"> OK </el-button>
        </div>
      </div>
    </div>
    <!-- Success end -->
  </div>
</template>
<script>
export default {
  data () {
    return {
      isLoading: false,
      needCreateAccount: false,
      showSuccess: false,
      countries: [],
      selectedPack: 'student',
      form: {
        email: '',
        password: '',
        confirmPassword: '',
        fullName: '',
        schoolEmail: '',
        country: null,
        schoolName: '',
        agreeTerms: false
      }
    }
  },

  computed: {
    packs () {
      return [
        {
          id: 'student'
        },
        {
          id: 'university'
        },
        {
          id: 'ngo'
        }
      ]
    },

    isBtnActive () {
      if (!this.form.email || !this.form.schoolName || !this.form.country) {
        return false
      }
      if (this.needCreateAccount) {
        return (
          this.form.password &&
          this.form.password === this.form.confirmPassword &&
          this.form.fullName &&
          this.form.agreeTerms
        )
      }
      return true
    }
  },

  mounted () {
    this.getCountries()
  },

  methods: {
    reset () {
      this.selectedPack = 'student'
      this.needCreateAccount = false
      this.showSuccess = false
      this.form = {
        email: '',
        password: '',
        confirmPassword: '',
        fullName: '',
        schoolEmail: '',
        country: null,
        schoolName: ''
      }
    },

    getCountries () {
      this.$axios.$get('resources/countries').then(res => {
        this.countries = res
      })
    },

    handleSubmit () {
      this.errorDetails = {}
      if (this.needCreateAccount) {
        this.requestPackAndCreateAccount()
      } else {
        this.requestPack()
      }
    },

    async requestPack () {
      const payload = {
        email: this.form.email,
        country: this.form.country,
        education_email: this.form.schoolEmail || this.form.email,
        education_type: this.selectedPack,
        university: this.form.schoolName
      }
      this.sendRequest(payload)
    },

    async requestPackAndCreateAccount () {
      const payload = {
        email: this.form.email,
        country: this.form.country,
        password: this.form.password,
        full_name: this.form.fullName,
        education_email: this.form.email,
        education_type: this.selectedPack,
        university: this.form.schoolName
      }
      this.sendRequest(payload)
    },

    async sendRequest (payload) {
      this.isLoading = true
      try {
        const token = await this.$recaptcha.execute('login')
        await this.$axios.$post(
          '/cystack_platform/pm/education/payments/plan',
          {
            ...payload,
            request_code: token
          }
        )
        this.showSuccess = true
        setTimeout(() => {
          const element = document.getElementById('form')
          element.scrollIntoView({ behavior: 'smooth' })
        }, 100)
      } catch (error) {
        const errorData = error.response?.data
        let errorMessage = ''

        // Account not exists
        if (errorData?.code === '1004') {
          this.needCreateAccount = true
          errorMessage = 1004
        }

        // Invalid school email
        if (errorData?.code === '7018') {
          errorMessage = 7018
        }

        // School email already claimed
        if (errorData?.code === '7019') {
          errorMessage = 7019
        }

        // Block business/family
        if (['7015', '7016'].includes(errorData?.education_email)) {
          errorMessage = 'only_individual'
        }

        // Invalid data
        if (errorData?.code === '0004') {
          // Invalid code
          if (errorData?.details?.education_email) {
            errorMessage = 7018
          }
        }

        if (!errorMessage) {
          if (errorData?.message) {
            this.notify(errorData?.message, 'warning')
            return
          }
          errorMessage = 'something_went_wrong'
        }

        this.notify(this.$t(`errors.${errorMessage}`), 'warning')
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>
