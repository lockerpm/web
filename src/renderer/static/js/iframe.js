const queryParams = new URLSearchParams(window.location.href.split('?')[1])
const isIframe = queryParams.get('mode') === 'iframe'
window.isIframe = true

const postToParent = (event, url) => {
  if (!isIframe) {
    return
  }
  const DOMAINS = ['https://locker.io', 'https://staging.locker.io', 'https://demo.locker.io:3011', 'http://localhost:3000', 'https://sm.locker.io']
  DOMAINS.forEach(domain => {
    window.parent.postMessage(
      {
        event,
        value: url
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
  postToParent(window.location.href)
})
