const REWARD_PNG = `${import.meta.env.BASE_URL}assets/balloon-reward-quynh-anh.png`

function applyRewardPng(root = document) {
  const images = root.querySelectorAll?.('img.balloon-reward-image') || []
  images.forEach((img) => {
    if (!img.src.endsWith('/assets/balloon-reward-quynh-anh.png')) {
      img.src = REWARD_PNG
    }
  })
}

if (typeof document !== 'undefined') {
  applyRewardPng()
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType === 1) {
          if (node.matches?.('img.balloon-reward-image')) node.src = REWARD_PNG
          applyRewardPng(node)
        }
      }
    }
  })
  observer.observe(document.documentElement, { childList: true, subtree: true })
}
