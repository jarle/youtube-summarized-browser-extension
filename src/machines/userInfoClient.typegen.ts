
// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
    '@@xstate/typegen': true;
    internalEvents: {
        "done.invoke.userInfoClient.idle:invocation[0]": { type: "done.invoke.userInfoClient.idle:invocation[0]"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
        "xstate.init": { type: "xstate.init" };
    };
    invokeSrcNameMap: {
        "getToken": "done.invoke.userInfoClient.idle:invocation[0]";
        "getUserInfo": "done.invoke.userInfoClient.Loading:invocation[0]";
    };
    missingImplementations: {
        actions: never;
        delays: never;
        guards: never;
        services: never;
    };
    eventsCausingActions: {
        "assignTokenToContext": "done.invoke.userInfoClient.idle:invocation[0]";
        "assignUserInfoToContext": "Success";
    };
    eventsCausingDelays: {

    };
    eventsCausingGuards: {

    };
    eventsCausingServices: {
        "getToken": "xstate.init";
        "getUserInfo": "done.invoke.userInfoClient.idle:invocation[0]";
    };
    matchesStates: "Done" | "Loading" | "No token" | "idle";
    tags: never;
}
