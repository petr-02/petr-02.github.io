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
    style: function () {
        const styleElm = document.createElement("style");
        document.querySelector("head").appendChild(styleElm);
        return styleElm;
    }(), // fce je přímo zavolána a vrací odkaz na html element dom objekt style
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
        playerName: "Modrý hráč", // pro uživatele je hráč majícího kolečka/circle zobrazen také jako "Modrý hráč" (neboť i kolečka jsou modrá), hráč s krížky/crosses jako "Zelený hráč"
    },
    cross: {
        playerName: "Zelený hráč",
    },
    CSSStyle: {
        strikeLineColor: "rgb(10,10,10)",
        circleColor: "blue",
        crossColor: "green",
        gridColor: "DodgerBlue", // barva mřížky/grid grid containeru
    },
    CSSClass: {
        drawingCircle: "drawing-circle",
        drawingCross: "drawing-cross",
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
    // barva koleček, křížků a mřížky grid containeru
    HTMLElm.style.innerText += `#div-tic-tac-toe-grid-container {background-color: ${value.CSSStyle.gridColor} }`;
    HTMLElm.style.innerText += `.drawing-circle::before {border-color: ${value.CSSStyle.circleColor} }`;
    HTMLElm.style.innerText += `.drawing-cross::before {background-color: ${value.CSSStyle.crossColor} }`;
    HTMLElm.style.innerText += `.drawing-cross::after {background-color: ${value.CSSStyle.crossColor} }`;
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
    if (value.whoIsTurn)
        displayInHTMLIsTurnOfCrossPlayer(); // před prvním tahem zobrazí, zda-li táhnou kolečka nebo křížky, tj. i kdo začíná
    else
        displayInHTMLIsTurnOfCirclePlayer();
    HTMLElm.div.ticTacToeGridContainer.addEventListener("click", gridContainerClick); // při každém startu se event listener grid containeru přidává znova, poněvadž po výhře je oddělán, aby hráči nemohli dále táhnout
}
// *** definování kódu průběhu hry *** //
start(); // uživateli se první hra spustí sama (s defaultními hodnotami, které kód dříve nastavil do příslušných html elementů)
function gridContainerClick(event) {
    const target = event.target;
    if (target === HTMLElm.div.ticTacToeGridContainer)
        return; // když uživatel klikl na grid container v místě, kde se nenachází buňka/grid_item, tj. klikl do mezery v okolí buněk (tehdy "event.target" odkazuje na grid container, nikoliv buňku/grid_item)
    if (target.classList.contains(value.CSSClass.drawingCircle) || target.classList.contains(value.CSSClass.drawingCross))
        return; // když uživatel klikl na grid container v místě, kde se nachází buňka/grid_item, ale v buňce již je nakresleno kolečko nebo křížek
    if (value.whoIsTurn === 0)
        circlePlayerGo(target); // je-li na tahu hráč mající kolečka
    else
        crossPlayerGo(target);
}
function circlePlayerGo(clickedCell) {
    clickedCell.classList.add(value.CSSClass.drawingCircle); // přidá buňce/grid_itemu css třídu, která v buňce vykreslí kroužek
    const win = checkWinAndIfStrikeWinningSeriesAndReturnTrue(clickedCell, value.CSSClass.drawingCircle);
    if (win) { // pokud právě nakresleným kolečkem hráč mající kolečka vyhrál
        HTMLElm.span.displayingWhoIsTurn.innerText += " (vyhrál)";
        HTMLElm.div.ticTacToeGridContainer.removeEventListener("click", gridContainerClick);
        return;
    }
    value.whoIsTurn = 1; // změní hráče z circle "0" na cross "1"
    displayInHTMLIsTurnOfCrossPlayer(); // změnu hráče zobrazí v html
}
function crossPlayerGo(clickedCell) {
    clickedCell.classList.add(value.CSSClass.drawingCross);
    const win = checkWinAndIfStrikeWinningSeriesAndReturnTrue(clickedCell, value.CSSClass.drawingCross);
    if (win) {
        HTMLElm.span.displayingWhoIsTurn.innerText += " (vyhrál)";
        HTMLElm.div.ticTacToeGridContainer.removeEventListener("click", gridContainerClick);
        return;
    }
    value.whoIsTurn = 0;
    displayInHTMLIsTurnOfCirclePlayer();
}
function displayInHTMLIsTurnOfCirclePlayer() {
    HTMLElm.span.displayingWhoIsTurn.innerHTML = value.circle.playerName;
    HTMLElm.span.displayingWhoIsTurn.style.color = value.CSSStyle.circleColor;
}
function displayInHTMLIsTurnOfCrossPlayer() {
    HTMLElm.span.displayingWhoIsTurn.innerHTML = value.cross.playerName;
    HTMLElm.span.displayingWhoIsTurn.style.color = value.CSSStyle.crossColor;
}
// *** vyhodnocení vítěze a proškrtnutí vítězné série koleček/křížků *** //
function checkWinAndIfStrikeWinningSeriesAndReturnTrue(clickedCell, CSSClassDrawingSymbolOfPlayerWhoClickedCell) {
    const dimX = value.dimensionOfPlaygroundX.actual; // rozměr "x" hrací plochy
    const dimY = value.dimensionOfPlaygroundY.actual;
    const clickedCellI = clickedCell.dataset.i * 1; // "i" je číslo/index řádku buňky
    const clickedCellJ = clickedCell.dataset.j * 1; // "j" je číslo/index sloupce buňky
    let count = 0;
    count = countWinningSeriesHorizontal(dimX, clickedCellI, clickedCellJ, CSSClassDrawingSymbolOfPlayerWhoClickedCell);
    if (count >= value.numberOfWinningCirclesOrCrosses.actual) {
        strikeWinningSeriesHorizontal(dimX, clickedCellI, clickedCellJ, CSSClassDrawingSymbolOfPlayerWhoClickedCell);
        return true;
    }
    count = countWinningSeriesVertical(dimY, clickedCellI, clickedCellJ, CSSClassDrawingSymbolOfPlayerWhoClickedCell);
    if (count >= value.numberOfWinningCirclesOrCrosses.actual) {
        strikeWinningSeriesVertical(dimY, clickedCellI, clickedCellJ, CSSClassDrawingSymbolOfPlayerWhoClickedCell);
        return true;
    }
    count = countWinningSeriesLTtoRB(dimX, dimY, clickedCellI, clickedCellJ, CSSClassDrawingSymbolOfPlayerWhoClickedCell);
    if (count >= value.numberOfWinningCirclesOrCrosses.actual) {
        strikeWinningSeriesLTtoRB(dimX, dimY, clickedCellI, clickedCellJ, CSSClassDrawingSymbolOfPlayerWhoClickedCell);
        return true;
    }
    count = countWinningSeriesRTtoLB(dimX, dimY, clickedCellI, clickedCellJ, CSSClassDrawingSymbolOfPlayerWhoClickedCell);
    if (count >= value.numberOfWinningCirclesOrCrosses.actual) {
        strikeWinningSeriesRTtoLB(dimX, dimY, clickedCellI, clickedCellJ, CSSClassDrawingSymbolOfPlayerWhoClickedCell);
        return true;
    }
    return false;
}
function countWinningSeriesHorizontal(dimX, clickedCellI, clickedCellJ, CSSClassDrawingSymbolOfPlayerWhoClickedCell) {
    let count = 1; // počítá počet buněk v řadě, v kterých má hráč svůj znak; začíná od hodnoty "1", neboť se ověřuje jen okolí kliknuté buňky, v které samotné je již jeden znak
    for (let i = clickedCellI, j = clickedCellJ + 1; j < dimX; j++) {
        if (HTMLElmCell[i][j].classList.contains(CSSClassDrawingSymbolOfPlayerWhoClickedCell))
            count++;
        else
            break;
    }
    for (let i = clickedCellI, j = clickedCellJ - 1; j > -1; j--) {
        if (HTMLElmCell[i][j].classList.contains(CSSClassDrawingSymbolOfPlayerWhoClickedCell))
            count++;
        else
            break;
    }
    return count;
}
function strikeWinningSeriesHorizontal(dimX, clickedCellI, clickedCellJ, CSSClassDrawingSymbolOfPlayerWhoClickedCell) {
    for (let i = clickedCellI, j = clickedCellJ; j < dimX; j++) {
        if (HTMLElmCell[i][j].classList.contains(CSSClassDrawingSymbolOfPlayerWhoClickedCell)) {
            HTMLElmCell[i][j].style.position = "relative";
            HTMLElmCell[i][j].innerHTML = `<svg height='34' width='34' style="position:absolute;left:-2px;top:-2px;z-index:1;"> <line x1='0' y1='17' x2='34' y2='17' style='stroke:${value.CSSStyle.strikeLineColor};stroke-width:2;' /> </svg>`;
        }
        else
            break;
    }
    for (let i = clickedCellI, j = clickedCellJ - 1; j > -1; j--) {
        if (HTMLElmCell[i][j].classList.contains(CSSClassDrawingSymbolOfPlayerWhoClickedCell)) {
            HTMLElmCell[i][j].style.position = "relative";
            HTMLElmCell[i][j].innerHTML = `<svg height='34' width='34' style="position:absolute;left:-2px;top:-2px;z-index:1;"> <line x1='0' y1='17' x2='34' y2='17' style='stroke:${value.CSSStyle.strikeLineColor};stroke-width:2;' /> </svg>`;
        }
        else
            break;
    }
}
function countWinningSeriesVertical(dimY, clickedCellI, clickedCellJ, CSSClassDrawingSymbolOfPlayerWhoClickedCell) {
    let count = 1;
    for (let i = clickedCellI + 1, j = clickedCellJ; i < dimY; i++) {
        if (HTMLElmCell[i][j].classList.contains(CSSClassDrawingSymbolOfPlayerWhoClickedCell))
            count++;
        else
            break;
    }
    for (let i = clickedCellI - 1, j = clickedCellJ; i > -1; i--) {
        if (HTMLElmCell[i][j].classList.contains(CSSClassDrawingSymbolOfPlayerWhoClickedCell))
            count++;
        else
            break;
    }
    return count;
}
function strikeWinningSeriesVertical(dimY, clickedCellI, clickedCellJ, CSSClassDrawingSymbolOfPlayerWhoClickedCell) {
    for (let i = clickedCellI, j = clickedCellJ; i < dimY; i++) {
        if (HTMLElmCell[i][j].classList.contains(CSSClassDrawingSymbolOfPlayerWhoClickedCell)) {
            HTMLElmCell[i][j].style.position = "relative";
            HTMLElmCell[i][j].innerHTML = `<svg height='34' width='34' style="position:absolute;left:-2px;top:-2px;z-index:1;"> <line x1='17' y1='0' x2='17' y2='34' style='stroke:${value.CSSStyle.strikeLineColor};stroke-width:2;' /> </svg>`;
        }
        else
            break;
    }
    for (let i = clickedCellI - 1, j = clickedCellJ; i > -1; i--) {
        if (HTMLElmCell[i][j].classList.contains(CSSClassDrawingSymbolOfPlayerWhoClickedCell)) {
            HTMLElmCell[i][j].style.position = "relative";
            HTMLElmCell[i][j].innerHTML = `<svg height='34' width='34' style="position:absolute;left:-2px;top:-2px;z-index:1;"> <line x1='17' y1='0' x2='17' y2='34' style='stroke:${value.CSSStyle.strikeLineColor};stroke-width:2;' /> </svg>`;
        }
        else
            break;
    }
}
function countWinningSeriesLTtoRB(dimX, dimY, clickedCellI, clickedCellJ, CSSClassDrawingSymbolOfPlayerWhoClickedCell) {
    let count = 1;
    for (let i = clickedCellI + 1, j = clickedCellJ + 1; i < dimY && j < dimX; i++, j++) {
        if (HTMLElmCell[i][j].classList.contains(CSSClassDrawingSymbolOfPlayerWhoClickedCell))
            count++;
        else
            break;
    }
    for (let i = clickedCellI - 1, j = clickedCellJ - 1; i > -1 && j > -1; i--, j--) {
        if (HTMLElmCell[i][j].classList.contains(CSSClassDrawingSymbolOfPlayerWhoClickedCell))
            count++;
        else
            break;
    }
    return count;
}
function strikeWinningSeriesLTtoRB(dimX, dimY, clickedCellI, clickedCellJ, CSSClassDrawingSymbolOfPlayerWhoClickedCell) {
    for (let i = clickedCellI, j = clickedCellJ; i < dimY && j < dimX; i++, j++) {
        if (HTMLElmCell[i][j].classList.contains(CSSClassDrawingSymbolOfPlayerWhoClickedCell)) {
            HTMLElmCell[i][j].style.position = "relative";
            const canvas = document.createElement("canvas");
            HTMLElmCell[i][j].appendChild(canvas);
            canvas.setAttribute("width", "34px");
            canvas.setAttribute("height", "34px");
            canvas.style.cssText = "position:absolute;left:-2px;top:-2px;z-index:1;";
            const ctx = canvas.getContext("2d");
            if (ctx) {
                ctx.strokeStyle = value.CSSStyle.strikeLineColor;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(34, 34);
                ctx.stroke();
            }
        }
        else
            break;
    }
    for (let i = clickedCellI - 1, j = clickedCellJ - 1; i > -1 && j > -1; i--, j--) {
        if (HTMLElmCell[i][j].classList.contains(CSSClassDrawingSymbolOfPlayerWhoClickedCell)) {
            HTMLElmCell[i][j].style.position = "relative";
            const canvas = document.createElement("canvas");
            HTMLElmCell[i][j].appendChild(canvas);
            canvas.setAttribute("width", "34px");
            canvas.setAttribute("height", "34px");
            canvas.style.cssText = "position:absolute;left:-2px;top:-2px;z-index:1;";
            const ctx = canvas.getContext("2d");
            if (ctx) {
                ctx.strokeStyle = value.CSSStyle.strikeLineColor;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(34, 34);
                ctx.stroke();
            }
        }
        else
            break;
    }
}
function countWinningSeriesRTtoLB(dimX, dimY, clickedCellI, clickedCellJ, CSSClassDrawingSymbolOfPlayerWhoClickedCell) {
    let count = 1;
    for (let i = clickedCellI + 1, j = clickedCellJ - 1; i < dimY && j > -1; i++, j--) {
        if (HTMLElmCell[i][j].classList.contains(CSSClassDrawingSymbolOfPlayerWhoClickedCell))
            count++;
        else
            break;
    }
    for (let i = clickedCellI - 1, j = clickedCellJ + 1; i > -1 && j < dimX; i--, j++) {
        if (HTMLElmCell[i][j].classList.contains(CSSClassDrawingSymbolOfPlayerWhoClickedCell))
            count++;
        else
            break;
    }
    return count;
}
function strikeWinningSeriesRTtoLB(dimX, dimY, clickedCellI, clickedCellJ, CSSClassDrawingSymbolOfPlayerWhoClickedCell) {
    for (let i = clickedCellI, j = clickedCellJ; i < dimY && j > -1; i++, j--) {
        if (HTMLElmCell[i][j].classList.contains(CSSClassDrawingSymbolOfPlayerWhoClickedCell)) {
            HTMLElmCell[i][j].style.position = "relative";
            const canvas = document.createElement("canvas");
            HTMLElmCell[i][j].appendChild(canvas);
            canvas.setAttribute("width", "34px");
            canvas.setAttribute("height", "34px");
            canvas.style.cssText = "position:absolute;left:-2px;top:-2px;z-index:1;";
            const ctx = canvas.getContext("2d");
            if (ctx) {
                ctx.strokeStyle = value.CSSStyle.strikeLineColor;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(0, 34);
                ctx.lineTo(34, 0);
                ctx.stroke();
            }
        }
        else
            break;
    }
    for (let i = clickedCellI - 1, j = clickedCellJ + 1; i > -1 && j < dimX; i--, j++) {
        if (HTMLElmCell[i][j].classList.contains(CSSClassDrawingSymbolOfPlayerWhoClickedCell)) {
            HTMLElmCell[i][j].style.position = "relative";
            const canvas = document.createElement("canvas");
            HTMLElmCell[i][j].appendChild(canvas);
            canvas.setAttribute("width", "34px");
            canvas.setAttribute("height", "34px");
            canvas.style.cssText = "position:absolute;left:-2px;top:-2px;z-index:1;";
            const ctx = canvas.getContext("2d");
            if (ctx) {
                ctx.strokeStyle = value.CSSStyle.strikeLineColor;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(0, 34);
                ctx.lineTo(34, 0);
                ctx.stroke();
            }
        }
        else
            break;
    }
}
