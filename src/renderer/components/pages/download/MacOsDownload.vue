<template>
  <section class="p-6 rounded-lg bg-white max-w-3xl mx-auto">
    <!-- Terminal instructions -->
    <div>
      <p class="landing-font-16 text-black mb-2">
        1. Open <span><img
          :src="require(`~/assets/images/landing/download/terminal.png`)"
          alt="Terminal"
          class="w-6 object-contain inline-block"
        ></span> <strong>Terminal</strong>. You can find it using one of the following methods:
      </p>

      <ul class="pl-7 list-disc">
        <li class="landing-font-16 text-black mb-2">
          Open <span><img
            :src="require(`~/assets/images/landing/download/launchpad.webp`)"
            alt="Launchpad"
            class="w-6 object-contain inline-block"
          ></span> <strong>Launchpad</strong> in the Dock and search for Terminal
        </li>
        <li class="landing-font-16 text-black mb-2">
          Open Spotlight using <strong>Command (⌘) + Space</strong> and search for Terminal
        </li>
      </ul>

      <p class="landing-font-16 text-black mt-4 mb-2">
        2. Paste the following command into your Terminal and press Enter:
      </p>

      <div class="flex flex-row">
        <pre class="landing-font-14 whitespace-nowrap overflow-x-auto px-4 py-2 bg-black-300 text-danger" style="font-family: monospace;">
          {{ command }}
        </pre>
        <el-button
          v-clipboard:copy="command"
          icon="el-icon-document-copy"
        />
      </div>
    </div>
    <!-- Terminal instructions end -->

    <!-- PKG instructions -->
    <div class="mt-4">
      <el-collapse>
        <el-collapse-item name="1">
          <template slot="title">
            <p class="landing-font-16 text-[#216AE2] font-normal" style="margin-left: -20px;">
              Or you can download our .pkg installer directly
            </p>
          </template>

          <!-- Download buttons -->
          <div
            class="grid lg:grid-cols-2 gap-y-[12px]"
          >
            <a
              v-for="(item, index) in $t('download.macos.list')"
              :key="index"
              :class="{
                'pointer-events-none cursor-not-allowed': !links[item.tag],
              }"
              target="_blank"
              :href="links[item.tag] || '#'"
            >
              <button
                :class="
                  links[item.tag] ? 'button-download bg-tag1' : 'button-disable'
                "
              >
                <p class="landing-font-16">
                  {{ item.button }}
                </p>
                <img
                  v-if="links[item.tag]"
                  src="~/assets/images/landing/download2/download.svg"
                  alt=""
                >
                <img
                  v-else
                  src="~/assets/images/landing/download2/download-disable.svg"
                  alt=""
                >
              </button>
              <p
                class="mt-2 mb-2 text-[#617296] landing-font-14"
              >
                {{ item.note }}
              </p>
            </a>
          </div>
          <!-- Download buttons end -->

          <!-- How to fix -->
          <div>
            <p class="landing-font-16 text-black mt-4 mb-2">
              If you cannot open the installer, do the following steps:
            </p>
            <ul class="pl-7 list-disc">
              <li class="landing-font-16 text-black mb-2">
                Open <span><img
                  :src="require(`~/assets/images/landing/download/settings.webp`)"
                  alt="Settings"
                  class="w-6 object-contain inline-block"
                ></span> <strong>Settings</strong>
              </li>
              <li class="landing-font-16 text-black mb-2">
                Navigate to <strong>Privacy & Security</strong>
              </li>
              <li class="landing-font-16 text-black mb-2">
                Select <strong>Open Anyway</strong>
              </li>
            </ul>
            <img
              :src="require(`~/assets/images/landing/download/macos-fix.png`)"
              alt="Open Anyway"
              class="w-full object-contain"
            >
          </div>
          <!-- How to fix end -->
        </el-collapse-item>
      </el-collapse>
    </div>
    <!-- PKG instructions end -->

    <!-- See what's new -->
    <div class="flex mt-4">
      <a
        href="https://locker.io/release-notes"
        class="text-[#216AE2] landing-font-16 mr-2 hover:underline hover:text-[#216AE2]"
        target="_blank"
      >
        {{ $t('download.see_what_new') }} <i class="el-icon-right" />
      </a>
    </div>
    <!-- See what's new end -->
  </section>
</template>

<script>
export default {
  name: 'MacOsDownload',
  props: {
    links: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    command () {
      return 'curl -s "https://locker.io/scripts/lockerpm-macos-installer.sh" | bash'
    }
  }
}
</script>

<style scoped>
.button-download {
  width: 298px;
  justify-content: space-between;
  display: flex;
  padding: 10px 20px;
  color: #ffffff;
  border-radius: 4px;
  align-items: center;
}
.button-download:hover {
  opacity: 0.7;
}
.bg-tag1 {
  background: linear-gradient(92.77deg, #f36cff -46.79%, #9781ff 106.78%);
}
.button-disable {
  width: 298px;
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  padding: 10px 24px;
  color: #c2c4c7;
  background: #ebeef2;
  border: 1px solid #dadee3;
  border-radius: 4px;
  align-items: center;
}
</style>
