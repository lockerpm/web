<template>
  <div class="lg:w-3/4 md:w-full">
    <el-collapse v-model="collapse" class="mb-8">
      <el-collapse-item
        class="setting-wrapper"
        name="collapse"
      >
        <!-- Header -->
        <template slot="title">
          <div class="py-5 flex items-center justify-between" style="width: 95%">
            <div class="flex items-center">
              <div class="text-head-5 font-semibold">
                {{ $t('data.rewards.desktop_installation.title') }}
              </div>
              <span v-if="!collapse.length" class="ml-4 text-black-500">
                {{ $t('data.rewards.note2', { percent: 5 }) }}
              </span>
            </div>
            <div v-if="!collapse.length" class="flex items-center">
              <div class="mr-3 font-semibold text-black-400">
                {{ $t(`data.rewards.steps.step${step}`) }}
              </div>
              <img :src="require('~/assets/images/icons/power.svg')">
            </div>
            <el-button v-else type="success" size="small">
              {{ $t('data.rewards.desktop_installation.header_btn') }}
            </el-button>
          </div>
        </template>
        <!-- Header end -->
        <!-- Body -->
        <div class="px-5">
          <div class="lg:w-1/2 md:w-full mb-4">
            {{ $t('data.rewards.desktop_installation.subtitle') }}
          </div>
          <Steps />
          <div class="mb-4 text-black-500">
            <div v-html="$t('data.rewards.desktop_installation.subtitle1_desc')"/>
          </div>
          <div class="mb-3 text-black-500">
            <div v-html="$t('data.rewards.desktop_installation.subtitle1_desc1')"/>
          </div>
          <el-button type="success" plain>
            {{ $t('data.rewards.desktop_installation.btn') }}
          </el-button>
        </div>
        <!-- Body end -->
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import Steps from './Steps.vue'

export default {
  components: {
    Steps
  },
  props: {
  },
  data () {
    return {
      collapse: [],
      step: 1
    }
  },
  computed: {
  },
  methods: {
  }
}
</script>
