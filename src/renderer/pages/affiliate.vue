<template>
  <div>
    <section
      class="full-width h-auto bg-no-repeat bg-cover"
      :style="{backgroundImage: `url(${require(`~/assets/images/landing/affiliate/cover-bg.png`)})`}"
    >
      <div class="md:pt-[140px] pt-28 mx-auto pl-6">
        <div class="w-full flex flex-wrap justify-end">
          <div class="lg:max-w-[610px] max-h-[500px] md:w-1/2 order-1 mb-8 md:mb-0 z-10">
            <h1 class="text-left font-bold text-black landing-font-50 md:whitespace-nowrap whitespace-normal">
              {{ $t('landing_affiliate.banner.title') }}
            </h1>
            <h1 class="text-left font-bold text-black landing-font-50 md:whitespace-nowrap whitespace-normal">
              {{ $t('landing_affiliate.banner.title2') }}
            </h1>
            <p
              class="max-w-[540px] text-left font-normal text-black-600 landing-font-20 mt-4"
              v-html="$t('landing_affiliate.banner.desc')"
            />
            <div class="mt-9">
              <div class="landing-btn cursor-pointer" @click="dialogFormVisible=true">
                {{ $t('landing_affiliate.banner.button.text') }}
              </div>
            </div>
          </div>
          <!-- Right -->
          <div class="hidden md:block md:w-[48%] order-2 justify-self-end top-[173px] pr-0">
            <img
              :src="require(`~/assets/images/landing/affiliate/cover-img_${locale}.png`)"
              alt=""
              style="max-width: 120%; margin-left: 24px; max-height: 500px;"
              class="translate-x-[-120px]"
            >
          </div>
          <div class="w-full md:hidden order-2 mt-4">
            <img
              :src="require(`~/assets/images/landing/affiliate/cover-img_${locale}.png`)"
              alt=""
            >
          </div>
          <!-- Right end -->
        </div>
      </div>
    </section>
    <section class="py-[120px]">
      <div class="w-full">
        <h2 class="w-full font-bold landing-font-48 text-black text-center mb-6">
          {{ $t('landing_affiliate.why.title') }}
        </h2>
        <img
          src="~/assets/images/landing/index/boundary2.svg"
          alt=""
          class="mx-auto"
        >
        <div class="mt-16 grid md:grid-cols-2 grid-cols-1 md:gap-x-20 gap-x-0 gap-y-12">
          <div
            v-for="(item, index) in $t('landing_affiliate.why.reasons')"
            :key="index"
            class="bg-white px-9 py-[54px]"
            style="border: 1px solid #DFDFDF;box-shadow: 0px 64px 100px rgba(0, 0, 0, 0.05);border-radius: 10px;"
          >
            <img :src="require(`~/assets/images/landing/affiliate/${item.icon}`)">
            <div class="landing-font-22 font-bold mt-6">
              {{ item.title }}
            </div>
            <div class="landing-font-16 mt-2 text-black font-normal">
              {{ item.desc }}
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="py-[120px]">
      <div class="w-full">
        <h2 class="w-full font-bold landing-font-48 text-black text-center mb-6">
          {{ $t('landing_affiliate.steps.title') }}
        </h2>
        <img
          src="~/assets/images/landing/index/boundary2.svg"
          alt=""
          class="mx-auto"
        >
        <div class="mt-16 grid md:grid-cols-8 grid-cols-1">
          <template v-for="(item, index) in $t('landing_affiliate.steps.details')">
            <div
              :key="index"
              class="col-span-2"
            >
              <div class="w-full text-right text-[#62AD56] text-[85px] leading-[104px] font-bold opacity-[33%]">0{{ index + 1 }}</div>
              <img :src="require(`~/assets/images/landing/affiliate/${item.icon}`)" class="mx-auto">
              <div class="landing-font-22 font-bold mt-[18px] text-center">
                {{ item.title }}
              </div>
              <div class="landing-font-16 mt-8 text-black font-normal text-center">
                {{ item.desc }}
              </div>
            </div>
            <div v-if="index!==2" :key="`arrow-r-${index}`" class="md:col-span-1 md:block hidden self-center">
              <img src="~/assets/images/landing/affiliate/arrow.svg" class="mx-auto">
            </div>
            <div v-if="index!==2" :key="`arrow-${index}`" class="w-full h-6 md:hidden block mt-4">
              <img class="rotate-90 mx-auto" src="~/assets/images/landing/affiliate/arrow.svg">
            </div>
          </template>
        </div>
      </div>
    </section>
    <section class="py-[120px]">
      <div class="bg-[#f5f6f7] px-6 py-16">
        <div class="font-bold landing-font-38 text-black text-center">
          {{ $t('landing_affiliate.cta.title') }}
        </div>
        <div class="mt-4 landing-font-18 text-black font-normal text-center">
          {{ $t('landing_affiliate.cta.desc') }}
        </div>
        <div class="mt-8 text-center">
          <div class="landing-btn cursor-pointer" style="align-self: center" @click="dialogFormVisible=true">
            {{ $t('landing_affiliate.cta.button.text') }}
          </div>
        </div>
      </div>
    </section>
    <section class="py-[120px] full-width h-auto questions">
      <div class="landing-font-38 font-bold text-center mb-[72px]">
        {{ $t('landing_affiliate.faqs.title') }}
      </div>
      <div class="max-w-6xl px-6 mx-auto">
        <el-collapse v-model="activeName" accordion>
          <el-collapse-item v-for="(item, index) in $t('landing_affiliate.faqs.details')" :key="index" :name="(index+1).toString()">
            <template slot="title">
              <div class="font-bold landing-font-22 text-black question">
                {{ item.q }}
              </div>
            </template>
            <div class="answer font-normal landing-font-18 pl-[58px] md:pr-[80px] pr-[50px] md:py-[38px] py-[15px]">
              {{ item.a }}
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </section>
    <div class="mb-[90px] py-6 px-8 bg-[#E8E8E9] flex gap-x-6 rounded">
      <img src="~/assets/images/landing/master-password/help.svg">
      <div class="font-semibold max-w-4/5 overflow-hidden overflow-ellipsis">
        <div class="landing-font-20">
          {{ $t('landing_affiliate.help_box.title') }}
        </div>
        <div class="landing-font-16">
          {{ $t('landing_affiliate.help_box.detail') }} <span><a :href="`mailto: ${$t('landing_affiliate.help_box.email')}`" target="_blank">{{ $t('landing_affiliate.help_box.email') }}</a></span>
        </div>
      </div>
    </div>
    <el-dialog :title="$t('landing_affiliate.banner.button.text')" :visible.sync="dialogFormVisible" width="600px">
      <template v-if="dialogStep===1">
        <el-form
          ref="inputForm"
          :model="form"
          :rules="rules"
          label-position="top"
          label-width="120px"
          class="demo-form"
        >
          <el-form-item :label="$t('landing_contact.full_name')" prop="full_name">
            <el-input v-model="form.full_name" />
          </el-form-item>
          <div class="w-full flex flex-nowrap">
            <div class="w-1/2">
              <el-form-item :label="$t('landing_contact.email')" prop="email">
                <el-input v-model="form.email" />
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
              <el-form-item :label="$t('common.company')" prop="company">
                <el-input v-model="form.company" />
              </el-form-item>
            </div>
            <div class="w-1/2 ml-[10px]">
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
                    :value="country.country_name"
                    :label="country.country_name"
                  >
                    <span>
                      <span :class="`flag flag-${country.country_code.toLowerCase()}`" class="" />
                      {{ country.country_name }}
                    </span>
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
          </div>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">Cancel</el-button>
          <el-button type="primary" :loading="isLoading" @click.prevent="submit">Submit</el-button>
        </span>
      </template>
      <template v-else>
        <div class="text-center py-10">
          <div class="mt-2 text-head-6">{{ $t('landing_affiliate.thankyou') }}</div>
          <div class="mt-[30px]">
            <button
              class="btn btn-primary w-[320px]"
              @click="dialogFormVisible=false"
            >
              {{ $t('blog.great') }}
            </button>
          </div>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  layout: 'landing',
  data () {
    const phoneNotRequiredValidator = (rule, value, callback) => {
      for (const i in value) {
        if (isNaN(value[i])) {
          return callback(new Error('Please input digits'))
        }
      }

      return callback()
    }
    return {
      activeName: '1',
      dialogFormVisible: false,
      form: {
        full_name: '',
        company: '',
        email: '',
        phone: '',
        country: 'Vietnam'
      },
      dialogStep: 1,
      countries: [],
      isLoading: false,
      rules: {
        phone: [
          { validator: phoneNotRequiredValidator, trigger: ['blur', 'change'] },
          { required: true, message: 'Please input Phone', trigger: 'blur' }
        ],
        full_name: [
          { required: true, message: 'Please input Full name', trigger: 'blur' }
        ],
        email: [
          { required: true, message: 'Please input Email', trigger: 'blur' },
          { type: 'email', message: 'Please input correct email address', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  created () {
    this.getCountries()
  },
  methods: {
    getCountries () {
      this.$axios.$get('resources/countries')
        .then(res => {
          this.countries = res
        })
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
      const payload = {
        ...this.form,
        request_code: await this.$recaptcha.execute('homepage')
      }
      try {
        await this.$axios.$post('/cystack_platform/pm/affiliate_submissions', payload)
        // Successfully submitted
        this.notify(
          this.$t('landing_contact.messages.request_has_been_sent'),
          'success'
        )
        this.dialogStep = 2
      } catch (error) {
        this.notify(this.$t('landing_contact.messages.error_occurred'), 'error')
      }
      this.isLoading = false
    }
  }
}
</script>

<style>
.questions .el-collapse{
  background: #FFFFFF;
  border: 1px solid #DFDFDF;
  box-shadow: 0px 64px 100px rgba(0, 0, 0, 0.05);
  border-radius: 10px;
}
.questions .el-collapse-item__header {
  padding: 46px 80px 46px 58px;
  border-bottom: 1px solid #DFDFDF !important;
}
.questions .el-collapse-item__content{
  border-bottom: 1px solid #DFDFDF !important;
  border-top: 0 !important;
  border-right: 0 !important;
  border-left: 0 !important;
}
.questions .el-collapse-item__header i.el-collapse-item__arrow{
  display: block !important;
  color: black !important;
  font-weight: bold;
}

@media screen and (max-width: 640px){
  .bg-welcome{
    background-size: cover !important;
  }
  .questions .question{
    font-size: 16px;
  }
  .questions .answer{
    font-size: 14px;
  }
}
</style>
