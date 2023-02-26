import { getToken } from "."
import { UserInfoRequestMessage, UserInfoResponseMessage } from "../messaging/userInfoPort"
import { ErrorResponseMessage } from "../types"
import { getUserInfo } from "./fetchers"

export const userInfoRequestHandler = async (message: UserInfoRequestMessage, port: chrome.runtime.Port) => {
    if (message.type == "user_info_request") {
        try {
            const token = await getToken()
            const result = await getUserInfo(token!)
            const firstResponse: UserInfoResponseMessage = {
                type: "user_info_response",
                accumulatedCost: Number.parseFloat(result.accumulatedCost)
            }
            console.debug({ firstResponse })
            port.postMessage(firstResponse)
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
