<template>
  <div>
    <div v-if="!showSuccess">
      <h2 class="landing-font-38 font-semibold mb-6">
        {{ $t('education.form.title') }}
      </h2>

      <!-- Pack selector -->
      <div class="flex items-center py-4 pl-9 landing-font-16">
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
          {{ item.name }} pack</a>
      </div>
      <!-- Pack selector end -->

      <div class="rounded border border-black-50 p-10">
        <!-- Need create account? -->
        <el-checkbox v-model="needCreateAccount" class="mb-6 w-full">
          {{ $t('promo.buy13.form.need_create_account') }}
        </el-checkbox>
        <!-- Need create account? end -->

        <div class="mb-4">
          <p class="text-black mb-1">
            <span class="text-danger">*</span>
            {{ needCreateAccount ? 'Email' : 'Locker Email' }}
          </p>
          <p v-if="!needCreateAccount">
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
          <p class="mb-2">
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
          <p class="text-black mb-1">
            <span class="text-danger">*</span>
            {{ $t('education.form.school_name') }}
          </p>
          <p class="mb-2">
            {{ $t('education.form.school_name_desc') }}
          </p>
          <el-input v-model="form.schoolName" />
        </div>

        <div class="mt-10 flex justify-end">
          <el-button
            :loading="isLoading"
            :disabled="isLoading"
            type="primary"
            @click="handleSubmit"
          >
            {{ $t('common.submit') }}
          </el-button>
        </div>
      </div>
    </div>

    <div v-else>
      <div class="max-w-xl mx-auto rounded-md shadow py-4">
        <p class="landing-font-28 font-semibold mb-4 px-6">
          Application Form sent!
        </p>
        <hr class="border-black-50">
        <p class="my-6 landing-font-16 px-6">
          😍 Thank you for your application for the Student Pack! Please wait
          for the qualification result sent to your email within 24 hours.
        </p>
        <hr class="border-black-50">
        <div class="flex justify-end mt-4 px-6">
          <el-button type="primary" @click="$emit('close')"> OK </el-button>
        </div>
      </div>
    </div>
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
        schoolName: ''
      }
    }
  },

  computed: {
    packs () {
      return [
        {
          id: 'student',
          name: 'Student'
        },
        {
          id: 'teacher',
          name: 'Teacher'
        }
        // {
        //   id: 'university',
        //   name: 'University'
        // },
        // {
        //   id: 'ngo',
        //   name: 'Non-Government Organization'
        // }
      ]
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
        education_email: this.form.schoolEmail,
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
      } catch (error) {
        const errorData = error.response?.data
        this.notify(
          errorData?.message || this.$t('errors.something_went_wrong'),
          'warning'
        )

        // Account not exists
        if (errorData?.code === '1004') {
          this.needCreateAccount = true
          this.$nextTick(() => {
            this.errorMessage = 'account_not_exist'
          })
          return
        }

        // Block business/family
        if (['7015', '7016'].includes(errorData?.code)) {
          this.errorMessage = 'only_individual'
          return
        }

        // Invalid data
        if (errorData?.code === '0004') {
          // Invalid code
          if (errorData?.details?.code) {
            this.errorMessage = 'invalid_code'
            return
          }

          this.errorDetails = errorData?.details
          this.errorMessage = 'invalid_data'
          return
        }
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>
