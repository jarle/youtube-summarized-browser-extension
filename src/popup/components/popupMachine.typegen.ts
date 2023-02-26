
// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
    '@@xstate/typegen': true;
    internalEvents: {
        "": { type: "" };
        "xstate.init": { type: "xstate.init" };
    };
    invokeSrcNameMap: {

    };
    missingImplementations: {
        actions: "fetchUserInfo";
        delays: never;
        guards: never;
        services: never;
    };
    eventsCausingActions: {
        "fetchUserInfo": "";
    };
    eventsCausingDelays: {

    };
    eventsCausingGuards: {
        "noToken": "";
        "noVideo": "";
    };
    eventsCausingServices: {

    };
    matchesStates: "Data loaded" | "Fetching userInfo" | "Initialized" | "Initialized.Complete" | "Initialized.Failed" | "Initialized.Idle" | "Initialized.Loading" | "No token present" | "No video present" | "Not loaded" | { "Initialized"?: "Complete" | "Failed" | "Idle" | "Loading"; };
    tags: never;
}
