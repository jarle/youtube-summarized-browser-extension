import { assign, createMachine } from "xstate"
import { getCurrentTab } from "../../common/tabHandler"
import { getToken } from "../../common/tokenHandler"

export const popupMachine =
    /** @xstate-layout N4IgpgJg5mDOIC5QAUD2AHArugdAOVQBcACAG1QEMJIBiCVAOzBwEsGA3VAa2bS1wIlyVSAjacAxhUItGAbQAMAXUVLEodKlgsZjdSAAeiAIwB2AMw5zANgAsAVgX37t87esAOAJymANCABPRABaYwUPHC8vDwUAJg9je1M48NMAXzT-PmwcAEkGHRYKUhYAL0g8iFIwGgAVACcWKBh64lhMAFsOinqA1X1NbV0GfSMEDw9bSNNYn3tY2IVjTw9-IIRY63srL0XnWNsFu2tzDKyMHPzC4rKKgBlKCDYoGgBlTAkJOFh+pBBBwp6P5jYyxezWHAWazWYyucwJLzONYmUxTUzLMFhBwwjzzM4gbK4K4yG7lCA4B5UZ40ACi9XqqHqvw0WkBI2BJmM5kszlR0T51gUtj8gRCsMh6I8ngO1mSCi8TnxhLyBRJJTJOAAYhQWNUIHVGs0wK12l0en1lANWcNRohdrFIssogpufYoh5zMiEGEFDhwj5PNYol5rJtrEqLrgACLSChkR60Zn-a2ydmgMZuX3mUwJQ6LOKw4xezx+hSh4yImKmOxSiP8HAxwhx4TUfVyYxqP4Am0chDmWKWdy2JxmYVJTxerkOhYWcwu0yIpL2Os5RvNhNt2KdllDVO2vtuHCOcxcw6IzZzkXrYwTSIu+xz7OCwvpTIEyNasCECQAC2exEwWBjXyAAzVAaAAVSAxoGDA4h6jAL4WHYSAk27Pde37X1DlsKJhVsMIPHRL08xwbwFBHcxoliMJjAyN8GFQah4D+QkrV3IF0xCLxLCWYU7D2cEF2sL1gkWKYTyFZJdmrBUkhXAQiHjEQIHYtl92CBw-VhatDicISQ1E4xljIrEEnRbMFwOBSVWudVIDUnsuIQaEvCsMs5mrSZzDdIy4hwWJJSSdwy1Bay32VYkins8lciqMBHIw5zUUsXYkhvHMc0cVZRT7cUjhcHM5iOGyotJe5HmeRLOMMTlEkhfSgwXBUqMnVFIQxewsXBG9nFK1VotuckAGFUA6dBqkIBKuxTGqQQI0wcFsM83VwrxhxdNrB2hfMhTsLz+rsoatR1PVqrTWqEHRRa5ya8dvN83LDzLBJwgmdxoQ9GyCGIQhuDABhiHQBCgIYQhzo0xbkgcNafEmJ0RNy0EIhmCxkiogdvDBb7UGIdgWGoXHgbgAHwZmjiLrGYJFoHG9EQIpYfUOYspkcUMaK2aIvArU4Io-NdlNbCHMMOSJ4hamcYjBexRJ4qwsVlUNETmDwbM1L9f3-QDgNg1Bhec-teJDKU7D2oM7C9eJfSlcJ5hPN1oWW+i0iAA */
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
            },
        },
        initial: "Not loaded",
    }, {
        guards: {
            noToken: (ctx, evt) => !ctx.openAIToken,
            noVideo: (ctx, evt) => !ctx.videoURL
        }
    })