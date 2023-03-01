import { assign, createMachine } from "xstate";
import { getToken } from "../common/tokenHandler";
import { UserInfoRequestMessage, UserInfoResponseMessage } from "../messaging/userInfoPort";
import { userInfoPort } from "../popup/messaging";
import { UserInfo } from './../types';

export const getTokenService = async () => {
    const openAIToken = await getToken()
    if (!openAIToken) {
        throw new Error("No OpenAI token found")
    }
    return {
        openAIToken
    }
}

export const userInfoClient =
    /** @xstate-layout N4IgpgJg5mDOIC5QFdZgE4EkB2AzA9gMIA2AlmNgC4B0pExYAxBPtmLdgG74DW7qGHARLkqtemASku+AMYBDSqVYBtAAwBddRsSgADvliklrXSAAeiAEwBGagBYArADZ7ATjfOA7Fa9ubAMyOVgA0IACeiAC0XmrUbmpeABz+zo7B9ikAvllhAlh4RGQUNAAy+PIQ0lBQjADKyLKycLDaZgZGJthmlgjBAfFWnklejmGRCDFWDokpNmkZ2bkg+UJFojR0DIwY6Pjo1HrEigToALbUq4UiJeIMUjIKXdptSCAdxsrdb7329tTOBIjezeXz+ILjRA2Lx2ZzONSBP5uLx+Zw2HLLbD4CBwMxXYTFKjtQyfUw-aJWZzURz2IJqNQBXxWNRJVxJSGTGyONzxWapdJWTJuHJ5NAFAkbO5gYmdL49RABOKORJWJJqNxWMGIsYRRDOaZeNGAwHI1E2dHLfHrW7lSrVKAy0nfUC-FzUFLONVeJwBP5qZwcjXUQK+JJDAIwgI2Nz2EUrMVrG5iABy+AABJReBRHV15Qh7F5qJSUh5QX5AjqJr5-lYAglDZ5AnC-nGrUmaAARVjSt4fXPkhCjWFJLkZGko-wcpKOIvuNzAtS09VqRwYrJAA */
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

                    onError: "No token"
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
        services: {
            getToken: getTokenService,
            getUserInfo: () => (callback, onReceive) => {
                const handler = (response: UserInfoResponseMessage) => {
                    if (response.type === "user_info_response") {
                        callback({
                            type: "Success",
                            userInfo: response.userInfo
                        })
                    }
                }

                userInfoPort.onMessage.addListener(handler);
                userInfoPort.postMessage({ type: "user_info_request" } as UserInfoRequestMessage)
                return () => userInfoPort.onMessage.removeListener(handler)
            }
        }
    })