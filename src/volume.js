console.log('xd')

document.addEventListener('DOMContentLoaded', () => {
  console.log('test')

  initObserver()
})

function initObserver() {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.tagName === 'AUDIO' || node.tagName === 'VIDEO') {
              console.log(node.tagName)
              controlVolume()
            }
          }
        })
      }
    })
  })

  observer.observe(document.documentElement, { childList: true, subtree: true })
}

function controlVolume() {
  const $soundElements = [...document.querySelectorAll('video, audio')]

  console.log($soundElements)
  if ($soundElements.length > 0) {
    $soundElements.forEach((element) => {
      element.volume = 0
    })
  }
}
