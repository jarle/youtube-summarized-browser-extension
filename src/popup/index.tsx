import { ChakraProvider } from '@chakra-ui/react'
import React from 'react'
import { SummaryContext, UserInfoContext } from '../common/state'
import { ytSummarizedTheme } from '../theme'
import { Popup } from './components/Popup'


export default function App() {
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