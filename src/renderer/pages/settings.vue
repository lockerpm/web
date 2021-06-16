<template>
  <div class="flex flex-col flex-column-fluid relative">
    <div class="flex-column-fluid lg:px-28 py-10 px-10 mb-20">
      <div class="flex mb-5">
        <nuxt-link v-for="(item, index) in menu"
                   :key="index"
                   :to="localeRoute({name: item.routeName})"
                   active-class="!text-primary"
                   class="text-black-600 font-bold mr-8 last:mr-0"
                   exact
        >
          {{ $t(`sidebar.${item.label}`) }}
        </nuxt-link>
      </div>
      <div>
        <InputSelect label="heheheh"
                     :initial-value="value"
                     class="w-[400px]"
                     @change="(v) => value = v"
        />
        {{ value }}
      </div>
      <nuxt-child />
    </div>
  </div>
</template>

<script>
import InputSelect from '../components/input/InputSelect'
export default {
  components: { InputSelect },
  props: {
    isError: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      value: 'Option1'
    }
  },
  computed: {
    currentPlan () {
      return this.$store.state.currentPlan
    },
    menu () {
      return [
        {
          label: 'general',
          routeName: 'settings'
        },
        {
          label: 'import_export',
          routeName: 'settings-import-export'
        },
        {
          label: 'download',
          routeName: 'settings-download'
        },
        {
          label: 'excluded_domains',
          routeName: 'settings-excluded-domains'
        },
        ...this.currentPlan.alias === 'pm_family_discount'
          ? [{
            label: 'family_members',
            routeName: 'settings-family-members'
          }]
          : []

      ]
    }
  }
}
</script>
