import type { PlasmoCSConfig } from "plasmo";
import './components/css/index.css';

import type { PlasmoGetInlineAnchor, PlasmoMountShadowHost } from "plasmo";

export const config: PlasmoCSConfig = {
  matches: ["https://www.youtube.com/watch*"],
}

export const mountShadowHost: PlasmoMountShadowHost = ({
  shadowHost,
  anchor,
  observer
}) => {
  anchor.element.prepend(shadowHost)
}

export const getInlineAnchor: PlasmoGetInlineAnchor = async () =>
  document.querySelector("#top-level-buttons-computed")

export const getShadowHostId = () => "plasmo-inline-example-unique-id"


const onClick = () => {
  const secondaryInner = document.querySelector("#secondary-inner")
  const newSummaryContainer = document.createElement('div');
  // createRoot(newSummaryContainer).render(
  //   <SummaryContext.Provider>
  //     <SummaryComponent />
  //   </SummaryContext.Provider>
  // )
  if (!secondaryInner) {
    console.warn("Could not find secondary-inner")
  }

  dispatchEvent(
    new CustomEvent('ytSummarizedTriggerSummary')
  )
  secondaryInner!.prepend(newSummaryContainer)
}

const foo = () => {
  // return <SummarizeButton onClick={onClick} />
  return <span hidden></span>
}

export default foo