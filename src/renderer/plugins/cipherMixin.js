export const CipherMixin = {
  methods: {
    async deleteCipher (cipher) {
      this.$confirm('Are you sure you want to permanently delete this item?', 'Warning', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(async () => {
        try {
          await this.$axios.$delete(`cystack_platform/pm/ciphers/${cipher.id}`)
          this.notify(`Xóa vĩnh viễn ${this.type}  thành công`, 'success')
          this.getSyncData()
          this.$emit('deleted-cipher')
        } catch (e) {
          this.notify(`Xóa vĩnh viễn ${this.type} thất bại`, 'warning')
          console.log(e)
        } finally {
          this.loadingPost = false
        }
      }).catch(() => {

      })
    },
    async moveTrashCipher (cipher) {
      this.$confirm('Do you really want to send to the trash?', 'Warning', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(async () => {
        try {
          await this.$axios.$put(`cystack_platform/pm/ciphers/${cipher.id}/delete`)
          this.notify(`Xóa ${cipher.type} thành công`, 'success')
          this.getSyncData()
          this.$emit('trashed-cipher')
        } catch (e) {
          this.notify(`Xóa ${cipher.type} thất bại`, 'warning')
          console.log(e)
        } finally {
          this.loadingPost = false
        }
      }).catch(() => {

      })
    },
    async restoreCipher (cipher) {
      console.log(cipher)
      this.$confirm('Are you sure you want to restore this item?', 'Warning', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(async () => {
        try {
          await this.$axios.$put(`cystack_platform/pm/ciphers/${cipher.id}/restore`)
          this.notify(`Khôi phục ${cipher.type} thành công`, 'success')
          this.getSyncData()
          this.$emit('restored-cipher')
        } catch (e) {
          this.notify(`Khôi phục ${cipher.type} thất bại`, 'warning')
          console.log(e)
        } finally {
          this.loadingPost = false
        }
      }).catch(() => {

      })
    }
  }
}
