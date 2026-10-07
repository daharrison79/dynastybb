async function loadPlayer() {

    const params =
        new URLSearchParams(
            window.location.search
        );

    const playerName =
        params.get("player");

    const response =
        await fetch(dataPath("players.json"));

    const players =
        await response.json();
    
    const gameResponse =
        await fetch(dataPath("player_game_stats.json"));

    const gameStats =
        await gameResponse.json();

    const shotResponse =
        await fetch(dataPath("shots.json"));

    const shots =
        await shotResponse.json();

    const player =
        players.find(
            p => p.Player === playerName
        );

    const playerGames =
        gameStats.filter(
                g => g.Player === playerName
            );

    const playerShots =
            shots.filter(
                s => s.Player.trim() === playerName.trim()
            );
    window.playerShots = playerShots;
    window.currentFilteredShots = playerShots;
    window.currentShotFilter = "All Games";
    console.log("Selected Player:", playerName);
    console.log("Shots Found:", playerShots.length);
    
    const container =
        document.getElementById(
            "player-details"
        );

    if (!player) {

        container.innerHTML =
            "<p>Player not found.</p>";

        return;
    }

    let gameLogHtml = "";

    playerGames.forEach(game => {
        gameLogHtml += `
            <div class="game-log-entry" onclick="filterGame('${game.GameFolder}')">
                <strong>
                    ${game.Date}
                </strong>
                <span>
                    ${game.Opponent}
                </span>
                <span>
                    <strong>${game.Result}</strong>
                </span>
                <span>
                    PTS: ${game.PTS}
                </span>
                <span>
                    REB: ${game.REB}
                </span>
                <span>
                    AST: ${game.AST}
                </span>
                <span>
                    <strong>DIFF: ${game.DIFF > 0 ? "+" : ""}${game.DIFF}</strong>
                </span>
            </div>
        `;
    });

    container.innerHTML = `
        <div class="player-header">
            <div class="player-photo">
                <img
                    src="images/players/playerplaceholder.png"
                    alt="Player Photo">
            </div>
            <div class="player-profile">
                <h2>${player.Player}</h2>
                <p>
                    Games: ${player.Games}
                </p>
                <div class="profile-grid">
                    <div>
                        <h4>Season Averages Per Game</h4>
                        <p><span>Points: </span><span>${player.PPG.toFixed(1)}</span></p>
                        <p><span>Rebounds: </span><span>${player.RPG.toFixed(1)}</span></p>
                        <p><span>Assists: </span><span>${player.APG.toFixed(1)}</span></p>
                        <p><span>Steals: </span><span>${player.SPG.toFixed(1)}</span></p>
                        <p><span>Blocks: </span><span>${player.BPG.toFixed(1)}</span></p>
                        <p><span>Turnovers: </span><span>${player.TOPG.toFixed(1)}</span></p>
                        <p><span>Fouls: </span><span>${player.FPG.toFixed(1)}</span></p>
                        <p><span>EFF/G:</span><span>${player.EFF_PG.toFixed(1)}</span></p>
                    </div>
                    <div>
                        <h4>Shooting Stats</h4>
                        <p><span>FG%: </span><span>${(player.FG_PCT * 100).toFixed(1)}%</span></p>
                        <p><span>3PT%: </span><span>${isNaN(player.THREE_PCT) ? "-" : `${(player.THREE_PCT * 100).toFixed(1)}%`}</span></p>
                        <p><span>FT%: </span><span>${(player.FT_PCT * 100).toFixed(1)}%</span></p>
                        <p><span>eFG%: </span><span>${(player.eFG_PCT * 100).toFixed(1)}%</span></p>
                        <p><span>TS%: </span><span>${(player.TS_PCT * 100).toFixed(1)}%</span></p>
                    </div>
                    <div>
                        <h4>Season Totals</h4>
                        <p><span>PTS: </span><span>${player.PTS_Total}</span></p>
                        <p><span>REB: </span><span>${player.REB_Total}</span></p>
                        <p><span>AST: </span><span>${player.AST_Total}</span></p>
                        <p><span>NetRtg: </span><span>${player.NET_RTG.toFixed(1)}</span></p>
                        <p><span>EFF:</span><span>${player.EFF}</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="stat-section">
            <h3>Game Log</h3>
            <button
                onclick="showAllShots()">
                All Games
            </button>
            <div class="game-log-container">
                ${gameLogHtml}
            </div>
        </div>
        <div class="stat-section">
            <h3>Shot Chart</h3>
            <p id="current-shot-filter">
                Showing: All Games
            </p>
            <div id="shot-summary">
                Loading shot summary...
            </div>
            <div
                id="shot-chart-container" class="shot-chart-container">
                <img src="images/court.png" alt="Basketball Court">
            </div>
        </div>

        <div class="stat-section">
            <h3>Zone Efficiency</h3>
            <div id="zone-heatmap" class="shot-chart-container">
            <img src="images/zone_court.png" alt="Zone Heat Map Court">
            <div id="zone-overlay">
            </div>
        </div>
    </div>
    `;

    const shotContainer =
        document.getElementById(
            "shot-chart-container"
        );
    if (shotContainer) {
        renderShots(
            window.currentFilteredShots,
            shotContainer
        );
    }
    updateShotSummary(
        playerShots
    );
    renderZoneHeatMap(
        window.currentFilteredShots,
        "zone-overlay"
    );
}

