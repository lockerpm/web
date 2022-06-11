<template>
  <div class="md:pt-[180px] pt-36">
    <section>
      <h1 class="landing-font-50 text-center font-bold">{{ header.title }}</h1>
      <img
        src="~/assets/images/landing/password-generator/boundary.svg"
        class="mx-auto mt-[15px] mb-5"
      >
      <p class="landing-font-20 max-w-[600px] text-center mx-auto">{{ header.desc }}</p>
      <!--      Tool-->
      <div class="mx-auto h-auto mt-[45px] max-w-[730px] shadow-xl rounded-xl">
        <!--        <img-->
        <!--          :src="require(`~/assets/images/landing/password-generator/${header.img}`)"-->
        <!--        >-->
        <div
          style="background-color: #F5F6F7; border-radius: 10px 10px 0 0;"
          class="h-auto flex flex-wrap pb-5 pr-6"
        >
          <div class="w-11/12 h-auto break-words">
            <p
              id="password"
              class="landing-font-34 font-semibold mt-8 ml-9 max-w-[600px]"
            >
              {{ password }}
            </p>
          </div>
          <div class="w-1/12 self-center pt-6">
            <button @click="regenerate">
              <img
                src="~/assets/images/landing/password-generator/refresh.png"
                style="width: 50px; height: 50px;"
              >
            </button>
          </div>
        </div>
        <div class="mx-9 pt-6 flex flex-wrap">
          <div class="w-full sm:w-1/2">
            <p v-if="locale === 'vi'" class="landing-font-16 font-semibold">Mật khẩu mạnh:</p>
            <p v-if="locale === 'en'" class="landing-font-16 font-semibold">Strength:</p>
            <div style="margin-left: 130px; transform: translateY(-23px);">
              <PasswordStrength
                v-if="password"
                :score="passwordStrength.score"
              />
            </div>
            <p class="landing-font-16 font-semibold">{{ $t('common.length') }}</p>
            <div>
              <input
                v-model="options.length"
                class="h-[44px] w-[70px] mt-4 mr-3"
                type="number"
                min="8"
                max="64"
                @change="updateLength"
              >
              <!--            <input type="range" min="0" max="50" v-model="form_gen.length">-->
              <el-slider
                v-model="options.length"
                :min="8"
                :max="64"
                :debounce="800"
                style="margin-left: 80px; transform: translateY(-40px); padding-right: 60px"
                @change="regenerate"
              />
            </div>
          </div>
          <div class="w-full sm:w-1/2">
            <!--            <div v-for="(item, index) in form_gen.check_list" class="mb-[14px] md:pl-10 pl-0" :key="index">-->
            <!--              <input type="checkbox" :id="item.value" v-model="item.checked" :key="index">-->
            <!--              <label :for="item.value" :key="index" class="landing-font-14" style="color: #5A6176"> {{-->
            <!--                  item.label-->
            <!--                }}</label>-->
            <!--              <el-checkbox-->
            <!--                v-for="(item, index) in form_gen.check_list" :key="index"-->
            <!--                v-model="item.checked"-->
            <!--                class="mb-[14px] md:pl-10 pl-0"-->
            <!--              >-->
            <!--              {{item.label}}-->
            <!--              </el-checkbox>-->
            <!--              <br>-->
            <!--            </div>-->
            <el-checkbox
              v-model="options.uppercase"
              class="mb-[14px] md:pl-10 pl-0"
              @change="regenerate"
            >
              {{ $t('data.tools.uppercase') }}
            </el-checkbox>
            <el-checkbox
              v-model="options.lowercase"
              class="mb-[14px] md:pl-10 pl-0"
              @change="regenerate"
            >
              {{ $t('data.tools.lowercase') }}
            </el-checkbox>
            <el-checkbox
              v-model="options.number"
              class="mb-[14px] md:pl-10 pl-0"
              @change="regenerate"
            >
              {{ $t('data.tools.digits') }}
            </el-checkbox>
            <el-checkbox
              v-model="options.special"
              class="mb-[14px] md:pl-10 pl-0"
              @change="regenerate"
            >
              {{ $t('data.tools.symbols') }}
            </el-checkbox>
            <el-checkbox
              v-model="options.ambiguous"
              class="mb-[14px] md:pl-10 pl-0"
              @change="regenerate"
            >
              {{ $t('data.tools.ambiguous') }}
            </el-checkbox>
          </div>
          <div class="w-full mt-9 grid sm:grid-cols-2 grid-cols-1 gap-5 mb-[50px]">
            <button
              v-clipboard:copy="password"
              v-clipboard:success="clipboardSuccessHandler"
              class="landing-btn w-auto"
            >
              {{ $t('data.tools.copy_password') }}
            </button>

            <button class="landing-btn2 w-auto" @click="saveWithLocker">
              {{ $t('password_generator.save_with_locker') }}
            </button>
          </div>
        </div>
      </div>
      <!--Tool end-->
      <!-- CTA 1 -->
      <div class="md:mt-36 mt-24">
        <div
          class="w-full rounded-lg py-[40px] px-[65px] flex justify-between align-middle md:flex-row flex-col"
          style="background-color: #f5f6f7"
        >
          <div>
            <h2 class="landing-font-28 font-semibold mb-3 sm:text-left text-center">{{ cta1.title }}</h2>
            <p class=" md:max-w-[490px] md:text-left md:mb-0 landing-font-14 max-w-max text-center mb-6">
              {{ cta1.desc }}
            </p>
          </div>
          <nuxt-link
            class="landing-btn"
            :to="localeRoute({name: cta1.btn.link})"
            style="align-self: center"
          >
            {{ cta1.btn.text }}
          </nuxt-link>
        </div>
      </div>
      <!-- CTA 1 end -->
      <!-- Why -->
      <div class="mt-[150px]">
        <div class="w-full flex flex-wrap">
          <div class="w-full md:mb-0 mt-3 md:w-1/2 md:px-20 self-center md:order-2 order-1">
            <h2 class="w-full font-bold landing-font-38 text-black mb-[20px]">
              {{ why.title }}
            </h2>
            <p
              class="landing-font-18 md:max-w-[445px]"
              v-html="why.desc"
            />
          </div>
          <!-- Right end -->
          <!-- Left -->
          <div class="w-full md:w-1/2 pl-0 flex order-1">
            <img
              :src="require(`~/assets/images/landing/password-generator/${why.img}`)"
              alt=""
              style="align-self: center"
            >
          </div>
          <!-- Left end -->
        </div>
      </div>
      <!-- Why end -->
    </section>
    <section
      class="full-width h-auto mt-32"
      style="background-color: #F5F6F7"
    >
      <div class="max-w-[1000px] mx-auto">
        <h1 class="landing-font-38 font-bold pt-32  text-center">{{ tips.title }}</h1>
        <img
          src="~/assets/images/landing/password-generator/boundary2.svg"
          class="mx-auto mt-[15px] mb-5"
        >
      </div>
      <div class="max-w-[900px] mx-auto mt-[45px] pb-[120px] px-5">
        <div
          v-for="(tip, index) in tips.details"
          :key="index"
          class="bg-white mb-[30px] rounded-lg py-[50px] pr-[35px] pl-3"
        >
          <div class="w-full flex flex-wrap">
            <div class="md:w-1/12 w-full circle ml-6 mb-3">
              <p class="text-white landing-font-38 font-bold mx-auto my-auto">{{ index + 1 }}</p>
            </div>
            <div class="max-w-[705px] ml-6">
              <h2
                class="landing-font-22 font-bold mb-3"
                style="color: #161922"
              >
                {{ tip.title }}
              </h2>
              <p
                class="landing-font-14"
                style="color: #5A6176"
              >
                {{ tip.desc }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="mb-20">
      <div class="mt-[150px]">
        <div class="w-full flex flex-wrap">
          <div class="w-full md:mb-0 mt-3 md:w-1/2 self-center order-1">
            <h2 class="w-full font-bold landing-font-38 text-black mb-[20px]">
              {{ use_locker.title }}
            </h2>
            <p class="landing-font-18">{{ use_locker.desc }}</p>
            <div class="landing-font-18 align-top mt-[45px]">
              <nuxt-link
                :to="localeRoute({name: 'features'})"
                class="hover:no-underline text-green font-semibold"
              >
                {{ use_locker.link }} <i class="el-icon-right" />
              </nuxt-link>
            </div>
          </div>
          <!-- Left end -->
          <!-- Right -->
          <div class="w-full md:w-1/2 pl-0 md:pl-4 pt-6 md:pt-0 flex align-middle justify-end order-2">
            <img
              :src="require(`~/assets/images/landing/password-generator/${use_locker.img}`)"
              alt=""
              style="align-self: center"
            >
          </div>
          <!-- Right end -->
        </div>
      </div>
      <!-- Download -->
      <div class="mt-[150px]">
        <h1 class="landing-font-38 font-bold text-center">{{ benefit.title }}</h1>
        <p class="landing-font-18 text-center max-w-[730px] mx-auto mt-5 mb-[45px]">{{ benefit.desc }}</p>
        <div class="w-full mx-auto grid md:grid-cols-2 grid-cols-1 gap-y-[60px] gap-x-[90px]">
          <div
            v-for="(item, index) in benefit.features"
            :key="index"
            class="rounded-md"
            style="background-color:#F5F6F7"
          >
            <div class="px-[50px] pt-[60px] text-center">
              <h2 class="landing-font-22 font-bold">{{ item.title }}</h2>
              <p class="landing-font-14 mt-3 mb-[30px]">{{ item.desc }}</p>
              <div
                v-for="link in item.link"
                :key="link.app"
                class="landing-font-18 align-top"
              >
                <a
                  class="hover:no-underline text-green font-semibold"
                  @click.prevent="goToInstall(link.app)"
                >
                  {{ link.title }} <i class="el-icon-right" />
                </a>
              </div>
            </div>
            <img :src="require(`~/assets/images/landing/password-generator/${item.img}`)">
          </div>
        </div>
      </div>
      <!-- Download end -->
      <div class="md:mt-36 mt-24">
        <div
          class="w-full rounded-lg py-[40px] px-[65px] flex justify-between align-middle md:flex-row flex-col"
          style="background-color: #f5f6f7"
        >
          <p class=" md:max-w-[530px] md:text-left md:mb-0 landing-font-28 font-semibold max-w-max text-center mb-6">
            {{ cta2.title }}
          </p>
          <nuxt-link
            class="landing-btn"
            :to="localePath(cta2.btn.link)"
            style="align-self: center"
          >
            {{ cta2.btn.text }}
          </nuxt-link>
        </div>
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
      ...this.$t('password_generator'),
      options: {
        length: 16,
        uppercase: true,
        lowercase: true,
        number: true,
        special: true,
        ambiguous: false
      }
    }
  },
  computed: {
    passwordStrength () {
      if (this.password) {
        return this.$passwordGenerationService.passwordStrength(this.password, ['cystack']) || {}
      }
      return {}
    }
  },
  mounted () {
    this.regenerate()
  },
  methods: {
    copy_password () {
      const cb = navigator.clipboard
      const paragraph = document.getElementById('password')
      cb.writeText(paragraph.innerText).then(() => alert('Password copied'))
    },
    async regenerate () {
      if (!this.options.lowercase && !this.options.uppercase && !this.options.lowercase && !this.options.number && !this.options.special) {
        this.options.lowercase = true
      }
      const _options = { ...this.options }
      _options.ambiguous = !_options.ambiguous
      this.password = await this.$passwordGenerationService.generatePassword(_options)
    },
    updateLength () {
      this.options.length = parseInt(this.options.length)
      this.regenerate()
    },
    saveWithLocker () {
      this.$router.push(this.localeRoute({ name: 'vault', query: { password: this.password, nextStep: 'save' } }))
    }
  }
}
</script>

<style scoped>
.circle {
  height: 60px;
  width: 60px;
  background-color: #268334;
  border-radius: 50%;
  display: flex;
}
</style>
