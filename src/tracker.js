const browser = require("webextension-polyfill");

const [year, day] = /\/(\d+)\/day\/(\d+)/.exec(document.location.pathname).slice(1)
browser.storage.local.get(year).then(yearCache => {
    if (!yearCache.hasOwnProperty(year)) {
        yearCache[year] = {}
    }
    if (!yearCache[year].hasOwnProperty(day)) {
        yearCache[year][day] = Math.floor(new Date().getTime() / 1000)
    }
    browser.storage.local.set(yearCache);
})
