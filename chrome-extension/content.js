let link = document.createElement(`link`);
link.id = `darkdarkdark`;
link.href = chrome.extension.getURL(`dark.css`);
link.type = `text/css`;
link.rel = `stylesheet`;
document.getElementsByTagName(`html`)[0].appendChild(link);

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request) {
        link.href = chrome.extension.getURL(`dark.css`);
    } else {
        link.href = ``;
    }
});

chrome.runtime.sendMessage({ host: location.host }, (response) => {
    if (response) {
        link.href = chrome.extension.getURL(`dark.css`);
    } else {
        link.href = ``;
    }
});
