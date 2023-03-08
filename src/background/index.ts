import { SummaryPort, SummaryRequestMessage } from '../messaging/summaryPort';
import { UserInfoPort, UserInfoRequestMessage } from '../messaging/userInfoPort';
import { summaryRequestHandler } from "./summaryRequestHandler";
import { userInfoRequestHandler } from "./userInfoRequestHandler";


chrome.runtime?.onInstalled.addListener((details) => {
    if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
        chrome.runtime.openOptionsPage()
    }
});

chrome.runtime.onConnect.addListener(
    port => {
        if (port.name === SummaryPort.name) {
            port.onMessage?.addListener(async (message: SummaryRequestMessage) => {
                summaryRequestHandler(message, port)
            })
        }
        else if (port.name === UserInfoPort.name) {
            port.onMessage?.addListener(async (message: UserInfoRequestMessage) => {
                userInfoRequestHandler(message, port)
            })
        }
        else {
            console.warn("Unknown port name: " + port.name)
        }
    })