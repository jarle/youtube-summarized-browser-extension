import { createMachine } from "xstate";
import { UserInfo } from './../types';

export const userInfoClient =
    /** @xstate-layout N4IgpgJg5mDOIC5QFdZgE4EkB2AzA9gMIA2AlmNgC4B0pExYAxBPtmLdgG74DW7qGHARLkqtemASku+AMYBDSqVYBtAAwBddRsSgADvliklrXSAAeiAEwBGagBYArADZ7ATjfOA7Fa9ubAMyOVgA0IACeiAC0XmrUbmpeABz+zo7B9ikAvllhAlh4RGQUNHQMjNpmBkYm2GaWCDZ+1I7+ao4Bbh1JzrZhkQhJSdRqo6NWzjZWap5e9jl5aAXCxWJlTCo2Okgg1cbKdTsNTV4Ozs7tavbOSfZeXjbO-YhNVtQ3fjaJAUHBAV4LED5IRFUQ0AAy+HkEGkUEYAGVkLJZHBYJUdntavVEJlhkkbI58bcui57M8EM4Ai0rAF7DZ7E5poFHoDgYURCVqJDobDGABRdDofDodH6Qz7UxHRC0tzUWm2QIMomPMkRazOBweNyxez-ZluII5XIgbD4CBwMxslZgqrirFShBRJKne4za6EpK2D7kqIE4b2RIpWKBNQ2T02VlLEEctYSW01A7Yx2daiutzuoZeobk3rxLXJKx3PyTCPGq2gzncmHYKDxiWHUANIJ2KxJIITaa0gNPNWDDXuDw6vUBGzpyOCdmrGgAOXwAAJKLwKHX7Y2Xp54qPHmkmvYaTZyRNZQkR51roFzgzx8sK2IACKsMArxMOryOOw3AkZRxF-zkpKONQhYeM6Aa6jM7TXtGU7UAAYvIpAMBAz6SmuCC0qc1wjm4zoBGorjOG4PruA4p6JFYvhTF8zhGlkQA */
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
                }
            }
        },
        states: {
            idle: {
                invoke: {
                    src: "getToken",
                    onDone: {
                        actions: "assignTokenToContext"
                    },
                },
                always: [{
                    target: "Loading",
                    cond: "hasToken"
                }, "No token"]
            },

            Loading: {
                on: {
                    Success: {
                        target: "Done",
                        actions: "assignUserInfoToContext"
                    },
                    Error: "Failed"
                }
            },

            "No token": {
                type: "final"
            },
            Done: {
                type: "final"
            },
            Failed: {}
        },

        initial: "idle"
    }, {
        actions: {
            assignUserInfoToContext: (context, event) => {
                context.userInfo = event.userInfo;
            },
            assignTokenToContext: (context, event) => {
                context.openAIToken = event.data.openAIToken;
            }
        }
    })