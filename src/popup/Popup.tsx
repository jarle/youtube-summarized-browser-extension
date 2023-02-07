import { ExternalLinkIcon, SettingsIcon } from '@chakra-ui/icons'
import { Box, Button, Center, Divider, Heading, HStack, Text, Tooltip, VStack } from '@chakra-ui/react'
import ChakraUIRenderer from 'chakra-ui-markdown-renderer'
import { FC, useEffect, useState } from 'react'
import { ReactMarkdown } from 'react-markdown/lib/react-markdown'
import { QueryClient } from 'react-query'
import { getCurrentTab, getToken } from '../background'
import { SummaryRequest, SummaryResponse } from '../types'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      // 24 hours
      staleTime: 1000 * 60 * 60 * 24
    }
  }
})

const summaryPort = chrome.runtime.connect({ name: 'summaries' });

const Summary: FC<{
  summary: string,
  // videoId: string
}> = ({ summary }) => {
  return (
    <Box alignContent={'left'} padding={'3em'}>
      <Center>
        {/* <a href={`https://youtubesummarized.com/watch?v=${videoId}`} target="_blank"> */}
        <HStack>
          <Text>Open full summary</Text>
          <ExternalLinkIcon />
        </HStack>
        {/* </a> */}
      </Center>

      <ReactMarkdown components={ChakraUIRenderer()} children={summary} skipHtml />
    </Box>
  )
}

function App() {
  const [openAIToken, setOpenAIToken] = useState<string | undefined>()
  // current video if on youtube
  const [videoURL, setVideoURL] = useState<string | undefined>()
  // video summary in markdown
  const [summary, setSummary] = useState<string | undefined>()

  const canSummarize = !!openAIToken && !!videoURL

  const summaryHandler = (response: SummaryResponse) => {
    setSummary(response.summary)
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

    summaryPort.onMessage.addListener(summaryHandler);
    return () => {
      summaryPort.onMessage.removeListener(summaryHandler)
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
              {!summary && <Tooltip label={canSummarize ? `Summarize ${videoURL}` : !videoURL ? "Go to YouTube.com to summarize videos" : "Unable to summarize"}>
                <Button
                  isDisabled={!canSummarize}
                  colorScheme={'green'}
                  onClick={
                    async e => {
                      await getCurrentTab()
                        .then(
                          async tab => {
                            const message: SummaryRequest = {
                              type: "summary_request",
                              videoURL: videoURL!
                            }
                            console.log("Posting message")
                            summaryPort.postMessage(message)
                          }
                        )
                    }
                  }
                >
                  Summarize video
                </Button>
              </Tooltip>
              }
              {
                summary && <>
                  <Divider />
                  <Summary
                    summary={summary}
                  />
                </>
              }
            </>
          }
        </VStack>
      </Center>
    </main >
  )
}

export default App
