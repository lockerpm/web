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
                  {{ $t('data.rewards.desktop_installation.title') }}
                </div>
                <span v-if="!collapse.length" class="text-black-500 lg:hidden md:block">
                  {{ $t('data.rewards.note2', { percent: 5 }) }}
                </span>
                <CurrentStep
                  v-if="!collapse.length"
                  :current-step="currentStep"
                  class="lg:hidden md:flex"
                />
              </div>
              <span v-if="!collapse.length" class="ml-4 text-black-500 lg:block md:hidden hidden">
                {{ $t('data.rewards.note2', { percent: 5 }) }}
              </span>
            </div>
            <CurrentStep
              v-if="!collapse.length"
              :current-step="currentStep"
              class="lg:flex md:hidden hidden"
            />
            <a
              v-else
              href="https://locker.io/download"
              target="_blank"
              class="lg:block md:hidden hidden"
            >
              <el-button
                type="success"
                size="small"
              >
                {{ $t('data.rewards.desktop_installation.header_btn') }}
              </el-button>
            </a>
          </div>
        </template>
        <div class="px-5">
          <div v-if="collapse.length" class="lg:hidden md:block mb-3">
            <a
              href="https://locker.io/download"
              target="_blank"
            >
              <el-button
                type="success"
                size="small"
              >
                {{ $t('data.rewards.desktop_installation.header_btn') }}
              </el-button>
            </a>
          </div>
          <div class="lg:w-1/2 md:w-full mb-4">
            {{ $t('data.rewards.desktop_installation.subtitle') }}
          </div>
          <Steps :steps="steps" />
          <div class="mb-4 text-black-500">
            <div v-html="$t('data.rewards.desktop_installation.subtitle1_desc')"/>
          </div>
          <div class="ext-black-500">
            <div v-html="$t('data.rewards.desktop_installation.subtitle1_desc1')"/>
          </div>
          <div v-if="currentStep.key < 3" class="mt-3">
            <el-button
              type="success"
              plain
              :loading="callingAPI"
              @click="handleSend"
            >
              {{ $t('data.rewards.desktop_installation.btn') }}
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
    }
  },
  methods: {
    handleSend () {
      this.callingAPI = true
      this.$axios.$post(`/cystack_platform/pm/reward/missions/${this.mission.mission.id}/completed`, { user_identifier: null }).then(res => {
        this.callingAPI = false
        if (res.claim) {
          this.$emit('send', {
            type: 'code_off',
            percent: 5,
            action: this.$t('data.rewards.desktop_installation.title')
          })
        } else {
          this.$emit('resubmit', {
            type: 'code_off',
            action: this.$t('data.rewards.desktop_installation.title')
          })
        }
      }).catch(() => {
        this.callingAPI = false
        this.$emit('resubmit', {
          type: 'code_off',
          action: this.$t('data.rewards.desktop_installation.title')
        })
      })
    }
  }
}
</script>
