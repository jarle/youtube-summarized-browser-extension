import { ActorRefFrom, assign, createMachine, spawn } from "xstate";
import { summaryClient } from "../machines/summaryClient";


export const contentMachine = createMachine({
    /** @xstate-layout N4IgpgJg5mDOIC5QGED2A7ALmLA6AcqpgAQA2qAhhJAMQBqAltamZdRANoAMAuoqAAdUsBpgYZ+IAB6IAtAFYAzABZcANgBMARgCcGgBzz9y+Ro2KANCACeiZVtxa1Adi1cVO9wf0BfH1bQsHExcAAUKGGIAJzAqa1wASQhSMBoAJTAARwBXOBJYbIBbQooo624+JBAhETEJKpkERR1nXCN7FuVPZ3tLGzktLVa1Uy0NeS79Z2c1LWU-AIxsPHDImLjE5NSAGViANzBiPaYwVArJGtFxdElG5S71ZRGdZX0uDqUrWwRlLnk2nRGYxccxGIwLECBZYhVaHdYQeLhdBgUjECgAYzEewo2AgNF2FAORxOZ14F2EV3qoDuDzUT3kLzeH0UfW+v3+DKBv1Bhl8-khS2CYQicNiCOFyNRGKxONoyHIsEOAgokvOVUudRuDUQYw0qgmmnk8i08i4elMXx1zh0uGa3Q0ai4by5EKhQth0TFiJVKOI6IVtDVggpmtuiBcNtm+kNOkUBuc+ktCC0b1w+h0nn0cbUzRz1tdgrwAGUABaobKkCCezBlGhSWCYWW4CgAM2wUQAFG4uABKGhu4tlitVmI18pk9Uh65hhCyLpqNoaHp0jQ6Wb3VlyUy4ZTTHS8tRRnpaAtBQflyusKjEABG2UwmAwNCD1SnVOkcg0INw+-GemUcaxnqzhJi8bTWgYXCzG4er7qe0K4KWF5VuQ153g+T4cFolTBrU07arOX5cI4HiKK4oy-O4SayEMNpke80bprugzRvB7oip6GxFkUJRlJ6OR5IGE64ZSWrUjq2g2i8ugZlB0Ygmo1HGLa2Zxs4eqKOY+h8vy6CoNQ8BVAOmDknh76NLIjqtG4XTOKa+iDIoQzUfY-wmtoZGxm8uZsXghAkKh7CmaJM4KAyjjvC09mOc5-TJu8O5aIoDkOfuOZzL5MIcfC3wiaGBGOeoXBOklMwTMYGbUZpwyjOYyhfi8TqZcKaxepsKTBfl4nJrMRUlWRIyvPI1FGhFQwqLM7i5mozUejliE8aU1j8bkDaQJ1+HdWo+47tM8gjDmJi0dRcwOO5Yx0iyPTGPM-LGS1oobEivrSgw2K4ht5k6nMC5jK46YGM4KifHF5g7gYQLTLu9iDPIs3ZW1z2ov6wjrZOZliR+CCeA4+2KMVZo9F+DlJrRtqyXoF09NyzVIcO1ZlJ9mMWU8qhPGu1rRkDegzCddmOK4gz3Cl7gnndhYhHTl6Bbe96PpjGqbVjsjJaoBhOTMAGzAmJgnYo6hDG48h2Tjcm3X4QA */
    id: "Content",

    tsTypes: {} as import("./contentMachine.typegen").Typegen0,

    schema: {
        events: {} as { type: "Request summary" } |
        { type: "Leave video" } |
        { type: "Close panel" } |
        { type: "Video loaded" } |
        { type: "Summary requested" },
        context: {} as {
            summarizer: ActorRefFrom<typeof summaryClient> | undefined,
            summary: string
        }
    },

    states: {
        "Not loaded": {
            on: {
                "Video loaded": "Should load button"
            }
        },

        "Page ready": {
            entry: ["attachButton", assign({
                summarizer: () => spawn(summaryClient, "summaryClient")
            })],
            exit: "detachButton",
            states: {
                Idle: {
                    on: {
                        "Request summary": "Summary requested",
                        "Leave video": "#Content.Not loaded"
                    }
                },
                "Summary requested": {
                    entry: (context) => {
                        context.summarizer?.send("Summarize")
                    },
                    always: "Panel activated"
                },
                "Panel activated": {
                    entry: "attachSummaryPanel",
                    exit: "detachSummaryPanel",
                    on: {
                        "Leave video": "#Content.Not loaded",
                        "Close panel": "Panel closed"
                    }
                },

                "Panel closed": {
                    always: "Idle"
                }
            },

            initial: "Idle"
        },

        "Should retry": {
            after: {
                "100": "Should load button"
            }
        },

        "Should load button": {
            always: [{
                target: "Page ready",
                cond: "hasActions"
            }, "Should retry"]
        }
    },

    initial: "Not loaded"
})