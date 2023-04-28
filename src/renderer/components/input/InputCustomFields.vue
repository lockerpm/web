<template>
  <div>
    <div class="mb-4">
      <!-- <el-select
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
      </el-select> -->
    </div>
    <div v-for="(field, index) in value" :key="index">
      <InputField
        v-model="field.value"
        class="w-full"
        :label="field.name"
        :is-date="field.type === 7"
        :is-password="field.type === FieldType.Hidden"
        :option="fieldTypeOptions.find((o) => o.value == field.type)"
        @input-label="(l) => updateField(index, {name: l, value: field.value})"
        @input="(v) => updateField(index, {name: field.name, value: v})"
        @delete="deleteField(index)"
      />
      <!-- <InputText
        v-if="field.type !== FieldType.Boolean"
        v-model="field.value"
        :label="$t('common.value')"
        class="w-full"
        :is-password="field.type === FieldType.Hidden"
        @input="(v) => updateField(index, {name: field.name, value: v})"
      /> -->
      <!-- <InputSelect
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
      /> -->
    </div>

    <!-- Add new custom field -->
    <div>
      <!-- <a
        href="#"
        class="text-primary cursor-pointer"
        @click.prevent="addNewField(type, true)"
      >
        <i class="el-icon-circle-plus-outline mr-2" />{{ $t('data.ciphers.new_custom_field') }}
      </a> -->
      <el-dropdown trigger="click">
        <span class="el-dropdown-link text-primary">
          <i class="el-icon-circle-plus-outline mr-2" />{{ $t('data.ciphers.new_custom_field') }}
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            v-for="option in fieldTypeOptions"
            :key="option.value"
            :value="option.value"
            @click.native="addNewField(option.value)"
          >
            {{ option.label }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { FieldView } from '../../jslib/src/models/view'
import { FieldType } from '../../jslib/src/enums/fieldType'
import InputField from '../input/InputField.vue'
// import InputSelect from '../input/InputSelect'
export default {
  components: {
    InputField
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
          label: this.$t('data.ciphers.text'),
          value: FieldType.Text,
          fieldPlaceholder: this.$t('data.ciphers.field_name'),
          placeholder: this.$t('data.ciphers.text')
        },
        {
          label: this.$t('data.ciphers.hidden'),
          value: FieldType.Hidden,
          fieldPlaceholder: this.$t('data.ciphers.field_name'),
          placeholder: this.$t('data.ciphers.text')
        },
        // {
        //   label: 'Boolean',
        //   value: FieldType.Boolean
        // }
        {
          label: 'URL',
          value: 4,
          placeholder: 'https:// '
        },
        {
          label: 'Email',
          value: 5,
          placeholder: 'xxx@xxxx.xx'
        },
        // {
        //   label: this.$t('data.ciphers.address'),
        //   value: 6
        // },
        {
          label: this.$t('data.ciphers.date'),
          value: 7,
          placeholder: 'DD/MM/YYYY'
        },
        {
          label: this.$t('data.ciphers.monthYear'),
          value: 8,
          placeholder: 'MM/YY '
        },
        {
          label: this.$t('data.ciphers.phone'),
          value: 9,
          placeholder: '0123456789'
        }
      ],
      FieldType,
      type: FieldType.Text
    }
  },
  methods: {
    addNewField (type) {
      const newField = new FieldView()
      newField.type = type
      this.$emit('set-fields', { value: newField })
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
