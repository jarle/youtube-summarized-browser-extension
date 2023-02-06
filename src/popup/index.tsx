import { ChakraProvider } from '@chakra-ui/react'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './Popup'
import { ytSummarizedTheme } from './theme'

ReactDOM.createRoot(document.getElementById('app') as HTMLElement).render(
  <React.StrictMode>
    <ChakraProvider theme={ytSummarizedTheme}>
      <App />
    </ChakraProvider>
  </React.StrictMode>,
)
