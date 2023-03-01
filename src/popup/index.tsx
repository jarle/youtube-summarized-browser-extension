import { ChakraProvider } from '@chakra-ui/react'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { getCurrentTab } from '../common/tabHandler'
import { getToken } from '../common/tokenHandler'
import { SummaryRequestMessage } from '../messaging/summaryPort'
import { UserInfoRequestMessage, UserInfoResponseMessage } from '../messaging/userInfoPort'
import { ytSummarizedTheme } from '../theme'
import { Popup } from './components/Popup'
import { summaryPort, userInfoPort } from './messaging'
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
            getToken: getTokenService,
            getUserInfo: () => (callback, onReceive) => {
              const handler = (response: UserInfoResponseMessage) => {
                if (response.type === "user_info_response") {
                  callback({
                    type: "Success",
                    userInfo: response.userInfo
                  })
                }
              }

              userInfoPort.onMessage.addListener(handler);
              userInfoPort.postMessage({ type: "user_info_request" } as UserInfoRequestMessage)
              return () => userInfoPort.onMessage.removeListener(handler)
            }
          },
          guards: {
            hasToken: () => true
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
