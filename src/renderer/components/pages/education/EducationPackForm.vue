<template>
  <div>
    <h2 class="landing-font-38 font-semibold mb-6">
      Choose a pack to claim 👇
    </h2>

    <!-- Pack selector -->
    <div class="flex items-center py-4 pl-9 landing-font-16 overflow-x-scroll">
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
          Enter the email address linked with your Locker account
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

      <div class="mb-4">
        <p class="text-black mb-1">School email</p>
        <p class="mb-2">
          If your Locker email isn't a school-issued email address, enter a
          valid one. You need to verify your school email later
        </p>
        <el-input v-model="form.schoolEmail" />
      </div>

      <div class="mb-4">
        <p class="text-black mb-2">
          <span class="text-danger">*</span>
          Country
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
          School name
        </p>
        <p class="mb-2">
          If your school name doesn't appear in the list, then enter the full
          school name and continue
        </p>
        <el-input v-model="form.schoolName" />
      </div>

      <div class="mt-10 flex justify-end">
        <el-button type="primary"> Submit </el-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      needCreateAccount: false,
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
        },
        {
          id: 'university',
          name: 'University'
        },
        {
          id: 'ngo',
          name: 'Non-Government Organization'
        }
      ]
    }
  },

  mounted () {
    this.getCountries()
  },

  methods: {
    getCountries () {
      this.$axios.$get('resources/countries').then(res => {
        this.countries = res
      })
    }
  }
}
</script>
