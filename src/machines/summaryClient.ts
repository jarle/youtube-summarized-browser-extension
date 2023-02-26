import { assign, createMachine } from 'xstate';

type EventType = { type: "Summarize", videoURL: string }
    | { type: "SummaryReceived", summary: string, videoId: string }
    | { type: "SummaryFailed", message: string }

export const summaryClient =
    /** @xstate-layout N4IgpgJg5mDOIC5SwK4Fs0EMBOBPAspgMYAWAlgHZgB0ZEANmAMQDK6W2ZAXmANoAMAXUSgADgHtYZAC5lxFESAAeiAIwBOAEzUA7JoBsAVn2bDAGhC5EmnQBZqt-icMBfFxdQYcBYuSrV6cUwISihWdm8AJTAiMDIAN0gBYSQQCSlZeUUVBENDbX1bAA5bAGYdc0s1Iv4HQ1LVUzcPCLxCUkoaQODQ8K88ADFMMkYIZMV0mTkFVJyDdWpSw1VjUwsrBCLVald3EE8OHw7-ADNh0b6Obj4hCckprNm1LV0DVcqN1R0danV6xt2ewo4ggcEUB287T8YDuGWm2UQAFp9OskfpmvtWkdobQGDDUpNMjNQDlVPx7Jo3s5UQhNOofkUipotk09hC2r5OgEgiEKFBYQ9icpELZbIZqGT1OUPtZ+KVfnT9EUKhj2diuWcRpABUSEQhbJoaep7EUpZT1Kp9Fbrei2VioVz2dcIDr4U8EBVtvp+FKKjTNPwCjp1EqVW4XEA */
    createMachine({
        id: "summaryMachine",
        initial: "idle",
        predictableActionArguments: true,
        context: {
            summary: undefined,
            videoId: undefined,
            errorMessage: undefined
        },
        schema: {
            events: {} as EventType,
            context: {} as {
                summary: string | undefined,
                videoId: string | undefined,
                errorMessage: string | undefined
            },
        },
        tsTypes: {} as import("./summaryClient.typegen").Typegen0,
        states: {
            idle: {
                on: {
                    "Summarize": {
                        target: "loading",
                        actions: "scheduleSummary",
                        cond: {
                            predicate: (_, event) => Boolean(event.videoURL),
                            type: 'xstate.guard',
                            name: "hasVideoURL",
                        },
                    }
                },
            },
            "loading": {
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