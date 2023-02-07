import { ExternalLinkIcon, SettingsIcon, WarningIcon } from '@chakra-ui/icons'
import { Box, Button, Center, Divider, Heading, HStack, Spinner, Text, Tooltip, VStack } from '@chakra-ui/react'
import { useMachine } from '@xstate/react'
import ChakraUIRenderer from 'chakra-ui-markdown-renderer'
import { FC, useEffect, useState } from 'react'
import { ReactMarkdown } from 'react-markdown/lib/react-markdown'
import { getCurrentTab, getToken } from '../background'
import { summaryMachine } from '../machines/summaryMachine'
import { ServiceResponse, SummaryRequest, SummaryState } from '../types'

const summaryPort = chrome.runtime.connect({ name: 'summaries' });

const Summary: FC<{
  summary: string,
  videoId: string
}> = ({ videoId, summary }) => {
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
  // current video if on youtube
  const [videoURL, setVideoURL] = useState<string | undefined>()

  const [state, send] = useMachine(summaryMachine, {
    actions: {
      scheduleSummary: async () => {
        await getCurrentTab()
          .then(
            async tab => {
              const message: SummaryRequest = {
                type: "summary_request",
                videoURL: tab!
              }
              summaryPort.postMessage(message)
            }
          )
      }
    }
  })

  const { summary } = state.context
  const summaryState = (state.value as SummaryState)

  const canSummarize = !!openAIToken && !!videoURL

  const summaryHandler = (response: ServiceResponse) => {
    switch (response.type) {
      case "summary_response":
        return send({
          type: "SummaryReceived",
          summary: response.summary!!,
          videoId: response.videoId
        })
      case "error":
        return send({
          type: "SummaryFailed",
          message: response.message
        })
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
              {!state.context.summary && <Tooltip label={canSummarize ? `Summarize ${videoURL}` : !videoURL ? "Go to YouTube.com to summarize videos" : "Unable to summarize"}>
                <Button
                  isDisabled={!canSummarize}
                  colorScheme={'green'}
                  onClick={
                    async e => {
                      send("Summarize")
                    }
                  }
                >
                  Summarize video
                </Button>
              </Tooltip>
              }
              {
                summaryState === "loading" && (
                  <VStack>
                    <Text>Loading Summary</Text>
                    <Spinner />
                  </VStack>
                )
              }
              {
                summaryState === "failed" && (
                  <HStack>
                    <WarningIcon />
                    <Text>{state.context.errorMessage}</Text>
                  </HStack>
                )
              }
              {
                summary && <>
                  <Divider />
                  <Summary
                    summary={summary}
                    videoId={state.context.videoId!!}
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
