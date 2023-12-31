<template>
  <div
    class="cs-field"
    :class="{
      'is-focus': focusing,
      'have-value': value,
      'is-hover': hovering,
      'is-password': isPassword,
      'is-error': errorText,
      'is-disabled': disabled
    }"
    :style="{
      marginBottom:
        errorText && typeof errorText === 'string'
          ? '2rem'
          : '0.625rem !important'
    }"
  >
    <label for="">{{ label }} <span v-if="required" class="text-danger">*</span></label>
    <template v-if="isTextarea">
      <textarea
        ref="textarea"
        class="cs-textarea"
        :placeholder="shouldShowPlaceHolder ? placeholder : ''"
        :disabled="disabled"
        @mouseleave="hovering = false"
        @focus="handleFocus"
        @blur="handleOnBlur"
        @input="handleInput"
        @mouseenter="handleHover"
      />
    </template>
    <template v-else>
      <div class="input-container" :class="{ 'suffix-icon': suffixIcon }">
        <input
          ref="input"
          class="cs-input"
          :type="type"
          :placeholder="shouldShowPlaceHolder ? placeholder : ''"
          :disabled="disabled"
          :value="value"
          tabindex="0"
          @mouseleave="hovering = false"
          @focus="handleFocus"
          @blur="handleOnBlur"
          @input="handleInput"
          @mouseenter="handleHover"
          @keyup.enter="keyupEnter"
        >
        <i v-if="suffixIcon && iconType == 'icon'" :class="suffixIcon" />
        <img v-if="suffixIcon && iconType == 'img'" :src="suffixIcon">
      </div>
    </template>

    <button
      v-if="isPassword && value"
      class="btn btn-icon"
      type="button"
      tabindex="-1"
      @click="togglePassword"
    >
      <i
        class="far"
        :class="{
          'fa-eye': type === 'password',
          'fa-eye-slash': type === 'text'
        }"
      />
    </button>
    <button
      v-if="addButton"
      class="btn btn-icon !py-0"
      type="button"
      tabindex="-1"
      @click="add"
    >
      <i class="fas fa-plus" />
    </button>
    <div
      v-if="errorText && typeof errorText === 'string'"
      class="cs-helper-text"
    >
      {{ errorText }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isPassword: {
      type: Boolean,
      default: false
    },
    addButton: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: ''
    },
    errorText: {
      type: [String, Boolean, Number],
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    isTextarea: {
      type: Boolean,
      default: false
    },
    value: {
      type: [String, Number],
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    required: {
      type: Boolean,
      default: false
    },
    suffixIcon: {
      type: String,
      default: ''
    },
    iconType: {
      type: String,
      default: 'icon'
    }
  },
  data () {
    return {
      focusing: false,
      hovering: false,
      type: 'text'
    }
  },
  computed: {
    shouldShowPlaceHolder () {
      return this.placeholder && this.focusing && !this.value
    },
    nativeInputValue () {
      return this.value === null || this.value === undefined
        ? ''
        : String(this.value)
    }
  },
  watch: {
    nativeInputValue () {
      this.setNativeInputValue()
    }
  },
  created () {},
  mounted () {
    if (this.isPassword) {
      this.type = 'password'
    }
    this.$nextTick(() => {
      this.setNativeInputValue()
    })
  },
  methods: {
    handleOnBlur () {
      this.focusing = false
      this.$emit('onBlur')
    },
    togglePassword () {
      this.type = this.type === 'text' ? 'password' : 'text'
    },
    setNativeInputValue () {
      const input = this.getInput()
      if (!input) return
      if (input.value === this.nativeInputValue) return
      input.value = this.nativeInputValue
    },
    getInput () {
      return this.$refs.input || this.$refs.textarea
    },
    handleInput (event) {
      if (event.target.value === this.nativeInputValue) return

      this.$emit('input', event.target.value)
      this.$nextTick(this.setNativeInputValue)
    },
    handleFocus () {
      if (this.disabled) {
        return
      }
      this.focusing = true
    },
    handleHover () {
      if (this.disabled) {
        return
      }
      this.hovering = true
    },
    add () {
      this.$emit('add')
    },
    keyupEnter () {
      this.$emit('keyupEnter')
    }
  }
}
</script>

<style scoped lang="scss">
.cs-field {
  //width: 100%;
  min-height: 48px;
  @apply mb-2.5 last:mb-6;
  display: flex;
  position: relative;
  border-radius: 2px;
  border: solid 1px #e6e8f4;
  padding-top: 16px;
  background-color: #f3f3f3;
  .input-container {
    width: 100%;
    display: flex;
    align-items: center;
    .cs-input {
      width: 100%;
    }
    i {
      font-size: 24px;
    }
    img {
      height: 24px;
    }
    &.suffix-icon {
      padding-right: 12px;
    }
  }
  &.is-hover,
  &.is-focus {
    @apply border-primary bg-white;
    label {
      @apply text-primary;
    }
  }
  &.is-error {
    @apply border-danger mb-8 last:mb-8 #{!important};
    label,
    .cs-helper-text {
      @apply text-danger;
    }
  }
  &.is-password.is-focus,
  &.is-password.have-value {
    button.btn {
      @apply absolute p-0.5;
      top: 19px;
      right: 13px;
    }
    .cs-input {
      padding-right: 48px;
    }
  }
  &.is-focus label,
  &.have-value label {
    font-size: 12px;
    line-height: 19px;
    top: 5px;
    left: 11px;
  }
  &.is-focus .cs-textarea,
  &.have-value .cs-textarea {
    padding-top: 8px;
    margin-top: 8px;
  }
  &.is-disabled {
    cursor: not-allowed;
    input,
    button,
    input:hover,
    button:hover {
      cursor: not-allowed !important;
      user-select: none;
    }
  }
  .cs-input,
  .cs-textarea {
    padding-bottom: 0px;
    padding-top: 0px;
    font-size: 14px;
    line-height: 19px;
    border: none;
    flex: 1;
    color: #161922;
    height: 32px;
    background-color: inherit;
  }
  .cs-textarea {
    min-height: 100px;
    resize: vertical;
    max-height: 230px;
    padding-left: 12px;
    padding-right: 12px;
  }
  .cs-helper-text {
    height: 20px;
    position: absolute;
    bottom: -22px;
    font-size: 12px;
    transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  label {
    font-size: 14px;
    color: #90a0c1;
    position: absolute;
    top: 15px;
    left: 13px;
    pointer-events: none;
    transition: 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
    transition-duration: 0.3s;
    line-height: 19px;
    user-select: none;
  }
}
</style>
