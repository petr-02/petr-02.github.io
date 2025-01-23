
import distance_speed_time from "./calc/Distance_speed_timeModule.js"                   // import of calculation code, the html string to be rendered into html
import percentage from "./calc/PercentageModule.js"

const importedCalcModules = {                                                           // object keys holds the html string code of each calculation to be rendered into html
  "distance-speed-time": distance_speed_time,                                           // calc name from html datalist : link to imported variable value
  "percentage": percentage
}

const calcNamesArr=Object.keys(importedCalcModules)                                     // array extracting keys from "importedCalcModules" object and placing them into array

const calcNamePickInputObject = document.getElementById("calc_name_pick-input-field")   // dom object where user is picking calc name, but also can enter his own value, shorter than full calc name appearing in <datalist> (if bellow is "calcNamePick", it means the value picked by user, that can be shorter than full calc name from html <datalist> )
const calcSpaceObject = document.getElementById("calc-space")                           // dom object where choosen calculation will be rendered in html

calcNamePickInputObject.addEventListener("click", function(){ this.value=""; this.showPicker() } )     // on click, empty <input> field (so the all datalist option values would show etc.), then show datalist option values again (since the first datalist option values show is made with click event by js before user code, thus here before input field was emptied)
calcNamePickInputObject.addEventListener("input", calcRender )                          // on input; this event occur with every value change and immediatelly (if user will write a calc name manually, every new letter added or removed will trigger the event, even before string is finnished)


function calcRender(){                                          // in case user will write calc name manually, code below will find out entered letters fit only one option available and automatically start, even before full calc name is written, but "min" numbers of letters need to be inserted as mentioned below
  const min=4                                                   // minimum number of letters of picked calc name to let the code continue (for case user will write calc name manually) (because of this condition all datalist values, that are html calc names, need be at least "min" char in length)
  const calcNamePick=calcNamePickInputObject.value
  let calcName=""                                               // if picked calc name will fit just one of available calc names, this variable will hold that one available calc name (for case user will manually write only first "min" letters and already these will fit only one available calc name, this variable will hold that full available calc name, not only first 4 letters of it)

  if (calcNamePick.length < min) return                         // if picked calc name does not have at least "min" number of letters, end the triggered code
  calcName= checkCalcNamePickUniqueness(calcNamePick, calcNamesArr)     // if picked calc name does have at least "min" number of letters, call the function
  if(!calcName) return                                          // if function "checkCalcNamePickUniqueness" didn't find only one unique picked calc name between available calc names, end the triggered code

  calcSpaceObject.innerHTML=importedCalcModules[calcName]       // will insert into html imported code according to calc name

}


function checkCalcNamePickUniqueness (calcNamePick, calcNamesArr) {     // check if calc name input (particularly for case letters will be written by user) fit just one calc name from possible calc names (or if fit noone or more than one)
  let founded=0
  let lastFoundedCalcName=""
  for (let x=0; x < calcNamesArr.length ; x++) {
    if( calcNamesArr[x].search( calcNamePick ) === 0 ) founded++, lastFoundedCalcName=calcNamesArr[x]
  }
  if (founded===1) return lastFoundedCalcName
}






