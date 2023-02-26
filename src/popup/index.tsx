import { ChakraProvider } from '@chakra-ui/react'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { getCurrentTab } from '../background'
import { SummaryRequestMessage } from '../messaging/summaryPort'
import { ytSummarizedTheme } from '../theme'
import { summaryPort } from './messaging'
import { Popup } from './Popup'
import { SummaryContext } from './SummaryContext'

function App() {
  const scheduleSummary = async () => {
    await getCurrentTab()
      .then(
        async tab => {
          const message: SummaryRequestMessage = {
            type: "summary_request",
            videoURL: tab!
          }
          summaryPort.postMessage(message)
        }
      )
  }
  return (
    <SummaryContext.Provider options={{
      actions: { scheduleSummary }
    }}>
      <React.StrictMode>
        <ChakraProvider theme={ytSummarizedTheme}>
          <Popup />
        </ChakraProvider>
      </React.StrictMode>
    </SummaryContext.Provider>
  )
}

const rootElement = document.getElementById('app') as HTMLElement
const root = ReactDOM.createRoot(rootElement)
root.render(<App />)
