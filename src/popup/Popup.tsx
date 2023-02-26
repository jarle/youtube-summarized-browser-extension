import { ExternalLinkIcon, SettingsIcon, WarningIcon } from '@chakra-ui/icons'
import { Button, Center, Divider, Heading, HStack, Link, Spinner, Tag, Text, Tooltip, VStack } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { getCurrentTab, getToken } from '../background'
import { SummaryResponseMessage } from '../messaging/summaryPort'
import { UserInfoRequestMessage, UserInfoResponseMessage } from '../messaging/userInfoPort'
import { SummaryState } from '../types'
import { summaryPort, userInfoPort } from './messaging'
import { Summary } from './Summary'
import { SummaryContext } from './SummaryContext'

const getSummaryButtonTooltext = (summaryState: SummaryState): string => {
  switch (summaryState) {
    case "idle":
      return "Summarize this video using OpenAI tokens"
    case "loading":
      return "Generating summary..."
    case "failed":
      return "Summary failed"
    case "summarized":
      return "Summarized"
  }
}

export function Popup() {
  const [openAIToken, setOpenAIToken] = useState<string | undefined>()
  // current video if on youtube
  const [videoURL, setVideoURL] = useState<string | undefined>()
  const [accumulatedCost, setAccumulatedCost] = useState<number | undefined>()

  const updateSummaryState = SummaryContext.useActorRef().send

  const { summary, errorMessage, videoId } = SummaryContext.useSelector(state => state.context)
  const summaryState = (SummaryContext.useSelector(state => state.value) as SummaryState)

  const canSummarize = !!openAIToken && !!videoURL && ["idle", "failed"].includes(summaryState)

  const summaryPortHandler = (response: SummaryResponseMessage) => {
    switch (response.type) {
      case "summary_response":
        return updateSummaryState({
          type: "SummaryReceived",
          summary: response.summary!!,
          videoId: response.videoId
        })
      case "error":
        return updateSummaryState({
          type: "SummaryFailed",
          message: response.message
        })
    }
  }
  const userPortHandler = (response: UserInfoResponseMessage) => {
    switch (response.type) {
      case "user_info_response":
        const { accumulatedCost: cost } = response
        return setAccumulatedCost(cost)
      case "error":
        return updateSummaryState({
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
          const message: UserInfoRequestMessage = {
            type: "user_info_request",
          }
          userInfoPort.postMessage(message)
        }
      })

    getCurrentTab()
      .then(url => { setVideoURL(url) })

    summaryPort.onMessage.addListener(summaryPortHandler);
    userInfoPort.onMessage.addListener(userPortHandler);
    return () => {
      summaryPort.onMessage.removeListener(summaryPortHandler)
      userInfoPort.onMessage.removeListener(userPortHandler)
    }

  }, [])

  const buttonTooltipText = videoURL && getSummaryButtonTooltext(summaryState) || "Find a video on youtube.com to summarize videos"

  return (
    <main>
      <Center padding={5}>
        <VStack w={'50em'} spacing={'1.5em'}>
          <HStack>
            <Heading>YouTube Summarized</Heading>
          </HStack>
          {
            !openAIToken ? (
              <a onClick={() => chrome.runtime.openOptionsPage()}>
                <Button leftIcon={<SettingsIcon />} rightIcon={<ExternalLinkIcon />}>
                  Start using the extension by entering an OpenAI key in the settings
                </Button>
              </a>
            ) : <>
              {!summary && <Tooltip label={buttonTooltipText}>
                <Button
                  isDisabled={!canSummarize}
                  colorScheme={'green'}
                  onClick={
                    async _ => {
                      updateSummaryState({
                        type: "Summarize",
                        videoURL: videoURL!!
                      })
                    }
                  }
                >
                  Summarize video
                </Button>
              </Tooltip>
              }
              {
                accumulatedCost ? (
                  <Tooltip label="Your accumulated cost for generated summaries this month, excluding local tax. See openai.com for more details.">
                    <Link href="https://platform.openai.com/account/usage" target={"_blank"}>
                      <HStack>
                        <Tag>
                          <Text>{`$${accumulatedCost.toFixed(2)}`}</Text>
                        </Tag>
                        <ExternalLinkIcon />
                      </HStack>
                    </Link>
                  </Tooltip>
                ) : null
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
                    <Text>{errorMessage}</Text>
                  </HStack>
                )
              }
              {
                summary && <>
                  <Divider />
                  <Summary
                    summary={summary}
                    videoId={videoId!!}
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