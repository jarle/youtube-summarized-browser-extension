export type TabInfo = {
    url: string,
    tabId: number
}

export type SummaryState = "empty" | "loading" | "failed" | "summarized"

export type SummaryRequest = {
    type: "summary_request",
    videoURL: string
}

export type UserInfoRequest = {
    type: "user_info_request",
}

export type ServiceRequest = UserInfoRequest | SummaryRequest

export type ErrorResponse = {
    type: "error",
    message: string
}

export type UserInfo = {
    accumulatedCost: string
}

export type SummaryResponse = {
    type: "summary_response",
    videoId: string,
    preview: string,
    summary: string | undefined
}

export type UserInfoResponse = {
    type: "user_info_response",
    accumulatedCost: number
}

export type ServiceResponse = UserInfoResponse | ErrorResponse | SummaryResponse


export type Summary = {
    summary: string,
    videoId: string,
}
