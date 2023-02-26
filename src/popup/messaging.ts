import { SummaryPort } from "../messaging/summaryPort";
import { UserInfoPort } from "../messaging/userInfoPort";

export const summaryPort = chrome.runtime.connect({ name: SummaryPort.name });
export const userInfoPort = chrome.runtime.connect({ name: UserInfoPort.name });
