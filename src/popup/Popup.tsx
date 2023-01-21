import { ExternalLinkIcon, SettingsIcon } from '@chakra-ui/icons'
import { Box, Button, Center, Divider, Heading, HStack, Spinner, Text, Tooltip, VStack } from '@chakra-ui/react'
import ChakraUIRenderer from 'chakra-ui-markdown-renderer'
import { FC, useEffect, useState } from 'react'
import { ReactMarkdown } from 'react-markdown/lib/react-markdown'
import { QueryClient, QueryClientProvider, useQuery } from 'react-query'
import { getCurrentTab, getToken } from '../background'

const queryClient = new QueryClient()

type Summary = {
  summary: string
}

const API_GATEWAY_URL = "https://video-summarizer-gateway-6rjhapzj.uc.gateway.dev"

async function getSummary(token: string, videoURL: string): Promise<Summary> {
  return fetch(
    `${API_GATEWAY_URL}/v1/youtube/summarizeVideoWithToken?videoURL=${videoURL}`,
    {
      headers: {
        "openai-token": token
      }
    }
  )
    .then(
      res => res.json()
    )
    .catch(
      error => {
        console.error(error)
        Promise.reject(error.message)
      }
    )
}

const Summary: FC<{
  openAIToken: string,
  videoURL: string
}> = ({ openAIToken, videoURL }) => {
  const { isLoading, error, data } = useQuery(
    'repoData',
    async () => await getSummary(
      openAIToken,
      videoURL
    )
  )

  if (isLoading) {
    return (
      <VStack>
        <Spinner />
        <Text> {'Generating summary...'} </Text>
      </VStack>
    )
  }

  if (error) {
    console.error(error)
    return (
      <Text>An error has occurred</Text>
    )
  }

  const summary = data?.summary || ""

  return (
    <Box alignContent={'left'} padding={'3em'}>
      <ReactMarkdown components={ChakraUIRenderer()} children={summary} skipHtml />
    </Box>
  )
}

function App() {
  const [openAIToken, setOpenAIToken] = useState<string | null>()
  const [summaryURL, setSummaryURL] = useState<string | null>()
  const [videoURL, setVideoURL] = useState<string | null>()

  useEffect(() => {
    getToken()
      .then(token => {
        if (token) {
          setOpenAIToken(token)
        }
      })

    getCurrentTab()
      .then(url => { setVideoURL(url) })
  }, [])

  // if (!videoURL) {
  //   return (
  //     <main>
  //       <Center padding={5}>
  //         <VStack w={'50em'} spacing={'1.5em'}>
  //           <Heading>YouTube Summarizer</Heading>
  //         </VStack>
  //       </Center>
  //     </main>
  //   )
  // }

  return (
    <main>
      <Center padding={5}>
        <VStack w={'50em'} spacing={'1.5em'}>
          <Heading>YouTube Summarizer</Heading>
          {
            !openAIToken ? (
              <VStack>
                <a onClick={() => chrome.runtime.openOptionsPage()}>
                  <Button leftIcon={<SettingsIcon />}>
                    Enter your OpenAI token in the settings
                  </Button>
                </a>
                <HStack>
                  <a href="https://beta.openai.com/account/api-keys" target={"_blank"}>
                    Create a new OpenAPI token
                  </a>
                  <ExternalLinkIcon />
                </HStack>
              </VStack>
            ) : <>
              <Tooltip label={videoURL ? `Summarize ${videoURL}` : "Go to YouTube.com to summarize videos"}>
                <Button
                  isDisabled={!videoURL}
                  colorScheme={'green'}
                  onClick={
                    async e => {
                      await getCurrentTab()
                        .then(tab => setSummaryURL(tab))
                    }
                  }
                >
                  Summarize video
                </Button>
              </Tooltip>
              {
                summaryURL && <QueryClientProvider client={queryClient}>
                  <Divider />
                  <Summary
                    openAIToken={openAIToken}
                    videoURL={summaryURL}
                  />
                </QueryClientProvider>
              }
            </>
          }
        </VStack>
      </Center>
    </main >
  )
}

export default App
