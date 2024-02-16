<template>
  <div class="running-text">
    <div class="content">
      <slot />
    </div>
    <div class="content">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'RunningText',
  props: {
    vertical: {
      type: Boolean,
      default: () => false
    }
  }
}
</script>

<style scoped>
.content {
  min-width: 100%;
  display: inline-block;
}
.running-text {
  /* min-width: 100%; */
  white-space: nowrap;
  display: inline-block;
  animation: running-text-animation 8s linear infinite;
}

@keyframes running-text-animation {
  0% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(-100%);
  }
}
</style>
