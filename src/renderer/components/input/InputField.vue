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
  >
    <div class="cs-input-label flex">
      <input
        ref="inputLabel"
        type="text"
        :disabled="disabled"
        :placeholder="option.fieldPlaceholder || option.label"
        :value="label"
        @input="handleInputLabel"
        @mouseleave="hovering = false"
        @focus="handleFocus"
        @blur="focusing = false"
        @mouseenter="handleHover"
        @keyup.enter="keyupEnter"
      >
      <i
        v-if="!disabled"
        class="el-icon-remove-outline cursor-pointer text-danger-600 text-head-5"
        @click="$emit('delete')"
      />
    </div>
    <div class="cs-input-value">
      <template v-if="isTextarea">
        <textarea
          ref="textarea"
          class="cs-textarea"
          :placeholder="option.placeholder"
          :disabled="disabled"
          @mouseleave="hovering = false"
          @focus="handleFocus"
          @blur="focusing = false"
          @input="handleInput"
          @mouseenter="handleHover"
        />
      </template>
      <template v-else-if="isDate">
        <el-date-picker
          ref="datetime"
          v-model="date"
          :disabled="disabled"
          :default-value="value"
          class="cs-datepicker"
          type="date"
          :placeholder="option.placeholder"
          format="dd-MM-yyyy"
          value-format="dd-MM-yyyy"
          @change="handleChangeDate"
        />
      </template>
      <template v-else>
        <input
          ref="input"
          class="cs-input"
          :type="type"
          :placeholder="option.placeholder"
          :disabled="disabled"
          :value="value"
          tabindex="0"
          @mouseleave="hovering = false"
          @focus="handleFocus"
          @blur="focusing = false"
          @input="handleInput"
          @mouseenter="handleHover"
          @keyup.enter="keyupEnter"
        >
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
      <div v-if="errorText" class="cs-helper-text">
        {{ errorText }}
      </div>
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
    isTextarea: {
      type: Boolean,
      default: false
    },
    isDate: {
      type: Boolean,
      default: false
    },
    value: {
      type: [String, Number, Date],
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
    option: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      focusing: false,
      hovering: false,
      type: 'text',
      date: this.value
    }
  },
  computed: {
    nativeInputValue () {
      return this.value === null || this.value === undefined
        ? ''
        : String(this.value)
    },
    nativeInputLabel () {
      return this.label === null || this.label === undefined
        ? ''
        : String(this.label)
    }
  },
  watch: {
    nativeInputValue () {
      this.setNativeInputValue()
    },
    nativeInputLabel () {
      this.setNativeInputLabel()
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
    togglePassword () {
      this.type = this.type === 'text' ? 'password' : 'text'
    },
    setNativeInputValue () {
      const input = this.getInput()
      if (!input) return
      if (input.value === this.nativeInputValue) return
      input.value = this.nativeInputValue
    },
    setNativeInputLabel () {
      const label = this.$refs.inputLabel
      if (!label) return
      if (label.value === this.nativeInputLabel) return
      label.value = this.nativeInputLabel
    },
    getInput () {
      return this.$refs.input || this.$refs.textarea
    },
    handleInput (event) {
      if (event.target.value === this.nativeInputValue) return

      this.$emit('input', event.target.value)
      this.$nextTick(this.setNativeInputValue)
    },
    handleInputLabel (event) {
      if (event.target.value === this.nativeInputLabel) return
      this.$emit('input-label', event.target.value)
      this.$nextTick(this.setNativeInputLabel)
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
    },
    handleChangeDate (v) {
      this.$emit('input', v)
    }
  }
}
</script>

<style scoped lang="scss">
.cs-field {
  @apply mb-2.5 last:mb-6;
  position: relative;
  border-radius: 2px;
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
      top: 34px;
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
    line-height: 20px;
    border: none;
    flex: 1;
    color: #161922;
    height: 32px;
    background-color: #f3f3f3 !important;
    width: 100%;
  }
  .cs-input-label {
    margin: 0 0 8px 0;
    align-items: center;
    input {
      padding: 0 0.75rem 0 0;
      font-size: 14px;
      line-height: 20px;
      border: none;
      flex: 1;
      color: #161922;
      background-color: inherit;
    }
    i {
      font-size: 18px;
    }
  }
  .cs-input-value {
    border: solid 1px #e6e8f4;
    background-color: #f3f3f3;
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

  ::placeholder {
    color: #90a0c1;
  }
}
</style>
