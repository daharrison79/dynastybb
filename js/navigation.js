function buildNavigation() {
    return `
        <div id="data-selectors">
            <label>
                Season:
                <select id="season-selector">
                    <option value="2026">2026</option>
                    //<option value="2027">2027</option>
                </select>
            </label>
            <label>
                Team:
                <select id="team-selector">
                    <option value="13-14">13-14</option>
                    //<option value="12">12</option>
                </select>
            </label>
        </div>

        <nav>
            <a href="index.html">Home</a>
            <a href="team.html">Team</a>
            <a href="players.html">Players</a>
            <a href="pairings.html">Pairings</a>
            <a href="lineups.html">Lineups</a>
        </nav>
    `;
}

document.addEventListener("DOMContentLoaded", function () {

    const navContainer =
        document.getElementById("navigation");

    if (navContainer) {
        navContainer.innerHTML =
            buildNavigation();
    }
    
    const seasonSelector =
        document.getElementById(
            "season-selector"
        );
    const teamSelector =
        document.getElementById(
            "team-selector"
        );
    if (seasonSelector) {
        seasonSelector.value =
            CURRENT_SEASON;
    }
    if (teamSelector) {
        teamSelector.value =
            CURRENT_TEAM;
    }

function reloadWithSelection() {
    const season =
        seasonSelector.value;
    const team =
        teamSelector.value;
    const currentPage =
        window.location.pathname
            .split("/")
            .pop();
    window.location.href =
        `${currentPage}?season=${season}&team=${team}`;
}
if (seasonSelector) {
    seasonSelector.addEventListener(
        "change",
        reloadWithSelection
    );
}

if (teamSelector) {
    teamSelector.addEventListener(
        "change",
        reloadWithSelection
    );
}
});
