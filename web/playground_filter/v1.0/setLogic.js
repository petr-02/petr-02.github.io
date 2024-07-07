
import {submit, directEnterPage, reset} from './function.js';

const submitButton=document.getElementById("submit-button");
const resetButton=document.getElementById("reset-button");

submitButton.addEventListener("click", submit);
resetButton.addEventListener("click", reset);
if (document.readyState === "complete") directEnterPage();                     // for case page have already been loaded, then import of this code occur (thus load event will occur before event function is defined)
 else window.addEventListener("load", directEnterPage);
window.addEventListener("popstate", directEnterPage);





