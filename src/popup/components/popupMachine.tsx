import { assign, createMachine } from "xstate"
import { getCurrentTab } from "../../common/tabHandler"
import { getToken } from "../../common/tokenHandler"

export const popupMachine =

    /** @xstate-layout N4IgpgJg5mDOIC5QAUD2AHArugdAOVQBcACAG1QEMJIBiCVAOzBwEsGA3VAa2bS1wIlyVSAjacAxhUItGAbQAMAXUVLEodKlgsZjdSAAeiAIwB2AMw5zANgAsAVgX37t87esAOAJymANCABPRABaYwUPHC8vDwUAJg9je1M48NMAXzT-PmwcAEkGHRYKUhYAL0g8iFIwGgAVACcWKBh64lhMAFsOinqA1X1NbV0GfSMEGMtbV3trcxtTJPtzfyCEYw9rHA8l2zNTawPzDw9bDKyMHPzC4rKKgBlKCDYoGgBlTAkJOFh+pBBBwp6P5jYxmew4WIKUyQ2K2bbWOKxFaILybPbWYzmGZRLyxaFnEDZXBXGQ3coQHAPKjPGgAUXq9VQ9V+Gi0gJGwJMTliODiMQ23mSoKRgRCXks5jCjiSsVi5li1lMxgJRLyBVJJXJOAAYhQWNUIHVGs0wK12l0en1lAM2cNRogTsYrB4FqYTh43Ao4ciELEnc5QZLZa4bPCVRdcAARaQUMiPWgs-622Qc0BjT1WN3GWyyhRxbPGH2eXkKax+rz2GL7OHWcP8HDRwix4TUQ1yYxqP4Au2chDyyZ2JwYszCjw+kclnFLCsKcw+U6ZQkRhsxuMiNuxTusoYp+19tw4RySo6zDHi6w++IKXm4rzGXOz+x3jKLhioajwP5Em07oFpsWWAo2bVpCziKqiPrBAqESStyZi2Li8QLuc9aCGurY-uye7BA4vLAXYoEzKYEGiggoTGJsCRegkSrmKYxGwnWlzqkUmqQJhPb-gglamDg9ELLMd6VjmtiQes15UQhDhTF4rieExxIsWSFS5FUYAcbuvYHDyc6zKW4r2LESTLKRcrgp4xFhDm6yoh4ClqtcbEUlSTwMFAGl-oYXIHmYGJJLJdgOPYPqojg6KYtiUR4uY9kkqxtwUgAwqgHToNUhDqV2yaeSCczgneWK2NWnilmOpGyZEeIzEZyTbGEyqLqqcXKRSur6uxWW-qmXkILM4L8TMc6JCcsKQVMOBFdy2xeAoFbeHZjXLgQxCENwYAMMQ6D1HA62EB53VjMEvHJA45ize4xEIQs46KoeYSPjMniorK9nLewLDUKgm3bbAu37dhvFyjZLj1fdOZFrYh6lrKFFPt4xjivZjbNvGED-b2bg8ri3izrKbpxM4kHilYVmKmWFY+JWL5pEAA */
    createMachine({
        id: "Popup",

        context: {
            videoURL: undefined,
            openAIToken: undefined,
        },

        tsTypes: {} as import("./popupMachine.typegen").Typegen0,

        schema: {
            context: {} as {
                videoURL: string | undefined,
                openAIToken: string | undefined,
            },
            events: {} as
                { "type": "Trigger summary" } |
                { "type": "Success" } |
                { "type": "Error" }
        },
        states: {
            "Not loaded": {
                invoke: {
                    src: (ctx, evt) => async () => {
                        const videoURL = await getCurrentTab()
                        const openAIToken = await getToken()
                        return {
                            videoURL,
                            openAIToken
                        }
                    },
                    onDone: {
                        target: "Data loaded",
                        actions: assign({
                            videoURL: (ctx, evt) => evt.data.videoURL,
                            openAIToken: (ctx, evt) => evt.data.openAIToken
                        })
                    }
                },
            },
            Initialized: {
                states: {
                    Idle: {
                        on: {
                            "Trigger summary": "Loading"
                        }
                    },

                    Loading: {
                        on: {
                            Success: "Complete",
                            Error: "Failed"
                        }
                    },

                    Complete: {
                        type: "final"
                    },
                    Failed: {
                        on: {
                            "Trigger summary": "Loading"
                        }
                    }
                },

                initial: "Idle"
            },

            "No token present": {
                type: "final"
            },

            "No video present": {
                type: "final"
            },

            "Data loaded": {
                always: [{
                    target: "No video present",
                    cond: "noVideo"
                }, {
                    target: "No token present",
                    cond: "noToken"
                }, "Initialized"]
            }
        },
        initial: "Not loaded",
    }, {
        guards: {
            noToken: (ctx, evt) => !ctx.openAIToken,
            noVideo: (ctx, evt) => !ctx.videoURL
        }
    })