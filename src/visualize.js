
export function visualize(data) {
    const origDisplay = document.getElementsByTagName('pre')[0].innerHTML.split("\n");
    let updatedDisplay = origDisplay[0] + '    <span class="leaderboard-daydesc-first">--------Part 1 to Part 2--------</span>\n' +
                         origDisplay[1] + "\n";

    origDisplay.slice(2).forEach(line => {
        if (!line.trim()) {
            updatedDisplay += '\n';
            return;
        }

        const dayNum = line.trim().split(/\s/g)[0].trim();
        let delta = "";
        if (data[dayNum].delta) {
            const deltaObj = data[dayNum].delta;
            delta = `    ${deltaObj.hours.toString().padStart(2, "0")}:${deltaObj.minutes.toString().padStart(2, "0")}:${deltaObj.seconds.toString().padStart(2, "0")}`;
            if (deltaObj.days) {
                delta += ` +${deltaObj.days} days`;
            }
            if (!deltaObj.days && !deltaObj.hours && deltaObj.minutes < 5) {
                delta = '<span class="leaderboard-daydesc-both">' + delta + '</span>';
            }
        }
        updatedDisplay += line + delta + '\n';
    });
    
    document.getElementsByTagName('pre')[0].innerHTML = updatedDisplay;
    
    return data;
}