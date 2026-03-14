"use strict";
// *** definování vstupů *** //
const HTMLElm = {
    span: {
        displayingWhoIsTurn: document.getElementById("span-displaying-who-is-turn"),
    },
    input: {
        dimensionOfPlaygroundX: document.getElementById("input-dimension-of-playground-x"),
        dimensionOfPlaygroundY: document.getElementById("input-dimension-of-playground-y"),
        numberOfWinningCirclesOrCrosses: document.getElementById("input-number-of-winning-circles-or-crosses"),
    },
    button: {
        start: document.getElementById("button-start"),
    },
    div: {
        ticTacToeGridContainer: document.getElementById("div-tic-tac-toe-grid-container"),
    },
};
const value = {
    dimensionOfPlaygroundX: {
        min: "3",
        max: "45",
        default: "15",
    },
    dimensionOfPlaygroundY: {
        min: "3",
        max: "45",
        default: "15",
    },
    numberOfWinningCirclesOrCrosses: {
        min: "3",
        max: "8",
        default: "5",
    },
    circle: {
        playerName: "Modrý hráč",
        styleColor: "blue",
        className: "circle", // "circle" a "cross" jsou názvy css tříd; třída "circle" způsobí vyplnění buňky kolečkem, "cross" krížkem
    },
    cross: {
        playerName: "Zelený hráč",
        styleColor: "green",
        className: "cross",
    },
    whoIsTurn: 0, // hodnota 0/1 určuje, zda-li táhne kolečko "0" nebo křížek "1"
};
// *** nastavení hodnot, trvalých a počátečních *** //
function setGameValues() {
    // defaultní hodnoty, které uživatel může měnit
    HTMLElm.input.dimensionOfPlaygroundX.value = value.dimensionOfPlaygroundX.default; // html elementům input nastaví atribut "value" na defaultní hodnotu
    HTMLElm.input.dimensionOfPlaygroundY.value = value.dimensionOfPlaygroundY.default;
    HTMLElm.input.numberOfWinningCirclesOrCrosses.value = value.numberOfWinningCirclesOrCrosses.default;
    // limitní hodnoty, které uživatel měnit nemůže
    HTMLElm.input.dimensionOfPlaygroundX.min = value.dimensionOfPlaygroundX.min; // html elementům input nastaví atributy "min" a "max"
    HTMLElm.input.dimensionOfPlaygroundX.max = value.dimensionOfPlaygroundX.max;
    HTMLElm.input.dimensionOfPlaygroundY.min = value.dimensionOfPlaygroundY.min;
    HTMLElm.input.dimensionOfPlaygroundY.max = value.dimensionOfPlaygroundY.max;
    HTMLElm.input.numberOfWinningCirclesOrCrosses.min = value.numberOfWinningCirclesOrCrosses.min;
    HTMLElm.input.numberOfWinningCirclesOrCrosses.max = value.numberOfWinningCirclesOrCrosses.max;
}
setGameValues();
// *** definování tlačítka pro start hry, které podle rozměrů X a Y vykreslí hrací plochu *** //
HTMLElm.button.start.addEventListener("click", start);
function start() {
    // pokud uživatel určil hodnoty vně min/max, nastaví min/max
    if (HTMLElm.input.dimensionOfPlaygroundX.value * 1 < value.dimensionOfPlaygroundX.min * 1)
        HTMLElm.input.dimensionOfPlaygroundX.value = value.dimensionOfPlaygroundX.min;
    if (HTMLElm.input.dimensionOfPlaygroundX.value * 1 > value.dimensionOfPlaygroundX.max * 1)
        HTMLElm.input.dimensionOfPlaygroundX.value = value.dimensionOfPlaygroundX.max;
    if (HTMLElm.input.dimensionOfPlaygroundY.value * 1 < value.dimensionOfPlaygroundY.min * 1)
        HTMLElm.input.dimensionOfPlaygroundY.value = value.dimensionOfPlaygroundY.min;
    if (HTMLElm.input.dimensionOfPlaygroundY.value * 1 > value.dimensionOfPlaygroundY.max * 1)
        HTMLElm.input.dimensionOfPlaygroundY.value = value.dimensionOfPlaygroundY.max;
    if (HTMLElm.input.numberOfWinningCirclesOrCrosses.value * 1 < value.numberOfWinningCirclesOrCrosses.min * 1)
        HTMLElm.input.numberOfWinningCirclesOrCrosses.value = value.numberOfWinningCirclesOrCrosses.min;
    if (HTMLElm.input.numberOfWinningCirclesOrCrosses.value * 1 > value.numberOfWinningCirclesOrCrosses.max * 1)
        HTMLElm.input.numberOfWinningCirclesOrCrosses.value = value.numberOfWinningCirclesOrCrosses.max;
    const x = Math.round(HTMLElm.input.dimensionOfPlaygroundX.value * 1); // v html je "input type='number'" tj. input hodnotou bude string obsahující číslo, celé i desetinné (s desetinnou tečkou), i obsahující zbytečné nuly na začátku - se zbytečnými nulami si poradí *1 a převede řetězec na číslo bez nul na začátku, necelou část zaokrouhlí "Math.round()"
    const y = Math.round(HTMLElm.input.dimensionOfPlaygroundY.value * 1);
    HTMLElm.div.ticTacToeGridContainer.style.gridTemplateColumns = `repeat(${x},30px)`; // podle hodnoty "x" nastavuje css styl grid containeru hrací plochy na "grid-template-columns: repeat(x,30px)"
    HTMLElm.div.ticTacToeGridContainer.style.gridTemplateRows = `repeat(${y},30px)`;
    let gridCellsString = ""; // vyplňuje grid container hrací plochy buňkami
    for (let i = 0; i < y; i++) {
        for (let j = 0; j < x; j++) {
            gridCellsString += `<div data-i="${i}" data-j="${j}"></div>`;
        }
    }
    HTMLElm.div.ticTacToeGridContainer.innerHTML = gridCellsString;
    value.whoIsTurn = Math.floor(Math.random() * 2); // náhodná hodnota 0|1 (začíná kolečko nebo křížek)
    if (value.whoIsTurn) { // před prvním tahem zobrazí, zda-li táhnou kolečka nebo křížky, tj. i kdo začíná
        displayInHTMLIsTurnOfCrossPlayer();
    }
    else {
        displayInHTMLIsTurnOfCirclePlayer();
    }
}
// *** definování kódu průběhu hry *** //
start(); // uživateli se první hra spustí sama (s defaultními hodnotami, které kód dříve nastavil do příslušných html elementů)
HTMLElm.div.ticTacToeGridContainer.addEventListener("click", function (event) {
    const target = event.target;
    if (target === HTMLElm.div.ticTacToeGridContainer)
        return; // když uživatel klikl na grid container v místě, kde se nenachází buňka/grid_item, tj. klikl do mezery v okolí buněk (tehdy "event.target" odkazuje na grid container, nikoliv buňku/grid_item)
    if (target.classList.contains(value.circle.className) || target.classList.contains(value.cross.className))
        return; // když uživatel klikl na grid container v místě, kde se nachází buňka/grid_item, ale v buňce již je nakresleno kolečko nebo křížek
    fillCellWithCircleOrCross(target);
});
function fillCellWithCircleOrCross(cell) {
    if (value.whoIsTurn === 0) {
        cell.classList.add(value.circle.className); // přidá buňce/grid_itemu css třídu, která v buňce vykreslí kroužek
        afterCircleDrawn();
    }
    else {
        cell.classList.add(value.cross.className);
        afterCrossDrawn();
    }
}
function afterCircleDrawn() {
    value.whoIsTurn = 1; // změní hráče z circle "0" na cross "1"
    displayInHTMLIsTurnOfCrossPlayer(); // změnu hráče zobrazí v html
}
function afterCrossDrawn() {
    value.whoIsTurn = 0;
    displayInHTMLIsTurnOfCirclePlayer();
}
function displayInHTMLIsTurnOfCirclePlayer() {
    HTMLElm.span.displayingWhoIsTurn.innerHTML = value.circle.playerName;
    HTMLElm.span.displayingWhoIsTurn.style.color = value.circle.styleColor;
}
function displayInHTMLIsTurnOfCrossPlayer() {
    HTMLElm.span.displayingWhoIsTurn.innerHTML = value.cross.playerName;
    HTMLElm.span.displayingWhoIsTurn.style.color = value.cross.styleColor;
}
