
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
        actions: never;
        delays: never;
        guards: never;
        services: never;
    };
    eventsCausingActions: {

    };
    eventsCausingDelays: {

    };
    eventsCausingGuards: {
        "noToken": "";
        "noVideo": "";
    };
    eventsCausingServices: {

    };
    matchesStates: "Data loaded" | "Initialized" | "Initialized.Complete" | "Initialized.Failed" | "Initialized.Idle" | "Initialized.Loading" | "No token present" | "No video present" | "Not loaded" | { "Initialized"?: "Complete" | "Failed" | "Idle" | "Loading"; };
    tags: never;
}
