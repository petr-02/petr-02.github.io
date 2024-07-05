
////////////////////////////////////////////////////////////////
//categoriesOptions.js module
////////////////////////////////////////////////////////////////

// importováno a užíváno v "setCheckboxes.js" i "index.js"
/*export*/ const categoriesOptions= {"category1":["badminton","basketbal","běh","florbal","fotbal","házená","nohejbal","ping pong","plavání","tenis","volejbal"],"category3":["hřiště otevřené","hřiště placené","tělocvična"],"category5":["Bohunice","Brno-sever","Brno-střed","Bystrc","Horní Heršpice","Jundrov","Kohoutovice","Komárov","Komín","Královo pole","Líšeň","Maloměřice a Obřany","Nový Lískovec","Starý Lískovec","Tuřany","Vinohrady","Černovice","Žabovřesky","Židenice","MU","Mendelu","UO","VUT"],"surface":["antuka","asfalt","gumový povrch","mondo","parkety","písek","tartan","tráva","umělá tráva","umělá tráva 3. generace","umělý povrch","umělý povrch (epdm)","umělý povrch (pur)","umělý povrch bez písku","umělý povrch s pískem","umělý povrch z plastu (nisaplast)"],"groupedByCategory3":[{"category3":"tělocvična","category1":["badminton","basketbal","florbal","fotbal","házená","ping pong","plavání","tenis","volejbal"],"category5":["Bohunice","Brno-střed","Bystrc","Jundrov","Kohoutovice","Komín","Královo pole","Nový Lískovec","Starý Lískovec","Tuřany","Vinohrady","Černovice","Žabovřesky","Židenice","MU","Mendelu","UO","VUT"],"surface":["gumový povrch","parkety","umělý povrch","umělý povrch (epdm)","umělý povrch (pur)","umělý povrch s pískem"]},{"category3":"hřiště otevřené","category1":["basketbal","florbal","fotbal","nohejbal","volejbal"],"category5":["Bohunice","Brno-sever","Brno-střed","Bystrc","Horní Heršpice","Jundrov","Kohoutovice","Komárov","Komín","Líšeň","Černovice","Žabovřesky","Židenice"],"surface":["asfalt","písek","tartan","umělý povrch bez písku","umělý povrch s pískem","umělý povrch z plastu (nisaplast)"]},{"category3":"hřiště placené","category1":["basketbal","běh","florbal","fotbal","házená","nohejbal","tenis","volejbal"],"category5":["Bohunice","Brno-střed","Bystrc","Jundrov","Kohoutovice","Komárov","Komín","Královo pole","Líšeň","Maloměřice a Obřany","Nový Lískovec","Starý Lískovec","Tuřany","Černovice","Židenice","MU","VUT"],"surface":["antuka","mondo","tartan","tráva","umělá tráva","umělá tráva 3. generace","umělý povrch s pískem"]}],"timestamp":"2024-06-25T07:32:12.069Z"};


////////////////////////////////////////////////////////////////
//function.js module
////////////////////////////////////////////////////////////////

/* for setCheckboxes.js */

function fillObjectWithInnerHTMLData(object,keyName,arrayOfOptions,name){
 let innerHTMLData=""
 arrayOfOptions.forEach(function(val){
   innerHTMLData+=`<label for="${val}"> <input type="checkbox" name="${name}" id="${val}" value="${val}"> ${val}</label>`
 })
 object[keyName]= innerHTMLData;
}


function fillSearchFormWithCheckboxes(htmlDOMObject,innerHTMLData){
 htmlDOMObject.innerHTML= innerHTMLData;
}


function letOnlyOneCheckboxBeSelected_of(checkboxes) {            // funkce volána s parametrem např. "document.querySelectorAll( 'input[type="checkbox"]' )"
  window.lastCheckedCheckbox;

  checkboxes.forEach(function(checkbox){
    checkbox.addEventListener("click", function(e){
      e.preventDefault();
      if (checkbox !== lastCheckedCheckbox) {
        setTimeout( ()=>checkbox.checked=true , 0 );
        lastCheckedCheckbox.checked=false;
        lastCheckedCheckbox = checkbox;
        checkbox.dispatchEvent(new Event('change'));
        /* some additional code here */
      }
    })
  })

  initialCheck(checkboxes);

}


/* for setCheckboxes.js and index.js */

// tuto funkci užívá "setCheckboxes.js" i "index.js" (kvůli tomuto druhému musí být kód "checkbox.checked=true" uvnitř fce "setTimeout()", celou tuto fci totiž tehdy spouští event kód elementu "<input type='reset'>", který skrze default behaviour resetuje formulář, i jeho checkboxy, tehdy ovšem kód "checkbox.checked=true" nefunguje běžně)
function initialCheck(checkboxes){
  let flag=true;

  checkboxes.forEach(function(checkbox){
    if(!checkbox.disabled && flag) {
      setTimeout( ()=>checkbox.checked=true , 0 );
      lastCheckedCheckbox = checkbox;
      flag=false;
      checkbox.dispatchEvent(new Event('change'));
    }
  })
  if(!lastCheckedCheckbox) {
    checkboxes[0].checked=true;
    lastCheckedCheckbox=checkboxes[0];
  }
}


//export {functionName1, functionName2, functionName3, ...};
////////////////////////////////////////////////////////////////
//categoriesOptionsRefined.js module
////////////////////////////////////////////////////////////////
//import {categoriesOptions} from './categoriesOptions.js';
//import {fillObjectWithInnerHTMLData} from './function.js';


const categoriesOptionsRefined={
 category3:"",                      // string with innerHTML data to be inserted into checkbox container dom object
 category1:"",
 surface:{},                        // "surface:{category3_kind1:'', category3_kind2:'', category3_kind3='', ...}" ; zatímco ostatní checkboxy jsou neměnné, povrch/surface (checkboxy) se mění podle uživatelem zaškrtnutého checkboxu kategorie 3
 category5:""
};

fillObjectWithInnerHTMLData( categoriesOptionsRefined, "category3", categoriesOptions.category3, "category3" );
fillObjectWithInnerHTMLData( categoriesOptionsRefined, "category1", categoriesOptions.category1, "category1" );
fillObjectWithInnerHTMLData( categoriesOptionsRefined, "category5", categoriesOptions.category5, "category5" );
categoriesOptions.groupedByCategory3.forEach(function(document){
 fillObjectWithInnerHTMLData( categoriesOptionsRefined.surface, document.category3, document.surface, "surface" );
})


//export {categoriesOptionsRefined};
////////////////////////////////////////////////////////////////
//setCheckboxes.js module script
////////////////////////////////////////////////////////////////
//import {categoriesOptionsRefined} from './categoriesOptionsRefined.js';
//import {fillSearchFormWithCheckboxes, letOnlyOneCheckboxBeSelected_of} from './function.js';


const cat3= document.getElementById("cat3-content");
const cat1= document.getElementById("cat1-content");
const surface= document.getElementById("surface-content");
const cat5= document.getElementById("cat5-content");


fillSearchFormWithCheckboxes( cat3, categoriesOptionsRefined.category3 )
fillSearchFormWithCheckboxes( cat1, categoriesOptionsRefined.category1 )
fillSearchFormWithCheckboxes( cat5, categoriesOptionsRefined.category5 )

const cat3Checkboxes=document.querySelectorAll("div#cat3-content input");

cat3Checkboxes.forEach(function(checkbox){
  checkbox.addEventListener("change", function(){
    fillSearchFormWithCheckboxes( surface, categoriesOptionsRefined.surface[this.value] )
  })
})


letOnlyOneCheckboxBeSelected_of( cat3Checkboxes );





