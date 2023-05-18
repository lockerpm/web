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
              <div class="text-head-5 font-semibold">
                {{ $t('data.rewards.google_play_rating.title') }}
              </div>
              <span v-if="!collapse.length" class="ml-4 text-black-500">
                {{ $t('data.rewards.note2', { percent: 5 }) }}
              </span>
            </div>
            <CurrentStep v-if="!collapse.length" :current-step="currentStep" />
            <el-button v-else type="success" size="small">
              {{ $t('data.rewards.google_play_rating.header_btn') }}
            </el-button>
          </div>
        </template>
        <div class="px-5">
          <div class="lg:w-1/2 md:w-full mb-4">
            {{ $t('data.rewards.google_play_rating.subtitle') }}
          </div>
          <Steps :steps="steps" />
          <div class="mb-4 text-black-500">
            <div v-html="$t('data.rewards.google_play_rating.subtitle1_desc')"/>
          </div>
          <div class="flex items-center w-full">
            <div style="width: 355px" class="mr-2">
              <el-input
                v-model="displayName"
                :placeholder="$t('data.rewards.google_play_rating.input_placeholder')"
              />
            </div>
            <el-button type="success">
              {{ $t('data.rewards.google_play_rating.btn') }}
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
      displayName: ''
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
        status: this.currentStep.key > s.key ? 'finish' : 'await'
      }))
    }
  },
  methods: {
  }
}
</script>
