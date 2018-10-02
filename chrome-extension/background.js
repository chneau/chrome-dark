const manageTab = (tab) => {
    const host = /.*\/\/([^\/]*)\//.exec(tab.url)[1];
    chrome.storage.local.get(host, (data) => {
        if (data[host] != true && data[host] != false) {
            data[host] = true;
        }
        chrome.storage.local.set({ [host]: !data[host] }, () => {
            console.log({ [host]: !data[host] });
            chrome.tabs.sendMessage(tab.id, !data[host]);
        });
    });
}

chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        title: `Dark: Toggle for this website`,
        contexts: [`all`],
        onclick: (info, tab) => {
            manageTab(tab);
        }
    });
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    chrome.storage.local.get(msg.host, (data) => {
        if (data[msg.host] != true && data[msg.host] != false) {
            sendResponse(true);
        } else {
            sendResponse(data[msg.host]);
        }
    });
    return true;
});

chrome.browserAction.onClicked.addListener((tab) => {
    manageTab(tab);
});
