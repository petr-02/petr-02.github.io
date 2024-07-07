
import {categoriesOptionsRefined} from './categoriesOptionsRefined.js';
import {fillSearchFormWithCheckboxes, letOnlyOneCheckboxBeSelected_of} from './function.js';


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





