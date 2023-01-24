
console.info('chrome-ext template-react-ts background script')

const hasStorage = !!chrome.storage?.sync


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
    let queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await chrome.tabs.query(queryOptions);
    if (tab.url?.startsWith("https://www.youtube.com")) {
        return tab.url;
    }
    return null
}

export { getToken, storeToken, getCurrentTab }

