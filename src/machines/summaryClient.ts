import { assign, createMachine } from 'xstate';
import { SummaryRequestMessage, SummaryResponseMessage } from '../messaging/summaryPort';
import { summaryPort } from '../popup/messaging';
import { getTokenService } from './userInfoClient';

type EventType = { type: "Summarize", videoURL: string }
    | { type: "SummaryReceived", summary: string, videoId: string }
    | { type: "SummaryFailed", message: string }

export const summaryClient =
    /** @xstate-layout N4IgpgJg5mDOIC5SwK4Fs0EMBOBPAspgMYAWAlgHZgB0ZEANmAMQDK6W2ZAXmANoAMAXUSgADgHtYZAC5lxFESAAeiAEwAWABzUAzKoBsmgKzr1Adj06jRnQBoQuRDp3rqATk0BGTQb3rr+qYAvkH2qBg4BMTkVNT04pgQlFCs7JEASmBEYGQAbpACwkggElKy8ooqCGaebtSeZkb8GqpGnvya+mb2jgiq-J7UZsaeOpo6nqoWtSFhaXiEpJQ08YnJqRF4AGKYZIwQhYqlMnIKxVV6+u7qgQbjzmZmqj1qOvVu6h1mbkaamvzOX6zEDhDhRJaxABmu32Gw43D4QiOkhOFXOiE8NiG1n8bieHh0-HUzwcGP+7hsmJGGkmwNBkUWMRoAFUKJQTph6AiIEwIPIaJRcuIANY0GDSAAqIrAFEOxWO5TOoCq6kGUys-CM+m1E34+heCFM-GoepMXS0GjN+jp83BTOorPZsk53KYYGw2HE2GoonomGkkK9aGo4qlotlSPlKMVlUQAFpVH96p5vNr-joPpMDaoDNQDA1NZo3Pw3HjGiFQiAKOIIHBFPSFtFlsiyqdYwg4+ZBkZGoYzJqteYLAa40XqD59MWdPoJrq8TbNnblrQGGAW6ilcoMc1x-wvlYLG0NG4DQeKeNS40DPmF2DGcvVkkKFB1zH0Yb-PUSzpGtmAe5VDcPsjFvBkmyhGFIFfNt3wTMxqEMAxGmnGcOk8fVSQ7VRdAMYtvETfgzHUUDGwhGgG25aC0WVbdE3qM0nkJfxMWzVQ3jaBpvBQyYjCAkil1iR02WdLkeAgKjNyqOMJngok3B-PdtRqVRPANdQxhNYkiV+Ax9H6a1KwbASaAAOXEAACaRpU3BUYJojtiXY3tNH7AIhzsTD2mNJoJmJPDnGcCsgiAA */
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