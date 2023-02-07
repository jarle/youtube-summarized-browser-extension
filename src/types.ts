export type ServiceRequest = {
    type: string
}

export type TabInfo = {
    url: string,
    tabId: number
}


export type SummaryRequest = ServiceRequest & {
    type: "summary_request",
    videoURL: string
}

export type SummaryAck = ServiceRequest & {
    type: "summary_ack",
    videoURL: string
}

export type ErrorResponse = ServiceRequest & {
    type: "error",
    message: string
}

export type SummaryResponse = {
    videoId: string,
    preview: string,
    summary: string | undefined
}

export type Summary = {
    summary: string,
    videoId: string,
}