loadPlayer();

function renderShots(shots, shotContainer) {
    shotContainer.innerHTML = `
        <img src="images/court.png" alt=court>
    `;
    shots.forEach(shot => {
        const marker =
            document.createElement("div");
        marker.classList.add(
            "shot-marker"
        );
        if (shot.Made === 1) {
            marker.classList.add(
                "shot-made"
            );
        } else {
            marker.classList.add(
                "shot-missed"
            );
        }
        const left =
            (shot.CourtX / 50) * 100;

        const top =
            5 +
            ((shot.CourtY / 41) * 90);
        marker.style.left =
            `${left}%`;
        marker.style.top =
            `${top}%`;
        marker.title =
            `${classifyShotZone(shot)}
            | ${shot.Made ? "Made" : "Missed"}
            | X:${shot.CourtX}
            | Y:${shot.CourtY}`;
        shotContainer.appendChild(
            marker
        );
    });
}

function updateShotSummary(shots) {
    const summary =
        document.getElementById(
            "shot-summary"
        );
    if (!summary) {
        return;
    }
    const attempts =
        shots.length;
    const makes =
        shots.filter(
            shot => shot.Made === 1
        ).length;
    const fgPct =
        attempts === 0
            ? 0
            : (
                (makes / attempts)
                * 100
            ).toFixed(1);
    summary.innerHTML = `
        <p>
            Attempts:
            ${attempts}
        </p>
        <p>
            Makes:
            ${makes}
        </p>
        <p>
            FG%:
            ${fgPct}%
        </p>
    `;
}

function filterGame(gameFolder) {
    const shotContainer =
        document.getElementById(
            "shot-chart-container"
        );
    if (!shotContainer) {
        return;
    }
    const label =
        document.getElementById(
            "current-shot-filter"
        );
    if (label) {
        label.textContent =
            `Showing: ${gameFolder}`;
    }
    window.currentFilteredShots =
        window.playerShots.filter(
                shot =>
                    shot.GameFolder === gameFolder
        );

    renderShots(
        window.currentFilteredShots,
        shotContainer
    );
    updateShotSummary(
        window.currentFilteredShots
    );
    renderZoneHeatMap(
        window.currentFilteredShots,
        "zone-overlay"
    );
}

function showAllShots() {
    const shotContainer =
        document.getElementById(
            "shot-chart-container"
        );
    if (!shotContainer) {
        return;
    }
    const label =
        document.getElementById(
            "current-shot-filter"
        );
    if (label) {
        label.textContent =
            "Showing: All Games";
    }
    
    window.currentFilteredShots =
        window.playerShots;
    renderShots(
        window.currentFilteredShots,
        shotContainer
    );
    updateShotSummary(
        window.playerShots
    );
    renderZoneHeatMap(
        window.currentFilteredShots,
        "zone-overlay"
    );
}

