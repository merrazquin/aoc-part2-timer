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

function getMemberId() {
    return new Promise((resolve, reject) => {
        browser.storage.local.get("memberId").then(memberId => {
            if (memberId === null ||
                !memberId.hasOwnProperty("memberId") ||
                memberId.memberId == null) {

                const settingsUrl = document.location.protocol +
                    "//" +
                    document.location.host +
                    document.location.pathname.split("/").slice(0, 2).join("/") +
                    "/settings";
                const utf8Decoder = new TextDecoder("utf-8");
                fetch(settingsUrl)
                    .then(response => response.body)
                    .then(body => {
                        const reader = body.getReader()
                        reader.read().then(function processText({ done, value }) {
                            if (done) {
                                return;
                            }
                            const memberRegex = new RegExp(/\(anonymous user #(\d+)\)/, 'g');
                            const chunk = utf8Decoder.decode(value);
                            if (chunk.match(memberRegex)) {
                                memberId = memberRegex.exec(chunk)[1]
                                browser.storage.local.set({ memberId });
                                resolve(memberId);
                                return;
                            }

                            return reader.read().then(processText);
                        });
                    })
            } else {
                resolve(memberId.memberId);
            }
        })
    })
}

export function loadData() {
    return new Promise((resolve, reject) => {
        getMemberId().then(memberId => {
            const url =
                document.location.protocol +
                "//" +
                document.location.host +
                document.location.pathname.split("/").slice(0, 3).join("/") +
                "/private/view/" +
                memberId +
                ".json";
            browser.storage.local.get(url).then(k => {
                if (
                    k === null ||
                    !k.hasOwnProperty(url) ||
                    !k[url].hasOwnProperty("data") ||
                    !k[[url]].hasOwnProperty("date")
                ) {
                    fetchData(url, url).then(data => resolve({data, memberId}));
                } else {
                    const ttl = new Date(k[url].date + 5 * 60 * 1000);
                    if (ttl < new Date()) {
                        fetchData(url, url).then(data => resolve({data, memberId}));
                    } else {
                        resolve({data:k[url].data, memberId});
                    }
                }
            });
        });
    });
}
