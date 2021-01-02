
export function visualize(data) {
    const lineRegex = new RegExp(/^\s+([^\s]+)(\s+\d+\s+\d+)\s+([^\s]+)(.*)$/);
    const origDisplay = document.getElementsByTagName('pre')[0].innerHTML.split("\n");
    const includePuzzleOpenedColumn = Object.values(data).some(obj => obj.puzzleOpen != undefined)
    let headerStart = origDisplay[0].indexOf("<");
    let updatedDisplay = origDisplay[0].substr(0, headerStart) + (includePuzzleOpenedColumn ? '<span class="leaderboard-daydesc-first">----Puzzle Opened----</span>   ' : '') +
                         origDisplay[0].substr(headerStart) + '   <span class="leaderboard-daydesc-first">---Part 1 to Part 2---</span>\n';
    headerStart = origDisplay[1].indexOf("<");
    updatedDisplay += origDisplay[1].substr(0, headerStart) + ' '.repeat(includePuzzleOpenedColumn ? 24 : 0) + origDisplay[1].substr(headerStart) + "\n";

    origDisplay.slice(2).forEach(line => {
        if (!line.trim()) {
            updatedDisplay += '\n';
            return;
        }
        let [dayNum, restOfLine] = /(\d+)(.*)/.exec(line.trim()).slice(1);
        let delta = "";
        if (data[dayNum].delta) {
            const deltaObj = data[dayNum].delta;
            delta = `   ${deltaObj.hours.toString().padStart(2, "0")}:${deltaObj.minutes.toString().padStart(2, "0")}:${deltaObj.seconds.toString().padStart(2, "0")}`;
            if (deltaObj.days) {
                delta += ` +${deltaObj.days} days`;
            }
            if (!deltaObj.days && !deltaObj.hours && deltaObj.minutes < 5) {
                delta = '<span class="leaderboard-daydesc-both">' + delta + '</span>';
            }
        }
        let puzzleOpen = ''
        if (data[dayNum].puzzleOpen) {
            const {ts, daysOffset, adjustedTS} = data[dayNum].puzzleOpen;
            const puzzleOpenDate = new Date(ts * 1000);
            if (daysOffset) {
                puzzleOpen = `+${daysOffset} days `;
            }
            puzzleOpen += `${puzzleOpenDate.getHours().toString().padStart(2, 0)}:${puzzleOpenDate.getMinutes().toString().padStart(2, 0)}:${puzzleOpenDate.getSeconds().toString().padStart(2, 0)}`
            let [p1Time, p1RankScore, p2Time, p2RankScore] = lineRegex.exec(restOfLine).slice(1)
            p1Time = adjustedTS["1"]
            if (adjustedTS["2"]) {
                p2Time = adjustedTS["2"]
            }
            puzzleOpen = puzzleOpen.padStart(24, ' ')
            restOfLine = `${p1Time.padStart(11, ' ')}${p1RankScore}  ${p2Time.padStart(9, ' ')}${p2RankScore}`
        }
        if (includePuzzleOpenedColumn) {
            puzzleOpen = puzzleOpen.padStart(24, ' ');   
        }
        updatedDisplay += dayNum.padStart(3, ' ') + puzzleOpen + restOfLine + delta + '\n';
    });
    
    document.getElementsByTagName('pre')[0].innerHTML = updatedDisplay;
    
    return data;
}