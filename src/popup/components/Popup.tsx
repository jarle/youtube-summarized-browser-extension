import { ExternalLinkIcon, SettingsIcon, WarningIcon } from '@chakra-ui/icons'
import { Button, Center, Divider, Heading, HStack, Link, Spinner, Tag, Text, Tooltip, VStack } from '@chakra-ui/react'
import { useMachine } from '@xstate/react'
import { useEffect } from 'react'
import { SummaryContext, UserInfoContext } from '../../common/state'
import { SummaryResponseMessage } from '../../messaging/summaryPort'
import { summaryPort } from '../messaging'
import { popupMachine } from './popupMachine'
import { Summary } from './Summary'

export function Popup() {
  const summaryActor = SummaryContext.useActorRef()
  const updateSummaryState = summaryActor.send
  const userState = UserInfoContext.useSelector(state => state)

  const { errorMessage } = SummaryContext.useSelector(state => state.context)
  const summaryState = (SummaryContext.useSelector(state => state))

  const [popupState, updatePopupState] = useMachine(popupMachine)
  const { videoURL } = popupState.context
  const { userInfo } = userState.context
  const accumulatedCost = userInfo?.accumulatedCost

  const getSummaryButtonTooltext = (): string | undefined => {
    if (popupState.matches("No video present")) {
      return "Find a video on YouTube.com to summarize first"
    }
    else if (summaryState.matches("idle")) {
      return "Summarize this video using OpenAI tokens"
    }
    else if (summaryState.matches("loading")) {
      return "Generating summary..."
    }
    else if (summaryState.matches("failed")) {
      return "Summary failed"
    }
    else if (summaryState.matches("summarized")) {
      return "Summarized"
    }
  }


  const summaryPortHandler = (response: SummaryResponseMessage) => {
    switch (response.type) {
      case "summary_response":
        updatePopupState("Success")
        return updateSummaryState({
          type: "SummaryReceived",
          summary: response.summary!!,
          videoId: response.videoId
        })
      case "error":
        updatePopupState("Error")
        return updateSummaryState({
          type: "SummaryFailed",
          message: response.message
        })
    }
  }

  useEffect(() => {
    summaryPort.onMessage.addListener(summaryPortHandler);
    return () => {
      summaryPort.onMessage.removeListener(summaryPortHandler)
    }

  }, [])

  const buttonTooltipText = getSummaryButtonTooltext()

  return (
    <main>
      <Center padding={5}>
        <VStack w={'50em'} spacing={'1.5em'}>
          <HStack>
            <Heading>YouTube Summarized</Heading>
          </HStack>
          {
            summaryState.matches("No token") ? (
              <a onClick={() => chrome.runtime.openOptionsPage()}>
                <Button leftIcon={<SettingsIcon />} rightIcon={<ExternalLinkIcon />}>
                  Start using the extension by entering an OpenAI key in the settings
                </Button>
              </a>
            ) : <>
              {popupState.matches("No video present") ? (
                <Text>Go to <Link href='https://youtube.com' target={"_blank"}>YouTube.com</Link> to summarize a video.</Text>)
                : null}
              {popupState.matches("Initialized") && !popupState.matches("Initialized.Complete") && <Tooltip label={buttonTooltipText}>
                <Button
                  isDisabled={
                    !popupState.can("Trigger summary")
                  }
                  colorScheme={'green'}
                  onClick={
                    async _ => {
                      updatePopupState('Trigger summary')
                      summaryActor.send({
                        type: "Summarize",
                        videoURL: videoURL!
                      })
                    }
                  }
                >
                  Summarize video
                </Button>
              </Tooltip>
              }
              {
                userState.matches("Done") ? (
                  <Tooltip label="Your accumulated cost for generated summaries this month, excluding local tax. See openai.com for more details.">
                    <Link href="https://platform.openai.com/account/usage" target={"_blank"}>
                      <HStack>
                        <Tag>
                          <Text>{`$${accumulatedCost?.toFixed(2) || "unknown"}`}</Text>
                        </Tag>
                        <ExternalLinkIcon />
                      </HStack>
                    </Link>
                  </Tooltip>
                ) : null
              }
              {
                summaryState.matches("loading") && (
                  <VStack>
                    <Text>Loading Summary</Text>
                    <Spinner />
                  </VStack>
                )
              }
              {
                summaryState.matches("failed") && (
                  <HStack>
                    <WarningIcon />
                    <Text>{errorMessage}</Text>
                  </HStack>
                )
              }
              {
                popupState.matches("Initialized.Complete") && <>
                  <Divider />
                  <Summary />
                </>
              }
            </>
          }
        </VStack>
      </Center>
    </main >
  )
}