<template>
  <div class="full-width bg-[#DFDFDF]">
    <div class="max-w-6xl px-6 mx-auto mt-20 py-[100px]">
      <div class="flex">
        <div class="md:w-1/2 w-full">
          <h1 class="landing-font-42 font-semibold" v-html="$t('business.register.title')" />
          <div class="mt-8 landing-font-16 ">
            {{ $t('business.register.desc') }}
          </div>
          <div v-for="(item, index) in $t('business.register.features')" :key="index" class="mt-5 flex gap-x-3">
            <img :src="require(`~/assets/images/business/${item.icon}`)">
            <div class="landing-font-16">{{ item.text }}</div>
          </div>
          <div class="mt-12 landing-font-16">
            {{ $t('business.register.support_text') }} <span><a class="text-info" @click.prevent="openIntercom">{{ locale==='vi'?'Liên hệ':'Contact us' }}</a></span>
          </div>
        </div>
        <div class="w-full md:w-1/2 shadow-custom rounded-lg h-auto bg-white py-[30px] px-[75px]">
          <el-form
            ref="inputForm"
            :model="form"
            :rules="rules"
            label-position="top"
            label-width="120px"
            class="demo-form"
          >
            <div class="w-full grid grid-cols-2 gap-x-4">
              <div class="col-span-1">
                <el-form-item :label="$t('common.first_name')" prop="firstName">
                  <el-input v-model="form.firstName" :placeholder="$t('common.first_name_placeholder')" />
                </el-form-item>
              </div>
              <div class="col-span-1">
                <el-form-item :label="$t('common.last_name')" prop="lastName">
                  <el-input v-model="form.lastName" :placeholder="$t('common.last_name_placeholder')" />
                </el-form-item>
              </div>
            </div>
            <el-form-item :label="$t('common.work_email')" prop="email">
              <el-input v-model="form.email" :placeholder="$t('common.work_email_placeholder')" />
            </el-form-item>
            <el-form-item :label="$t('common.new_password')" prop="password">
              <el-input v-model="form.password" :placeholder="$t('common.new_password')" />
            </el-form-item>
            <el-form-item :label="$t('common.phone')" prop="phone">
              <el-input v-model="form.phone" :placeholder="$t('common.phone')" />
            </el-form-item>
            <el-form-item :label="$t('common.company')" prop="company">
              <el-input v-model="form.company" :placeholder="$t('common.company')" />
            </el-form-item>
            <el-form-item :label="$t('common.job_title')" prop="title">
              <el-input v-model="form.title" :placeholder="$t('common.job_title')" />
            </el-form-item>
            <el-form-item>
              <el-button class="landing-btn w-full" :loading="isLoading">
                {{ $t('landing_contact.send') }}
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
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
      isLoading: false,
      form: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        company: '',
        title: ''
      },
      rules: {
        phone: [
          { required: true },
          { validator: phoneNotRequiredValidator, trigger: ['blur', 'change'] }
        ],
        firstName: [
          { required: true }
        ],
        lastName: [
          { required: true }
        ],
        email: [
          { required: true },
          { type: 'email', message: 'Please input correct email address', trigger: ['blur', 'change'] }
        ],
        password: [
          { required: true }
        ],
        company: [
          { required: true }
        ]
      }
    }
  },
  methods: {
    openIntercom () {
      if (window.Intercom) { window.Intercom('show') }
    }
  }
}
</script>

<style lang="scss" scoped>
.el-form--label-top .el-form-item__label {
  padding-bottom: 4px;
}
</style>
