<template>
  <div class="flex items-center">
    <div class="mr-3 font-semibold" :class="currentStep.class">
      {{ currentStep.name }}
    </div>
    <img :src="require(`~/assets/images/icons/${currentStep.icon}.svg`)">
  </div>
</template>

<script>

export default {
  props: {
    steps: {
      type: Array,
      default: () => []
    },
    step: {
      type: Number,
      default: 1
    }
  },
  data () {
    return {
    }
  },
  computed: {
    currentStep () {
      return this.steps.find(s => s.key === this.step)
    }
  },
  methods: {
  }
}
</script>
