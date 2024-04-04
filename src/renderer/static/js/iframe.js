const queryParams = new URLSearchParams(window.location.href.split('?')[1])
const isIframe = queryParams.get('mode') === 'iframe'
window.isIframe = true

function readCookie (name) {
  const nameEQ = name + '='
  const ca = document.cookie.split(';')
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) === ' ') c = c.substring(1, c.length)
    if (c.indexOf(nameEQ) === 0) {
      const value = c.substring(nameEQ.length, c.length)
      return value === 'null' ? '' : value
    }
  }
  return ''
}

const postToParent = (event, url) => {
  if (!isIframe) {
    return
  }
  const DOMAINS = [
    'https://locker.io',
    'https://staging.locker.io',
    'https://demo.locker.io:3011',
    'http://localhost:3000',
    'https://sm.locker.io'
  ]
  DOMAINS.forEach(domain => {
    window.parent.postMessage(
      {
        event,
        value: url,
        html: document.documentElement.outerHTML,
        locale: readCookie('i18n_redirected')
      },
      domain
    )
  })
}

history.pushState = (f => function pushState () {
  const ret = f.apply(this, arguments)
  window.dispatchEvent(new Event('pushState'))
  window.dispatchEvent(new Event('locationchange'))
  return ret
})(history.pushState)

history.replaceState = (f => function replaceState () {
  const ret = f.apply(this, arguments)
  window.dispatchEvent(new Event('replaceState'))
  window.dispatchEvent(new Event('locationchange'))
  return ret
})(history.replaceState)

window.addEventListener('popstate', () => {
  window.dispatchEvent(new Event('locationchange'))
})

window.addEventListener('locationchange', () => {
  postToParent('url', window.location.href)
})
