
const hasStorage = !!chrome.storage?.sync

export const getToken = async (): Promise<string | null> => {
    if (!hasStorage) {
        if (typeof window !== "undefined") {
            return window.localStorage.getItem("openapi-token")
        }
        return null
    }

    return chrome.storage.sync.get("openapi-token")
        .then(data => data["openapi-token"] || null)
}

export const storeToken = async (token: string) => {
    if (hasStorage) {
        await chrome.storage.sync.set({ "openapi-token": token })
    }
    else if (typeof window !== "undefined") {
        return window.localStorage.setItem("openapi-token", token)
    }
}