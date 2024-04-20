console.log('xd')

initObserver()

function initObserver() {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      // if (mutation.type === 'childList') {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          if (node.tagName === 'AUDIO' || node.tagName === 'VIDEO') {
            console.log(node.tagName)
            controlVolume(node)
          }
        }
      })
      // }
    })
  })

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  })
}

function controlVolume(mediaElement) {
  const audioContext = new AudioContext()

  const mediaSource = audioContext.createMediaElementSource(mediaElement)

  const gainNode = audioContext.createGain()

  mediaSource.connect(gainNode)

  gainNode.connect(audioContext.destination)

  gainNode.gain.value = 0
}

function searchAllVideosAndAudios() {
  console.log({ document })
  const $soundElements = [...document.querySelectorAll('video, audio')]

  console.log($soundElements)
  if ($soundElements.length > 0) {
    $soundElements.forEach((element) => {
      controlVolume(element)
    })
  }
}
