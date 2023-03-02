
export async function getCurrentTab(): Promise<string | undefined> {
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