import { ExternalLinkIcon, QuestionIcon } from '@chakra-ui/icons'
import { Container, FormControl, FormErrorMessage, FormHelperText, FormLabel, Heading, HStack, Input, Text, Tooltip, VStack } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { getToken, storeToken } from '../background'

function App() {
  const [openAIToken, setOpenAIToken] = useState<string>()
  useEffect(() => {
    getToken()
      .then(token => {
        if (token) {
          setOpenAIToken(token)
        }
      })
  }, [])

  const invalidApiKey = Boolean(!openAIToken?.startsWith("sk-") || openAIToken?.length !== 51)

  return (
    <main>
      <Container >
        <VStack padding={'2em'} spacing={5}>
          <Heading>YouTube Summarized</Heading>
          <VStack>

            <FormControl>
              <FormLabel>
                <HStack>
                  <Heading size={'sm'}>OpenAI API key</Heading>
                  <Tooltip label="Enter your OpenAI API key below to use the extension.">
                    <QuestionIcon />
                  </Tooltip>
                </HStack>
              </FormLabel>
              <Input
                textAlign={'center'}
                w="35em"
                placeholder='Enter OpenAI API key'
                defaultValue={openAIToken}
                onChange={
                  c => {
                    const newToken = c.target.value
                    storeToken(newToken)
                    setOpenAIToken(newToken)
                  }
                }
              />
              {
                invalidApiKey && (
                  <FormErrorMessage>
                    Invalid OpenAI API key format. Did you enter the correct API key?
                  </FormErrorMessage>
                )
              }
              <FormHelperText>
                <Text>
                  The API Key will be used when you generate summaries, which will expend OpenAI tokens.
                </Text>
              </FormHelperText>
            </FormControl>
          </VStack>
          <HStack>
            <a href="https://beta.openai.com/account/api-keys" target="_blank">
              Manage OpenAI API keys
            </a>
            <ExternalLinkIcon />
          </HStack>
        </VStack>
      </Container>
    </main>
  )
}

export default App
