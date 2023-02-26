import { ErrorResponseMessage, UserInfo } from "../types"

export const UserInfoPort = {
    name: "userInfo"
}

export type UserInfoRequestMessage = {
    type: "user_info_request",
}

export type UserInfoResponseMessage = ErrorResponseMessage | {
    type: "user_info_response",
    userInfo: UserInfo
}