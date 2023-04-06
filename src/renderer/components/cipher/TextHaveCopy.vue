<template>
  <div class="grid md:grid-cols-6 grid-cols-1 cipher-item">
    <p class="!break-normal mr-4">{{ label }}</p>

    <div class="col-span-4 font-semibold">
      <div v-if="text && textArea" class="whitespace-pre-wrap break-normal">
        {{ text }}
      </div>
      <span v-if="text && !textArea" class="break-normal">{{
        text | filterPassword(showPassword)
      }}</span>
    </div>

    <div v-if="text && viewPassword === true" class="text-right">
      <button
        v-if="shouldHide"
        class="btn btn-icon btn-xs btn-action"
        @click="showPassword = !showPassword"
      >
        <i
          class="far"
          :class="{ 'fa-eye': !showPassword, 'fa-eye-slash': showPassword }"
        />
      </button>
      <button
        v-clipboard:copy="text"
        v-clipboard:success="clipboardSuccessHandler"
        class="btn btn-icon btn-xs btn-action"
      >
        <i class="far fa-copy" />
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    shouldHide: {
      type: Boolean,
      default: false
    },
    viewPassword: {
      type: Boolean,
      default: true
    },
    textArea: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      showPassword: false
    }
  },
  watch: {
    shouldHide (val) {
      this.showPassword = !val
    }
  },
  mounted () {
    this.showPassword = !this.shouldHide
  }
}
</script>
