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

function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

document.addEventListener("DOMContentLoaded", async function () {

    if (!location.host.endsWith("twitch.tv")) return;

    function getUsersColor() {
        let usernames = [...document.querySelectorAll(".chat-line__username")];
        return usernames.reduce((acc, cur) => {
            acc[cur.innerText.toLowerCase()] = cur.style.color;
            return acc;
        }, {});
    }

    async function getElementByAllMeans(selector) {
        var el = document.querySelector(selector);
        var tries = 100;
        while (el == null && --tries) {
            await sleep(1);
            el = document.querySelector(selector);
        }
        return el;
    }

    new MutationObserver(() => { // coloring mentions
        let mentions = [...document.querySelectorAll('.mention-fragment:not([style]), .chat-line__message-mention:not([style])')];
        if (mentions.length == 0) return;
        let usersColor = getUsersColor();
        mentions.forEach(x => {
            let color = usersColor[x.innerText.substring(1).toLowerCase()];
            if (color == null) return;
            x.style = `color: ${color};`;
        });
    }).observe(await getElementByAllMeans(".chat-list__list-container"), { attributes: true, childList: true });

    new MutationObserver(() => { // clicking the reward button
        [...document.querySelectorAll('.tw-button--success')].forEach(x => x.click())
    }).observe(await getElementByAllMeans(".chat-input__buttons-container"), { attributes: true, childList: true });

}, false);
