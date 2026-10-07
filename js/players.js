async function loadPlayers() {

    const response =
        await fetch(dataPath("players.json"));

    const players =
        await response.json();

    const container =
        document.getElementById("players-container");

    let html = "";

    players.forEach(player => {
        const playerPhoto =
            player.Player
                .replace(/^.*?#?\d+\s*/, "")
                .toLowerCase()
                .replaceAll(".", "")
                .replaceAll(" ", "_");

        html += `
            <div
                class="card player-card"
                onclick="openPlayer('${player.Player}')"
            >

                <h3>${player.Player}</h3>
                <img
                    class="player-list-photo"
                    src="images/players/${playerPhoto}.png"
                    alt="${player.Player}"
                    onerror="this.src='images/players/playerplaceholder.png'">
                <p class="plus-minus">
                    ${player.NET_RTG.toFixed(1)}
                </p>

                <p>GP: ${player.Games}</p>

                <p>PPG: ${player.PPG.toFixed(1)}</p>

                <p>RPG: ${player.RPG.toFixed(1)}</p>

                <p>APG: ${player.APG.toFixed(1)}</p>

                <p>FG%: ${(player.FG_PCT * 100).toFixed(1)}%</p>

                <p>3PT%: ${isNaN(player.THREE_PCT) ? "-" : `${(player.THREE_PCT * 100).toFixed(1)}%`}</p>
            </div>
        `;
    });

    container.innerHTML = html;
}

function openPlayer(playerName) {

    const encodedName =
        encodeURIComponent(playerName);

    window.location.href =
        `player.html?player=${encodedName}`;
}

loadPlayers();