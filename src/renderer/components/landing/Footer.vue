<template>
  <footer style="background-color: #F6F7F8">
    <div class="max-w-6xl mx-auto px-6">
      <!-- Menu -->
      <div class="w-full lg:flex">
        <!-- Menu items -->
        <div class="w-full lg:w-9/12">
          <div class="grid sm:grid-cols-12 gap-8 py-8 md:py-12">
            <div
              v-for="(parent, i) in menu"
              :key="i"
              class="col-span-6 md:col-span-3"
            >
              <h6 class="font-bold landing-font-16 mb-[20px]">
                {{ parent.category }}
              </h6>
              <ul>
                <li
                  v-for="(item, index) in parent.items"
                  :key="index"
                  class="mb-3"
                >
                  <a
                    class="text-black-600 transition duration-200 ease-in-out hover:no-underline sm:max-w-[170px] block"
                    :href="item.link"
                  >
                    {{ item.name }}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <!-- Menu items end -->

        <!-- Social -->
        <div class="w-full lg:w-3/12">
          <div class="grid sm:grid-cols-12 gap-8 py-8 md:py-12">
            <div class="col-span-12">
              <h6 class="font-bold landing-font-16 mb-[20px]">
                Follow us
              </h6>

              <div class="flex">
                <a
                  class="text-black-600 landing-font-32 transition duration-200 ease-in-out mr-6"
                  href="#"
                >
                  <i class="fab fa-facebook" />
                </a>
                <a
                  class="text-black-600 landing-font-32 transition duration-200 ease-in-out mr-6"
                  href="#"
                >
                  <i class="fab fa-twitter" />
                </a>
                <a
                  class="text-black-600 landing-font-32 transition duration-200 ease-in-out"
                  href="#"
                >
                  <i class="fab fa-linkedin" />
                </a>
              </div>
            </div>
          </div>
        </div>
        <!-- Social end -->
      </div>
      <!-- Menu end -->

      <!-- Bottom -->
      <div class="md:flex md:items-center md:justify-between py-3 border-t border-black-200">
        <div>
          <p class="text-black-600 landing-font-12">
            Copyright © {{ currentYear }} Locker.io ·  All rights reserved.
          </p>
        </div>
        <div>
          <a
            href="#"
            class="text-black-600 landing-font-12 mr-4 hover:no-underline"
          >
            Điều khoản
          </a>
          <a
            href="#"
            class="text-black-600 landing-font-12 hover:no-underline"
          >
            Chính sách
          </a>
        </div>
      </div>
      <!-- Bottom -->
    </div>
  </footer>
</template>

<script>
export default {

  data () {
    return {
      menu: [
        {
          category: 'Locker',
          items: [
            {
              name: 'Cách hoạt động',
              link: '#'
            },
            {
              name: 'Tính năng',
              link: '#'
            },
            {
              name: 'Bảng giá',
              link: '#'
            },
            {
              name: 'Doanh nghiệp',
              link: '#'
            },
            {
              name: 'Quản lý mật khẩu',
              link: '#'
            }
          ]
        },
        {
          category: 'Công cụ',
          items: [
            {
              name: 'Tạo mật khẩu',
              link: '#'
            },
            {
              name: 'Kiểm tra độ mạnh yếu của mật khẩu',
              link: '#'
            }, {
              name: 'Kiểm tra mật khẩu bị lộ',
              link: '#'
            }

          ]
        },
        {
          category: 'Tài nguyên',
          items: [
            {
              name: 'Danh sách 100 mật khẩu yếu nhất',
              link: '#'
            },
            {
              name: 'Blog',
              link: '#'
            },
            {
              name: 'Liên hệ',
              link: '#'
            },
            {
              name: 'Trung tâm hỗ trợ',
              link: '#'
            }
          ]
        },
        {
          category: 'Công ty',
          items: [
            {
              name: 'Về chúng tôi',
              link: '#'
            },
            {
              name: 'Tin tức',
              link: '#'
            },
            {
              name: 'Liên hệ',
              link: '#'
            }
          ]
        }
      ]
    }
  },
  computed: {
    currentYear () { return new Date().getFullYear() }
  }
}
</script>

<style scoped>

</style>
