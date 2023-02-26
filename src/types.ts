import { SummaryRequestMessage, SummaryResponseMessage } from './messaging/summaryPort';
import { UserInfoRequestMessage, UserInfoResponseMessage } from './messaging/userInfoPort';

export type TabInfo = {
    url: string,
    tabId: number
}

export type SummaryState = "idle" | "loading" | "failed" | "summarized"

export type ServiceRequestMessage = UserInfoRequestMessage | SummaryRequestMessage

export type ErrorResponseMessage = {
    type: "error",
    message: string
}

export type APIUserInfo = {
    accumulatedCost: string
}

export type UserInfo = {
    accumulatedCost: number
}

export type ServiceResponse = UserInfoResponseMessage | ErrorResponseMessage | SummaryResponseMessage


export type Summary = {
    summary: string,
    videoId: string,
}
