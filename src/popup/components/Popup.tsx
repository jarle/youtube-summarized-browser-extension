import { ExternalLinkIcon, SettingsIcon, WarningIcon } from '@chakra-ui/icons'
import { Button, Center, Divider, Heading, HStack, Link, Spinner, Tag, Text, Tooltip, VStack } from '@chakra-ui/react'
import { useMachine } from '@xstate/react'
import { useEffect } from 'react'
import { SummaryResponseMessage } from '../../messaging/summaryPort'
import { UserInfoRequestMessage, UserInfoResponseMessage } from '../../messaging/userInfoPort'
import { summaryPort, userInfoPort } from '../messaging'
import { SummaryContext } from '../SummaryContext'
import { popupMachine } from './popupMachine'
import { Summary } from './Summary'

export function Popup() {
  const summaryActor = SummaryContext.useActorRef()
  const updateSummaryState = summaryActor.send

  const { summary, errorMessage, videoId } = SummaryContext.useSelector(state => state.context)
  const summaryState = (SummaryContext.useSelector(state => state))

  const [popupState, updatePopupState] = useMachine(popupMachine, {
    actions: {
      "fetchUserInfo": () => {
        userInfoPort.postMessage({ type: "user_info_request" } as UserInfoRequestMessage)
      }
    }
  })
  const { videoURL, userInfo } = popupState.context
  const { accumulatedCost } = userInfo || { accumulatedCost: 0 }

  const getSummaryButtonTooltext = (): string | undefined => {
    if (summaryState.matches("idle")) {
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
  const userPortHandler = (response: UserInfoResponseMessage) => {
    switch (response.type) {
      case "user_info_response":
        return updatePopupState({
          type: "Userinfo received",
          userInfo: response.userInfo
        })
      case "error":
        return updateSummaryState({
          type: "SummaryFailed",
          message: response.message
        })
    }
  }

  useEffect(() => {
    summaryPort.onMessage.addListener(summaryPortHandler);
    userInfoPort.onMessage.addListener(userPortHandler);
    return () => {
      summaryPort.onMessage.removeListener(summaryPortHandler)
      userInfoPort.onMessage.removeListener(userPortHandler)
    }

  }, [])

  const buttonTooltipText = getSummaryButtonTooltext()
  const state = popupState.value

  return (
    <main>
      <Center padding={5}>
        <VStack w={'50em'} spacing={'1.5em'}>
          <pre>{JSON.stringify(state)}</pre>
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
              {!summary && <Tooltip label={buttonTooltipText}>
                <Button
                  disabled={
                    !videoURL || !summaryActor.getSnapshot()?.can({ type: "Summarize", videoURL: videoURL })
                  }
                  colorScheme={'green'}
                  onClick={
                    async _ => {
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