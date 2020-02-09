const hreg = /.*\/\/([^\/]*)\//;
const manageTab = (tab) => {
    const host = hreg.exec(tab.url)[1];
    chrome.storage.local.get(host, (data) => {
        const newVal = data[host] == null ? true : !data[host];
        chrome.storage.local.set({ [host]: newVal }, () => chrome.tabs.sendMessage(tab.id, newVal));
        console.log(host, newVal);
    });
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    chrome.storage.local.get(msg.host, (data) => sendResponse((data[msg.host] == null ? false : data[msg.host])));
    return true;
});

chrome.browserAction.onClicked.addListener((tab) => manageTab(tab));
