import { ExternalLinkIcon } from "@chakra-ui/icons"
import { Box, Center, HStack, Text } from "@chakra-ui/react"
import ChakraUIRenderer from "chakra-ui-markdown-renderer"
import { FC } from "react"
import ReactMarkdown from "react-markdown"

export const Summary: FC<{
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
