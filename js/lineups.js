async function loadLineups() {

    const response =
        await fetch(dataPath("lineups.json"));

    const lineups =
        await response.json();

    const container =
        document.getElementById(
            "lineups-container"
        );

    const cleanName = name =>
        name.replace(/^.*?#?\d+\s*/, "");

    const photoName = name =>
        cleanName(name)
            .toLowerCase()
            .replaceAll(".", "")
            .replaceAll(" ", "_");

    const eligibleLineups =
        lineups.filter(
            lineup => lineup.POSS >= 10
        );

    eligibleLineups.sort(
        (a, b) => b.NET_RTG - a.NET_RTG
    );

    let html = "";

    eligibleLineups.slice(0, 10).forEach((lineup, index) => {
        const lineupPlayers =
            lineup.lineup.split(",");
        
        let lineupPlayersHtml = "";

        lineupPlayers.forEach(player => {
            const playerDisplay =
                cleanName(player.trim());
            const playerPhoto =
                photoName(player);

            lineupPlayersHtml += `
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
            

        html += `
            <div class="card lineup-card">
                <div class="lineup-players">
                    ${lineupPlayersHtml}
                </div>
                <div class="plus-minus">
                    ${lineup.NET_RTG.toFixed(1)}
                </div>
            <div class="pairing-stat-grid">
                <div class="pairing-stat">
                    <div class="pairing-stat-label">PF</div>
                    <div>${lineup.PF}</div>
                </div>
                <div class="pairing-stat">
                    <div class="pairing-stat-label">PA</div>
                    <div>${lineup.PA}</div>
                </div>
                <div class="pairing-stat">
                    <div class="pairing-stat-label">FG</div>
                    <div>${lineup.MadeFG}</div>
                </div>
                <div class="pairing-stat">
                    <div class="pairing-stat-label">REB</div>
                    <div>${lineup.Rebounds}</div>
                </div>
                <div class="pairing-stat">
                    <div class="pairing-stat-label">AST</div>
                    <div>${lineup.Assists}</div>
                </div>
                <div class="pairing-stat">
                    <div class="pairing-stat-label">STL</div>
                    <div>${lineup.Steals}</div>
                </div>
                <div class="pairing-stat">
                    <div class="pairing-stat-label">BLK</div>
                    <div>${lineup.Blocks}</div>
                </div>
                <div class="pairing-stat">
                    <div class="pairing-stat-label">TO</div>
                    <div>${lineup.Turnovers}</div>
                </div>
            </div>
        </div>
    `;
    });

    container.innerHTML = html;
}

loadLineups();