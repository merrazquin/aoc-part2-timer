var browser = require("webextension-polyfill");

export function calculateDeltas(data, memberId) {
    return new Promise((resolve, reject) => {
        const members = Object.values(data.members);
        const member = members.find(member => member.id == memberId)
        const completion_day_level = member.completion_day_level
        Object.keys(completion_day_level).forEach(dayNum => {
            const obj = completion_day_level[dayNum]
            if (obj["2"]) {
                var delta = obj["2"].get_star_ts - obj["1"].get_star_ts;
                var seconds = delta
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
                obj.delta = {
                    days,
                    hours,
                    minutes,
                    seconds
                };
            }
        })
        resolve(completion_day_level);
    });
}
