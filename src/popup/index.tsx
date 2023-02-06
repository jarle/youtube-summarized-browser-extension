import { ChakraProvider } from '@chakra-ui/react'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { ytSummarizedTheme } from '../theme'
import App from './Popup'

ReactDOM.createRoot(document.getElementById('app') as HTMLElement).render(
  <React.StrictMode>
    <ChakraProvider theme={ytSummarizedTheme}>
      <App />
    </ChakraProvider>
  </React.StrictMode>,
)
