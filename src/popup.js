function controlVolume() {
  const $volume = document.getElementById('volume-slider')

  if (!$volume) return

  browser.tabs
    .query({
      currentWindow: true,
      active: true,
    })
    .then((tabs) => {
      for (const tab of tabs) {
        const hostname = new URL(tab.url).hostname

        browser.storage.local.get(hostname).then((res) => {
          $volume.value = (res[hostname] * 100).toString()
        })
      }
    })
    .catch((err) => console.error(err))

  $volume.addEventListener('change', function (e) {
    const currentVolume = e.target.value / 100
    console.log(currentVolume)

    browser.tabs
      .query({
        currentWindow: true,
        active: true,
      })
      .then((tabs) => {
        console.log({ tabs })
        for (const tab of tabs) {
          browser.tabs
            .sendMessage(tab.id, {
              action: 'changeVolume',
              data: currentVolume,
            })
            .catch((err) => console.error(err))
        }
      })
      .catch((err) => console.error(err))
  })
}

controlVolume()
