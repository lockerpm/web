<template>
  <div class="lg:w-3/4 md:w-full">
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
                  {{ $t('data.rewards.capterra_rating.title') }}
                </div>
                <span v-if="!collapse.length" class="text-black-500 lg:hidden md:block">
                  {{ $t('data.rewards.note2', { percent: 5 }) }}
                </span>
              </div>
              <span v-if="!collapse.length" class="ml-4 text-black-500 lg:block md:hidden hidden">
                {{ $t('data.rewards.note2', { percent: 5 }) }}
              </span>
            </div>
            <CurrentStep v-if="!collapse.length" :current-step="currentStep" />
            <a
              v-else
              href="https://www.capterra.com/p/265084/Locker-Password-Manager/#reviews"
              target="_blank"
            >
              <el-button
                type="success"
                size="small"
              >
                {{ $t('data.rewards.capterra_rating.header_btn') }}
              </el-button>
            </a>
          </div>
        </template>
        <div class="px-5">
          <div class="lg:w-1/2 md:w-full mb-4">
            {{ $t('data.rewards.capterra_rating.subtitle') }}
          </div>
          <Steps :steps="steps" />
          <div class="mb-4 text-black-500">
            <div v-html="$t('data.rewards.capterra_rating.subtitle1_desc')"/>
          </div>
          <div v-if="currentStep.key < 3" class="flex items-center w-full">
            <div style="width: 355px" class="mr-2">
              <el-input
                v-model="displayName"
                :placeholder="$t('data.rewards.capterra_rating.input_placeholder')"
                :disabled="callingAPI"
              />
            </div>
            <el-button
              :type="displayName.trim() ? 'success' : ''"
              :disabled="!displayName.trim()"
              :loading="callingAPI"
              @click="handleSend"
            >
              {{ $t('data.rewards.capterra_rating.btn') }}
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
      displayName: '',
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
      this.displayName = this.mission?.answer?.user_identifier || ''
    },
    handleSend () {
      this.callingAPI = true
      this.$axios.$post(`/cystack_platform/pm/reward/missions/${this.mission.mission.id}/completed`, { user_identifier: this.displayName }).then(res => {
        this.callingAPI = false
        if (res.claim) {
          this.$emit('send', {
            type: 'code_off',
            percent: 5,
            action: this.$t('data.rewards.capterra_rating.title')
          })
        } else {
          this.$emit('resubmit', {
            type: 'code_off',
            store: 'Capterra',
            action: this.$t('data.rewards.capterra_rating.title')
          })
        }
      }).catch(() => {
        this.callingAPI = false
        this.$emit('resubmit', {
          type: 'code_off',
          store: 'Capterra',
          action: this.$t('data.rewards.capterra_rating.title')
        })
      })
    }
  }
}
</script>
