<template>
  <div>
    <TextHaveCopy
      :label="$t('data.ciphers.title')"
      :text="
        cipher.identity.title ? $t(`common.${cipher.identity.title}`) : null
      "
      :should-hide="isPublic && hideAll"
    />
    <TextHaveCopy
      :label="$t('data.ciphers.first_name')"
      :text="cipher.identity.firstName"
      :should-hide="isPublic && hideAll"
    />
    <TextHaveCopy
      :label="$t('data.ciphers.last_name')"
      :text="cipher.identity.lastName"
      :should-hide="isPublic && hideAll"
    />
    <TextHaveCopy
      label="Username"
      :text="cipher.identity.username"
      :should-hide="isPublic && hideAll"
    />
    <TextHaveCopy
      label="Email"
      :text="cipher.identity.email"
      :should-hide="isPublic && hideAll"
    />
    <TextHaveCopy
      :label="$t('data.ciphers.phone')"
      :text="cipher.identity.phone"
      :should-hide="isPublic && hideAll"
    />
    <TextHaveCopy
      :label="$t('data.ciphers.company')"
      :text="cipher.identity.company"
      :should-hide="isPublic && hideAll"
    />
    <TextHaveCopy
      :label="$t('data.ciphers.ssn')"
      :text="cipher.identity.ssn"
      :should-hide="isPublic && hideAll"
    />
    <TextHaveCopy
      :label="$t('data.ciphers.passport')"
      :text="cipher.identity.passportNumber"
      :should-hide="isPublic && hideAll"
    />
    <TextHaveCopy
      :label="$t('data.ciphers.license')"
      :text="cipher.identity.licenseNumber"
      :should-hide="isPublic && hideAll"
    />
    <TextHaveCopy
      :label="$t('data.ciphers.address') + '1'"
      :text="cipher.identity.address1"
      :should-hide="isPublic && hideAll"
    />
    <TextHaveCopy
      :label="$t('data.ciphers.address') + '2'"
      :text="cipher.identity.address2"
      :should-hide="isPublic && hideAll"
    />
    <TextHaveCopy
      :label="$t('data.ciphers.city_town')"
      :text="cipher.identity.city"
      :should-hide="isPublic && hideAll"
    />
    <TextHaveCopy
      :label="$t('data.ciphers.state_province')"
      :text="cipher.identity.state"
      :should-hide="isPublic && hideAll"
    />
    <TextHaveCopy
      :label="$t('data.ciphers.zip')"
      :text="cipher.identity.postalCode"
      :should-hide="isPublic && hideAll"
    />
    <TextHaveCopy
      :label="$t('data.ciphers.country')"
      :text="cipher.identity.country"
      :should-hide="isPublic && hideAll"
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
    },
    isPublic: {
      type: Boolean,
      default: () => false
    },
    hideAll: {
      type: Boolean,
      default: () => false
    }
  }
}
</script>
