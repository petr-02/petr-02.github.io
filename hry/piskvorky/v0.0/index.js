"use strict";
const spanDisplayingWhoIsTurn = document.getElementById("span-displaying-who-is-turn");
const inputDimensionOfPlaygroundX = document.getElementById("input-dimension-of-playground-x");
const inputDimensionOfPlaygroundY = document.getElementById("input-dimension-of-playground-y");
const buttonStart = document.getElementById("button-start");
const divTicTacToeGridContainer = document.getElementById("div-tic-tac-toe-grid-container");
const circle = "circle"; // "circle" a "cross" jsou názvy css tříd; třída "circle" způsobí vyplnění buňky kolečkem, "cross" krížkem
const cross = "cross";
const circlePlayerName = "Modrý hráč"; // pro uživatele je hráč mající kolečka/circle zobrazen také jako "Modrý hráč" (neboť i kolečka jsou modré); hráč s krížky/crosses jako "Zelený hráč"
const crossPlayerName = "Zelený hráč";
buttonStart.addEventListener("click", function () {
    location.reload(); // pokud by někde nefungovalo --> "window.location.href = window.location.href"
});
let whoIsTurn = Math.floor(Math.random() * 2); // hodnota 0/1 určuje, zda-li táhne kolečko "0" nebo křížek "1"
if (whoIsTurn) {
    displayInHTMLIsTurnOfCrossPlayer();
}
else {
    displayInHTMLIsTurnOfCirclePlayer();
}
divTicTacToeGridContainer.addEventListener("click", function (event) {
    const target = event.target;
    if (target === divTicTacToeGridContainer)
        return; // když uživatel klikl na grid container v místě, kde se nenachází buňka/grid_item, tj. klikl do mezery v okolí buněk (tehdy "event.target" odkazuje na grid container, nikoliv buňku/grid_item)
    if (target.classList.contains(circle) || target.classList.contains(cross))
        return; // když uživatel klikl na grid container v místě, kde se nachází buňka/grid_item, ale v buňce již je nakresleno kolečko nebo křížek
    fillCellWithCircleOrCross(target);
});
function fillCellWithCircleOrCross(cell) {
    if (whoIsTurn === 0) {
        cell.classList.toggle(circle); // přidá buňce/grid_itemu css třídu, která v buňce vykreslí kroužek
        afterCircleDrawn();
    }
    else {
        cell.classList.toggle(cross);
        afterCrossDrawn();
    }
}
function afterCircleDrawn() {
    whoIsTurn = 1; // změní hráče z circle "0" na cross "1"
    displayInHTMLIsTurnOfCrossPlayer(); // změnu hráče zobrazí v html
}
function afterCrossDrawn() {
    whoIsTurn = 0;
    displayInHTMLIsTurnOfCirclePlayer();
}
function displayInHTMLIsTurnOfCirclePlayer() {
    spanDisplayingWhoIsTurn.innerHTML = circlePlayerName;
    spanDisplayingWhoIsTurn.style.color = "blue";
}
function displayInHTMLIsTurnOfCrossPlayer() {
    spanDisplayingWhoIsTurn.innerHTML = crossPlayerName;
    spanDisplayingWhoIsTurn.style.color = "green";
}
