<template>
  <div class="">
    <section class="py-[120px] full-width h-auto" style="background: #fbfaf3">
      <div class="font-bold landing-font-50 text-center">
        {{ $t('password_health_checker.header.title') }}
      </div>
      <div class="mt-5 landing-font-20 font-normal text-center font-normal">
        {{ $t('password_health_checker.header.subtitle_first') }}
      </div>
      <div class="mt-16 text-center check-input-password">
        <div class="check-password">
          <el-input
            v-model="yourPassword"
            placeholder="Test your password"
            show-password
            :class="yourPassword != '' ? 'border-desc' : 'border-no-desc'"
          />
          <div v-if="yourPassword != '' " class="description-password">
            <ul>
              <li>Minh thu</li>
              <li>
                <PasswordStrength
                  v-if="yourPassword"
                  :score="passwordStrength.score"
                />
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="mt-[42px] landing-font-14-2 italic text-center">
        {{ $t('password_health_checker.header.subtitle_second') }}
      </div>
    </section>
    <section class="py-[120px] full-width h-auto" style="background: #F5F6F7;">
      <div class="landing-font-38 font-bold text-center">
        {{ $t('password_health_checker.security_password.title') }}
      </div>
      <div class="mt-5 mb-[72px] text-center">
        <img src="~assets/images/landing/password-health-checker/image-line.png" class="w-100">
      </div>
      <div class="max-w-6xl mx-auto px-6">
        <div class="grid grid-cols-2 gap-x-[80px]">
          <div v-for="(item, index) in $t('password_health_checker.security_password.tips')" :key="index" class="p-[42px] bg-white rounded-[10px]">
            <div>
              <img :src="require(`assets/images/landing/password-health-checker/${item.image}`)" class="w-100">
            </div>
            <div class="landing-font-22 font-bold mt-[17px]">
              {{ item.title }}
            </div>
            <div class="landing-font-14 font-normal mt-3">
              {{ item.desc }}
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="py-[120px]">
      <div class="grid grid-cols-2 items-center gap-x-[94px]">
        <div>
          <div class="font-bold landing-font-38">
            {{ $t('password_health_checker.why.title') }}
          </div>
          <div class="mt-5 font-normal landing-font-18">
            {{ $t('password_health_checker.why.desc') }}
          </div>
        </div>
        <div>
          <img src="~/assets/images/landing/password-health-checker/image-why.png" class="w-100">
        </div>
      </div>
    </section>
    <section class="py-[120px] full-width h-auto">
      <div class="max-w-6xl mx-auto rounded-[10px]" style="background: #F5F6F7;">
        <div class="py-16 px-[166px]">
          <div class="landing-font-38 font-bold text-center">
            {{ $t('password_health_checker.cta.title') }}
          </div>
          <div class="landing-font-18 mt-3 font-normal text-center">
            {{ $t('password_health_checker.cta.subtitle') }}
          </div>
          <div class="mt-[42px] text-center">
            <nuxt-link
              class="landing-btn text-center"
              :to="localeRoute($t('password_health_checker.cta.btn.link'))"
            >
              {{ $t('password_health_checker.cta.btn.text') }}
            </nuxt-link>
          </div>
        </div>
      </div>
    </section>
    <section class="py-[120px] full-width h-auto questions">
      <div class="landing-font-38 font-bold text-center mb-[72px]">
        {{ $t('password_health_checker.questions.title') }}
      </div>
      <div class="max-w-6xl mx-auto">
        <el-collapse v-model="activeName" accordion>
          <el-collapse-item v-for="(item, index) in $t('password_health_checker.questions.list_questions')" :key="index" :name="(index+1).toString()">
            <template slot="title">
              <div class="font-bold landing-font-22 text-black">
                {{ item.question }}
              </div>
            </template>
            <div class="font-normal landing-font-18 pl-[58px] pr-[80px] py-[38px]">
              {{ item.answer }}
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </section>
  </div>
</template>
<script>
import PasswordStrength from '../components/password/PasswordStrength'
export default {
  components: { PasswordStrength },
  layout: 'landing',
  data () {
    return {
      yourPassword: '',
      obj: null,
      activeName: '1'
    }
  },
  computed: {
    passwordStrength () {
      if (this.yourPassword) {
        console.log(this.$passwordGenerationService.passwordStrength(this.yourPassword, ['cystack']))
        return this.$passwordGenerationService.passwordStrength(this.yourPassword, ['cystack']) || {}
      }
      return {}
    }
  }
}
</script>
<style>
.check-input-password .check-password{
  width: 70%;
  border: 1px solid #DFDFDF;
  box-shadow: 0px 10px 100px rgba(0, 0, 0, 0.05);
  border-radius: 44px;
  margin: 0 auto;
}
.check-input-password .check-password input{
  font-style: normal;
  font-weight: 400;
  font-size: 22px;
  line-height: 20px;
  color: #A2A3A7;
  padding-top: 32px;
  padding-bottom: 32px;
  padding-left: 42px;
  border: none;
}
.check-input-password .check-password .el-input i{
  margin-right: 20px;
}
.border-desc input{
  border-radius: 44px 44px 0px 0px;
}
.border-no-desc input{
  border-radius: 44px;
}
.questions .el-collapse-item__header .el-collapse-item__arrow{
  display: block;
  color: black;
}
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
  border: 1px solid #DFDFDF;
}
</style>
