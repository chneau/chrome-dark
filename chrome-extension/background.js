chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        title: `Toggle for this website`,
        contexts: [`all`],
        onclick: (info, tab) => {
            let host = /.*\/\/([^\/]*)\//igm.exec(info.pageUrl)[1];
            chrome.storage.sync.get(host, (data) => {
                if (data[host] != true && data[host] != false) {
                    data[host] = true;
                }
                chrome.storage.sync.set({ [host]: !data[host] }, () => {
                    console.log({ [host]: !data[host] });
                    chrome.tabs.sendMessage(tab.id, !data[host]);
                });
            });
        }
    });
});



chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    chrome.storage.sync.get(msg.host, (data) => {
        if (data[msg.host] != true && data[msg.host] != false) {
            sendResponse(true);
        } else {
            sendResponse(data[msg.host]);
        }
    });
    return true;
});