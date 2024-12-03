<template>
  <div>
    <section class="full-width h-auto mt-20">
      <div
        class="h-[185px]"
        style="background-image: linear-gradient(#f8fafe, #ffffff)"
      />
      <div
        class="pb-[50px] min-w-[320px] max-w-6xl mx-auto px-6 flex flex-wrap"
        style="transform: translateY(-110px)"
      >
        <div class="w-full md:w-1/2 md:pr-[100px] self-center">
          <h1 class="landing-font-56 font-bold text-black">
            {{ $t('landing_contact.title1') }}
          </h1>
          <p
            class="landing-font-20 text-black-600 mt-5"
            v-html="$t('landing_contact.title2')"
          />
        </div>
        <div
          class="w-full md:w-1/2 md:mt-0 mt-10 shadow-custom rounded-lg h-auto bg-white p-[30px]"
        >
          <el-form
            ref="inputForm"
            :model="form"
            :rules="rules"
            label-position="top"
            label-width="120px"
            class="demo-form"
          >
            <el-form-item
              :label="$t('landing_contact.full_name')"
              prop="fullName"
            >
              <el-input v-model="form.fullName" />
            </el-form-item>
            <el-form-item :label="$t('landing_contact.email')" prop="email">
              <el-input v-model="form.email" />
            </el-form-item>
            <div class="w-full flex flex-nowrap">
              <div class="w-1/2">
                <el-form-item :label="$t('common.country')" prop="country">
                  <el-select
                    v-model="form.country"
                    placeholder=""
                    filterable
                    class="w-full"
                    auto-complete="off"
                  >
                    <el-option
                      v-for="country in countries"
                      :key="country.country_code"
                      :value="country.country_code"
                      :label="country.country_name"
                    >
                      <span>
                        <span
                          :class="`flag flag-${country.country_code.toLowerCase()}`"
                          class=""
                        />
                        {{ country.country_name }}
                      </span>
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div class="w-1/2 ml-[10px]">
                <el-form-item :label="$t('landing_contact.phone')" prop="phone">
                  <el-input v-model="form.phone" />
                </el-form-item>
              </div>
            </div>
            <div class="w-full flex flex-nowrap">
              <div class="w-1/2">
                <el-form-item
                  :label="$t('landing_contact.inquiry')"
                  prop="topic"
                >
                  <el-select
                    v-model="form.topic"
                    class="w-full"
                    placeholder="Others"
                  >
                    <el-option
                      v-for="(item, index) in options.topic"
                      :key="index"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </div>
              <div class="w-1/2 ml-[10px]">
                <el-form-item
                  :label="$t('landing_contact.urgency')"
                  prop="urgency"
                >
                  <el-select
                    v-model="form.urgency"
                    class="w-full"
                    placeholder=""
                  >
                    <el-option
                      v-for="(item, index) in options.urgency"
                      :key="index"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </div>
            </div>

            <el-form-item :label="$t('landing_contact.message')" prop="message">
              <el-input v-model="form.message" type="textarea" :rows="5" />
            </el-form-item>
            <el-form-item>
              <el-button
                class="landing-btn w-full"
                :loading="isLoading"
                @click.prevent="submit"
              >
                {{ $t('landing_contact.send') }}
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <!-- <hr class="opacity-50"> -->
    </section>
  </div>
</template>

<script>
export default {
  layout: 'landing',
  data () {
    return {
      isLoading: false,
      options: {
        topic: this.$t('landing_contact.options.topic'),
        urgency: this.$t('landing_contact.options.urgency')
      },
      countries: [],
      form: {
        fullName: '',
        email: '',
        phone: '',
        topic: 'general',
        urgency: 'medium',
        message: '',
        country: 'VN'
      },
      rules: {
        phone: [
          {
            validator: this.phoneNotRequiredValidator,
            trigger: ['blur', 'change']
          }
        ],
        fullName: [
          { required: true, message: 'Please input Full name', trigger: 'blur' }
        ],
        email: [
          { required: true, message: 'Please input Email', trigger: 'blur' },
          {
            type: 'email',
            message: 'Please input correct email address',
            trigger: ['blur', 'change']
          }
        ],
        topic: [{ required: true }],
        urgency: [{ required: true }],
        message: [{ required: true }]
      }
    }
  },

  head: {
    title: 'Contact Us - Locker'
  },

  mounted () {
    this.$recaptcha.init()
    this.getCountries()
    this.getCountryByIp().then(code => {
      if (code) {
        this.form.country = code
      }
    })
  },

  methods: {
    getCountries () {
      this.$axios.$get('resources/countries').then(res => {
        this.countries = res
      })
    },

    getLabelFromOptions (optionKey, value) {
      const item = this.options[optionKey].find(i => i.value === value)
      return item ? item.label : value
    },

    async submit () {
      if (this.$refs.inputForm) {
        const isValid = await this.$refs.inputForm.validate()
        if (!isValid) {
          return
        }
      } else {
        return
      }

      this.isLoading = true

      try {
        // Submit to portal
        const payload = {
          email: this.form.email,
          fullname: this.form.fullName,
          phone_number: this.form.phone,
          country_code: this.form.country,
          products: [
            'password_manager'
          ],
          message: `Topic: ${this.getLabelFromOptions('topic', this.form.topic)}. Urgency: ${this.getLabelFromOptions('urgency', this.form.urgency)}. Message: ${this.form.message}`,
          source: 'landing_form',
          source_link: 'https://locker.io/contact',
          captcha_code: await this.$recaptcha.execute('homepage')
        }
        await this.$axios.post(
          'https://api.cystack.net/portal/v1/users/register',
          payload
        )

        // Successfully submitted
        this.$message({
          message: this.$t('landing_contact.messages.request_has_been_sent'),
          type: 'success'
        })
      } catch (e) {
        this.$message({
          message: this.$t('landing_contact.messages.error_occurred'),
          type: 'error'
        })
      }

      this.isLoading = false
    }
  }
}
</script>

<style>
.el-form-item__label {
  @apply text-black !important;
  font-size: 14px !important;
  line-height: 24px !important;
}
</style>
