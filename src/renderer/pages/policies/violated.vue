<template>
  <div>
    <client-only>
      <RecycleScroller
        ref="list"
        page-mode
        :item-size="65"
        :items="violatedPasswords || []"
      >
        <template #default="{item}">
          <div class="td">
            <div class="flex items-center">
              <div
                class="text-[34px] mr-3 flex-shrink-0"
                :class="{'filter grayscale': item.isDeleted}"
              >
                <Vnodes :vnodes="getIconCipher(item, 34)" />
              </div>
              <div class="flex flex-col">
                <a
                  class="text-black font-semibold truncate flex items-center"
                  :class="{'opacity-80': item.isDeleted}"
                  @click="routerCipher(item, addEdit)"
                >
                  {{ item.name }}
                  <img
                    v-if="item.organizationId"
                    src="~/assets/images/icons/shares.svg"
                    alt="Shared"
                    :title="$t('common.shared_with_you')"
                    class="inline-block ml-2"
                  >
                </a>
                <div>
                  {{ item.subTitle }}
                </div>
              </div>
            </div>
          </div>
          <div>
            <div style="border-radius: 100px; margin-right: 16px; overflow: hidden">
              <div class="bg-danger">
                <p class="font-semibold text-white px-3 py-1">
                  {{ $tc('data.policies.violation', violationsMap.get(item.id)) }}
                </p>
              </div>
            </div>
          </div>
        </template>
      </RecycleScroller>
    </client-only>
  </div>
</template>

<script>
import Vnodes from '../../components/Vnodes'

export default {
  components: {
    Vnodes
  },
  props: {
    violationsMap: {
      type: Map,
      default () {
        return new Map()
      }
    },
    violatedPasswords: {
      type: Array,
      default () {
        return []
      }
    }
  },
  computed: {
    haveData () {
      return this.violatedPasswords && this.violatedPasswords.length
    },
    noData () {
      return this.violatedPasswords && this.violatedPasswords.length === 0
    }
  },
  mounted () {
  }
}
</script>
