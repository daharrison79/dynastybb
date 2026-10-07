async function loadPairings() {

    const response =
        await fetch(dataPath("pairings.json"));

    const pairings =
        await response.json();

    const container =
        document.getElementById(
            "pairings-container"
        );

    let html = "";
    
    const cleanName = name =>
        name.replace(/^.*?#?\d+\s*/, "");

    const photoName = name =>
        cleanName(name)
            .toLowerCase()
            .replaceAll(".", "")
            .replaceAll(" ", "_");


    pairings.sort((a, b) => b.NET_RTG - a.NET_RTG);

    const eligiblePairings =
        pairings.filter(
            pair => pair.POSS >= 50
        );

    eligiblePairings.sort(
        (a, b) => b.NET_RTG - a.NET_RTG
    );

    eligiblePairings
        .slice(0, 15)
        .forEach((pair, index) => {
            const player1Display =
                cleanName(pair.Player1);
            const player2Display =
                cleanName(pair.Player2);
            const pair1Photo =
                photoName(pair.Player1);
            const pair2Photo =
                photoName(pair.Player2);

        html += `
            <div class="card pairing-card">
                <div class="pairing-players">
                    <div class="pairing-player">
                        <img
                            class="dashboard-player-photo"
                            src="images/players/${pair1Photo}.png"
                            alt="${player1Display}"
                            onerror="this.src='images/players/playerplaceholder.png'">
                        <div class="pairing-name">
                            ${player1Display}
                        </div>
                    </div>
                    <div class="pairing-player">
                        <img
                            class="dashboard-player-photo"
                            src="images/players/${pair2Photo}.png"
                            alt="${player2Display}"
                            onerror="this.src='images/players/playerplaceholder.png'">
                        <div class="pairing-name">
                            ${player2Display}
                        </div>
                    </div>
                </div>
                <div class="plus-minus">
                    ${pair.NET_RTG.toFixed(1)}
                </div>      
                    <div class="pairing-stat-grid">
                        <div class="pairing-stat">
                            <div class="pairing-stat-label">PF
                            </div>
                            <div>
                                ${pair.PF}
                            </div>
                        </div>
                        <div class="pairing-stat">
                            <div class="pairing-stat-label">PA
                            </div>
                            <div>
                                ${pair.PA}
                            </div>
                        </div>
                        <div class="pairing-stat">
                            <div class="pairing-stat-label">FG
                            </div>
                            <div>
                                ${pair.FG}
                            </div>
                        </div>
                        <div class="pairing-stat">
                            <div class="pairing-stat-label">REB
                            </div>
                            <div>
                                ${pair.REB}
                            </div>
                        </div>
                        <div class="pairing-stat">
                            <div class="pairing-stat-label">AST
                            </div>
                            <div>
                                ${pair.AST}
                            </div>
                        </div>
                        <div class="pairing-stat">
                            <div class="pairing-stat-label">STL
                            </div>
                            <div>
                                ${pair.STL}
                            </div>
                        </div>
                        <div class="pairing-stat">
                            <div class="pairing-stat-label">BLK
                            </div>
                            <div>
                                ${pair.BLK}
                            </div>
                        </div>
                        <div class="pairing-stat">
                            <div class="pairing-stat-label">TO
                            </div>
                            <div>
                                ${pair.TO}
                            </div>
                        </div>
                    </div>
            </div>
            `;
    });
    container.innerHTML = html;
}

loadPairings();