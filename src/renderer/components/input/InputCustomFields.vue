<template>
  <div>
    <div class="mb-4">
      <!-- <InputSelect
        :initial-value="0"
        class="w-full"
        :options="fieldTypeOptions"
        @change="(v) => addNewField(v)"
      /> -->
      <el-select
        v-model="type"
        class="w-full"
        @change="(v) => addNewField(v)"
      >
        <el-option
          v-for="option in fieldTypeOptions"
          :key="option.value"
          :label="option.label"
          :value="option.value"
        />
      </el-select>
    </div>
    <div v-for="(field, index) in value" :key="index">
      <div class="flex">
        <InputText
          v-model="field.name"
          :label="$t('common.name')"
          class="w-1/2"
          @input="(v) => updateField(index, {name: v, value: field.value})"
        />
        <div class="self-center ml-4">
          <i class="el-icon-remove-outline cursor-pointer text-danger-600 text-head-5 " @click="deleteField(index)" />
        </div>
      </div>
      <InputText
        v-if="field.type !== FieldType.Boolean"
        v-model="field.value"
        :label="$t('common.value')"
        class="w-full"
        :is-password="field.type === FieldType.Hidden"
        @input="(v) => updateField(index, {name: field.name, value: v})"
      />
      <!-- <el-select
        v-else
        :value="field.value"
        @change="(v) => updateField(index, {name: field.name, value: v})"
      >
        <el-option
          key="false"
          label="False"
          value="false"
        />
        <el-option
          key="true"
          label="True"
          value="true"
        />
      </el-select> -->
      <InputSelect
        v-else
        :label="$t('common.value')"
        :initial-value="'false'"
        class="w-full"
        :options="[
          {
            value: 'false',
            label: 'False'
          },
          {
            value: 'true',
            label: 'True'
          }
        ]"
        @change="(v) => updateField(index, {name: field.name, value: v})"
      />
    </div>
    <div>
      <a
        href="#"
        class="text-primary cursor-pointer"
        @click.prevent="addNewField(type, true)"
      >
        <i class="el-icon-circle-plus-outline mr-2" />{{ $t('data.ciphers.new_custom_field') }}
      </a>
    </div>
  </div>
</template>

<script>
import { FieldView } from '../../jslib/src/models/view'
import { FieldType } from '../../jslib/src/enums/fieldType'
import InputText from '../input/InputText'
import InputSelect from '../input/InputSelect'
export default {
  components: {
    InputText,
    InputSelect
  },
  props: {
    value: {
      type: Array,
      default: () => []
    },
    editMode: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      fieldTypeOptions: [
        {
          label: 'Text',
          value: FieldType.Text
        },
        {
          label: 'Hidden',
          value: FieldType.Hidden
        },
        {
          label: 'Boolean',
          value: FieldType.Boolean
        }
      ],
      FieldType,
      type: FieldType.Text
    }
  },
  methods: {
    addNewField (type, forceAdd = false) {
      if (this.value.length && !this.value[this.value.length - 1].value && !this.value[this.value.length - 1].name && !forceAdd) {
        this.$emit('set-fields', { index: this.value.length - 1, value: { type } })
      } else {
        const newField = new FieldView()
        newField.type = type
        this.$emit('set-fields', { value: newField })
      }
    },
    updateField (index, value) {
      this.$emit('set-fields', { index, value })
    },
    deleteField (index) {
      this.$emit('set-fields', { index, remove: true })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
