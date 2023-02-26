
// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
    '@@xstate/typegen': true;
    internalEvents: {
        "": { type: "" };
        "done.invoke.userInfoClient.idle:invocation[0]": { type: "done.invoke.userInfoClient.idle:invocation[0]"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
        "xstate.init": { type: "xstate.init" };
    };
    invokeSrcNameMap: {
        "getToken": "done.invoke.userInfoClient.idle:invocation[0]";
    };
    missingImplementations: {
        actions: never;
        delays: never;
        guards: "hasToken";
        services: "getToken";
    };
    eventsCausingActions: {
        "assignTokenToContext": "done.invoke.userInfoClient.idle:invocation[0]";
        "assignUserInfoToContext": "Success";
    };
    eventsCausingDelays: {

    };
    eventsCausingGuards: {
        "hasToken": "";
    };
    eventsCausingServices: {
        "getToken": "xstate.init";
    };
    matchesStates: "Done" | "Failed" | "Loading" | "No token" | "idle";
    tags: never;
}
