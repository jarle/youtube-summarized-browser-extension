import { assign, createMachine } from 'xstate';

type SummaryReceived = {
    type: "SummaryReceived",
    summary: string,
    videoId: string
}
type SummaryFailed = {
    type: "SummaryFailed",
    message: string
}

type SummaryContext = {
    summary: string | undefined,
    videoId: string | undefined,
    errorMessage: string | undefined
}

export const summaryMachine =
    /** @xstate-layout N4IgpgJg5mDOIC5QAoC2BDAxgCwJYDswBKAOgFFUAHAFwE8BiAZQFdUMAnXALzAG0AGALqJQlAPaxc1XGPwiQtRAA4lJACwBGAGw7derQHYANCAAeiAMwAmLSQ3WlGqwFYAvq5NoseQqQAyYugQBFBMrBy0AEpgmGC4AG6QAsJIIOKS0rLy5ggGAJy2VjbOWi4mighKtkpuHiBeOATEJAFBIWFs6Oy0AGLouAA2SULy6VIycqk5+YXFpc7liBp5BiQWtXX4YhBw8g0+xKMS41lTiAC0akqLCOf8JFpqeQV5znnLBmr8eVXunhiNXzkKh0I4ZCbZJY2EhWRxlBTKVSafQogx-eoAg7+QLBfBQMEnSagHKaDQkJQGex5J6U2H8YwIhBU9RWCwWb7OKyfZz8JTo-ZNUgsTqcLjoTL4AAEADN+kMIASJZCEPwbhZtGtav9vIKSMKONxIIqIWdchS7BSFoz7GpyRtXEA */
    createMachine({
        id: "summaryMachine",
        initial: "empty",
        context: {
            summary: undefined,
            videoId: undefined,
            errorMessage: undefined
        },
        schema: {
            events: {} as { type: "Summarize" }
                | SummaryReceived
                | SummaryFailed,
            context: {} as SummaryContext,
        },
        tsTypes: {} as import("./summaryMachine.typegen").Typegen0,
        states: {
            "empty": {
                on: {
                    "Summarize": {
                        target: "loading",
                        actions: "scheduleSummary"
                    }
                }
            },
            "loading": {
                on: {
                    "SummaryReceived": {
                        target: "summarized",
                        actions: "assignSummaryToContext"
                    },
                    "SummaryFailed": {
                        target: "failed",
                        actions: "assignErrorToContext"
                    }
                },
            },
            "failed": {
                on: {
                    "Summarize": {
                        target: "loading",
                        actions: "scheduleSummary"
                    }
                }
            },
            "summarized": {
                type: "final"
            },
        },
    }, {
        actions: {
            assignSummaryToContext: assign({
                summary: (_, event) => event.summary,
                videoId: (_, event) => event.videoId,
            }),
            assignErrorToContext: assign({
                errorMessage: (_, event) => event.message
            })
        }
    })