import { ExternalLinkIcon, SettingsIcon } from '@chakra-ui/icons'
import { Box, Button, Center, Divider, Heading, HStack, Spinner, Text, Tooltip, VStack } from '@chakra-ui/react'
import ChakraUIRenderer from 'chakra-ui-markdown-renderer'
import { FC, useEffect, useState } from 'react'
import { ReactMarkdown } from 'react-markdown/lib/react-markdown'
import { QueryClient, QueryClientProvider, useQuery } from 'react-query'
import { getCurrentTab, getToken } from '../background'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      // 24 hours
      staleTime: 1000 * 60 * 60 * 24
    }
  }
})

type Summary = {
  summary: string,
  videoId: string,
}

const port = chrome.runtime.connect({ name: 'popup' });

const API_GATEWAY_URL = "https://api.youtubesummarized.com"

async function getSummary(token: string, videoURL: string): Promise<Summary> {
  return fetch(
    `${API_GATEWAY_URL}/v1/youtube/summarizeVideoWithToken?videoURL=${videoURL}`,
    {
      headers: {
        "openai-token": token,
        "yt-summarized-request-source": "BROWSER_EXTENSION",
        "Access-Control-Allow-Origin": API_GATEWAY_URL
      }
    }
  )
    .then(
      async res => {
        const response = await res.json()
        if (res.status == 200) {
          return response
        }
        throw Error(`${response.message}`)
      }
    )
    .catch(
      error => {
        console.error(error)
        throw (error)
      }
    )
}

const Summary: FC<{
  openAIToken: string,
  videoURL: string
}> = ({ openAIToken, videoURL }) => {
  const { isLoading, error, data } = useQuery({
    queryKey: `get ${videoURL}`,
    queryFn: async () => await getSummary(
      openAIToken,
      videoURL
    ),
  })

  if (isLoading) {
    return (
      <VStack>
        <Spinner />
        <Text> {'Generating summary...'} </Text>
      </VStack>
    )
  }

  if (error) {
    const err = error as Error
    console.error(error)
    return (
      <VStack>

        <Text>An error has occurred</Text>
        <Text>
          {`Error message: ${err.message}`}
        </Text>
      </VStack>
    )
  }

  const summary = data?.summary || ""
  const videoId = data?.videoId || ""

  return (
    <Box alignContent={'left'} padding={'3em'}>
      <Center>
        <a href={`https://youtubesummarized.com/watch?v=${videoId}`} target="_blank">
          <HStack>
            <Text>Open full summary</Text>
            <ExternalLinkIcon />
          </HStack>
        </a>
      </Center>

      <ReactMarkdown components={ChakraUIRenderer()} children={summary} skipHtml />
    </Box>
  )
}

function App() {
  const [openAIToken, setOpenAIToken] = useState<string | undefined>()
  // the video url that should be summarized
  const [summaryURL, setSummaryURL] = useState<string | undefined>()
  // current video if on youtube
  const [videoURL, setVideoURL] = useState<string | undefined>()

  const canSummarize = !!openAIToken && !!videoURL && !summaryURL

  const handler = (response: any) => {
    if (response.type === 'workComplete') {
      alert("Hello")
    }
  }

  useEffect(() => {
    getToken()
      .then(token => {
        if (token) {
          setOpenAIToken(token)
        }
      })

    getCurrentTab()
      .then(url => { setVideoURL(url) })

    port.onMessage.addListener(handler);

    return () => {
      port.onMessage.removeListener(handler)
    }

  }, [])

  return (
    <main>
      <Center padding={5}>
        <VStack w={'50em'} spacing={'1.5em'}>
          <Heading>YouTube Summarized</Heading>
          {
            !openAIToken ? (
              <VStack>
                <a onClick={() => chrome.runtime.openOptionsPage()}>
                  <Button leftIcon={<SettingsIcon />} rightIcon={<ExternalLinkIcon />}>
                    Start using the extension by entering an OpenAI key in the settings
                  </Button>
                </a>
              </VStack>
            ) : <>
              <Tooltip label={canSummarize ? `Summarize ${videoURL}` : !videoURL ? "Go to YouTube.com to summarize videos" : "Unable to summarize"}>
                <Button
                  isDisabled={!canSummarize}
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
              <Button onClick={() => {
                port.postMessage({ type: "startWork" })
              }}>Press me!</Button>
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
