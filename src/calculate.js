var browser = require("webextension-polyfill");
function formatTimestamp(seconds, asString = false) {
    var days = 0, hours = 0, minutes = 0
    if (seconds >= 86400) {
        days = Math.floor(seconds / 86400);
        seconds %= 86400;
    }
    if (seconds >= 3600) {
        hours = Math.floor(seconds / 3600);
        seconds %= 3600;
    }
    if (seconds >= 60) {
        minutes = Math.floor(seconds / 60);
        seconds %= 60;
    }
    
    if (asString) {
        return `${hours.toString().padStart(2, 0)}:${minutes.toString().padStart(2, 0)}:${seconds.toString().padStart(2, 0)}`;
    }

    return {
        days,
        hours,
        minutes,
        seconds
    };
}
export function calculateDeltas(memberId, data, year, yearCache) {
    return new Promise((resolve, reject) => {
        const members = Object.values(data.members);
        const member = members.find(member => member.id == memberId)
        const completion_day_level = member.completion_day_level
        Object.keys(completion_day_level).forEach(dayNum => {
            const puzzleDropDate = new Date(year, 11, dayNum);
            const obj = completion_day_level[dayNum]
            if (yearCache[dayNum] && yearCache[dayNum] < obj["1"].get_star_ts) {
                const puzzleOpenDate = new Date(yearCache[dayNum] * 1000)
                const daysOffset = Math.floor((puzzleOpenDate - puzzleDropDate) / 86400000)
                obj.puzzleOpen = {
                    ts: yearCache[dayNum],
                    daysOffset,
                    adjustedTS: {
                        1: formatTimestamp(obj["1"].get_star_ts - yearCache[dayNum], true)
                    }
                }
            }
            if (obj["2"]) {
                if (obj.puzzleOpen) {
                    // TODO: don't override if >24 hrs
                    obj.puzzleOpen.adjustedTS["2"] = formatTimestamp(obj["2"].get_star_ts - obj.puzzleOpen.ts, true)
                }
                var delta = obj["2"].get_star_ts - obj["1"].get_star_ts;
                obj.delta = formatTimestamp(delta);
            }
        })
        resolve(completion_day_level);
    });
}
