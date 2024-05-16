<template>
  <div>
    <!-- Header -->
    <plans-header :plans="plans" />
    <!-- Header -->

    <!-- Table -->
    <plans-table :plans="plans" />
    <!-- Table end -->

    <!-- Feature -->
    <section class="py-16">
      <div class="grid grid-cols-1 sm:grid-cols-2 items-center mb-20 gap-x-4">
        <div class="relative">
          <img
            :src="require('~/assets/images/landing/plan/feature-stripe.svg')"
            class="h-[108px] absolute z-0"
          >
          <h2
            class="font-bold landing-font-38 text-black relative bg-white ml-10 mt-14"
          >
            {{ $t('plan.features.title') }}
          </h2>
        </div>
        <img
          :src="require('~/assets/images/landing/plan/feature-img.svg')"
          alt="Security features"
          class="sm:mt-0 mt-8"
        >
      </div>

      <div
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 lg:gap-x-14 gap-y-14"
      >
        <div
          v-for="(item, index) in $t('plan.features.details')"
          :key="index"
          class="text-center sm:text-left"
        >
          <img
            :src="require(`~/assets/images/landing/plan/${item.img}`)"
            :alt="item.title"
            class="h-[55px] mb-4 mx-auto sm:mx-0"
          >
          <h3 class="mb-4 font-bold text-black landing-font-20">
            {{ item.title }}
          </h3>
          <p class="landing-font-16 text-black-600">
            {{ item.desc }}
          </p>
        </div>
      </div>
    </section>
    <!-- Feature end -->

    <!-- Private email -->
    <section id="private-email" class="full-width py-16">
      <div class="max-w-6xl mx-auto px-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 items-center gap-x-4">
          <div class="text-center md:text-left">
            <h2
              class="landing-font-34 font-bold mb-2"
              v-html="$t('plan.private_email.title')"
            />
            <p class="landing-font-20 text-black-600 mb-4">
              {{ $t('plan.private_email.desc') }}
            </p>
            <el-button type="primary" @click="$router.push('/register')">
              {{ $t('plan.private_email.btn') }}
            </el-button>
          </div>

          <img
            :src="
              require('~/assets/images/landing/plan/private-email-illus.png')
            "
            alt="Private email"
            class="sm:mt-0 mt-8"
          >
        </div>
      </div>
    </section>
    <!-- Private email end -->

    <!-- Questions-->
    <section id="questions" class="py-16">
      <h2 class="landing-font-34 font-bold mb-20">
        {{ $t('plan.question.title') }}
      </h2>
      <el-collapse accordion>
        <el-collapse-item
          v-for="(qa, index) in $t('plan.question.question_list')"
          :key="index"
          :name="index"
          class="border-b border-black-100"
        >
          <div slot="title" class="py-6" style="margin-left: -1.25rem">
            <p class="landing-font-18 font-bold text-black">
              {{ qa.question }}
            </p>
          </div>

          <div>
            <p class="landing-font-16 text-black-600" v-html="qa.answer" />
          </div>
        </el-collapse-item>
      </el-collapse>
    </section>
    <!-- Questions end -->
  </div>
</template>

<script>
import PlansHeader from '../components/pages/plans/PlansHeader.vue'
import PlansTable from '../components/pages/plans/PlansTable.vue'

export default {
  components: { PlansHeader, PlansTable },
  layout: 'landing',
  data () {
    return {
      plans: [
        {
          name: 'Free',
          alias: 'pm_free'
        },
        {
          name: 'Premium',
          alias: 'pm_premium'
        },
        {
          name: 'Family',
          alias: 'pm_family'
        }
      ]
    }
  },
  async mounted () {
    try {
      const plans = await this.$axios.$get(
        'resources/cystack_platform/pm/plans'
      )
      this.plans = plans
    } catch (error) {
      //
    }
  }
}
</script>
<style lang="scss" scoped>
#private-email {
  background-image: url(~assets/images/landing/plan/private-email-cover.svg);
  background-repeat: no-repeat;
  background-size: cover;
}
</style>
<style>
#questions .el-collapse-item__header {
  height: auto !important;
}
</style>
