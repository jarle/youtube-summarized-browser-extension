import { ErrorResponseMessage } from './../types';

export const SummaryPort = {
    name: "summaries",
}


export type SummaryRequestMessage = {
    type: "summary_request",
    videoURL: string
}

export type SummaryResponseMessage = ErrorResponseMessage | {
    type: "summary_response",
    videoId: string,
    preview: string,
    summary: string | undefined
}

