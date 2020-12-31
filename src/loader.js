const browser = require("webextension-polyfill");

function fetchData(url, key) {
    return fetch(url)
        .then(response => response.json())
        .then(data => {
            var val = {
                data: data,
                date: new Date().getTime()
            };
            browser.storage.local.set({ [key]: val });
            return data;
        })
        .catch(err => {
            console.log(err);
        });
}

export function loadData() {
    return new Promise((resolve, reject) => {
        if (window.data) {
            resolve(window.data);
            return;
        }
        browser.storage.local.get("memberId").then(memberId => {
            console.log('memberId', memberId);
            if (memberId === null ||
                !memberId.hasOwnProperty("memberId") ||
                memberId.memberId == null) {
                memberId = prompt("Please enter your member id");
                browser.storage.local.set({memberId});
            } else {
                memberId = memberId.memberId;
            }

        const url =
            document.location.protocol +
            "//" +
            document.location.host +
            document.location.pathname.split("/").slice(0, 3).join("/") + 
            "/private/view/" +
            memberId +
            ".json";
            console.log('url', url)
            browser.storage.local.get(url).then(k => {
                if (
                    k === null ||
                    !k.hasOwnProperty(url) ||
                    !k[url].hasOwnProperty("data") ||
                    !k[[url]].hasOwnProperty("date")
                ) {
                    fetchData(url, url).then(data => resolve(data));
                } else {
                    const ttl = new Date(k[url].date + 5 * 60 * 1000);
                    if (ttl < new Date()) {
                        fetchData(url, url).then(data => resolve(data));
                    } else {
                        resolve(k[url].data);
                    }
                }
            });
        });
    });
}
