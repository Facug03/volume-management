function controlVolume() {
  const $volume = document.getElementById('volume-slider')
  const $img = document.getElementById('web-icon')
  const $p = document.querySelector('p')

  if (!$volume || !$img || !$p) return

  browser.tabs
    .query({
      currentWindow: true,
      active: true,
    })
    .then((tabs) => {
      for (const tab of tabs) {
        const hostname = new URL(tab.url).hostname

        browser.storage.local.get(hostname).then((res) => {
          const storage = res[hostname]
          const storageVolume = storage?.volume
          const storageFavicon = storage?.favicon

          if (storageFavicon?.length > 0) {
            $img.src = storageFavicon
          } else {
            $img.style = 'display: none;'
          }

          if (storageVolume != null) {
            const stringVolume = (storageVolume * 100).toString()
            $volume.value = stringVolume
            $p.innerText = stringVolume
          } else {
            $p.innerText = '100'
          }
        })
      }
    })
    .catch((err) => console.error(err))

  $volume.addEventListener('change', (e) => {
    const currentVolume = e.target.value / 100

    browser.tabs
      .query({
        currentWindow: true,
        active: true,
      })
      .then((tabs) => {
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

  $volume.addEventListener('input', (event) => {
    $p.innerText = event.target.value
  })
}

controlVolume()
