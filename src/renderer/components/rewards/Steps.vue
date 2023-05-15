<template>
  <div class="w-full my-5">
    <el-steps class="w-full reward-steps" :active="2" align-center>
      <el-step
        v-for="(step, index) in steps"
        :key="index"
        :title="step.name"
        :status="step.status"
      >
        <img
          v-if="firstProcess.key === step.key && index < steps.length - 1"
          slot="icon"
          :src="require('~/assets/images/icons/step-process-next.svg')"
        >
        <img
          v-else-if="step.status !== 'finish'"
          slot="icon"
          :src="require('~/assets/images/icons/step-process.svg')"
        >
        <img
          v-else-if="lastFinish.key === step.key && index <= steps.length - 1"
          slot="icon"
          :src="require('~/assets/images/icons/step-finish-next.svg')"
        >
        <img
          v-else
          slot="icon"
          :src="require('~/assets/images/icons/step-finish.svg')"
        >
      </el-step>
    </el-steps>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    steps: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
    }
  },
  computed: {
    firstProcess () {
      return this.steps.find(s => s.status !== 'finish') || {}
    },
    lastFinish () {
      return this.steps.filter(s => s.status === 'finish').slice(-1)[0] || {}
    }
  }
}
</script>
<style lang="scss">
.reward-steps {
  .el-step {
    &__head {
      &.is-finish {
        border-color: #268334 !important;
      }
    }
    &__line {
      top: 20px !important;
      height: 1px !important;
      background-color: #000000;
      &-inner {
        border-width: 0  !important;
      }
    }
    &__icon {
      background: none;
      height: 40px;
      border-radius: 0 !important;
      img {
        background: #fff;
      }
      &.is-text {
        border: none;
      }
    }
    &:nth-child(1){
      .el-step__head {
        .el-step__icon {
          width: 54px;
          background-image: url(~/assets/images/icons/01.svg);
        }
        &.is-finish {
          .el-step__icon {
            background-image: url(~/assets/images/icons/01-green.svg);
          }
        }
      }
    }
    &:nth-child(2){
      .el-step__head {
        .el-step__icon {
          width: 65px;
          background-image: url(~/assets/images/icons/02.svg);
        }
        &.is-finish {
          .el-step__icon {
            background-image: url(~/assets/images/icons/02-green.svg);
          }
        }
      }
    }
    &:nth-child(3){
      .el-step__head {
        .el-step__icon {
          width: 66px;
          background-image: url(~/assets/images/icons/03.svg);
        }
        &.is-finish {
          .el-step__icon {
            background-image: url(~/assets/images/icons/03-green.svg);
          }
        }
      }
    }
  }
}
</style>
