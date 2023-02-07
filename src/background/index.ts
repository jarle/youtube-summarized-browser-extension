import { ErrorResponse, ServiceRequest, Summary, SummaryAck, SummaryRequest, SummaryResponse } from "../types";

console.info('chrome-ext template-react-ts background script')

const hasStorage = !!chrome.storage?.sync

chrome.runtime?.onInstalled.addListener((details) => {
    if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
        chrome.runtime.openOptionsPage()
    }
});


chrome.runtime.onConnect.addListener(port => {
    port.onMessage?.addListener(async (message: ServiceRequest) => {
        if (message.type == "summary_request") {
            const { videoURL } = (message as SummaryRequest)
            const ack: SummaryAck = {
                type: "summary_ack",
                videoURL,
            }
            port.postMessage(ack)

            try {
                const token = await getToken()
                const result = await getSummary(token!, videoURL)
                const firstResponse: SummaryResponse = {
                    videoId: result.videoId,
                    preview: result.summary,
                    summary: result.summary
                }
                port.postMessage(firstResponse)
            } catch (error) {
                const errorResponse: ErrorResponse = {
                    type: "error",
                    message: (error as any).message || "Unknown error"
                }
                port.postMessage(errorResponse)
            }
        }
    })

})

const API_GATEWAY_URL = "https://api.youtubesummarized.com"
async function getSummary(token: string, videoURL: string): Promise<Summary> {
    return fetch(
        `${API_GATEWAY_URL}/v1/youtube/summarizeVideoWithToken?videoURL=${videoURL}`,
        {
            headers: {
                "openai-token": token,
                "yt-summarized-request-source": "BROWSER_EXTENSION",
                "Access-Control-Allow-Origin": API_GATEWAY_URL
            }
        }
    )
        .then(
            async res => {
                const response = await res.json()
                if (res.status == 200) {
                    return response
                }
                throw Error(`${response.message}`)
            }
        )
        .catch(
            error => {
                console.error(error)
                throw (error)
            }
        )
}

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
console.log("hello")

export { getToken, storeToken, getCurrentTab };

