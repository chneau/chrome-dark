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
        let usernames = [...document.querySelectorAll(".chat-line__username[style], .chat-author__display-name[style]")];
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

    setInterval(() => [...document.querySelectorAll('.tw-button--success')].forEach(x => x.click()), 1000);

    var chat = null;
    setInterval(async () => {
        let newChat = await getElementByAllMeans(".chat-list__list-container");
        if (newChat == chat) return;
        console.log("============== INSTALLATION TO NEW CHAT ==============");
        chat = newChat;
        new MutationObserver(() => { // coloring mentions
            let mentions = [...document.querySelectorAll('.mention-fragment:not(.colored), .chat-line__message-mention:not(.colored)')];
            if (mentions.length == 0) return;
            let usersColor = getUsersColor();
            mentions.forEach(x => {
                let color = usersColor[x.innerText.substring(1).toLowerCase()];
                if (color == null) return;
                x.classList.add("colored");
                x.style.color = color;
            });
        }).observe(chat, { attributes: true, childList: true });
    }, 1000);

}, false);
