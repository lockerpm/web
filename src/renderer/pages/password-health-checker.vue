<template>
  <div class="">
    <section class="py-[120px] full-width h-auto" style="background: #fbfaf3">
      <div class="font-bold landing-font-72 text-center" style="color:#195723">
        {{ $t('password_health_checker.header.title') }}
      </div>
      <div class="mt-5 landing-font-20 font-normal text-center font-normal">
        {{ $t('password_health_checker.header.subtitle_first') }}
      </div>
      <div class="mt-16 text-center check-input-password">
        <el-input
          v-model="yourPassword"
          placeholder="Test your password"
          show-password
        />
        <div v-if="yourPassword != ''">
          <div class="my-8">
            <div class="line" />
          </div>
          <div class="description-password pt-16">
            <div class="flex pb-[42px] items-center border-common">
              <div class="landing-font-20 font-bold">
                Strength:
              </div>
              <div class="ml-9">
                <PasswordStrength
                  v-if="yourPassword"
                  :score="passwordStrength.score"
                />
              </div>
              <div
                class="border-status-password ml-5 "
                :class="passwordStrength.score <= 1 ? 'border-line-weak' : (passwordStrength.score == 2) ? 'border-line-medium' : 'border-line-strong' "
              />
            </div>
            <div class="flex items-center py-[42px] border-common">
              <div class="landing-font-20 font-bold">
                Password length:
              </div>
              <div class="landing-font-20 font-normal ml-9">
                {{ passwordStrength.password.length }} characters
              </div>
            </div>
            <div class="border-common py-[42px]">
              <div class="landing-font-20 font-bold text-left mb-[21px]">
                Character Variety:
              </div>
              <div>
                <ul>
                  <li v-for="(item, index) in $t('password_health_checker.header.list_character')" :key="index" class="flex items-center">
                    <div style="width: 40px;">
                      <img v-if="Object.values(options)[index] === (index + 1)" src="~assets/images/landing/password-health-checker/icon-check.png" class="w-100">
                    </div>
                    <div>
                      {{ item }}
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <div class="py-[42px]">
              <span class="landing-font-20 font-bold text-black">It would take hackers about</span>
              <span class="mx-[31px] landing-font-32 font-bold text-center" style="color: #008800">{{ passwordStrength.crack_times_display.offline_slow_hashing_1e4_per_second }}</span>
              <span class="landing-font-20 font-bold text-black">to crack your password.</span>
            </div>
            <div class="landing-font-14 font-normal italic pb-[28px]">
              Powered by haveibeenpawned.com
            </div>
          </div>
          <div class="mt-9 mb-12">
            <div class="grid grid-cols-4 py-[37px] px-16 card-exposed-time items-center" :style="times > 0 ? 'background: #FEE9EC; border: 2px solid #F54F64; ' : 'background: #E4F0E6; border: 2px solid #008800;' ">
              <div class="landing-font-20 font-bold col-span-3 text-left" :style="times > 0 ? 'color: #F54F64;': 'color: #008800;'">Your password has been exposed in data breaches:</div>
              <div v-if="times > 0" class="landing-font-20 font-bold" style="color: #F54F64;">{{ times }} times</div>
              <div v-else class="flex items-center ml-9">
                <div>
                  <img src="~/assets/images/landing/password-health-checker/ShieldCheck.png">
                </div>
                <div class="landing-font-20 font-bold">
                  No leaks found
                </div>
              </div>
            </div>
          </div>
          <div >
            <nuxt-link
              class="landing-btn text-center"
              style="padding: 28px 48px !important; font-size: 20px !important;line-height: 23px !important;"
              :to="localeRoute($t('password_health_checker.header.btn_protect_password.link'))"
            >
              {{ $t('password_health_checker.header.btn_protect_password.title') }}
            </nuxt-link>
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
        <img src="~assets/images/landing/password-health-checker/image-line.png" class="m-auto">
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
    <section class="py-[120px] process-strong-password">
      <div class="landing-font-48 font-bold text-center">
        {{ $t('password_health_checker.process_strong_password.title') }}
      </div>
      <div class="mt-[80px]">
        <div class="grid grid-cols-2 gap-[80px]">
          <div>
            <el-collapse v-model="activeIndex" accordion>
              <el-collapse-item
                v-for="(item, index) in $t('password_health_checker.process_strong_password.process')"
                :key="index"
                :name="(index+1).toString()"
                class="mb-8"
              >
                <template slot="title">
                  <div class="flex">
                    <div>
                      <div class="index-step landing-font-24 font-bold px-[15px] py-[5px]" :style="activeIndex === (index+1).toString() ? 'background: #268334; color: #FFFFFF;' : 'color: #000000; border: 1px solid #268334'">{{ index + 1 }}</div>
                    </div>
                    <div class="ml-[22px] landing-font-24 font-bold text-black">{{ item.step }}</div>
                  </div>
                </template>
                <div class="landing-font-16 font-normal mt-6 ml-[85px]">
                  {{ item.desc }}
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
          <div>
            <img src="~/assets/images/landing/password-health-checker/image-process-strong-password.png">
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
      activeName: '1',
      activeIndex: '1',
      options: {
        lowercase: 0,
        uppercase: 0,
        number: 0,
        special: 0
      },
      times: 0
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
  },
  asyncComputed: {
    getTimesExposed () {
      if (this.yourPassword) {
        this.$auditService.passwordLeaked(this.yourPassword).then(res => {
          if (res > 0) {
            this.times = res
            return res
          } else {
            this.times = 0
          }
        })
      }
      return 0
    }
  },
  watch: {
    yourPassword (yourPassword) {
      if (yourPassword) {
        const characterSpecial = /[ `!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/
        const characterLowercase = /[a-z]/
        const characterUppercase = /[A-Z]/
        const characterNumber = /[0-9]/
        if (characterSpecial.test(yourPassword)) {
          this.options.special = 4
        } else {
          this.options.special = 0
        }
        if (characterLowercase.test(yourPassword)) {
          this.options.lowercase = 1
        } else {
          this.options.lowercase = 0
        }
        if (characterUppercase.test(yourPassword)) {
          this.options.uppercase = 2
        } else {
          this.options.uppercase = 0
        }
        if (characterNumber.test(yourPassword)) {
          this.options.number = 3
        } else {
          this.options.number = 0
        }
      }
    }
  }
}
</script>
<style>
.check-input-password .el-input{
  width: 70%;
}
.check-input-password input{
  font-style: normal;
  width: 100%;
  border: 1px solid #DFDFDF;
  box-shadow: 0px 10px 100px rgba(0, 0, 0, 0.05);
  margin: 0 auto;
  font-weight: 400;
  font-size: 22px;
  line-height: 20px;
  color: #A2A3A7;
  padding-top: 32px;
  padding-bottom: 32px;
  padding-left: 42px;
  border-radius: 44px;
}
.check-input-password .el-input i{
  font-size: 32px;
  margin-right: 30px;
  margin-top: 12px;
}
.check-input-password .line{
  margin: 0 auto;
  box-shadow: 0px 10px 100px rgba(0, 0, 0, 0.05);
  border-radius: 44px;
  text-align: center;
  background: #DFDFDF;
  height: 8px;
  width: 56%;
}

.check-input-password .description-password{
  width: 70%;
  margin: 0 auto;
  background: #FFFFFF;
  border: 1px solid #DFDFDF;
  border-radius: 44px;
  padding-left: 48px;
}
.check-input-password .description-password .border-common{
  border-bottom: 1px solid #DFDFDF;
}
.check-input-password .description-password .border-status-password{
  height: 8px;
  box-shadow: 0px 10px 100px rgba(0, 0, 0, 0.05);
  border-radius: 4px;
}
.check-input-password .description-password .border-line-weak{
  background: linear-gradient(89.95deg, rgba(245, 79, 100, 0.8) 0%, #F54F64 100%);
  width: 90px;
}
.check-input-password .description-password .border-line-medium{
  width: 180px;
  background: linear-gradient(89.89deg, rgba(255, 191, 96, 0.8) 0%, #FFBF60 100%);
}
.check-input-password .description-password .border-line-strong{
  width: 270px;
  background: linear-gradient(89.95deg, rgba(58, 179, 74, 0.8) 0%, #3AB34A 100%, #3AB34A 100%);
}
.card-exposed-time{
  border-radius: 4px;
  width: 70%;
  margin: 0 auto;
}
.process-strong-password .index-step{
  border-radius: 4px;
}
.process-strong-password .el-collapse {
  border: none!important;
}
.process-strong-password .el-collapse-item__header .el-collapse-item__arrow{
  display: none;
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
