"use strict";
const sun = document.getElementById("sun"); // eg the "div" with style "height:400px; width:400px; position:absolute; top:15px; right:15px;"
letThereBeSunOnElement(sun);
setInitialStyleForElement(sun);
function setInitialStyleForElement(sunElm) {
    const lesserViewportSize = Math.min(window.innerWidth, window.innerHeight); // the lesser viewport size in pixels (eg viewport width or viewport height)
    sunElm.style.height = 0.4 * lesserViewportSize + "px";
    sunElm.style.width = 0.4 * lesserViewportSize + "px";
    sunElm.style.position = "absolute";
    sunElm.style.top = 0.008 * lesserViewportSize + "px";
    sunElm.style.right = 0.008 * lesserViewportSize + "px";
}
function letThereBeSunOnElement(sunElm) {
    const smoothness = 0.015; // time of one animation move, in seconds; for smoother animation lower number, but with bigger computing load
    const sunriseAndSunsetTime = 15; // how long sun does rise, how long does set, in seconds
    const yellowDistance = 10;
    const blackDistanceAtNight = 11; // yellow is at ${yellowDistance}% (eg. 10%), at night black is at ${blackDistanceAtNight}% (eg. 11%), only ${blackDistanceAtNight - yellowDistance}% (eg. 1%) transition from yellow to black, no much room for sun yellow light
    const blackDistanceAtNoon = 40; // yellow is at ${yellowDistance}%, at noon black is ${blackDistanceAtNoon}% (eg. 40%), ${blackDistanceAtNoon - yellowDistance}% (eg. 30%) transition from yellow to black, giving room for sun yellow light
    const blackColorStep = (blackDistanceAtNoon - blackDistanceAtNight) / (sunriseAndSunsetTime / smoothness); // counting % of one animation move, the movement of black night
    let blackColorPosition = blackDistanceAtNight; // animation starts at midnight, with sunRise=true
    let sunRise = true; // if sun is about to rise (true), the code adding colorStep, if about to set (false), subtracting
    const white = "white"; // for possibility set other color for background
    const black = "black"; // for possibility set other color for surrounding night
    const yellow = "yellow"; // for possibility set other color for sun ray
    const red = "red"; // for possibility set other color for sun hot center
    setInterval(() => {
        if (sunRise) {
            blackColorPosition += blackColorStep;
            sunElm.style.backgroundImage = `radial-gradient(circle closest-side, ${red} 0% 0%, ${yellow} ${yellowDistance}% ${yellowDistance}%, ${black} ${blackColorPosition}% ${blackDistanceAtNoon}%, ${white})`;
            if (blackColorPosition >= blackDistanceAtNoon)
                sunRise = false; // ">=" instead of "===" because declaration of "blackColorStep" involves division, for which rounding may happen, then backward multiplication of blackColorStep will not exactly fit the original number
        }
        else {
            blackColorPosition -= blackColorStep;
            sunElm.style.backgroundImage = `radial-gradient(circle closest-side, ${red} 0% 0%, ${yellow} ${yellowDistance}% ${yellowDistance}%, ${black} ${blackColorPosition}% ${blackDistanceAtNoon}%, ${white})`;
            if (blackColorPosition <= blackDistanceAtNight)
                sunRise = true;
        }
    }, smoothness * 1000);
}
