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
    currentStep: {
      type: Object,
      default: () => ({
        class: 'text-black-400',
        icon: 'power'
      })
    }
  },
  data () {
    return {
    }
  },
  methods: {
  }
}
</script>
