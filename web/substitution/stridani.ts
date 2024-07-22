
/* types */

type HTMLInpElm= { [key:string]:HTMLInputElement };
type HTMLBtnElm= { [key:string]:HTMLButtonElement };
type HTMLPElm= { [key:string]:HTMLParagraphElement };


/* functions */

function getInputElement (id:string):HTMLInputElement {
 const element= document.getElementById(id);
 if( !(element instanceof HTMLInputElement) ) { throw new Error(`element "${id}" is not HTMLInputElement`) }
 return element
}

function getButtonElement (id:string):HTMLButtonElement {
 const element= document.getElementById(id);
 if( !(element instanceof HTMLButtonElement) ) { throw new Error(`element "${id}" is not HTMLButtonElement`) }
 return element
}

function getPElement (id:string):HTMLParagraphElement {
 const element= document.getElementById(id);
 if( !(element instanceof HTMLParagraphElement) ) { throw new Error(`element "${id}" is not HTMLParagraphElement`) }
 return element
}


/* (groups of) html elements (stored in object) */

const input:HTMLInpElm= {
 numberofsubgoalkeeper: getInputElement("input-numberofsubgoalkeeper"),
 numberonfield: getInputElement("input-numberonfield"),
 numberofsubstitute: getInputElement("input-numberofsubstitute"),
 minutesofgame: getInputElement("input-minutesofgame"),
}

const button:HTMLBtnElm= {
 count: getButtonElement("button-count"),
 reset: getButtonElement("button-reset"),
 default: getButtonElement("button-default"),
}

const p:HTMLPElm={
 content: getPElement("p-content"),
}


/* code */

button.default.addEventListener("click", function(){
 input.numberofsubgoalkeeper.value="1";
 input.numberonfield.value="4";
 input.numberofsubstitute.value="1";
 input.minutesofgame.value="90";
})

button.reset.addEventListener("click", function(){
 input.numberofsubgoalkeeper.value="";
 input.numberonfield.value="";
 input.numberofsubstitute.value="";
 input.minutesofgame.value="";
})

button.count.addEventListener("click", function(){
 const subgoalkeeper:number= (input.numberofsubgoalkeeper.value as any)*1;
 const onfield:number= (input.numberonfield.value as any)*1;
 const substitute:number= (input.numberofsubstitute.value as any)*1;
 const total:number= subgoalkeeper + onfield + substitute;
 const gameminutes:number= (input.minutesofgame.value as any)*1;

 if (!onfield || !gameminutes) return;

 const goalkeeperTime= subgoalkeeper / total  *  gameminutes;
 const substituteTime= substitute / total  *  gameminutes;
 const notFieldPercentage= ((subgoalkeeper + substitute) / total  *  100).toFixed(2);

 p.content.innerHTML=`Every player need to spend ${goalkeeperTime}&nbsp;minutes in goal and ${substituteTime}&nbsp;minutes substituting, that is altogether ${notFieldPercentage}&nbsp;% of whole game.`;
})




