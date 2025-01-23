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
let HTMLElmCell; // proměnná, které bude přiřazeno dvourozměrné pole, které bude v prvcích obsahovat odkazy na html element dom objekty každé buňky grid containeru hrací plochy
const value = {
    dimensionOfPlaygroundX: {
        min: "3",
        max: "45",
        default: "15",
        actual: 15, // typ "number"
    },
    dimensionOfPlaygroundY: {
        min: "3",
        max: "45",
        default: "15",
        actual: 15,
    },
    numberOfWinningCirclesOrCrosses: {
        min: "3",
        max: "8",
        default: "5",
        actual: 5,
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
// *** nastavení hodnot trvalých a počátečních *** //
function setDefaultAndLimitGameValues() {
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
setDefaultAndLimitGameValues();
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
    // uložení (uživatelem) aktuálně zvolených hodnot
    value.dimensionOfPlaygroundX.actual = Math.round(HTMLElm.input.dimensionOfPlaygroundX.value * 1); // v html je "input type='number'" tj. input hodnotou bude string obsahující číslo, celé i desetinné (s desetinnou tečkou), i obsahující zbytečné nuly na začátku - se zbytečnými nulami si poradí *1 a převede řetězec na číslo bez nul na začátku, necelou část zaokrouhlí "Math.round()"
    value.dimensionOfPlaygroundY.actual = Math.round(HTMLElm.input.dimensionOfPlaygroundY.value * 1);
    value.numberOfWinningCirclesOrCrosses.actual = Math.round(HTMLElm.input.numberOfWinningCirclesOrCrosses.value * 1);
    const dimX = value.dimensionOfPlaygroundX.actual;
    const dimY = value.dimensionOfPlaygroundY.actual;
    // podle hodnot dimX a dimY nastavení uspořádání buněk v grid containeru hrací plochy, aby jich bylo v řadě právě "x" a ve sloupci právě "y"
    HTMLElm.div.ticTacToeGridContainer.style.gridTemplateColumns = `repeat(${dimX},30px)`; // podle hodnoty "dimX" nastavuje css styl grid containeru hrací plochy na "grid-template-columns: repeat(dimX,30px)"
    HTMLElm.div.ticTacToeGridContainer.style.gridTemplateRows = `repeat(${dimY},30px)`;
    // vyplnění grid containeru hrací plochy buňkami a současně vytvoření dvourozměrného pole, nesoucího odkazy na html dom objekty buněk
    HTMLElm.div.ticTacToeGridContainer.innerHTML = ""; // při prvním startu v grid containeru hrací plochy nejsou žádné elementy, pro další starty odstraní vytvořené předchozím startem
    HTMLElmCell = []; // s každým startem je vytvořeno nové pole (které v každém prvku ponese odkaz na vnitřní pole a v něm odkazy na html dom objekty buněk) a odkaz na něj je přiřazen proměnné "HTMLElmCell" (při prvním startu zde žádné (vnější) pole není, při dalších je nahrazen odkaz na předchozí (vnější) odkazem na (vždy) nové)
    for (let i = 0; i < dimY; i++) {
        HTMLElmCell[i] = []; // prvku [i] je přiřazena hodnota, kterou je odkaz na nově vytvořené vnitřní pole, aby do něj bylo možné (kódem níže viz "HTMLElmCell[i][j]") vkládat prvky s hodnotami
        for (let j = 0; j < dimX; j++) {
            const newDiv = document.createElement("div"); // tvoří nový html dom objekt <div> elementu, buňky grid containeru
            newDiv.setAttribute("data-i", `${i}`); // každý <div> a buňka má atribut "data-i" a "data-j", mající v hodnotě číslo řádku (i) a sloupce (j) (očíslování začíná nulou)
            newDiv.setAttribute("data-j", `${j}`);
            HTMLElm.div.ticTacToeGridContainer.appendChild(newDiv);
            HTMLElmCell[i][j] = newDiv; // vkládá současně odkazy na nově vytvářené html dom objekty buněk do dvourozměrné pole "HTMLElmCell" (do prvků pole [0][0] [0][1] [0][2] ... [1][0] [1][1] [1][2] ... ...), tak jak budou skrze css styly grid containeru seřazeny i v html
        }
    }
    value.whoIsTurn = Math.floor(Math.random() * 2); // náhodná hodnota 0|1 (začíná kolečko nebo křížek)
    if (value.whoIsTurn) { // před prvním tahem zobrazí, zda-li táhnou kolečka nebo křížky, tj. i kdo začíná
        displayInHTMLIsTurnOfCrossPlayer();
    }
    else {
        displayInHTMLIsTurnOfCirclePlayer();
    }
    HTMLElm.div.ticTacToeGridContainer.addEventListener("click", gridContainerClick); // při každém startu se event listener grid containeru přidává znova, poněvadž po výhře je oddělán, aby hráči nemohli dále táhnout
}
// *** definování kódu průběhu hry *** //
start(); // uživateli se první hra spustí sama (s defaultními hodnotami, které kód dříve nastavil do příslušných html elementů)
function gridContainerClick(event) {
    const target = event.target;
    if (target === HTMLElm.div.ticTacToeGridContainer)
        return; // když uživatel klikl na grid container v místě, kde se nenachází buňka/grid_item, tj. klikl do mezery v okolí buněk (tehdy "event.target" odkazuje na grid container, nikoliv buňku/grid_item)
    if (target.classList.contains(value.circle.className) || target.classList.contains(value.cross.className))
        return; // když uživatel klikl na grid container v místě, kde se nachází buňka/grid_item, ale v buňce již je nakresleno kolečko nebo křížek
    fillClickedCellWithCircleOrCross(target);
}
function fillClickedCellWithCircleOrCross(clickedCell) {
    if (value.whoIsTurn === 0) {
        clickedCell.classList.add(value.circle.className); // přidá buňce/grid_itemu css třídu, která v buňce vykreslí kroužek
        afterCircleDrawn(clickedCell);
    }
    else {
        clickedCell.classList.add(value.cross.className);
        afterCrossDrawn(clickedCell);
    }
}
function afterCircleDrawn(clickedCell) {
    if (checkWin(clickedCell, value.circle.className)) { // pokud právě nakresleným kolečkem hráč mající kolečka vyhrál
        setTimeout(() => alert(`vyhrál ${value.circle.playerName}`), 5); // bez "setTimeout" se "alert" zpráva zobrazí ještě před namalováním kolečka
        HTMLElm.div.ticTacToeGridContainer.removeEventListener("click", gridContainerClick);
        return;
    }
    value.whoIsTurn = 1; // změní hráče z circle "0" na cross "1"
    displayInHTMLIsTurnOfCrossPlayer(); // změnu hráče zobrazí v html
}
function afterCrossDrawn(clickedCell) {
    if (checkWin(clickedCell, value.cross.className)) {
        setTimeout(() => alert(`vyhrál ${value.cross.playerName}`), 5);
        HTMLElm.div.ticTacToeGridContainer.removeEventListener("click", gridContainerClick);
        return;
    }
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
// *** vyhodnocení vítěze *** //
function checkWin(clickedCell, playerWhoClickedCellClassName) {
    const dimX = value.dimensionOfPlaygroundX.actual; // rozměr "x" hrací plochy
    const dimY = value.dimensionOfPlaygroundY.actual;
    const clickedCell_i = clickedCell.dataset.i * 1; // "i" je číslo/index řádku buňky
    const clickedCell_j = clickedCell.dataset.j * 1; // "j" je číslo/index sloupce buňky
    // check horizontal (dimX, clickedCell_i, clickedCell_j)
    let count = 1; // počítá počet buněk v řadě, v kterých má hráč svůj znak; začíná od hodnoty "1", neboť se ověřuje jen okolí kliknuté buňky, v které samotné je již jeden znak
    for (let i = clickedCell_i, j = clickedCell_j + 1; j < dimX; j++) {
        if (HTMLElmCell[i][j].classList.contains(playerWhoClickedCellClassName))
            count++;
        else
            break;
    }
    for (let i = clickedCell_i, j = clickedCell_j - 1; j > -1; j--) {
        if (HTMLElmCell[i][j].classList.contains(playerWhoClickedCellClassName))
            count++;
        else
            break;
    }
    if (count >= value.numberOfWinningCirclesOrCrosses.actual)
        return true;
    // check vertical (dimY, clickedCell_i, clickedCell_j)
    count = 1;
    for (let i = clickedCell_i + 1, j = clickedCell_j; i < dimY; i++) {
        if (HTMLElmCell[i][j].classList.contains(playerWhoClickedCellClassName))
            count++;
        else
            break;
    }
    for (let i = clickedCell_i - 1, j = clickedCell_j; i > -1; i--) {
        if (HTMLElmCell[i][j].classList.contains(playerWhoClickedCellClassName))
            count++;
        else
            break;
    }
    if (count >= value.numberOfWinningCirclesOrCrosses.actual)
        return true;
    // check left top to right bottom (dimX, dimY, clickedCell_i, clickedCell_j)
    count = 1;
    for (let i = clickedCell_i + 1, j = clickedCell_j + 1; i < dimY && j < dimX; i++, j++) {
        if (HTMLElmCell[i][j].classList.contains(playerWhoClickedCellClassName))
            count++;
        else
            break;
    }
    for (let i = clickedCell_i - 1, j = clickedCell_j - 1; i > -1 && j > -1; i--, j--) {
        if (HTMLElmCell[i][j].classList.contains(playerWhoClickedCellClassName))
            count++;
        else
            break;
    }
    if (count >= value.numberOfWinningCirclesOrCrosses.actual)
        return true;
    // check right top to left bottom (dimX, dimY, clickedCell_i, clickedCell_j)
    count = 1;
    for (let i = clickedCell_i + 1, j = clickedCell_j - 1; i < dimY && j > -1; i++, j--) {
        if (HTMLElmCell[i][j].classList.contains(playerWhoClickedCellClassName))
            count++;
        else
            break;
    }
    for (let i = clickedCell_i - 1, j = clickedCell_j + 1; i > -1 && j < dimX; i--, j++) {
        if (HTMLElmCell[i][j].classList.contains(playerWhoClickedCellClassName))
            count++;
        else
            break;
    }
    if (count >= value.numberOfWinningCirclesOrCrosses.actual)
        return true;
    return false;
}
