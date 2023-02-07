
// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
    '@@xstate/typegen': true;
    internalEvents: {
        "xstate.init": { type: "xstate.init" };
    };
    invokeSrcNameMap: {

    };
    missingImplementations: {
        actions: "scheduleSummary";
        delays: never;
        guards: never;
        services: never;
    };
    eventsCausingActions: {
        "assignErrorToContext": "SummaryFailed";
        "assignSummaryToContext": "SummaryReceived";
        "scheduleSummary": "Summarize";
    };
    eventsCausingDelays: {

    };
    eventsCausingGuards: {

    };
    eventsCausingServices: {

    };
    matchesStates: "empty" | "failed" | "loading" | "summarized";
    tags: never;
}
