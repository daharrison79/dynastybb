async function loadDashboard() {

    const cleanName = name =>
        name.replace(/^.*?#?\d+\s*/, "");

    const photoName = name =>
        cleanName(name)
            .toLowerCase()
            .replaceAll(".", "")
            .replaceAll(" ", "_");

    const teamResponse =
        await fetch(dataPath("team.json"));

    const playerResponse =
        await fetch(dataPath("players.json"));

    const pairingResponse =
        await fetch(dataPath("pairings.json"));

    const lineupResponse =
        await fetch(dataPath("lineups.json"));

    console.log(teamResponse.status);
    console.log(playerResponse.status);
    console.log(pairingResponse.status);
    console.log(lineupResponse.status);

    const team =
        await teamResponse.json();

    const players =
        await playerResponse.json();

    const pairings =
        await pairingResponse.json();

    const lineups =
        await lineupResponse.json();

    const container =
        document.getElementById("season-stats");

    const gamesPlayed = team.length;

    let wins = 0;
    let losses = 0;

    team.forEach(game => {
        if (game.Result === "W") {
            wins++;
        } else {
            losses++;
        }
    });

    players.sort(
        (a, b) =>
            b.PLUS_MINUS - a.PLUS_MINUS
    );

    const scoringLeader =
        [...players].sort(
            (a, b) => b.PPG - a.PPG
        )[0];

    const scoringPhoto =
        photoName(scoringLeader.Player);

    const reboundLeader =
        [...players].sort(
            (a, b) => b.RPG - a.RPG
        )[0];
    
    const reboundPhoto =
        photoName(reboundLeader.Player);

    const assistLeader =
        [...players].sort(
            (a, b) => b.APG - a.APG
        )[0];

    const assistPhoto =
        photoName(assistLeader.Player);

    const stealLeader =
        [...players].sort(
            (a, b) => b.SPG - a.SPG
        )[0];

    const stealPhoto = 
        photoName(stealLeader.Player);

    const topPlayer = players[0];
    console.log(topPlayer.Player);

    pairings.sort(
        (a, b) =>
            b.DIFF - a.DIFF
    );

    const topPairing = pairings[0];

    lineups.sort(
        (a, b) =>
            b.DIFF - a.DIFF
    );

    const topLineup = lineups[0];
    const lineupPlayers =
        topLineup.lineup
            .split(",");

    let lineupHtml = "";
    lineupPlayers.forEach(player => {
        const playerDisplay = cleanName(player.trim());
        const playerPhoto = photoName(player);
        lineupHtml += `
            <div class="lineup-player">
                <img
                    class="dashboard-player-photo"
                    src="images/players/${playerPhoto}.png"
                    alt="${playerDisplay}"
                    onerror="this.src='images/players/playerplaceholder.png';">
                <div class="pairing-name">
                    ${playerDisplay}
                </div>
            </div>
        `;
    });

    const pair1Name = topPairing.Player1;
    const pair2Name = topPairing.Player2;
    const pair1Display =
        cleanName(pair1Name);
    const pair2Display =
        cleanName(pair2Name);
    const topPlayerDisplay =
        cleanName(topPlayer.Player);

    const topPlayerPhoto = photoName(topPlayer.Player);
    const pair1Photo = photoName(pair1Name);
    const pair2Photo = photoName(pair2Name);

    console.log("Top Player Photo:", topPlayerPhoto);
    console.log("Pair 1 Photo:", pair1Photo);
    console.log("Pair 2 Photo:", pair2Photo);


    container.innerHTML = `
        <div class="record-banner">
            Season Record: ${wins} - ${losses}
        </div>
        <div class="dashboard-grid">

            <div class="dashboard-card top-player-card" onclick="window.location.href='player.html?player=${encodeURIComponent(topPlayer.Player)}'">
                <h3>Top Impact Player</h3>
                <br>
                ${topPlayer.PLUS_MINUS > 0 ? "+" : ""}${topPlayer.PLUS_MINUS}
                <div class="top-player-content">
                    <img
                        class="dashboard-player-photo"
                        src="images/players/${topPlayerPhoto}.png"
                        alt="Player Photo"
                        onerror="this.src='images/players/playerplaceholder.png';">
                    <div class="pairing-name">
                        ${topPlayerDisplay}            
                    </div>
                </div>
            </div>

            <div class="dashboard-card pairing-card"onclick="window.location.href='pairings.html'">
                <h3>Best Pairing</h3>
                <br>
                ${topPairing.DIFF > 0 ? "+" : ""}${topPairing.DIFF}
                <div class="pairing-players">
                    <div class="pairing-player">
                        <img
                            class="dashboard-player-photo"
                            src="images/players/${pair1Photo}.png"
                            alt="${pair1Display}"
                            onerror="this.src='images/players/playerplaceholder.png'">
                        <div class="pairing-name">
                            ${pair1Display}
                        </div>
                    </div>
                    <div class="pairing-player">
                        <img
                            class="dashboard-player-photo"
                            src="images/players/${pair2Photo}.png"
                            alt="${pair2Display}"
                            onerror="this.src='images/players/playerplaceholder.png'">
                        <div class="pairing-name">
                            ${pair2Display}
                        </div>
                    </div>
                </div>
            </div>
            <div class="dashboard-card lineup-card" onclick="window.location.href='lineups.html'">
                <h3>Best Lineup</h3>
                <br>
                ${topLineup.DIFF > 0 ? "+" : ""}${topLineup.DIFF}
                <div class="lineup-players">
                    ${lineupHtml}
                </div>
            </div>

            <div class="dashboard-card leaders-card">
                <h3>Team Leaders</h3>
                <div class="leaders-grid">
                    <div class="leader-item" onclick="window.location.href='player.html?player=${encodeURIComponent(scoringLeader.Player)}'">
                        <img class="dashboard-player-photo" src="images/players/${scoringPhoto}.png" alt="Player Photo" onerror="this.src='images/players/playerplaceholder.png'">
                        <div class="leader-title">
                            Scoring Leader
                        </div>
                        <div class="leader-name">
                            ${cleanName(scoringLeader.Player)}
                        </div>
                        <div class="leader-stat">
                            ${scoringLeader.PPG.toFixed(1)} PPG
                        </div>
                    </div>
                    <div class="leader-item" onclick="window.location.href='player.html?player=${encodeURIComponent(reboundLeader.Player)}'">
                        <img class="dashboard-player-photo" src="images/players/${reboundPhoto}.png" alt="Player Photo" onerror="this.src='images/players/playerplaceholder.png'">
                        <div class="leader-title">
                            Rebounding Leader
                        </div>
                        <div class="leader-name">
                            ${cleanName(reboundLeader.Player)}
                        </div>
                        <div class="leader-stat">
                            ${reboundLeader.RPG.toFixed(1)} RPG
                        </div>
                    </div>
                    <div class="leader-item" onclick="window.location.href='player.html?player=${encodeURIComponent(assistLeader.Player)}'">
                        <img class="dashboard-player-photo" src="images/players/${assistPhoto}.png" alt="Player Photo" onerror="this.src='images/players/playerplaceholder.png'">
                        <div class="leader-title">
                            Assists Leader
                        </div>
                        <div class="leader-name">
                            ${cleanName(assistLeader.Player)}
                        </div>
                        <div class="leader-stat">
                            ${assistLeader.APG.toFixed(2)} APG
                        </div>
                    </div>
                    <div class="leader-item" onclick="window.location.href='player.html?player=${encodeURIComponent(stealLeader.Player)}'">
                        <img class="dashboard-player-photo" src="images/players/${stealPhoto}.png" alt="Player Photo" onerror="this.src='images/players/playerplaceholder.png'">
                        <div class="leader-title">
                            Steals Leader
                        </div>
                        <div class="leader-name">
                            ${cleanName(stealLeader.Player)}
                        </div>
                        <div class="leader-stat">
                            ${stealLeader.SPG.toFixed(2)} SPG
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

loadDashboard();