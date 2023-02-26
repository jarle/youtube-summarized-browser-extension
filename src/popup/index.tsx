import { ChakraProvider } from '@chakra-ui/react'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { getCurrentTab } from '../common/tabHandler'
import { getToken } from '../common/tokenHandler'
import { SummaryRequestMessage } from '../messaging/summaryPort'
import { ytSummarizedTheme } from '../theme'
import { Popup } from './components/Popup'
import { summaryPort } from './messaging'
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
      actions: { scheduleSummary },
      services: {
        getToken: async () => {
          const openAIToken = await getToken()
          if (!openAIToken) {
            throw new Error("No OpenAI token found")
          }

          return {
            openAIToken
          }

        }
      }
    }}>
      <React.StrictMode>
        <ChakraProvider theme={ytSummarizedTheme}>
          <Popup />
        </ChakraProvider>
      </React.StrictMode>
    </SummaryContext.Provider >
  )
}

const rootElement = document.getElementById('app') as HTMLElement
const root = ReactDOM.createRoot(rootElement)
root.render(<App />)
