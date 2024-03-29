(function (d, t) {
  const BASE_URL = 'https://chat.cystack.org'
  const g = d.createElement(t); const s = d.getElementsByTagName(t)[0]
  g.src = BASE_URL + '/packs/js/sdk.js'
  g.defer = true
  g.async = true
  s.parentNode.insertBefore(g, s)
  g.onload = function () {
    window.chatwootSDK.run({
      websiteToken: '9cv1u2gYqmg7VWqmj95orwAD',
      baseUrl: BASE_URL
    })
  }
})(document, 'script')

window.chatwootSettings = {
  baseDomain: '.locker.io',
  darkMode: 'auto'
}
