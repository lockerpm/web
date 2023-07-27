<template>
  <div v-if="format" class="locker-callout locker-callout-info">
    <div class="mb-2 font-semibold">{{ title }}</div>
    <div v-if="format === 'cystackcsv' || format === 'cystackjson'">
      {{ $t('data.instructions.see_details') }}
      <a
        target="_blank"
        rel="noopener"
        :href="$t('data.instructions.locker_link')"
      >
        {{ $t('data.instructions.locker_link') }}
      </a>
    </div>
    <div v-if="format === 'bitwardencsv' || format === 'bitwardenjson'">
      {{ $t('data.instructions.see_details') }}
      <a
        target="_blank"
        rel="noopener"
        :href="$t('data.instructions.bitwarden_link')"
      >
        {{ $t('data.instructions.bitwarden_link') }}
      </a>
    </div>
    <div v-if="format === 'lastpasscsv'">
      {{ $t('data.instructions.see_details') }}
      <a
        target="_blank"
        rel="noopener"
        :href="$t('data.instructions.lastpass_link')"
      >
        {{ $t('data.instructions.lastpass_link') }}
      </a>
    </div>
    <div
      v-if="format === 'keepassxcsv'"
      v-html="$t('data.instructions.keepassx')"
    />
    <div v-if="format === 'aviracsv'" v-html="$t('data.instructions.avira')" />
    <div v-if="format === 'blurcsv'" v-html="$t('data.instructions.blur')" />
    <div
      v-if="format === 'safeincloudxml'"
      v-html="$t('data.instructions.safeincloud')"
    />
    <div
      v-if="format === 'padlockcsv'"
      v-html="$t('data.instructions.padlock')"
    />
    <div
      v-if="format === 'keepass2xml'"
      v-html="$t('data.instructions.keepass2')"
    />
    <div v-if="format === 'upmcsv'" v-html="$t('data.instructions.upm')" />
    <div
      v-if="format === 'saferpasscsv'"
      v-html="$t('data.instructions.saferpass')"
    />
    <div
      v-if="format === 'meldiumcsv'"
      v-html="$t('data.instructions.medium')"
    />
    <div
      v-if="format === 'keepercsv'"
      v-html="$t('data.instructions.keeper')"
    />
    <div v-if="format === 'chromecsv'">
      {{ $t('data.instructions.see_details') }}
      <a
        target="_blank"
        rel="noopener"
        :href="$t('data.instructions.chrome_link')"
      >
        {{ $t('data.instructions.chrome_link') }}
      </a>
    </div>
    <div v-if="format === 'firefoxcsv'">
      {{ $t('data.instructions.see_details') }}
      <a
        target="_blank"
        rel="noopener"
        :href="$t('data.instructions.firefox_link')"
      >
        {{ $t('data.instructions.firefox_link') }} </a>.
    </div>
    <div
      v-if="
        format === '1password1pif' ||
          format === '1passwordwincsv' ||
          format === '1passwordmaccsv'
      "
    >
      {{ $t('data.instructions.see_details') }}
      <a
        target="_blank"
        rel="noopener"
        :href="$t('data.instructions.1password_link')"
      >
        {{ $t('data.instructions.1password_link') }} </a>.
    </div>
    <div
      v-if="format === 'passworddragonxml'"
      v-html="$t('data.instructions.passworddragon')"
    />
    <div
      v-if="format === 'enpasscsv'"
      v-html="$t('data.instructions.enpass')"
    />
    <div
      v-if="format === 'enpassjson'"
      v-html="$t('data.instructions.enpassjson')"
    />
    <div
      v-if="format === 'pwsafexml'"
      v-html="$t('data.instructions.pwsafe')"
    />
    <div
      v-if="format === 'dashlanejson'"
      v-html="$t('data.instructions.dashlane')"
    />
    <div
      v-if="format === 'msecurecsv'"
      v-html="$t('data.instructions.msecure')"
    />
    <div
      v-if="format === 'stickypasswordxml'"
      v-html="$t('data.instructions.stickypassword')"
    />
    <div
      v-if="format === 'truekeycsv'"
      v-html="$t('data.instructions.truekey')"
    />
    <div
      v-if="format === 'clipperzhtml'"
      v-html="$t('data.instructions.clipperz')"
    />
    <div
      v-if="format === 'roboformcsv'"
      v-html="$t('data.instructions.roboform')"
    />
    <div
      v-if="format === 'passboltcsv'"
      v-html="$t('data.instructions.passbolt')"
    />
    <div
      v-if="format === 'ascendocsv'"
      v-html="$t('data.instructions.ascendoc')"
    />
    <div
      v-if="format === 'passwordbossjson'"
      v-html="$t('data.instructions.passwordboss')"
    />
    <div
      v-if="format === 'zohovaultcsv'"
      v-html="$t('data.instructions.zohovault')"
    />
    <div
      v-if="format === 'splashidcsv'"
      v-html="$t('data.instructions.splashid')"
    />
    <div
      v-if="format === 'passkeepcsv'"
      v-html="$t('data.instructions.passkeep')"
    />
    <div v-if="format === 'gnomejson'" v-html="$t('data.instructions.gnome')" />
    <div
      v-if="format === 'passwordagentcsv'"
      v-html="$t('data.instructions.passwordagent')"
    />
    <div
      v-if="format === 'passpackcsv'"
      v-html="$t('data.instructions.passpack')"
    />
    <div
      v-if="format === 'passmanjson'"
      v-html="$t('data.instructions.passman')"
    />
    <div
      v-if="format === 'avastcsv'"
      v-html="$t('data.instructions.avastcsv')"
    />
    <div
      v-if="format === 'avastjson'"
      v-html="$t('data.instructions.avastjson')"
    />
    <div
      v-if="format === 'fsecurefsk'"
      v-html="$t('data.instructions.fsecurefsk')"
    />
    <div
      v-if="format === 'kasperskytxt'"
      v-html="$t('data.instructions.kaspersky')"
    />
    <div
      v-if="format === 'remembearcsv'"
      v-html="$t('data.instructions.remembear')"
    />
    <div
      v-if="format === 'passwordwallettxt'"
      v-html="$t('data.instructions.passwordwallet')"
    />
    <div v-if="format === 'mykicsv'" v-html="$t('data.instructions.myki')" />
    <div
      v-if="format === 'securesafecsv'"
      v-html="$t('data.instructions.securesafe')"
    />
    <div
      v-if="format === 'logmeoncecsv'"
      v-html="$t('data.instructions.logmeonce')"
    />
    <div
      v-if="format === 'blackberrycsv'"
      v-html="$t('data.instructions.blackberry')"
    />
    <div
      v-if="format === 'buttercupcsv'"
      v-html="$t('data.instructions.buttercup')"
    />
    <div
      v-if="format === 'codebookcsv'"
      v-html="$t('data.instructions.codebook')"
    />
    <div
      v-if="format === 'encryptrcsv'"
      v-html="$t('data.instructions.encryptr')"
    />
    <div v-if="format === 'yoticsv'" v-html="$t('data.instructions.yoti')" />
  </div>
</template>

<script>
export default {
  props: {
    format: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  }
}
</script>
