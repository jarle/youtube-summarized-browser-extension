import { ChakraProvider } from '@chakra-ui/react'
import React from 'react'
import { ytSummarizedTheme } from '../theme'
import Options from './Options'

export default function App() {
  return (
    <React.StrictMode>
      <ChakraProvider theme={ytSummarizedTheme}>
        <Options />
      </ChakraProvider>
    </React.StrictMode>
  )
}
