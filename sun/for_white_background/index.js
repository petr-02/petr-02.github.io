"use strict";
const sun = document.getElementById("sun"); // eg. the "div" with style "height:400px; width:400px; position:absolute; top:15px; right:15px;"
setInitialStyle(sun);
Sun(sun);
function setInitialStyle(sunElmContainer) {
    const lesserViewportSize = Math.min(window.innerWidth, window.innerHeight); // the lesser viewport size in pixels (eg viewport width or viewport height)
    sunElmContainer.style.height = 0.4 * lesserViewportSize + "px";
    sunElmContainer.style.width = 0.4 * lesserViewportSize + "px";
    sunElmContainer.style.position = "absolute";
    sunElmContainer.style.top = 0.008 * lesserViewportSize + "px";
    sunElmContainer.style.right = 0.008 * lesserViewportSize + "px";
}
function Sun(sunElmContainer) {
    const smoothness = 0.015; // time of one animation move, in seconds; for smoother animation lower number, but with bigger computing load
    const sunriseAndSunsetTime = 15; // how long sun does rise, how long does set, in seconds
    const yellowDistance = 10;
    const blackDistanceAtNight = 11; // yellow is at ${yellowDistance}% (eg. 10%), at night black is at ${blackDistanceAtNight}% (eg. 11%), only ${blackDistanceAtNight - yellowDistance}% (eg. 1%) transition from yellow to black, no much room for sun yellow light
    const blackDistanceAtNoon = 40; // yellow is at ${yellowDistance}%, at noon black is ${blackDistanceAtNoon}% (eg. 40%), ${blackDistanceAtNight - yellowDistance}% (eg. 30%) transition from yellow to black, giving room for sun yellow light
    const blackColorStep = (blackDistanceAtNoon - blackDistanceAtNight) / (sunriseAndSunsetTime / smoothness); // counting % of one animation move, the movement of black night
    let blackColorPosition = blackDistanceAtNight; // animace starts at midnight, with sunRise=true
    let sunRise = true; // if sun is about to rise (true), the code adding colorStep, if about to set (false), subtracting
    setInterval(() => {
        if (sunRise) {
            blackColorPosition += blackColorStep;
            sunElmContainer.style.backgroundImage = `radial-gradient(circle closest-side, red 0% 0%, yellow ${yellowDistance}% ${yellowDistance}%, black ${blackColorPosition}% ${blackDistanceAtNoon}%, white)`;
            if (blackColorPosition >= blackDistanceAtNoon)
                sunRise = false; // ">=" instead of "===" because declaration of "blackColorStep" involves division, for which rounding may happen, then backward multiplication of blackColorStep will not exactly fit the original number
        }
        else {
            blackColorPosition -= blackColorStep;
            sunElmContainer.style.backgroundImage = `radial-gradient(circle closest-side, red 0% 0%, yellow ${yellowDistance}% ${yellowDistance}%, black ${blackColorPosition}% ${blackDistanceAtNoon}%, white)`;
            if (blackColorPosition <= blackDistanceAtNight)
                sunRise = true;
        }
    }, smoothness * 1000);
}
