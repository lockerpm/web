<template>
  <div>
    <div class="p-5 bg-[#F5F6F7]">
      <div class="flex items-center justify-between mb-8">
        <div class="text-[20px] flex-grow truncate leading-[2rem]">
          {{ password }}
        </div>
        <div class="ml-4">
          <button class="btn btn-icon btn-default w-8 h-8 !rounded-full flex items-center justify-center"
                  @click="regenerate"
          >
            <i class="fas fa-redo-alt" />
          </button>
        </div>
      </div>
      <PasswordStrength v-if="password" :score="passwordStrength.score" />
    </div>
    <div class="p-5">
      <button v-clipboard:copy="password"
              v-clipboard:success="clipboardSuccessHandler"
              class="btn btn-primary w-full"
      >
        Copy Password
      </button>
      <button class="btn btn-clean w-full" @click="toggle = !toggle">
        Show Options <i class="fa fa-chevron-down" />
      </button>
      <div v-if="toggle" class="locker-pw-generator-options">
        <div>
          <div class="text-black font-semibold -mb-2">{{ $t('common.length') }}</div>
          <el-slider v-model="options.length"
                     :min="8"
                     :max="64"
                     :debounce="800"
                     @change="regenerate"
          />
          <el-checkbox v-model="options.uppercase"
                       class="mb-2"
                       @change="regenerate"
          >
            Use uppercase letters (A-Z)
          </el-checkbox>
          <el-checkbox v-model="options.lowercase"
                       class="mb-2"
                       @change="regenerate"
          >
            Use lowercase letters (a-z)
          </el-checkbox>
          <el-checkbox v-model="options.number"
                       class="mb-2"
                       @change="regenerate"
          >
            Use digits (0-9)
          </el-checkbox>
          <el-checkbox v-model="options.special"
                       class="mb-2"
                       @change="regenerate"
          >
            Use symbols (@!$%*)
          </el-checkbox>
          <el-checkbox v-model="options.ambiguous"
                       class="mb-2"
                       @change="regenerate"
          >
            Avoid ambiguous characters
          </el-checkbox>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PasswordStrength from './PasswordStrength'
export default {
  components: { PasswordStrength },
  data () {
    return {
      password: '',
      options: {
        length: 16,
        uppercase: true,
        lowercase: true,
        number: true,
        special: true,
        ambiguous: false
      },
      toggle: false
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
    async regenerate () {
      if (!this.options.lowercase && !this.options.uppercase) {
        this.options.lowercase = true
      }
      this.password = await this.$passwordGenerationService.generatePassword(this.options)
      this.$emit('generated', this.password)
    }
  }
}
</script>
