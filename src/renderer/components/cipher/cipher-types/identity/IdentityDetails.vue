<template>
  <div>
    <TextHaveCopy
      :label="$t('data.ciphers.title')"
      :text="
        cipher.identity.title ? $t(`common.${cipher.identity.title}`) : null
      "
    />
    <TextHaveCopy
      :label="$t('data.ciphers.first_name')"
      :text="cipher.identity.firstName"
    />
    <TextHaveCopy
      :label="$t('data.ciphers.last_name')"
      :text="cipher.identity.lastName"
    />
    <TextHaveCopy label="Username" :text="cipher.identity.username" />
    <TextHaveCopy label="Email" :text="cipher.identity.email" />
    <TextHaveCopy
      :label="$t('data.ciphers.phone')"
      :text="cipher.identity.phone"
    />
    <TextHaveCopy
      :label="$t('data.ciphers.company')"
      :text="cipher.identity.company"
    />
    <TextHaveCopy :label="$t('data.ciphers.ssn')" :text="cipher.identity.ssn" />
    <TextHaveCopy
      :label="$t('data.ciphers.passport')"
      :text="cipher.identity.passportNumber"
    />
    <TextHaveCopy
      :label="$t('data.ciphers.license')"
      :text="cipher.identity.licenseNumber"
    />
    <TextHaveCopy
      :label="$t('data.ciphers.address') + '1'"
      :text="cipher.identity.address1"
    />
    <TextHaveCopy
      :label="$t('data.ciphers.address') + '2'"
      :text="cipher.identity.address2"
    />
    <TextHaveCopy
      :label="$t('data.ciphers.city_town')"
      :text="cipher.identity.city"
    />
    <TextHaveCopy
      :label="$t('data.ciphers.state_province')"
      :text="cipher.identity.state"
    />
    <TextHaveCopy
      :label="$t('data.ciphers.zip')"
      :text="cipher.identity.postalCode"
    />
    <TextHaveCopy
      :label="$t('data.ciphers.country')"
      :text="cipher.identity.country"
    />
  </div>
</template>
<script>
import { CipherView } from '../../../../core/models/view/cipherView'
import TextHaveCopy from '@/components/cipher/TextHaveCopy'
export default {
  components: {
    TextHaveCopy
  },

  props: {
    cipher: {
      type: [CipherView, Object],
      default: () => ({ identity: {} })
    }
  }
}
</script>
