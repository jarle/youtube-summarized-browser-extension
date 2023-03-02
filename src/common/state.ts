import { createActorContext } from "@xstate/react";
import { summaryClient } from "../machines/summaryClient";
import { userInfoClient } from '../machines/userInfoClient';

export const SummaryContext = createActorContext(summaryClient)
export const UserInfoContext = createActorContext(userInfoClient)