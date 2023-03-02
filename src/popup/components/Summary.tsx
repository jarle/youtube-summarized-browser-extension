import { ExternalLinkIcon } from "@chakra-ui/icons"
import { Box, Center, HStack, Text } from "@chakra-ui/react"
import ChakraUIRenderer from "chakra-ui-markdown-renderer"
import ReactMarkdown from "react-markdown"
import { SummaryContext } from "../../common/state"

export const Summary = () => {
    const [state] = SummaryContext.useActor()
    const { summary, videoId } = state.context
    if (!summary || !videoId) return null

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
