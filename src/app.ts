import { FPGridItem } from "./components/fp-grid-item"
import { FPPlayer } from "./components/fp-player"
import { FPAppHeader } from "./components/fp-app-header"
import { FPVideoGrid } from "./components/fp-video-grid"

import { events as TizenEvents } from "@flowplayer/player/plugins/tizen"

window.customElements.define("fp-grid-item", FPGridItem)
window.customElements.define("fp-player", FPPlayer)
window.customElements.define("fp-app-header", FPAppHeader);
window.customElements.define("fp-video-grid", FPVideoGrid)


const grids = Array.from(document.querySelectorAll("fp-video-grid"))
const player = document.querySelector("fp-player") as FPPlayer

grids.forEach(grid => grid.addEventListener("media:selected", (ev) => {
  const item = ev.target as FPGridItem
  player.playVideo(item.mediaId)

  player.classList.remove("hide")
}))


let activeGridItem: Element | null = null
let activeGrid: Element | null = null

player.api.on(TizenEvents.EXIT_FULLSCREEN, () => {
  player.stopVideo()
  player.classList.add("hide")
})

document.addEventListener("keydown", ev => {
  if (!player.classList.contains("hide")) return // player handles keypresses
  const keycode = ev.which || ev.keyCode

  if ([13,37,38,39,40,10009].indexOf(keycode) === -1) return // Not arrow keys, back or enter
  ev.preventDefault()
  activeGridItem && activeGridItem.classList.remove("active")
  let idx: number
  switch (keycode) {
    case 13:
      if (!activeGridItem) return
      activeGridItem.dispatchEvent(new CustomEvent("click"))
      break
    case 10009:
      (window as any).tizen.application.getCurrentApplication().exit()
      break
    case 40:
    case 38:
      idx = activeGrid ? grids.indexOf(activeGrid) : -1
      idx = keycode === 40 ? idx + 1 : idx - 1
      idx = Math.min(grids.length - 1, Math.max(0, idx))
      activeGrid = grids[idx]
      activeGridItem = activeGrid.querySelector("fp-grid-item") as Element
      activeGridItem.classList.add("active")
      break
    case 37:
    case 39:
      if (!activeGrid) return
      const items = Array.from(activeGrid.querySelectorAll("fp-grid-item"))
      idx = activeGridItem ? items.indexOf(activeGridItem) : -1
      idx = keycode === 39 ? idx + 1 : idx - 1
      idx = Math.min(items.length - 1, Math.max(0, idx))
      activeGridItem = items[idx]
      activeGridItem.classList.add("active")
      break
  }
})