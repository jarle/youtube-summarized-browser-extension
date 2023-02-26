import { UserInfoPort, UserInfoRequestMessage } from '../messaging/userInfoPort';
import { SummaryPort, SummaryRequestMessage } from './../messaging/summaryPort';
import { summaryRequestHandler } from "./summaryRequestHandler";
import { userInfoRequestHandler } from "./userInfoRequestHandler";

const hasStorage = !!chrome.storage?.sync

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


const getToken = async (): Promise<string | null> => {
    if (!hasStorage) {
        if (typeof window !== "undefined") {
            return window.localStorage.getItem("openapi-token")
        }
        return null
    }

    return chrome.storage.sync.get("openapi-token")
        .then(data => data["openapi-token"] || null)
}

const storeToken = async (token: string) => {
    if (hasStorage) {
        await chrome.storage.sync.set({ "openapi-token": token })
    }
    else if (typeof window !== "undefined") {
        return window.localStorage.setItem("openapi-token", token)
    }
}

async function getCurrentTab(): Promise<string | undefined> {
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await chrome.tabs?.query({ lastFocusedWindow: true, active: true });
    if (!tab?.url || !tab.id) {
        return undefined
    }
    if (tab.url.match("(.*)://(.*).youtube.com/.+")?.length) {
        return tab.url
    }
    return undefined
}
export { getToken, storeToken, getCurrentTab };

