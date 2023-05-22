<template>
  <div>
    <el-collapse v-model="collapse" class="mb-8">
      <el-collapse-item
        class="setting-wrapper"
        name="collapse"
      >
        <template slot="title">
          <div class="py-5 flex items-center justify-between" style="width: 95%">
            <div class="flex items-center">
              <div>
                <div class="text-head-5 font-semibold">
                  {{ $t('data.rewards.ext_installation.title') }}
                </div>
                <span v-if="!collapse.length" class="text-black-500 lg:hidden md:block">
                  {{ $t('data.rewards.note1', { month: 1 }) }}
                </span>
                <CurrentStep
                  v-if="!collapse.length"
                  :current-step="currentStep"
                  class="lg:hidden md:flex"
                />
              </div>
              <span v-if="!collapse.length" class="ml-4 text-black-500 lg:block md:hidden hidden">
                {{ $t('data.rewards.note1', { month: 1 }) }}
              </span>
            </div>
            <CurrentStep
              v-if="!collapse.length"
              :current-step="currentStep"
              class="lg:flex md:hidden hidden"
            />
          </div>
        </template>
        <div class="px-5">
          <div class="lg:w-1/2 md:w-full mb-4">
            {{ $t('data.rewards.ext_installation.subtitle') }}
          </div>
          <Steps :steps="steps" />
          <div class="flex flex-wrap justify-center gap-x-3 mb-4">
            <div
              v-for="item in allBrowsers"
              :key="item.value"
              class="w-[135px] mt-6 text-webkit text-center"
            >
              <div class="h-[60px] flex justify-center">
                <img
                  :src="
                    require(`~/assets/images/landing/download2/${item.imgSrc}`)
                  "
                  alt=""
                >
              </div>
              <p class="mt-3 font-semibold text-[#121212]">{{ item.name }}</p>
              <a v-if="item.active" :href="item.link" target="_blank">
                <button
                  class="mt-3 py-[3px] px-[20px] font-semibold text-[#FFFFFF] bg-[#62AD56] rounded-sm hover:bg-[#2D702C]"
                >
                  {{ $t("download.section3.install") }}
                </button>
              </a>
              <button
                v-else
                class="mt-3 py-[3px] px-[20px] font-semibold text-[#606060] bg-[#EBEEF2] rounded-sm box-border border-[1px] border-[#DADEE3] cursor-auto"
              >
                {{ $t("download.section3.coming") }}
              </button>
            </div>
          </div>
          <div class="mb-4 text-black-500">
            <div v-html="$t('data.rewards.ext_installation.subtitle1_desc')"/>
          </div>
          <div class="">
            <el-checkbox-group
              v-model="browsers"
              :disabled="callingAPI || currentStep.key === 3"
              class="mb-3 flex flex-wrap"
            >
              <div
                v-for="browser in allBrowsers"
                :key="browser.value"
                class="lg:w-1/2 md:w-full pr-6 mb-3"
              >
                <div class="flex items-center">
                  <div class="w-[100px]">
                    <el-checkbox
                      :disabled="!browser.active"
                      :label="browser.value"
                    >
                      {{ browser.name }}
                    </el-checkbox>
                  </div>
                  <div v-if="browsers.includes(browser.value)">
                    <el-input
                      v-model="browser.displayName"
                      size="small"
                      :disabled="callingAPI || currentStep.key === 3"
                      :placeholder="$t('data.rewards.ext_installation.input_placeholder')"
                    />
                  </div>
                </div>
              </div>
            </el-checkbox-group>
            <el-button
              v-if="currentStep.key < 3"
              :disabled="selectedBrowsers.length === 0"
              :type="selectedBrowsers.length === 0 ? 'default' : 'success'"
              :loading="callingAPI"
              @click="handleSend"
            >
              {{ $t('data.rewards.ext_installation.btn') }}
            </el-button>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import Steps from './Steps.vue'
import CurrentStep from './CurrentStep.vue'

export default {
  components: {
    Steps,
    CurrentStep
  },
  props: {
    mission: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      collapse: [],
      allBrowsers: this.$t('download.section3.list').map(b => ({
        ...b,
        value: b.name.toLowerCase(),
        displayName: null
      })),
      browsers: [],
      callingAPI: false
    }
  },
  computed: {
    originSteps () {
      return this.$t('data.rewards.steps')
    },
    currentStep () {
      const missionStep = this.originSteps.find(s => s.value === this.mission.status)
      return missionStep || {}
    },
    steps () {
      return this.originSteps.map(s => ({
        ...s,
        status: this.currentStep.key !== 1 && this.currentStep.key >= s.key ? 'finish' : 'await'
      }))
    },
    selectedBrowsers () {
      return this.browsers.map(b => {
        return this.allBrowsers.find(browser => browser.value === b)
      }).filter(b => b.displayName)
    }
  },
  watch: {
    mission: {
      handler () {
        this.fetchData()
      },
      deep: true
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      this.browsers = (this.mission?.answer || []).map(a => a.browser)
      this.allBrowsers = this.allBrowsers.map(b => ({
        ...b,
        displayName: (this.mission?.answer || []).find(a => a.browser === b.value)?.user_identifier || ''
      }))
    },
    handleSend () {
      this.callingAPI = true
      this.$axios.$post(`/cystack_platform/pm/reward/missions/${this.mission.mission.id}/completed`,
        this.selectedBrowsers.map(b => ({
          user_identifier: b.displayName,
          browser: b.value
        }))
      ).then(res => {
        this.callingAPI = false
        if (res.claim) {
          this.$emit('send', {
            type: 'free_month',
            action: this.$t('data.rewards.ext_installation.title')
          })
        } else {
          this.$emit('resubmit', {
            type: 'free_month',
            action: this.$t('data.rewards.ext_installation.title')
          })
        }
      }).catch(() => {
        this.callingAPI = false
        this.$emit('resubmit', {
          type: 'free_month',
          action: this.$t('data.rewards.ext_installation.title')
        })
      })
    }
  }
}
</script>
