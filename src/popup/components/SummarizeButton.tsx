import { Button } from "@chakra-ui/react"
import { FC } from "react"
import { SummaryState } from "../../types"
import { SummaryContext } from "../SummaryContext"

export const SummarizeButton: FC<{ videoURL: string }> = ({ videoURL }) => {
    const summaryState = (SummaryContext.useSelector(state => state.value) as SummaryState)
    const updateSummaryState = SummaryContext.useActorRef().send

    return (
        <Button
            colorScheme={'green'}
            onClick={
                async _ => {
                    updateSummaryState({
                        type: "Summarize",
                        videoURL: videoURL
                    })
                }
            }
        >
            Summarize video
        </Button>
    )
}