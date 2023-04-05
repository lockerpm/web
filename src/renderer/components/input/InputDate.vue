<template>
  <div
    class="cs-field"
    :class="{
      'is-focus': focusing,
      'have-value': value,
      'is-hover': hovering,
      'is-error': errorText,
      'is-disabled': disabled
    }"
    @mouseleave="hovering = false"
    @mouseenter="handleHover"
  >
    <p class="cs-input-label">
      {{ label }}
    </p>
    <el-date-picker
      v-model="date"
      class="cs-datepicker"
      type="date"
      placeholder="dd-mm-yyyy"
      format="dd-MM-yyyy"
      value-format="dd-MM-yyyy"
      @change="handleChangeDate"
    />

    <div v-if="errorText" class="cs-helper-text">
      {{ errorText }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: ''
    },
    errorText: {
      type: [String, Boolean, Number],
      default: ''
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
    }
  },
  data () {
    return {
      focusing: false,
      hovering: false,
      date: this.value
    }
  },
  watch: {
    value (val) {
      this.date = val
    }
  },
  methods: {
    handleChangeDate (v) {
      this.$emit('input', v)
    },
    handleHover () {
      if (this.disabled) {
        return
      }
      this.hovering = true
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
  padding-top: 20px;
  background-color: #f3f3f3;
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
  .cs-input-label {
    padding: 0 0.75rem 0 0;
    font-size: 12px;
    line-height: 19px;
    border: none;
    flex: 1;
    color: #161922;
    position: absolute;
    top: 5px;
    left: 11px;
    background-color: inherit;
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
