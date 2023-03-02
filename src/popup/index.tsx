import { ChakraProvider } from '@chakra-ui/react'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { SummaryContext, UserInfoContext } from '../common/state'
import { ytSummarizedTheme } from '../theme'
import { Popup } from './components/Popup'


function App() {
  return (
    <React.StrictMode>
      <SummaryContext.Provider>
        <UserInfoContext.Provider>
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
