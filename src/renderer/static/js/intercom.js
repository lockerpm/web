window.intercomSettings = {
  app_id: 'hjus3ol6',
  api_base: 'https://hjus3ol6.intercom-messenger.com'
};

(function () {
  const w = window
  const ic = w.Intercom
  if (typeof ic === 'function') {
    ic('reattach_activator')
    ic('update', intercomSettings)
  } else {
    const d = document
    var i = function () {
      i.c(arguments)
    }
    i.q = []
    i.c = function (args) {
      i.q.push(args)
    }
    w.Intercom = i

    function l () {
      const s = d.createElement('script')
      s.type = 'text/javascript'
      s.async = true
      s.src = 'https://widget.intercom.io/widget/hjus3ol6'
      const x = d.getElementsByTagName('script')[0]
      x.parentNode.insertBefore(s, x)
    }

    if (w.attachEvent) {
      w.attachEvent('onload', l)
    } else {
      w.addEventListener('load', l, false)
    }
  }
})()
