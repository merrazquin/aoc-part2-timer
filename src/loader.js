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

function getOptions() {
    return new Promise((resolve, reject) => {
        browser.storage.local.get("options").then(options => {
            resolve(options.options ? options.options : { showLiveTimer: false });
        })
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
        });
    });
}

function getPuzzleOpensForYear(year) {
    return new Promise((resolve, reject) => {
        browser.storage.local.get(year).then(yearCache => {
            resolve(yearCache.hasOwnProperty(year) ? yearCache[year] : {})
        });
    });
}

export function loadData() {
    return new Promise((resolve, reject) => {
        const year = document.location.pathname.split("/")[1];
        getOptions().then(options => {
            getPuzzleOpensForYear(year).then(yearCache => {
                getMemberId().then(memberId => {
                    const url =
                        document.location.protocol +
                        "//" +
                        document.location.host +
                        document.location.pathname.split("/").slice(0, 3).join("/") +
                        "/private/view/" +
                        memberId +
                        ".json";

                    browser.storage.local.get(url).then(cache => {
                        if (
                            cache === null ||
                            !cache.hasOwnProperty(url) ||
                            !cache[url].hasOwnProperty("data") ||
                            !cache[[url]].hasOwnProperty("date")
                        ) {
                            fetchData(url, url).then(data => {
                                data.options = options;
                                resolve({ data, yearCache });
                            });
                        } else {
                            const ttl = new Date(cache[url].date + 5 * 60 * 1000);
                            if (ttl < new Date()) {
                                fetchData(url, url).then(data => {
                                    data.options = options;
                                    resolve({ data, yearCache });
                                });
                            } else {
                                cache[url].data.options = options;
                                resolve({ data: cache[url].data, yearCache });
                            }
                        }
                    });
                });
            });
        });
    });
}
