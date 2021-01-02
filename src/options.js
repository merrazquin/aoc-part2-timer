const browser = require("webextension-polyfill");

function saveOptions() {
    browser.storage.local.set({options: {showTimer: document.getElementById('showTimer').checked}})
}

browser.storage.local.get('options').then(options => {
    document.getElementById('showTimer').checked = options.options ? options.options.showTimer : false;
})
document.getElementById('showTimer').addEventListener('change', saveOptions);