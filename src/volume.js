initObserver()

const audioContext = new AudioContext()

function initObserver() {
  console.log('test')

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

      searchAllVideosAndAudios(parent)
    })
  })

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  })
}

function controlVolume(mediaElement) {
  const mediaSource = audioContext.createMediaElementSource(mediaElement)
  const gainNode = audioContext.createGain()
  mediaSource.connect(gainNode)
  gainNode.connect(audioContext.destination)
  gainNode.gain.value = 0
}

function searchAllVideosAndAudios(element) {
  const $soundElements = [...element.querySelectorAll('video, audio')]

  if ($soundElements.length > 0) {
    $soundElements.forEach((element) => {
      controlVolume(element)
    })
  }
}
