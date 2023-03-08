import { createRoot } from "react-dom/client";
import { interpret } from "xstate";
import { SummaryContext } from "../common/state";
import { contentMachine } from "./contentMachine";
import './css/index.css';
import { SummarizeButton } from "./summarizeButton";
import { SummaryPanel } from './summaryComponent';

// inspect({
//   // options
//   // url: 'https://stately.ai/viz?inspect', // (default)
//   iframe: false // open in new window
// });

const newSummarizeButton = document.createElement('div');
createRoot(newSummarizeButton).render(
  <SummarizeButton onClick={onClick} />
)
const newSummaryContainer = document.createElement('div');

function onClick() {
  actor.send({
    type: "Summary requested"
  })
  dispatchEvent(
    new CustomEvent('ytSummarizedTriggerSummary')
  )
}

const machine = contentMachine.withConfig({
  guards: {
    hasActions: () => {
      const actions = document.querySelector("#top-level-buttons-computed")
      const existing = document.querySelector("#summary-button")
      return !!actions && !existing
    }
  },
  actions: {
    attachButton: () => {
      console.log("Attach button")
      const actions = document.querySelector("#top-level-buttons-computed")
      actions!.prepend(newSummarizeButton);
    },
    detachButton: () => {
      newSummarizeButton.hidden = true
      newSummaryContainer.remove()
    },
    detachSummaryPanel: () => {
      newSummaryContainer.remove()
    },
    attachSummaryPanel: () => {
      const secondaryInner = document.querySelector("#secondary-inner")

      secondaryInner!.prepend(newSummaryContainer)
    },
  },
})

export const actor = interpret(machine).start()

createRoot(newSummaryContainer).render(
  <SummaryContext.Provider>
    <SummaryPanel onPanelClose={() => actor.send("Close panel")} />
  </SummaryContext.Provider>
)

document.addEventListener('yt-navigate-start', event => {
  console.log(`Leave ${window.location.href}`, actor.getSnapshot().value)
  actor.send({
    type: "Leave video",
  })
})

document.addEventListener('yt-navigate-finish', _ => {
  console.log("navigate finished for state", actor.getSnapshot().value)
  actor.send({
    type: "Video loaded"
  })
})
