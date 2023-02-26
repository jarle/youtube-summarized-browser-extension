import { createActorContext } from "@xstate/react";
import { summaryClient } from "../machines/summaryClient";

export const SummaryContext = createActorContext(summaryClient)