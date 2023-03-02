import { createRoot } from "react-dom/client";
import { SummaryContext } from "../common/state";
import './css/index.css';
import { SummarizeButton } from "./summarizeButton";
import { SummaryComponent } from './summaryComponent';

async function waitForElm(selector: string): Promise<Element | null> {
  return new Promise(resolve => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }

    const observer = new MutationObserver(mutations => {
      if (document.querySelector(selector)) {
        resolve(document.querySelector(selector));
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  });
}

async function initialize() {
  console.debug("Initialize YT Summarized view")
  document.querySelector(".ytSummarized")?.remove()

  const [actions, secondaryInner] = await Promise.all([
    waitForElm("#top-level-buttons-computed"),
    waitForElm("#secondary-inner"),
  ])

  const newSummaryContainer = document.createElement('div');
  createRoot(newSummaryContainer).render(
    <SummaryContext.Provider>
      <SummaryComponent />
    </SummaryContext.Provider>
  )
  const onClick = () => {
    if (!secondaryInner) {
      console.warn("Could not find secondary-inner")
    }

    dispatchEvent(
      new CustomEvent('ytSummarizedTriggerSummary')
    )
    secondaryInner!.prepend(newSummaryContainer)
  }

  const newSummarizeButton = document.createElement('div');
  createRoot(newSummarizeButton).render(
    <SummarizeButton onClick={onClick} />
  )

  if (!actions) {
    console.warn("Could not find actions")
  }

  actions!.prepend(newSummarizeButton);

  const cleanUp = () => {
    newSummaryContainer.remove()
    newSummarizeButton.remove()
    document.removeEventListener('yt-navigate-start', cleanUp)
  }

  document.addEventListener('yt-navigate-finish', cleanUp)
}


document.addEventListener('yt-navigate-finish', _ => {
  setTimeout(() => {
    initialize()
  }, 300)
})
