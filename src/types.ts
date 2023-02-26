
export type TabInfo = {
    url: string,
    tabId: number
}

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

export type APISummary = {
    summary: string,
    videoId: string,
}
