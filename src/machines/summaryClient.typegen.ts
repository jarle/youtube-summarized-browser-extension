
// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
    '@@xstate/typegen': true;
    internalEvents: {
        "done.invoke.getToken": { type: "done.invoke.getToken"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
        "error.platform.getToken": { type: "error.platform.getToken"; data: unknown };
        "xstate.init": { type: "xstate.init" };
    };
    invokeSrcNameMap: {
        "getToken": "done.invoke.getToken";
    };
    missingImplementations: {
        actions: "scheduleSummary";
        delays: never;
        guards: never;
        services: "getToken";
    };
    eventsCausingActions: {
        "assignErrorToContext": "SummaryFailed";
        "assignSummaryToContext": "SummaryReceived";
        "assignTokenToContext": "done.invoke.getToken";
        "scheduleSummary": "Summarize";
    };
    eventsCausingDelays: {

    };
    eventsCausingGuards: {

    };
    eventsCausingServices: {
        "getToken": "xstate.init";
    };
    matchesStates: "No token" | "Uninitialized" | "failed" | "idle" | "loading" | "summarized";
    tags: never;
}
