export type TabInfo = {
    url: string,
    tabId: number
}

export type SummaryState = "empty" | "loading" | "failed" | "summarized"

export type SummaryRequest = {
    type: "summary_request",
    videoURL: string
}

export type ServiceRequest = SummaryRequest

export type ErrorResponse = {
    type: "error",
    message: string
}


export type SummaryResponse = {
    type: "summary_response",
    videoId: string,
    preview: string,
    summary: string | undefined
}

export type ServiceResponse = ErrorResponse | SummaryResponse


export type Summary = {
    summary: string,
    videoId: string,
}
