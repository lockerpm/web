<template>
  <el-dropdown trigger="click">
    <!-- Bell + counter -->
    <span class="el-dropdown-link">
      <i class="fas fa-bell text-head-5 hover:text-primary" />
      <span
        v-if="notifications.unread_count > 0"
        class="count-noti-container"
      >
        <span
          v-if="notifications.unread_count <= 99"
          class="count-noti"
        >{{ notifications.unread_count }}</span>
        <span
          v-else
          class="count-noti"
        >99+</span>
      </span>
    </span>
    <!-- Bell + counter end -->

    <el-dropdown-menu
      slot="dropdown"
      class="w-[400px] notification max-h-[70vh] overflow-y-scroll"
    >
      <!-- Header -->
      <div class="flex justify-between px-4 pt-4 text-head-6 font-semibold">
        <div>
          {{ $t('sidebar.notifications') }}
        </div>
        <div class="text-[#005AE4] cursor-pointer" @click="setReadAll">
          {{ $t('data.notifications.mark_all_as_read') }}
        </div>
      </div>
      <!-- Header end -->

      <!-- List noti -->
      <template v-if="notifications.count > 0">
        <el-dropdown-item
          v-for="(item, index) in notifications.results"
          :key="index"
        >
          <div
            class="flex px-3 py-2 mt-2 justify-between"
            :class="item.read ? '' : 'bg-[#F6F6F6] hover:bg-transparent'"
            @click="handleNotiClick(item)"
          >
            <!-- Icon -->
            <div class="min-w-[40px]">
              <img :src="getNotiIcon(item.type)">
            </div>
            <!-- Icon end -->

            <!-- Body -->
            <div class="landing-font-14 px-4 flex-1">
              <div v-if="locale==='vi'" class="font-semibold">{{ item.title.vi }}</div>
              <div v-if="locale==='en'" class="font-semibold">{{ item.title.en }}</div>
              <div class="">{{ $moment(item.publish_time * 1000).fromNow() }}</div>
            </div>
            <!-- Body end -->

            <!-- Not read icon -->
            <div v-if="!item.read" class="min-w-3 w-3 h-3 rounded-full bg-primary self-center" />
            <!-- Not read icon end -->
          </div>
        </el-dropdown-item>
      </template>
      <!-- List noti end -->

      <!-- Empty -->
      <template v-else>
        <el-dropdown-item>
          {{ $t('data.notifications.no_notifications') }}
        </el-dropdown-item>
      </template>
      <!-- Empty end -->
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import { Utils } from '../../jslib/src/misc/utils.ts'

export default {
  computed: {
    notifications () { return this.$store.state.notifications }
  },
  methods: {
    getNotiIcon (type) {
      switch (type) {
      case 'item_sharing':
      case 'member_to_group_share':
        return require('~/assets/images/icons/noti_sharing.svg')
      case 'emergency_access':
        return require('~/assets/images/icons/noti_emergencyAccess.svg')
      case 'data_breach':
        return require('~/assets/images/icons/noti_dataBreach.svg')
      case 'password_tip_trick':
        return require('~/assets/images/icons/noti_tipTrick.svg')
      default:
        return require('~/assets/images/icons/noti_marketing.svg')
      }
    },

    handleNotiClick (item) {
      this.setRead(item.id)
      switch (item.type) {
      case 'item_sharing': {
        this.$router.push(this.localeRoute({ name: 'shares' }))
        break
      }
      case 'emergency_access': {
        this.$router.push(this.localeRoute({ name: 'settings-security' }))
        break
      }
      case 'member_to_group_share': {
        // eslint-disable-next-line camelcase
        const { group_id, sharing_id, emails } = item.metadata
        this.shareKeyToNewMember(sharing_id, group_id, emails)
        break
      }
      default:
        this.$router.push({
          name: 'vault'
        })
        break
      }
    },

    setReadAll () {
      this.$axios.$get('/notifications/read_all?scope=pwdmanager')
        .then(() => {
          this.$store.dispatch('LoadNotification')
        }).catch(() => {})
    },

    setRead (id) {
      this.$axios.$put(`/notifications/${id}`, { read: true }).then(
        () => {
          this.$store.dispatch('LoadNotification')
        }).catch(() => {
        // error callback
      })
    },

    async getPublicKey (email) {
      const { public_key: publicKey } = await this.$axios.$post('cystack_platform/pm/sharing/public_key', { email })
      return publicKey
    },

    async generateMemberKey (publicKey, orgKey) {
      const pk = Utils.fromB64ToArray(publicKey)
      const key = await this.$cryptoService.rsaEncrypt(orgKey.key, pk.buffer)
      return key.encryptedString
    },

    async shareKeyToNewMember (sharingId, groupId, emails) {
      try {
        const members = await Promise.all(emails.map(async email => {
          const publicKey = await this.getPublicKey(email)
          const orgKey = await this.$cryptoService.getOrgKey(sharingId)
          const key = publicKey ? await this.generateMemberKey(publicKey, orgKey) : null
          return {
            username: email,
            key
          }
        }))
        await this.$axios.$post(`cystack_platform/pm/sharing/${sharingId}/groups/${groupId}`, {
          members
        })
        this.notify(this.$t('common.success'), 'success')
      } catch (e) {
        this.notify(this.$t('errors.something_went_wrong'), 'warning')
      }
    }
  }
}
</script>

<style scoped>

</style>
