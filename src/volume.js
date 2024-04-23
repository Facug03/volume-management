console.log('test')

initObserver()

const hostname = location.hostname

browser.runtime.onMessage.addListener((message) => {
  if (message.action === 'changeVolume') {
    browser.storage.local.set({ [hostname]: message.data })

    getVideosAndAudios(document.documentElement)
  }
})

const audioContext = new AudioContext()
const gainNodesMap = new Map()

window.addEventListener('popstate', function (event) {
  console.log('probar')
})

function initObserver() {
  const observer = new MutationObserver((mutations) => {
    const uniqueParents = new Set()
    const uniqueGrandParents = new Set()

    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType !== Node.ELEMENT_NODE) return

          uniqueParents.add(node.parentNode)
        })
      }
    })

    if (uniqueParents.size === 0) return

    uniqueParents.forEach((parent) => {
      if (!parent || !parent.querySelectorAll) return

      uniqueGrandParents.add(parent.parentNode)
    })

    uniqueGrandParents.forEach((parent) => {
      if (!parent || !parent.querySelectorAll) return

      getVideosAndAudios(parent)
    })
  })

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  })
}

function controlVolume(mediaElement) {
  console.log(gainNodesMap)
  browser.storage.local.get(hostname).then((res) => {
    const volume = res[hostname]

    let gainNode = gainNodesMap.get(mediaElement)

    if (!gainNode) {
      gainNode = audioContext.createGain()
      const mediaSource = audioContext.createMediaElementSource(mediaElement)
      mediaSource.connect(gainNode)
      gainNode.connect(audioContext.destination)
      gainNodesMap.set(mediaElement, gainNode)
    }

    gainNode.gain.value = volume
  })
}

function getVideosAndAudios(element) {
  const $soundElements = element.querySelectorAll('video, audio')

  if ($soundElements.length > 0) {
    $soundElements.forEach((element) => {
      controlVolume(element)
    })
  }
}
