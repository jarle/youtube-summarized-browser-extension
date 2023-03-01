import { assign, createMachine } from "xstate";
import { UserInfo } from './../types';

export const userInfoClient =
    /** @xstate-layout N4IgpgJg5mDOIC5QFdZgE4EkB2AzA9gMIA2AlmNgC4B0pExYAxBPtmLdgG74DW7qGHARLkqtemASku+AMYBDSqVYBtAAwBddRsSgADvliklrXSAAeiAEwBGagBYArADZ7ATjfOA7Fa9ubAMyOVgA0IACeiAC0XmrUbmpeABz+zo7B9ikAvllhAlh4RGQUNAAy+PIQ0lBQjADKyLKycLDaZgZGJthmlgjBAfFWnklejmGRCDFWDokpNmkZ2Tlh2PgQcGb5QkWilO2GxsrdSBbRVs7UjvZBamoBvlZqSa5J49E2jm7xs6npVpluZYgLaFEQlcQMfadI49RABOKORJWJJqNxWXz+AJON4IZzTLzOeaeDxePyEmxAkHCYpicqVapQKGHUwnXpOC4pZworxOLH2NTOHFo6iBXxJIYBLyBGxueyUtAFam7agAOXwAAJKLwKEyurCEDKLv5UmkbDyrAEbDjzl8EpaArLCQFnK45blgQrtmCxAARVhgXUw1mIUZ2LkfDJXUn+HFJRzUf4eEb866otSOHI5IA */
    createMachine({
        id: "userInfoClient",
        tsTypes: {} as import("./userInfoClient.typegen").Typegen0,
        context: {
            userInfo: undefined,
            openAIToken: undefined
        },
        schema: {
            context: {
                userInfo: {} as UserInfo | undefined,
                openAIToken: {} as string | undefined
            },
            events: {} as { type: "Success", userInfo: UserInfo } | { type: "Error" },
            services: {} as {
                getToken: {
                    data: {
                        openAIToken: string
                    }
                },
                getUserInfo: {
                    data: {
                        userInfo: UserInfo
                    }
                }
            }
        },
        states: {
            idle: {
                invoke: {
                    src: "getToken",
                    onDone: {
                        target: "Loadingg",
                        actions: "assignTokenToContext"
                    },
                },
            },

            Loadingg: {
                invoke: {
                    src: "getUserInfo",
                },
                on: {
                    Success: {
                        target: "Done",
                        actions: "assignUserInfoToContext"
                    }
                }
            },

            "No token": {
                type: "final"
            },

            Done: {
                type: "final"
            }
        },

        initial: "idle"
    }, {
        actions: {
            assignTokenToContext: assign({
                openAIToken: (_, event) => event.data.openAIToken
            }),
            assignUserInfoToContext: assign({
                userInfo: (_, event) => event.userInfo
            })
        },
    })