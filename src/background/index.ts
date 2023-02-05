
console.info('chrome-ext template-react-ts background script')

const hasStorage = !!chrome.storage?.sync

chrome.runtime?.onInstalled.addListener((details) => {
    if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
        chrome.runtime.openOptionsPage()
    }
});

chrome.runtime.onConnect.addListener(port => {
    if (port.name === 'popup') {
        port.onMessage.addListener(request => {
            if (request.type === 'startWork') {
                // Perform some work on the background thread
                // ...

                // Notify the popup when the work is complete
                port.postMessage({
                    type: 'workComplete',
                    result: 'Work complete!'
                });
            }
        });
    }
});


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

async function getCurrentTab() {
    if (!chrome.tabs) {
        return "https://www.youtube.com/watch?v=f5j525KpdGc"
    }
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await chrome.tabs.query({ lastFocusedWindow: true, active: true });
    if (tab.url?.match("(.*)://(.*).youtube.com/.*")?.length) {
        return tab.url;
    }
    return undefined
}

export { getToken, storeToken, getCurrentTab };

