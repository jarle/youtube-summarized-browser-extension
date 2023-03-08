import { CheckIcon, ExternalLinkIcon, QuestionIcon } from '@chakra-ui/icons'
import { Button, Center, Container, FormControl, FormErrorMessage, FormHelperText, FormLabel, Heading, HStack, Image, Input, InputGroup, InputRightElement, Link, Text, Tooltip, VStack } from '@chakra-ui/react'
import logo from "data-base64:~assets/icon.png"
import { useEffect, useState } from 'react'
import { getToken, storeToken } from '../common/tokenHandler'

function Options() {
  const [openAIToken, setOpenAIToken] = useState<string>()
  useEffect(() => {
    getToken()
      .then(token => {
        if (token) {
          setOpenAIToken(token)
        }
      })
  }, [])

  const invalidAPIKey = !!openAIToken && Boolean(!openAIToken?.startsWith("sk-") || openAIToken?.length !== 51)

  return (
    <main>
      <Container>
        <VStack padding={'5em'} spacing={10}>
          <Center>
            <Link href="https://youtubesummarized.com" target={"_blank"}>
              <HStack spacing={4}>
                <Image src={logo} w={'48px'} />
                <Heading w={'12em'}>YouTube Summarized</Heading>
              </HStack>
            </Link>
          </Center>
          <VStack>

            <FormControl isInvalid={invalidAPIKey}>
              <FormLabel>
                <HStack>
                  <Heading size={'sm'}>OpenAI key</Heading>
                  <Tooltip label="An OpenAI key is a secret key generated for your account on openai.com, and is required to use this extension.">
                    <QuestionIcon />
                  </Tooltip>
                </HStack>
              </FormLabel>
              <InputGroup>
                <Input
                  textAlign={'center'}
                  w="35em"
                  placeholder='Enter OpenAI secret key'
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
                  openAIToken && !invalidAPIKey && <InputRightElement children={<CheckIcon color='green.500' />} />
                }
              </InputGroup>
              {
                invalidAPIKey && (
                  <FormErrorMessage>
                    <Text>
                      Invalid OpenAI API key format. Did you enter the correct API key?
                    </Text>
                  </FormErrorMessage>
                )
              }
              <FormHelperText>
                <Text>
                  By providing your OpenAI API key and using this extension you agree to <Link fontWeight={'bold'} target="_blank" href="https://youtubesummarized.com/terms">our terms of services.</Link>
                </Text>
              </FormHelperText>
            </FormControl>
          </VStack>
          <Button colorScheme={openAIToken && !invalidAPIKey ? 'gray' : 'green'} rightIcon={<ExternalLinkIcon />}>
            <a href="https://beta.openai.com/account/api-keys" target="_blank">
              Create new OpenAI key
            </a>
          </Button>

          <Text>
            Need help? Check out the step by step guide <Link href="https://youtubesummarized.com/doc/chrome-extension-guide" fontWeight={'bold'} target="_blank">here.</Link>
          </Text>
        </VStack>
      </Container>
    </main>
  )
}

export default Options
