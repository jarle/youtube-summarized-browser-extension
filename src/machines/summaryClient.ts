import { assign, createMachine } from 'xstate';
import { getCurrentTab } from '../common/tabHandler';
import { SummaryRequestMessage, SummaryResponseMessage } from '../messaging/summaryPort';
import { summaryPort } from '../popup/messaging';
import { getTokenService } from './userInfoClient';

type EventType = { type: "Summarize", videoURL: string }
    | { type: "SummaryReceived", summary: string, videoId: string }
    | { type: "SummaryFailed", message: string }

export const summaryClient =
    /** @xstate-layout N4IgpgJg5mDOIC5SwK4Fs0EMBOBPAspgMYAWAlgHZgB0ZEANmAMQDK6W2ZAXmANoAMAXUSgADgHtYZAC5lxFESAAeiAEwAWABzUAzKoBsmgKzr1Adj06jRnQBoQuRDp3rqATk0BGTQb3rr+qYAvkH2qBg4BMTkVNT04pgQlFCs7JEASmBEYGQAbpACwkggElKy8ooqCEZu+u6aOobqnmZmbjX69o4I3vzuNp6e6vxmnm46-AYhYWl4hKSUNPGJyakReABimGSMEIWKpTJyCsVVenVu6oEGDc6tql1qOtRjw5ptRpqa-M6f0yDhDhRBaxABm212aw43D4QgOkiOFVOiE8NmoZms-jcZlUHgm6geDhR336OlRxk8Gkp-0BkXmMRoAFUKJQjph6DCIEwIPIaJRcuIANY0GDSAAqQrAFH2xUO5ROoCqzWoqgsRn4Rn0WrJ-E6RIQpj6upM+jMWg0Jv0NNmwIZ1GZrNk7M5TDA2Gw4mw1FE9Ew0lBnrQ1FFEuF0rhsoR8sqiAAtKovi9Bpotd8dJdKY8EKoDCr9C0NZo3Pw3NiMSFQiAKOIIHBFLS5tFFvCyscYwhY+ZPNQjBjDGYNZrzBYs7Gi9QfPpi5NNW1i1bKw3bYtaAwwC3EQrlCjJhP+Px3lY1ZT1G4s0f+g1SxiDAZPNb1svYsskhQoBvo8iDf4XiWdBis1UH53FxfsjAfIF6RXcEdkgD82y-eMzGoQwDAxRp9AmLw9W6eNdAMYtvATEZ1Agukm1iBtOXgpFFUQIttBxNoi3GFM50A3dTVqfRNVAmxGjIxsQSZFkWSdDkeAgGityqWMyWQ-hT3-fctVGVRPCzdQdG0RSgP8Sd9CAhcZkfKDYgAOXEAACaRJS3OUELojsCWeXtNXeQdAlaOx9U8fcex+IZcX4TxnGcCsgiAA */
    createMachine({
        id: "summaryMachine",
        initial: "Uninitialized",
        predictableActionArguments: true,
        context: {
            summary: undefined,
            videoId: undefined,
            errorMessage: undefined,
            openAIToken: undefined
        },
        schema: {
            events: {} as EventType,
            services: {} as {
                getToken: {
                    data: {
                        openAIToken: string
                    },
                },
                getSummary: {
                    data: {
                        summary: string,
                        videoId: string
                    }
                }
            },
            context: {} as {
                summary: string | undefined,
                videoId: string | undefined,
                errorMessage: string | undefined,
                openAIToken: string | undefined
            },
        },
        tsTypes: {} as import("./summaryClient.typegen").Typegen0,
        states: {
            idle: {
                on: {
                    "Summarize": {
                        target: "loading",
                        cond: {
                            predicate: (_, event) => Boolean(event.videoURL),
                            type: 'xstate.guard',
                            name: "hasVideoURL",
                        },
                    }
                },
            },

            "loading": {
                invoke: {
                    src: "getSummary",
                },
                on: {
                    "SummaryReceived": {
                        target: "summarized",
                        actions: "assignSummaryToContext"
                    },
                    "SummaryFailed": {
                        target: "failed",
                    }
                },
            },

            "failed": {
                entry: "assignErrorToContext",
                on: {
                    "Summarize": {
                        target: "loading",
                        actions: "scheduleSummary"
                    }
                },
                exit: () => {
                    assign({
                        errorMessage: undefined
                    })
                }
            },

            "summarized": {
                type: "final"
            },

            Uninitialized: {
                invoke: {
                    src: "getToken",
                    id: "getToken",
                    onDone: {
                        target: "idle",
                        actions: "assignTokenToContext"
                    },
                    onError: {
                        target: "No token",
                    }
                }
            },

            "No token": {
                type: "final"
            }
        },
    }, {
        actions: {
            assignSummaryToContext: assign({
                summary: (_, event) => event.summary,
                videoId: (_, event) => event.videoId,
            }),
            assignErrorToContext: assign({
                errorMessage: (_, event) => event.message
            }),
            assignTokenToContext: assign({
                openAIToken: (_, event) => event.data.openAIToken
            }),
            scheduleSummary: async () => {
                await getCurrentTab()
                    .then(
                        async tab => {
                            const message: SummaryRequestMessage = {
                                type: "summary_request",
                                videoURL: tab!
                            }
                            summaryPort.postMessage(message)
                        }
                    )

            }
        },
        services: {
            getToken: getTokenService,
            getSummary: (context, event) => (callback, onReceive) => {
                const summaryPortHandler = (response: SummaryResponseMessage) => {
                    switch (response.type) {
                        case "summary_response":
                            return callback({
                                type: "SummaryReceived",
                                summary: response.summary!!,
                                videoId: response.videoId
                            })
                        case "error":
                            return callback({
                                type: "SummaryFailed",
                                message: response.message
                            })
                    }
                }
                summaryPort.onMessage.addListener(summaryPortHandler)
                const message: SummaryRequestMessage = {
                    type: "summary_request",
                    videoURL: event.videoURL
                }
                summaryPort.postMessage(message)
                return () => summaryPort.onMessage.removeListener(summaryPortHandler)
            }
        },
    })