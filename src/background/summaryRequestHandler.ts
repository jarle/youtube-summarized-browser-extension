import { getToken } from "../common/tokenHandler"
import { SummaryRequestMessage, SummaryResponseMessage } from "../messaging/summaryPort"
import { ErrorResponseMessage } from "../types"
import { getSummary } from "./fetchers"

export const summaryRequestHandler = async (message: SummaryRequestMessage, port: chrome.runtime.Port) => {
    if (message.type == "summary_request") {
        const { videoURL } = message
        try {
            const token = await getToken()
            const result = await getSummary(token!, videoURL)
            const summaryResponse: SummaryResponseMessage = {
                type: "summary_response",
                videoId: result.videoId,
                preview: result.summary,
                summary: result.summary
            }
            console.debug({ summaryResponse })
            port.postMessage(summaryResponse)
        } catch (error) {
            const errorResponse: ErrorResponseMessage = {
                type: "error",
                message: (error as any).message || "Unknown error"
            }
            console.debug({ errorResponse })
            port.postMessage(errorResponse)
        }
    }
}
