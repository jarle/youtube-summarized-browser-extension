import { getToken } from "../common/tokenHandler"
import type { UserInfoRequestMessage, UserInfoResponseMessage } from "../messaging/userInfoPort"
import type { ErrorResponseMessage } from "../types"
import { getUserInfo } from "./fetchers"

export const userInfoRequestHandler = async (message: UserInfoRequestMessage, port: chrome.runtime.Port) => {
    if (message.type == "user_info_request") {
        try {
            const token = await getToken()
            const result = await getUserInfo(token!)
            const userInfoResponse: UserInfoResponseMessage = {
                type: "user_info_response",
                userInfo: {
                    accumulatedCost: Number.parseFloat(result.accumulatedCost)
                }
            }
            console.debug({ userInfoResponse })
            port.postMessage(userInfoResponse)
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
