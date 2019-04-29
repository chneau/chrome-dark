const manageTab = (tab) => {
    const host = /.*\/\/([^\/]*)\//.exec(tab.url)[1];
    chrome.storage.local.get(host, (data) => {
        const newVal = data[host] == null ? false : !data[host];
        chrome.storage.local.set({ [host]: newVal }, () => {
            console.log(host, newVal);
            chrome.tabs.sendMessage(tab.id, newVal);
        });
    });
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    chrome.storage.local.get(msg.host, (data) => sendResponse((data[msg.host] == null ? true : data[msg.host])));
    return true;
});

chrome.browserAction.onClicked.addListener((tab) => manageTab(tab));
