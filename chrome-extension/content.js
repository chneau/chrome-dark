const darkCSS = chrome.extension.getURL(`dark.css`);
let link = document.createElement(`link`);
link.id = `darkdarkdark`;
link.href = darkCSS;
link.type = `text/css`;
link.rel = `stylesheet`;
[...document.getElementsByTagName(`html`)].forEach(x => x.appendChild(link));

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request) {
        link.href = darkCSS;
    } else {
        link.href = ``;
    }
});

chrome.runtime.sendMessage({ host: location.host }, (response) => {
    if (response) {
        link.href = darkCSS;
    } else {
        link.href = ``;
    }
});
