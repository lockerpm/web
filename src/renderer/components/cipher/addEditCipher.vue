<template>
  <div class="max-w-[300px]">
    <div class="form-group">
      <label for="">Type</label>
      <el-select v-model="cipher.type" placeholder="Select">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.name"
          :value="item.value"
        />
      </el-select>
    </div>
    <div class="form-group">
      <label for="">Name</label>
      <el-input v-model="cipher.name" />
    </div>
    <div class="form-group">
      <label for="">Username</label>
      <el-input v-model="cipher.login.username" />
    </div>
    <div class="form-group">
      <label for="">Password</label>
      <el-input v-model="cipher.login.password" />
    </div>
    <div class="form-group">
      <button class="btn btn-primary" @click="postCipher">Tạo pass</button>
    </div>
  </div>
</template>

<script>
import { CipherType } from '../../jslib/src/enums'
export default {
  data () {
    return {
      value: 1,
      cipher: {
        name: '12345',
        folder_id: null,
        team_id: null,
        fields: [],
        login: {
          username: '12345',
          password: '12345',
          totp: null,
          uris: [],
          uri: null,
          passwordRevisionDate: null
        },
        notes: '',
        type: 1
      }
    }
  },
  computed: {
    options () {
      return [
        { name: this.$t('typeLogin'), value: CipherType.Login },
        { name: this.$t('typeCard'), value: CipherType.Card },
        { name: this.$t('typeIdentity'), value: CipherType.Identity },
        { name: this.$t('typeSecureNote'), value: CipherType.SecureNote }
      ]
    },
    cardBrandOptions () {
      return [
        { name: '-- ' + this.$t('select') + ' --', value: null },
        { name: 'Visa', value: 'Visa' },
        { name: 'Mastercard', value: 'Mastercard' },
        { name: 'American Express', value: 'Amex' },
        { name: 'Discover', value: 'Discover' },
        { name: 'Diners Club', value: 'Diners Club' },
        { name: 'JCB', value: 'JCB' },
        { name: 'Maestro', value: 'Maestro' },
        { name: 'UnionPay', value: 'UnionPay' },
        { name: this.$t('other'), value: 'Other' }
      ]
    }
  },
  mounted () {
  },
  methods: {
    async postCipher () {
      try {
        const cipher = await this.$cipherService.encrypt(this.cipher)
        console.log(this.cipher)
        console.log(cipher)
        // const request = new CipherRequest(cipher)
        // console.log(request)
        const response = await this.$axios.$post('cystack_platform/pm/ciphers/vaults', {
          name: cipher.name ? cipher.name.encryptedString : null,
          folder_id: cipher.folderId,
          team_id: null,
          fields: [],
          login: {
            username: cipher.login && cipher.login.username ? cipher.login.username.encryptedString : null,
            password: cipher.login && cipher.login.password ? cipher.login.password.encryptedString : null,
            totp: cipher.login && cipher.login.totp ? cipher.login.totp.encryptedString : null,
            uris: (cipher.login && cipher.login.uris)
              ? cipher.login.uris.map(u => (
                {
                  uri: (u.uri != null ? u.uri.encryptedString : null),
                  match: (u.match != null ? u.match : null)
                }))
              : null
          },
          notes: cipher.notes ? cipher.notes.encryptedString : null,
          type: cipher.type,
          favorite: cipher.favorite,
          lastKnownRevisionDate: cipher.revisionDate,
          reprompt: cipher.reprompt
        })
        console.log(response.data)
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>
