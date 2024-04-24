const hostname = location.hostname
let audioContext = new AudioContext()
const gainNodesMap = new Map()
let observer

browser.runtime.onMessage.addListener((message) => {
  if (message.action === 'changeVolume') {
    let favicon = document.querySelector("link[rel='icon']")?.href ?? ''

    if (favicon.length === 0) {
      favicon = document.querySelector("link[rel~='icon']")?.href ?? ''
    }

    browser.storage.local.set({ [hostname]: { volume: message.data, favicon } })

    getVideosAndAudios(document.documentElement)
    initObserver()
  }
})

browser.storage.local.get(hostname).then((res) => {
  const storageVolume = res[hostname]?.volume
  const storageFavicon =
    res[hostname]?.favicon?.length > 0 ? res[hostname].favicon : ''

  if (!storageVolume) return

  if (storageVolume === 1) return

  browser.storage.local.set({
    [hostname]: { volume: storageVolume, favicon: storageFavicon },
  })

  getVideosAndAudios(document.documentElement)
  initObserver()
})

document.addEventListener('click', () => {
  if (audioContext.state === 'suspended') {
    audioContext.close()
    gainNodesMap.clear()
    audioContext = new AudioContext()
    getVideosAndAudios(document.documentElement)
  }
})

function initObserver() {
  if (observer) return

  observer = new MutationObserver((mutations) => {
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
  browser.storage.local.get(hostname).then((res) => {
    const volume = res[hostname].volume

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
