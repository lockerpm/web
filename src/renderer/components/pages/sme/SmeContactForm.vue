<template>
  <div id="sme-form" class="w-full">
    <div class="border rounded-2xl border-black-50 p-6 bg-white mb-8 w-full">
      <el-form
        ref="smeForm"
        :show-message="false"
        :model="formData"
        :rules="rules"
      >
        <el-form-item
          :label="$t('common.fullname')"
          :placeholder="$t('sme.contact.form.fullname.desc')"
          prop="fullname"
        >
          <el-input v-model="formData.fullname" />
        </el-form-item>

        <el-form-item
          :label="$t('common.work_email')"
          placeholder="doanhnghiep@gmail.com"
          prop="email"
        >
          <el-input v-model="formData.email" />
        </el-form-item>

        <el-form-item
          :label="$t('common.phone')"
          placeholder="123 456 7890"
          prop="phone"
        >
          <el-input v-model="formData.phone">
            <el-select slot="prepend" v-model="phoneCode" filterable style="width: 100px">
              <el-option
                v-for="item in countries"
                :key="item.country_code"
                :label="item.country_phone_code"
                :value="item.country_phone_code"
              >
                <span>
                  ({{ item.country_phone_code }}) {{ item.country_name }}
                </span>
              </el-option>
            </el-select>
          </el-input>
        </el-form-item>

        <el-form-item
          :label="$t('common.job_title')"
          :placeholder="$t('sme.contact.form.job.desc')"
          prop="job"
        >
          <el-input v-model="formData.job" />
        </el-form-item>

        <el-form-item
          :label="$t('common.company')"
          :placeholder="$t('sme.contact.form.company.desc')"
          prop="company"
        >
          <el-input v-model="formData.company" />
        </el-form-item>

        <el-form-item
          :label="$t('sme.contact.form.request_desc.label')"
          :placeholder="$t('sme.contact.form.request_desc.desc')"
          prop="note"
        >
          <el-input v-model="formData.note" type="textarea" :rows="2" />
        </el-form-item>
      </el-form>
    </div>

    <el-button
      type="primary"
      round
      class="w-full"
      :loading="loading"
      :disabled="loading"
      style="font-size: 18px; line-height: 24px;"
      @click="submitForm"
    >
      {{ $t('common.send') }}
    </el-button>
  </div>
</template>
<script>
export default {
  data () {
    return {
      loading: false,
      countries: [],
      phoneCode: '+84',
      formData: {
        fullname: '',
        email: '',
        phone: '',
        job: '',
        company: '',
        note: ''
      }
    }
  },

  computed: {
    rules () {
      function validatePhoneNumber (_, value, callback) {
        const phoneRegex = /^\d{6,}$/
        if (!phoneRegex.test(value)) {
          callback(new Error('Invalid phone'))
          return
        }
        callback()
      }
      return {
        fullname: { required: true, trigger: 'change' },
        email: { required: true, type: 'email', trigger: 'change' },
        phone: { required: true, validator: validatePhoneNumber, trigger: 'change' },
        job: { required: true, trigger: 'change' },
        company: { required: true, trigger: 'change' }
      }
    }
  },

  mounted () {
    this.getCountries()
    this.$recaptcha.init()
  },

  methods: {
    getCountries () {
      this.$axios.$get('resources/countries').then(res => {
        this.countries = res
      })
    },
    async submitForm () {
      try {
        const isValid = await this.$refs.smeForm.validate()
        if (!isValid) {
          this.notify($t('sme.contact.form.message.invalid)_data'), 'warning')
          return
        }

        this.loading = true

        // Submit to portal
        const payload = {
          email: this.formData.email,
          fullname: this.formData.fullname,
          phone_number: `${this.phoneCode} ${this.formData.phone}`,
          job_title: this.formData.job,
          organization_name: this.formData.company,
          country_code: this.countries.find(c => c.country_phone_code === this.phoneCode)?.country_code || 'VN',
          products: [
            'password_manager'
          ],
          message: this.formData.note,
          source: 'landing_form',
          source_link: 'https://locker.io/passwords/doanh-nghiep',
          captcha_code: await this.$recaptcha.execute('homepage')
        }
        await this.$axios.post(
          'https://api.cystack.net/portal/v1/users/register',
          payload
        )

        // Successfully submitted
        this.notify(this.$t('landing_contact.messages.request_has_been_sent'), 'success')
        this.$refs.smeForm.resetFields()
      } catch (error) {
        this.$message({
          message: this.$t('landing_contact.messages.error_occurred'),
          type: 'error'
        })
        console.log(error)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
<style lang="scss">
#sme-form {
  .el-form-item {
    margin-bottom: 0;
  }
}
</style>
