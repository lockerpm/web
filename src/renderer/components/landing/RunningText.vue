<template>
  <div :class="vertical ? inverted ? 'running-vertical-inverted' : 'running-vertical' : 'running-horizontal'">
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
    },
    inverted: {
      type: Boolean,
      default: () => false
    }
  }
}
</script>

<style lang="scss" scoped>
.running-horizontal {
  /* min-width: 100%; */
  white-space: nowrap;
  display: inline-block;
  animation: horizontal-animation 15s linear infinite;

  .content {
    min-width: 100%;
    display: inline-block;
  }
}

.running-vertical {
  animation: vertical-animation 15s linear infinite;
}

.running-vertical-inverted {
  animation: vertical-inverted-animation 15s linear infinite;
}

@keyframes horizontal-animation {
  0% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(-100%);
  }
}
@keyframes vertical-animation {
  0% {
    transform: translateY(0%);
  }
  100% {
    transform: translateY(-50%);
  }
}
@keyframes vertical-inverted-animation {
  0% {
    transform: translateY(-50%);
  }
  100% {
    transform: translateY(0%);
  }
}
</style>
