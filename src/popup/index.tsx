import { ChakraProvider } from '@chakra-ui/react'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { getCurrentTab } from '../common/tabHandler'
import { getToken } from '../common/tokenHandler'
import { SummaryRequestMessage } from '../messaging/summaryPort'
import { ytSummarizedTheme } from '../theme'
import { Popup } from './components/Popup'
import { summaryPort } from './messaging'
import { SummaryContext, UserInfoContext } from './state'

const getTokenService = async () => {
  const openAIToken = await getToken()
  if (!openAIToken) {
    throw new Error("No OpenAI token found")
  }
  return {
    openAIToken
  }
}

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
    <React.StrictMode>
      <SummaryContext.Provider options={{
        actions: { scheduleSummary },
        services: {
          getToken: getTokenService
        }
      }}>
        <UserInfoContext.Provider options={{
          services: {
            getToken: getTokenService
          },
          guards: {
            hasToken: (ctx, evt) => !!ctx.openAIToken
          }
        }}>
          <ChakraProvider theme={ytSummarizedTheme}>
            <Popup />
          </ChakraProvider>
        </UserInfoContext.Provider>
      </SummaryContext.Provider >
    </React.StrictMode>
  )
}

const rootElement = document.getElementById('app') as HTMLElement
const root = ReactDOM.createRoot(rootElement)
root.render(<App />)
