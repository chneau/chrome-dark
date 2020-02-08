const darkCSS = chrome.extension.getURL(`dark.css`);
const noCSS = chrome.extension.getURL(`no.css`);
let link = document.createElement(`link`);
link.id = `darkdarkdark`;
link.href = darkCSS;
link.type = `text/css`;
link.rel = `stylesheet`;
[...document.getElementsByTagName(`html`)].forEach(x => x.appendChild(link));

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => link.href = request ? darkCSS : noCSS);

chrome.runtime.sendMessage({ host: location.host }, (response) => link.href = response ? darkCSS : noCSS);

setInterval(() => [...document.querySelectorAll('.tw-button--success')].forEach(x => x.click()), 1000); // for twitch
