
import {categoriesOptions} from './categoriesOptions.js';
import {fillObjectWithInnerHTMLData} from './function.js';


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


export {categoriesOptionsRefined};




