import { ExternalLinkIcon, QuestionIcon } from '@chakra-ui/icons'
import { Container, Heading, HStack, Input, Tooltip, VStack } from '@chakra-ui/react'
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

  return (
    <main>
      <Container >
        <VStack padding={'2em'} spacing={5}>
          <Heading>YouTube Summarized</Heading>
          <VStack>

            <HStack>

              <Heading size={'sm'}>OpenAI API token</Heading>
              <Tooltip label="Enter your OpenAI API token below to use the extension">
                <QuestionIcon />
              </Tooltip>
            </HStack>
            <Input
              textAlign={'center'}
              w="35em"
              placeholder='Enter OpenAI token'
              defaultValue={openAIToken}
              onChange={
                c => {
                  const newToken = c.target.value
                  storeToken(newToken)
                  setOpenAIToken(newToken)
                }
              }
            />
          </VStack>
          <HStack>
            <a href="https://beta.openai.com/account/api-keys" target="_blank">
              Create a new OpenAPI token
            </a>
            <ExternalLinkIcon />
          </HStack>
        </VStack>
      </Container>
    </main>
  )
}

export default App
