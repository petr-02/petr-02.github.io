
/* global variable */

// used in function "initialCheck" (which is used by function "letOnlyOneCheckboxBeSelected_of" (which is imported and used by "setCheckboxes.js") and function "reset" (which is imported and used by "setLogic.js")) and function "letOnlyOneCheckboxBeSelected_of" (which is imported and used by "setCheckboxes.js")
let lastCheckedCheckbox;

// used in function "fillHTMLWithData"
import {categoriesOptions} from './categoriesOptions.js';




/* for setCheckboxes.js */

function fillSearchFormWithCheckboxes(htmlDOMObject,innerHTMLData){
 htmlDOMObject.innerHTML= innerHTMLData;
}


function letOnlyOneCheckboxBeSelected_of(checkboxes) {            // function called with parameter e.g. "document.querySelectorAll( 'input[type="checkbox"]' )"
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

export {fillSearchFormWithCheckboxes, letOnlyOneCheckboxBeSelected_of}


  /* for categoriesOptionsRefined.js */

  function fillObjectWithInnerHTMLData(object,keyName,arrayOfOptions,name){
    let innerHTMLData=""
    arrayOfOptions.forEach(function(val){
      innerHTMLData+=`<label for="${val}"> <input type="checkbox" name="${name}" id="${val}" value="${val}"> ${val}</label>`
    })
    object[keyName]= innerHTMLData;
  }

  export {fillObjectWithInnerHTMLData}





/* for setLogic.js */

function submit( e , form=document.getElementById("search-form") ) {
 const query=concatURLSearchString(form);
 if(query) history.pushState(null, null, query);
 fillHTMLWithData(query);
}

function directEnterPage() {
 const query=window.location.search;
 if(!query) return;
 fillHTMLWithData(query);
}

function reset ( e , cat3_Checkboxes=document.querySelectorAll("div#cat3-content input") ) {    // reset event function, i.e. default behaviour will reset form, then "initialCheck" happens
  initialCheck(cat3_Checkboxes);
}


function concatURLSearchString(formElmObj) {               // will concat search string from data user did choice in the form (search string starts with question mark "?"; form element values with common "name" attribute are concatenated into one query parameter as "common_name=val1,val2,val3,...")
 const formData=new FormData(formElmObj);                  // saves data of each form element, values at time of "new FormData()" command execuation; only of element having "name" attribute ("name" value became "key" of "formData" instance), "<input type='checkbox'>" need also be "checked"; "<input type='number/text'>", if user didn't fill value, have still value of ""

 const userChoice={};                                      // e.g. with key: category1:[val1,val2,val3,...] (checked checkboxes with common name="category1", values "val1", "val2", "val3", ...) or "dimensionWidth:[5,'']" (inputs type number with common name="dimensionWidth", values "5" and left by user blank)

 formData.forEach(function(value,name){                    // iterates value/key of "formData" instance and saves them into "userChoice" object (e.g. "category1/val1", "category1/val2", "category1/val3", ...)
   if( !userChoice[name] ) userChoice[name]=[];
   userChoice[name].push(value)
 })

 for(const key in userChoice){                             // deletes each "userChoice" object key with (empty array "[]" or) array of empty string items "['','',...]"  (it will thus not delete dimensionWidth/Length/Depth array "['',some_value]" or "[some_value,'']", but only if "['','']" )
   if(userChoice[key].join("")==="") delete userChoice[key];
 }

 let searchString= Object.keys(userChoice).map(name=> {    // creates array of "keys" of "userChoice" object --> ['category1','category3', ..., 'price']; then processes it by first "map"
   const refinedArray= userChoice[name].map(value=> {      // refines "userChoice[name]" (eg. "userChoice.category1") array to array with same but encoded values
     return encodeURIComponent(value);
   })
   return `${name}=${refinedArray.join(",")}`;
 }).join("&");

 if(searchString) searchString= "?" + searchString;

 return searchString;
}


async function fetchDataJSON(query) {
 const url=`https://brno-sportground-query-response.vercel.app/${query}`;                     // server address that processes url and returns json object according to query
 /* for test --> const url=`http://127.0.0.1:3000/${query}`; */                               /* for test ignore line above */

 try {
   const res= await fetch(url);
   if (!res.ok) { throw new Error("network response is not 'ok'") }
   return res.json();
 }
 catch (err) { console.error("fetch failed",err) }

}


async function fillHTMLWithData( query, categories3=categoriesOptions.category3 , categories3_dbKeyNames= ["outdoor_free","outdoor_paid","indoor"] , contentDiv=document.getElementById("content") ) {    // categories3=["hřiště otevřené","hřiště placené","tělocvična"]
 const data=await fetchDataJSON(query);     /* for test ignore this line */
 /* for test --> const data=DATA(); */

 const output={HTML:""};

 if (data.length===0) {contentDiv.innerHTML=output.HTML; return}                         // if db returns empty data result

 const category3= data[0].categories6[0].categories7[0].categorization.category3;        // as it is possible to search in only one category3, all data from server received share equal and one category3 (every single cat6 and also every single cat5 have categories7 (the pitches) of only one kind category3); if search form would make possible to search in more than one, more than one (category3) would exist for each category6, same number or more for each category5, the code returning category3 would be split and properly placed, one kind for each cat5, other for each cat6, returning one or more category3 (iterating through all categories7 (the pitches) of cat5 or of cat6 seeking their categories7)
 const category3_dbKeyName= categories3_dbKeyNames[  categories3.indexOf(category3)  ];  // "category3" and relative "category3_dbKeyName" name are on same position in array, former in "categories3", latter in array "categories3_dBKeyNames"

 data.forEach( cat5 => {                                          // on web, there is "cat5 content" "cat6 content" "cat7 content" "cat6 content" "cat7 content" (can be multiple cat7 content in one cat6, multiple cat6 content in one cat5)
   const cat5_data=cat5.category5_data[0];
   cat5_contentStart(cat5,output);

     cat5.categories6.forEach( cat6 => {
       const cat6_data=cat6.category6_data[0];
       cat6_contentStart(cat6,cat6_data,output);

         cat6.categories7.forEach( cat7 => {
           cat7_content(cat7,output);
         })

       if(cat6_data) cat5or6_contentEnd(cat6,cat6_data,category3_dbKeyName,output);
     })

   if(cat5_data) cat5or6_contentEnd(cat5,cat5_data,category3_dbKeyName,output);
 })

 contentDiv.innerHTML=output.HTML;
}

  function cat5_contentStart(cat5,output){
    output.HTML+=`<h2>${cat5.name}</h2>`;
  }

  function cat6_contentStart(cat6,cat6_data,output){
    output.HTML+=`<h3>${cat6.name}</h3> <span class="address">(${cat6_data?.address.street}${cat6_data?.address.district ? ", " + cat6_data.address.district : ""})</span><br>`;    // universities (not districts), its categories6, do include district in their address
  }

  function cat7_content(cat7,output){
    output.HTML+= `<a href="https://mapy.cz/zakladni?x=${cat7.gps.latitude}&y=${cat7.gps.longitude}&z=18" target="_blank">${cat7.name}</a>`;

    const playgroundContentArr=[];

    const dimensionArr=[];
    const dimension=cat7.dimension;
    if(dimension.width)  dimensionArr.push(dimension.width);
    if(dimension.length) dimensionArr.push(dimension.length);
    if(dimension.depth)  dimensionArr.push(dimension.depth);
    /* kód dělající totéž (musí být až za "const dimension=cat7.dimension;" )
    const dimensionArr=[ dimension.width, dimension.length, dimension.depth ]
      .filter( val => val[0]!==null && val[0]!==undefined )                                                 // can be written also "val[0]!=null"
    */
    if(dimensionArr.length!==0) {
      playgroundContentArr.push( `${dimensionArr.join("×")} m` );
      if(dimension.accurate===false) playgroundContentArr[playgroundContentArr.length-1]= `~${playgroundContentArr[playgroundContentArr.length-1]}`;
    }

    if(cat7.surface.value) {
      playgroundContentArr.push( cat7.surface.value );
      if(cat7.surface.note) playgroundContentArr[playgroundContentArr.length-1]+= ` (${cat7.surface.note})`;
    }

    const price=cat7.price;
    if(price.value) {
      let priceValue= `${price.value} Kč/h`;
      if(price.date) priceValue+= ` (${price.date})`;
      if(price.note) priceValue+= ` ${price.note}`;
      playgroundContentArr.push( priceValue );
    }
    if(!price.value && price.note) {
      let priceNote= price.note;
      if(price.date) priceNote+= ` (${price.date})`;
      playgroundContentArr.push( priceNote );
    }

    const price2=cat7.price2;
    if(price2?.value) {
      let price2Value=price2.value
      if(price2.date) price2Value+= ` (${price2.date})`;
      if(price2.note) price2Value+= ` ${price2.note}`;
      playgroundContentArr.push( price2Value );
    }
    if(!price2?.value && price2?.note) {
      let price2Note= price2.note;
      if(price2.date) price2Note+= ` (${price2.date})`;
      playgroundContentArr.push( price2Note );
    }

    if(cat7.note) playgroundContentArr.push( cat7.note );

    output.HTML+=` - ${playgroundContentArr.join(", ")}`;
    output.HTML+="<br>";
  }

  function cat5or6_contentEnd(cat5or6,cat5or6_data,category3_dbKeyName,output){
    const condition= cat5or6_data.contact || cat5or6_data.note1 || cat5or6_data[category3_dbKeyName]        // "cat6_data" should everytime contain at least "address" being not "undefined", but there can be issue in db data (eg. if cat5/6 name of sportground (in sportground collection) is not letter by letter equal as own name of cat5/6 (in cat5/6 collection)); "cat5_data" can be "undefined" (and mostly will be for the districts); both cases (missing data of cat5 or issue in db for cat5 and cat6) are sorted out above with "if(cat5/6_data) output=cat5or6_contentEnd(cat5/6,cat5/6_data,output)" (other option is above use code "output=cat5or6_contentEnd(cat5/6,cat5/6_data,output)" and there code "cat_data?.contact || cat_data?.note1 || cat_data?.[category3_dbKeyName]" )
    if(!condition) return;

    output.HTML+= cat5or6.category===6 ? ".<br>" : "<br>";

    addEndData(cat5or6_data,output);                                                                        // there can be condition "cat5or6_data.contact || cat5or6_data.note1", but mostly there will be these data at this point (probability of existence "category3 specific" data below and not existence of these is minor, additional checking would probably outweight the savings)
    if( cat5or6_data[category3_dbKeyName] ) addEndData(cat5or6_data[category3_dbKeyName],output);           // there can be category3 specificData, only for "outdoor_free" | "outdoor_paid" | "indoor" environment (if exist, they surely contain at least "contact" or "note1")
  }

    function addEndData(endData,output) {
      const contact= endData.contact;

      if(contact) {
        if(contact.web?.value) {
          output.HTML+=`<a href="${contact.web.value}" target="_blank">${contact.web.value}</a>`;
          if(contact.web.note) output.HTML+= ` (${contact.web.note})`;
          output.HTML+="<br>";
        }
        if(contact.web2?.value) {
          output.HTML+=`<a href="${contact.web2.value}" target="_blank">${contact.web2.value}</a>`;
          if(contact.web2.note) output.HTML+= ` (${contact.web2.note})`;
          output.HTML+="<br>";
        }

        /* mails and phones are on one line separated by semicolon with space "; " */
        const mailPhoneArr=[];

        if(contact.mail?.value) {
          mailPhoneArr.push( contact.mail.value );
          if(contact.mail.note) mailPhoneArr[mailPhoneArr.length-1]+= ` (${contact.mail.note})`;
        }
        if(contact.mail2?.value) {
          mailPhoneArr.push( contact.mail2.value );
          if(contact.mail2.note) mailPhoneArr[mailPhoneArr.length-1]+= ` (${contact.mail2.note})`;
        }
        if(contact.phone?.value) {
          mailPhoneArr.push( formattedPhone(contact.phone.value) );
          if(contact.phone.note) mailPhoneArr[mailPhoneArr.length-1]+= ` (${contact.phone.note})`;
        }
        if(contact.phone2?.value) {
          mailPhoneArr.push( formattedPhone(contact.phone2.value) );
          if(contact.phone2.note) mailPhoneArr[mailPhoneArr.length-1]+= ` (${contact.phone2.note})`;
        }
        /* kód dělající totéž
        const mailPhoneArr=[
          [ contact.mail?.value , contact.mail?.note ],
          [ contact.mail2?.value , contact.mail2?.note ],
          [ contact.phone?.value , contact.phone?.note ],
          [ contact.phone2?.value , contact.phone2?.note ],
        ]
          .filter( val => val[0]!==null && val[0]!==undefined )                                       // can be written also "val[0]!=null"; filters out elements [[empty value],[empty value]] from array (if empty value has first element, the ".value", then also the ".note")
          .map( val => { let newVal=formattedPhone(val[0]); if(val[1]) newVal+=` (${val[1]})`; return newVal } )
        */
        if (mailPhoneArr.length!==0) output.HTML+= mailPhoneArr.join("; ") + "<br>";

        if(contact.other) {
          output.HTML+= contact.other.value;
          if(contact.other.note) output.HTML+= ` (${contact.other.note})`;
          output.HTML+="<br>";
        }
      }

      if(endData.note1) {
        output.HTML+= `${endData.note1}<br>`;
        if(endData.note2) {
          output.HTML+= `${endData.note2}<br>`;
          if(endData.note3) {
            output.HTML+= `${endData.note3}<br>`;
            if(endData.note4) output.HTML+= `${endData.note4}<br>`;
          }
        }
      }

    }

      function formattedPhone(phone){
        return phone.toString().replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3')
      }


/* for test --> 
function DATA(){

 const DATA=[{"category4":"district","category":5,"name":"Bohunice","category5_data":[],"categories6_list":["Tatran Bohunice","ZŠ a MŠ Vedlejší","ZŠ Arménská"],"categories6":[{"category":6,"name":"Tatran Bohunice","category6_data":[{"_id":"667a6a4dcd8066064ba60140","category":6,"name":"Tatran Bohunice","address":{"street":"Neužilova 201/35"},"contact":{"web":{"value":"https://www.tatran-bohunice.cz","note":""},"web2":{"value":"https://www.tjtatranbohunice.cz/pronajem/","note":""},"mail":{"value":null,"note":""},"phone":{"value":null,"note":""}}}],"categories7_list":["hřiště 2","hřiště 3"],"categories7":[{"_id":"667a6a4dcd8066064ba6010b","category":7,"name":"hřiště 2","categorization":{"category0":"sport ground","category1":["fotbal"],"category2":"Brno","category3":"hřiště placené","category4":"district","category5":"Bohunice","category6":"Tatran Bohunice"},"gps":{"latitude":16.5753428,"longitude":49.1719086,"accurate":true},"dimension":{"width":50,"length":91},"surface":{"value":"umělá tráva 3. generace","note":""},"price":{"value":null,"date":null,"note":""},"note":"","createdAt":"2024-06-25T06:57:16.324Z"},{"_id":"667a6a4dcd8066064ba6010c","category":7,"name":"hřiště 3","categorization":{"category0":"sport ground","category1":["fotbal"],"category2":"Brno","category3":"hřiště placené","category4":"district","category5":"Bohunice","category6":"Tatran Bohunice"},"gps":{"latitude":16.5757383,"longitude":49.1713,"accurate":true},"dimension":{"width":68,"length":95},"surface":{"value":"tráva","note":""},"price":{"value":null,"date":null,"note":""},"note":"s místy pro diváky (300 míst k sezení, 300 ke stání)","createdAt":"2024-06-25T06:57:16.324Z"}]},{"category":6,"name":"ZŠ a MŠ Vedlejší","category6_data":[{"_id":"667a6a4dcd8066064ba60141","category":6,"name":"ZŠ a MŠ Vedlejší","address":{"street":"Vedlejší 655/10"},"contact":{"web":{"value":"https://www.zsvedlejsi.cz/pronajem-sportovist","note":""},"mail":{"value":"info@zsvedlejsi.cz","note":""},"phone":{"value":602803855,"note":"správce"}}}],"categories7_list":["hřiště 1","hřiště 2","hřiště 3"],"categories7":[{"_id":"667a6a4dcd8066064ba60104","category":7,"name":"hřiště 1","categorization":{"category0":"sport ground","category1":["fotbal","volejbal","házená","florbal"],"category2":"Brno","category3":"hřiště placené","category4":"district","category5":"Bohunice","category6":"ZŠ a MŠ Vedlejší"},"gps":{"latitude":16.5727639,"longitude":49.1711639,"accurate":true},"dimension":{"width":20,"length":40},"surface":{"value":"tartan","note":""},"price":{"value":150,"date":2022,"note":"(pro mládež)(+50 Kč/h pro dospělé)(žáci ZŠ Vedlejší od 16-18 zdarma, platící mají přednost)"},"note":"(fotbal, volejbal, házena, florbal)","createdAt":"2024-06-25T06:57:16.324Z"},{"_id":"667a6a4dcd8066064ba60105","category":7,"name":"hřiště 2","categorization":{"category0":"sport ground","category1":["basketbal","volejbal","nohejbal"],"category2":"Brno","category3":"hřiště placené","category4":"district","category5":"Bohunice","category6":"ZŠ a MŠ Vedlejší"},"gps":{"latitude":16.5727744,"longitude":49.1708658,"accurate":true},"dimension":{"width":15,"length":27},"surface":{"value":"tartan","note":""},"price":{"value":150,"date":2022,"note":"(žáci ZŠ Vedlejší od 16-18 zdarma, platící mají přednost)"},"note":"není na fotbal, nejsou zde brány (basketbal, volejbal, nohejbal)","createdAt":"2024-06-25T06:57:16.324Z"},{"_id":"667a6a4dcd8066064ba60106","category":7,"name":"hřiště 3","categorization":{"category0":"sport ground","category1":["tenis"],"category2":"Brno","category3":"hřiště placené","category4":"district","category5":"Bohunice","category6":"ZŠ a MŠ Vedlejší"},"gps":{"latitude":16.5728161,"longitude":49.1706219,"accurate":true},"dimension":{"width":18,"length":34},"surface":{"value":"umělý povrch s pískem","note":""},"price":{"value":200,"date":2022,"note":"(žáci ZŠ Vedlejší od 16-18 zdarma, platící mají přednost)"},"note":"nejsou zde brány (na tenis)","createdAt":"2024-06-25T06:57:16.324Z"}]},{"category":6,"name":"ZŠ Arménská","category6_data":[{"_id":"667a6a4dcd8066064ba60142","category":6,"name":"ZŠ Arménská","address":{"street":"Arménská 573/21"},"contact":{"web":{"value":"https://www.zsarmenska.cz","note":""},"mail":{"value":"ekonom@zsarmenska.cz","note":""},"phone":{"value":null,"note":""}}}],"categories7_list":["hřiště 1","hřiště 2","hřiště 3","hřiště 4"],"categories7":[{"_id":"667a6a4dcd8066064ba60107","category":7,"name":"hřiště 1","categorization":{"category0":"sport ground","category1":["fotbal"],"category2":"Brno","category3":"hřiště placené","category4":"district","category5":"Bohunice","category6":"ZŠ Arménská"},"gps":{"latitude":16.5804839,"longitude":49.1668831,"accurate":true},"dimension":{"width":25,"length":50},"surface":{"value":"tartan","note":""},"price":{"value":260,"date":null,"note":""},"note":"","createdAt":"2024-06-25T06:57:16.324Z"},{"_id":"667a6a4dcd8066064ba60108","category":7,"name":"hřiště 2","categorization":{"category0":"sport ground","category1":["tenis"],"category2":"Brno","category3":"hřiště placené","category4":"district","category5":"Bohunice","category6":"ZŠ Arménská"},"gps":{"latitude":16.5813517,"longitude":49.1669111,"accurate":true},"dimension":{"width":11,"length":24},"surface":{"value":"antuka","note":"?"},"price":{"value":null,"date":null,"note":""},"note":"na tenis","createdAt":"2024-06-25T06:57:16.324Z"},{"_id":"667a6a4dcd8066064ba60109","category":7,"name":"hřiště 3","categorization":{"category0":"sport ground","category1":["tenis"],"category2":"Brno","category3":"hřiště placené","category4":"district","category5":"Bohunice","category6":"ZŠ Arménská"},"gps":{"latitude":16.581605,"longitude":49.1669092,"accurate":true},"dimension":{"width":11,"length":24},"surface":{"value":"antuka","note":"?"},"price":{"value":null,"date":null,"note":""},"note":"na tenis","createdAt":"2024-06-25T06:57:16.324Z"},{"_id":"667a6a4dcd8066064ba6010a","category":7,"name":"hřiště 4","categorization":{"category0":"sport ground","category1":["tenis"],"category2":"Brno","category3":"hřiště placené","category4":"district","category5":"Bohunice","category6":"ZŠ Arménská"},"gps":{"latitude":16.5818208,"longitude":49.16691,"accurate":true},"dimension":{"width":11,"length":24},"surface":{"value":"antuka","note":"?"},"price":{"value":null,"date":null,"note":""},"note":"na tenis","createdAt":"2024-06-25T06:57:16.324Z"}]}],"retrievedAt":"2024-06-25T07:06:26.927Z"},{"category4":"district","category":5,"name":"Brno-střed","category5_data":[{"_id":"667a6a4dcd8066064ba60189","category":5,"name":"Brno-střed","outdoor_free":{"contact":{"web":{"value":"https://www.brno-stred.cz/mohlo-by-vas-zajimat/sport-a-volny-cas/venkovni-hraci-plochy-a-sportoviste/seznam-sportovist-a-hracich-ploch","note":""}}}}],"categories6_list":["TJ Sokol Brno"],"categories6":[{"category":6,"name":"TJ Sokol Brno","category6_data":[{"_id":"667a6a4dcd8066064ba60168","category":6,"name":"TJ Sokol Brno","address":{"street":"Kounicova 686/22"},"contact":{"web":{"value":"https://www.tjsokolbrno1.cz","note":""},"mail":{"value":"rezervace@tjsokolbrno1.cz","note":""},"phone":{"value":731149080,"note":""}},"outdoor_paid":{"contact":{"web":{"value":"https://sokolbrno1.isportsystem.cz","note":""}}},"indoor":{"contact":{"web":{"value":"https://www.tjsokolbrno1.cz/pronajem/hala-micovych-sportu","note":""}}}}],"categories7_list":["hřiště 1","hřiště 1+2+3","hřiště 2","hřiště 3"],"categories7":[{"_id":"667a6a4dcd8066064ba6012f","category":7,"name":"hřiště 1","categorization":{"category0":"sport ground","category1":["fotbal"],"category2":"Brno","category3":"hřiště placené","category4":"district","category5":"Brno-střed","category6":"TJ Sokol Brno"},"gps":{"latitude":16.6015633,"longitude":49.2038442,"accurate":true},"dimension":{"width":18.5,"length":38},"surface":{"value":"umělý povrch s pískem","note":""},"price":{"value":250,"date":2024,"note":"(všední dny do 16:00)(+100 Kč/h v jiné dny a dobu)"},"note":"","createdAt":"2024-06-25T06:57:16.325Z"},{"_id":"667a6a4dcd8066064ba60132","category":7,"name":"hřiště 1+2+3","categorization":{"category0":"sport ground","category1":["fotbal"],"category2":"Brno","category3":"hřiště placené","category4":"district","category5":"Brno-střed","category6":"TJ Sokol Brno"},"gps":{"latitude":16.6017711,"longitude":49.20395,"accurate":true},"dimension":{"width":38,"length":56},"surface":{"value":"umělý povrch s pískem","note":""},"price":{"value":null,"date":null,"note":""},"note":"","createdAt":"2024-06-25T06:57:16.325Z"},{"_id":"667a6a4dcd8066064ba60130","category":7,"name":"hřiště 2","categorization":{"category0":"sport ground","category1":["fotbal"],"category2":"Brno","category3":"hřiště placené","category4":"district","category5":"Brno-střed","category6":"TJ Sokol Brno"},"gps":{"latitude":16.6017711,"longitude":49.20395,"accurate":true},"dimension":{"width":18.5,"length":38},"surface":{"value":"umělý povrch s pískem","note":""},"price":{"value":250,"date":2024,"note":"(všední dny do 16:00)(+100 Kč/h v jiné dny a dobu)"},"note":"","createdAt":"2024-06-25T06:57:16.325Z"},{"_id":"667a6a4dcd8066064ba60131","category":7,"name":"hřiště 3","categorization":{"category0":"sport ground","category1":["fotbal"],"category2":"Brno","category3":"hřiště placené","category4":"district","category5":"Brno-střed","category6":"TJ Sokol Brno"},"gps":{"latitude":16.601975,"longitude":49.2040528,"accurate":true},"dimension":{"width":18.5,"length":38},"surface":{"value":"umělý povrch s pískem","note":""},"price":{"value":250,"date":2024,"note":"(všední dny do 16:00)(+100 Kč/h v jiné dny a dobu)"},"note":"","createdAt":"2024-06-25T06:57:16.325Z"}]}],"retrievedAt":"2024-06-25T07:06:26.927Z"},{"category4":"district","category":5,"name":"Bystrc","category5_data":[],"categories6_list":["Gymnázium Brno-Bystrc","ZŠ Heyrovského","ZŠ Vejrostova"],"categories6":[{"category":6,"name":"Gymnázium Brno-Bystrc","category6_data":[{"_id":"667a6a4dcd8066064ba60143","category":6,"name":"Gymnázium Brno-Bystrc","address":{"street":"Vejrostova 1143/2"},"contact":{"web":{"value":"https://www.gyby.cz","note":""},"mail":{"value":null,"note":""},"phone":{"value":null,"note":""}}}],"categories7_list":["hřiště"],"categories7":[{"_id":"667a6a4dcd8066064ba6010d","category":7,"name":"hřiště","categorization":{"category0":"sport ground","category1":["fotbal"],"category2":"Brno","category3":"hřiště placené","category4":"district","category5":"Bystrc","category6":"Gymnázium Brno-Bystrc"},"gps":{"latitude":16.5136053,"longitude":49.2190206,"accurate":true},"dimension":{"width":18,"length":42},"surface":{"value":"umělý povrch s pískem","note":""},"price":{"value":233.34,"date":null,"note":"(350 Kč/1.5 h)"},"note":"","createdAt":"2024-06-25T06:57:16.324Z"}]},{"category":6,"name":"ZŠ Heyrovského","category6_data":[{"_id":"667a6a4dcd8066064ba60146","category":6,"name":"ZŠ Heyrovského","address":{"street":"Heyrovského 611/32"},"contact":{"web":{"value":null,"note":""},"mail":{"value":null,"note":""},"phone":{"value":null,"note":""}},"outdoor_free":{"contact":{"web":{"value":"http://zsheyrovskeho32brno.cz/informace-o-skole/skolni-hriste.html","note":""},"mail":{"value":"info@zshey32.cz","note":""},"phone":{"value":605040190,"note":"správce, p. Šťasta"},"phone2":{"value":606757185,"note":"správce, p. Fiala"}}},"outdoor_paid":{"contact":{"web":{"value":"http://zsheyrovskeho32brno.cz/informace-o-skole/skolni-hriste.html","note":""},"mail":{"value":"info@zshey32.cz","note":""},"phone":{"value":605040190,"note":"správce, p. Šťasta"},"phone2":{"value":606757185,"note":"správce, p. Fiala"}}},"indoor":{"contact":{"web":{"value":"http://zsheyrovskeho32brno.cz","note":""},"mail":{"value":"info@zshey32.cz","note":""}}}}],"categories7_list":["víceúčelové hřiště"],"categories7":[{"_id":"667a6a4dcd8066064ba6010e","category":7,"name":"víceúčelové hřiště","categorization":{"category0":"sport ground","category1":["fotbal"],"category2":"Brno","category3":"hřiště placené","category4":"district","category5":"Bystrc","category6":"ZŠ Heyrovského"},"gps":{"latitude":16.5270525,"longitude":49.2284781,"accurate":true},"dimension":{"width":16,"length":35},"surface":{"value":"umělý povrch s pískem","note":""},"price":{"value":100,"date":2024,"note":"(krátkodobý pronájem i 20 Kč/osoba)(děti do 16 let zdarma)(org. skup. pracující s dětmi do 16 let 10 Kč/osoba)(platící mají přednost)"},"note":"","createdAt":"2024-06-25T06:57:16.324Z"}]},{"category":6,"name":"ZŠ Vejrostova","category6_data":[{"_id":"667a6a4dcd8066064ba60147","category":6,"name":"ZŠ Vejrostova","address":{"street":"Vejrostova 1066/1"},"contact":{"web":{"value":null,"note":""},"mail":{"value":null,"note":""},"phone":{"value":null,"note":""}},"outdoor_free":{"contact":{"web":{"value":"https://www.vejrostova.cz/sluzby/sportovni-areal/","note":""}}},"outdoor_paid":{"contact":{"web":{"value":"https://www.vejrostova.cz/sluzby/sportovni-areal/","note":""}}},"indoor":{"contact":{"web":{"value":"https://www.vejrostova.cz","note":""}}}}],"categories7_list":["fotbalové hřiště","víceúčelové hřiště"],"categories7":[{"_id":"667a6a4dcd8066064ba60110","category":7,"name":"fotbalové hřiště","categorization":{"category0":"sport ground","category1":["fotbal"],"category2":"Brno","category3":"hřiště placené","category4":"district","category5":"Bystrc","category6":"ZŠ Vejrostova"},"gps":{"latitude":16.5142706,"longitude":49.2179464,"accurate":true},"dimension":{"width":39,"length":58},"surface":{"value":"umělý povrch s pískem","note":""},"price":{"value":280,"date":2024,"note":"(+20 Kč/h krátkodobý pronájem; krátkodobý i 30 Kč/osoba)(děti do 16 let zdarma)(org. skup. pracující s dětmi do 16 let 200 Kč/h)(platící mají přednost)"},"note":"","createdAt":"2024-06-25T06:57:16.324Z"},{"_id":"667a6a4dcd8066064ba6010f","category":7,"name":"víceúčelové hřiště","categorization":{"category0":"sport ground","category1":["fotbal","basketbal"],"category2":"Brno","category3":"hřiště placené","category4":"district","category5":"Bystrc","category6":"ZŠ Vejrostova"},"gps":{"latitude":16.5131519,"longitude":49.2175225,"accurate":true},"dimension":{"width":13,"length":26},"surface":{"value":"umělý povrch s pískem","note":""},"price":{"value":130,"date":2024,"note":"(+20 Kč/h krátkodobý pronájem)(děti do 16 let zdarma)(org. skup. pracující s dětmi do 16 let 15 Kč/osoba)(platící mají přednost)"},"note":"","createdAt":"2024-06-25T06:57:16.324Z"}]}],"retrievedAt":"2024-06-25T07:06:26.927Z"},{"category4":"district","category":5,"name":"Černovice","category5_data":[],"categories6_list":["ZŠ Řehořova"],"categories6":[{"category":6,"name":"ZŠ Řehořova","category6_data":[{"_id":"667a6a4dcd8066064ba60148","category":6,"name":"ZŠ Řehořova","address":{"street":"Řehořova 1020/3"},"contact":{"web":{"value":"https://www.zsrehorova.cz/o-skole/pronajem-prostor","note":""},"mail":{"value":"sekretariat@zsrehorova.cz","note":""},"phone":{"value":null,"note":""}}}],"categories7_list":["hřiště"],"categories7":[{"_id":"667a6a4dcd8066064ba60111","category":7,"name":"hřiště","categorization":{"category0":"sport ground","category1":["fotbal"],"category2":"Brno","category3":"hřiště placené","category4":"district","category5":"Černovice","category6":"ZŠ Řehořova"},"gps":{"latitude":16.6355728,"longitude":49.1837589,"accurate":true},"dimension":{"width":20,"length":42},"surface":{"value":"umělý povrch s pískem","note":"?"},"price":{"value":400,"date":2024,"note":"(+150 Kč/h při využití šaten se sprchami)(červenec-srpen volně přístupné, bez šaten a sprch)"},"note":"","createdAt":"2024-06-25T06:57:16.324Z"}]}],"retrievedAt":"2024-06-25T07:06:26.927Z"},{"category4":"district","category":5,"name":"Jundrov","category5_data":[],"categories6_list":["ZŠ Jasanová"],"categories6":[{"category":6,"name":"ZŠ Jasanová","category6_data":[{"_id":"667a6a4dcd8066064ba6014b","category":6,"name":"ZŠ Jasanová","address":{"street":"Jasanová 647/2"},"contact":{"web":{"value":"https://zsjundrov.edupage.org","note":""},"web2":{"value":"https://zsjundrov.edupage.org/a/pronajmy-3","note":""},"mail":{"value":null,"note":""},"phone":{"value":null,"note":""}}}],"categories7_list":["hřiště"],"categories7":[{"_id":"667a6a4dcd8066064ba60112","category":7,"name":"hřiště","categorization":{"category0":"sport ground","category1":["fotbal"],"category2":"Brno","category3":"hřiště placené","category4":"district","category5":"Jundrov","category6":"ZŠ Jasanová"},"gps":{"latitude":16.5524669,"longitude":49.2069106,"accurate":true},"dimension":{"width":20,"length":40},"surface":{"value":"umělý povrch s pískem","note":"?"},"price":{"value":300,"date":2024,"note":"(+150 Kč/h osvětlení, +30 Kč/osoba sprchy)(lze užívat zdarma, platící mají přednost)"},"note":"","createdAt":"2024-06-25T06:57:16.324Z"}]}],"retrievedAt":"2024-06-25T07:06:26.927Z"},{"category4":"district","category":5,"name":"Kohoutovice","category5_data":[],"categories6_list":["MOP Brno","Tatran Kohoutovice"],"categories6":[{"category":6,"name":"MOP Brno","category6_data":[{"_id":"667a6a4dcd8066064ba6014c","category":6,"name":"MOP Brno","address":{"street":"Žebětínská 821/70"},"contact":{"web":{"value":"https://mopbrno.cz/sportoviste-a-detska-hriste/","note":""},"mail":{"value":"chalabalova@mopbrno.cz","note":""},"phone":{"value":null,"note":""}}}],"categories7_list":["hřiště 1 (Chalabalova)","hřiště 1+2 (Chalabalova)","hřiště 2 (Chalabalova)","malo hřiště 1 (Chalabalova)","malo hřiště 2 (Chalabalova)"],"categories7":[{"_id":"667a6a4dcd8066064ba60113","category":7,"name":"hřiště 1 (Chalabalova)","categorization":{"category0":"sport ground","category1":["fotbal"],"category2":"Brno","category3":"hřiště placené","category4":"district","category5":"Kohoutovice","category6":"MOP Brno"},"gps":{"latitude":16.5406972,"longitude":49.1928219,"accurate":true},"dimension":{"width":32,"length":44},"surface":{"value":"umělá tráva 3. generace","note":""},"price":{"value":null,"date":null,"note":""},"note":"(kabiny, sprchy), (jde o polovinu velkého hřiště, tato se prý nepronajímá, možná podle dohody)","createdAt":"2024-06-25T06:57:16.324Z"},{"_id":"667a6a4dcd8066064ba60115","category":7,"name":"hřiště 1+2 (Chalabalova)","categorization":{"category0":"sport ground","category1":["fotbal"],"category2":"Brno","category3":"hřiště placené","category4":"district","category5":"Kohoutovice","category6":"MOP Brno"},"gps":{"latitude":16.5405833,"longitude":49.1927028,"accurate":true},"dimension":{"width":44,"length":64},"surface":{"value":"umělá tráva 3. generace","note":""},"price":{"value":650,"date":2024,"note":"(pro mládež)(+100 Kč/h pro dospělé, +150 Kč/h osvětlení)"},"note":"(kabiny, sprchy)","createdAt":"2024-06-25T06:57:16.324Z"},{"_id":"667a6a4dcd8066064ba60114","category":7,"name":"hřiště 2 (Chalabalova)","categorization":{"category0":"sport ground","category1":["fotbal"],"category2":"Brno","category3":"hřiště placené","category4":"district","category5":"Kohoutovice","category6":"MOP Brno"},"gps":{"latitude":16.5404517,"longitude":49.19258,"accurate":true},"dimension":{"width":32,"length":44},"surface":{"value":"umělá tráva 3. generace","note":""},"price":{"value":null,"date":null,"note":""},"note":"(kabiny, sprchy), (jde o polovinu velkého hřiště, tato se prý nepronajímá, možná podle dohody)","createdAt":"2024-06-25T06:57:16.324Z"},{"_id":"667a6a4dcd8066064ba60116","category":7,"name":"malo hřiště 1 (Chalabalova)","categorization":{"category0":"sport ground","category1":["nohejbal","basketbal","volejbal"],"category2":"Brno","category3":"hřiště placené","category4":"district","category5":"Kohoutovice","category6":"MOP Brno"},"gps":{"latitude":16.5408208,"longitude":49.1923681,"accurate":true},"dimension":{"width":18,"length":30},"surface":{"value":"umělý povrch s pískem","note":""},"price":{"value":null,"date":null,"note":""},"note":"(nohejbal, basketbal, volejbal)","createdAt":"2024-06-25T06:57:16.324Z"},{"_id":"667a6a4dcd8066064ba60117","category":7,"name":"malo hřiště 2 (Chalabalova)","categorization":{"category0":"sport ground","category1":["nohejbal","volejbal"],"category2":"Brno","category3":"hřiště placené","category4":"district","category5":"Kohoutovice","category6":"MOP Brno"},"gps":{"latitude":16.5409939,"longitude":49.19227,"accurate":true},"dimension":{"width":15,"length":25},"surface":{"value":"umělý povrch s pískem","note":""},"price":{"value":null,"date":null,"note":""},"note":"(nohejbal, volejbal)","createdAt":"2024-06-25T06:57:16.324Z"}]},{"category":6,"name":"Tatran Kohoutovice","category6_data":[{"_id":"667a6a4dcd8066064ba6014d","category":6,"name":"Tatran Kohoutovice","address":{"street":"Voříškova 864/59"},"contact":{"web":{"value":"https://www.tatrankohoutovice.cz","note":""},"mail":{"value":null,"note":""},"phone":{"value":null,"note":""}}}],"categories7_list":["hřiště"],"categories7":[{"_id":"667a6a4dcd8066064ba60118","category":7,"name":"hřiště","categorization":{"category0":"sport ground","category1":["fotbal"],"category2":"Brno","category3":"hřiště placené","category4":"district","category5":"Kohoutovice","category6":"Tatran Kohoutovice"},"gps":{"latitude":16.5366761,"longitude":49.1989564,"accurate":true},"dimension":{"width":65,"length":100},"surface":{"value":"tráva","note":""},"price":{"value":null,"date":null,"note":""},"note":"?asi nepřístupné?","createdAt":"2024-06-25T06:57:16.324Z"}]}],"retrievedAt":"2024-06-25T07:06:26.927Z"},{"category4":"district","category":5,"name":"Komárov","category5_data":[],"categories6_list":["Komec","Masarykova univerzita, VŠ koleje","ZŠ Tuháčkova"],"categories6":[{"category":6,"name":"Komec","category6_data":[{"_id":"667a6a4dcd8066064ba60150","category":6,"name":"Komec","address":{"street":"Hněvkovského 730/62c"},"contact":{"web":{"value":"https://www.komec.cz","note":""},"web2":{"value":"https://komec.isportsystem.cz","note":""},"mail":{"value":null,"note":""},"phone":{"value":null,"note":""}}}],"categories7_list":["tenisové hřiště 1","tenisové hřiště 2","tenisové hřiště 3"],"categories7":[{"_id":"667a6a4dcd8066064ba60119","category":7,"name":"tenisové hřiště 1","categorization":{"category0":"sport ground","category1":["fotbal"],"category2":"Brno","category3":"hřiště placené","category4":"district","category5":"Komárov","category6":"Komec"},"gps":{"latitude":16.6234594,"longitude":49.1693264,"accurate":true},"dimension":{"width":10,"length":24},"surface":{"value":"umělý povrch s pískem","note":""},"price":{"value":null,"date":null,"note":""},"note":"","createdAt":"2024-06-25T06:57:16.324Z"},{"_id":"667a6a4dcd8066064ba6011a","category":7,"name":"tenisové hřiště 2","categorization":{"category0":"sport ground","category1":["fotbal"],"category2":"Brno","category3":"hřiště placené","category4":"district","category5":"Komárov","category6":"Komec"},"gps":{"latitude":16.6236781,"longitude":49.1693317,"accurate":true},"dimension":{"width":10,"length":24},"surface":{"value":"umělý povrch s pískem","note":""},"price":{"value":null,"date":null,"note":""},"note":"","createdAt":"2024-06-25T06:57:16.324Z"},{"_id":"667a6a4dcd8066064ba6011b","category":7,"name":"tenisové hřiště 3","categorization":{"category0":"sport ground","category1":["fotbal"],"category2":"Brno","category3":"hřiště placené","category4":"district","category5":"Komárov","category6":"Komec"},"gps":{"latitude":16.6238994,"longitude":49.1693342,"accurate":true},"dimension":{"width":10,"length":24},"surface":{"value":"umělý povrch s pískem","note":""},"price":{"value":null,"date":null,"note":""},"note":"","createdAt":"2024-06-25T06:57:16.324Z"}]},{"category":6,"name":"Masarykova univerzita, VŠ koleje","category6_data":[{"_id":"667a6a4dcd8066064ba60151","category":6,"name":"Masarykova univerzita, VŠ koleje","address":{"street":"Bratří Žůrků 591/5"}}],"categories7_list":["hřiště"],"categories7":[{"_id":"667a6a4dcd8066064ba6011c","category":7,"name":"hřiště","categorization":{"category0":"sport ground","category1":["fotbal"],"category2":"Brno","category3":"hřiště placené","category4":"district","category5":"Komárov","category6":"Masarykova univerzita, VŠ koleje"},"gps":{"latitude":16.6290861,"longitude":49.1736017,"accurate":true},"dimension":{"width":22,"length":41},"surface":{"value":"umělý povrch s pískem","note":"skoro bez písku"},"price":{"value":null,"date":null,"note":"(kdo bydlí na kolejích, si může půjčit klíče zdarma)"},"note":"","createdAt":"2024-06-25T06:57:16.325Z"}]},{"category":6,"name":"ZŠ Tuháčkova","category6_data":[{"_id":"667a6a4dcd8066064ba60152","category":6,"name":"ZŠ Tuháčkova","address":{"street":"Tuháčkova 23/25"}}],"categories7_list":["hřiště"],"categories7":[{"_id":"667a6a4dcd8066064ba6011d","category":7,"name":"hřiště","categorization":{"category0":"sport ground","category1":["fotbal"],"category2":"Brno","category3":"hřiště placené","category4":"district","category5":"Komárov","category6":"ZŠ Tuháčkova"},"gps":{"latitude":16.6255858,"longitude":49.1777614,"accurate":true},"dimension":{"width":20,"length":40},"surface":{"value":"umělý povrch s pískem","note":""},"price":{"value":null,"date":null,"note":""},"note":"hřiště není oploceno (balóny odlétávají z jedné strany dál za hranice hřiště)","createdAt":"2024-06-25T06:57:16.325Z"}]}],"retrievedAt":"2024-06-25T07:06:26.927Z"},{"category4":"district","category":5,"name":"Komín","category5_data":[],"categories6_list":["ZŠ a MŠ Pastviny"],"categories6":[{"category":6,"name":"ZŠ a MŠ Pastviny","category6_data":[{"_id":"667a6a4dcd8066064ba60155","category":6,"name":"ZŠ a MŠ Pastviny","address":{"street":"Pastviny 718/70"},"contact":{"web":{"value":"https://www.zspastviny.cz/nase-skola/pronajmy-prostor","note":""},"mail":{"value":"pronajmy@zspastviny.cz","note":""},"phone":{"value":null,"note":""}},"outdoor_paid":{"note1":"(wc a šatny při dlouhodobém pronájmu v ceně, při krátkodobém 200/den (2022))"},"indoor":{"note1":"(wc při dlouhodobém pronájmu v ceně, při krátkodobém 30 Kč/h (2022))"}}],"categories7_list":["atletický ovál","hřiště 1","hřiště 2.1 (skupina)","hřiště 2.2 (tenis)"],"categories7":[{"_id":"667a6a4dcd8066064ba60121","category":7,"name":"atletický ovál","categorization":{"category0":"sport ground","category1":["běh"],"category2":"Brno","category3":"hřiště placené","category4":"district","category5":"Komín","category6":"ZŠ a MŠ Pastviny"},"gps":{"latitude":16.5598072,"longitude":49.2218764,"accurate":true},"dimension":{"width":null,"length":null},"surface":{"value":"tartan","note":""},"price":{"value":200,"date":2022,"note":""},"note":"","createdAt":"2024-06-25T06:57:16.325Z"},{"_id":"667a6a4dcd8066064ba6011e","category":7,"name":"hřiště 1","categorization":{"category0":"sport ground","category1":["fotbal"],"category2":"Brno","category3":"hřiště placené","category4":"district","category5":"Komín","category6":"ZŠ a MŠ Pastviny"},"gps":{"latitude":16.56025,"longitude":49.2214436,"accurate":true},"dimension":{"width":23,"length":43},"surface":{"value":"umělá tráva","note":""},"price":{"value":300,"date":2022,"note":"(+100 Kč/h osvětlení)"},"note":"(s mantinely)","createdAt":"2024-06-25T06:57:16.325Z"},{"_id":"667a6a4dcd8066064ba6011f","category":7,"name":"hřiště 2.1 (skupina)","categorization":{"category0":"sport ground","category1":["fotbal","basketbal"],"category2":"Brno","category3":"hřiště placené","category4":"district","category5":"Komín","category6":"ZŠ a MŠ Pastviny"},"gps":{"latitude":16.5603411,"longitude":49.2212292,"accurate":true},"dimension":{"width":15,"length":34},"surface":{"value":"tartan","note":""},"price":{"value":270,"date":2022,"note":"(+100 Kč/h osvětlení)"},"note":"možná není na fotbal (možná zde nejsou brány)","createdAt":"2024-06-25T06:57:16.325Z"},{"_id":"667a6a4dcd8066064ba60120","category":7,"name":"hřiště 2.2 (tenis)","categorization":{"category0":"sport ground","category1":["tenis"],"category2":"Brno","category3":"hřiště placené","category4":"district","category5":"Komín","category6":"ZŠ a MŠ Pastviny"},"gps":{"latitude":16.5603411,"longitude":49.2212292,"accurate":true},"dimension":{"width":11,"length":24},"surface":{"value":"tartan","note":""},"price":{"value":140,"date":2022,"note":"(70 Kč/h/osoba; +100 Kč/h osvětlení)"},"note":"(je to totéž hřiště, je nalajnované i na tenis)","createdAt":"2024-06-25T06:57:16.325Z"}]}],"retrievedAt":"2024-06-25T07:06:26.927Z"},{"category4":"district","category":5,"name":"Královo pole","category5_data":[],"categories6_list":["Starez, TC Lužánky malý fotbal"],"categories6":[{"category":6,"name":"Starez, TC Lužánky malý fotbal","category6_data":[{"_id":"667a6a4dcd8066064ba60157","category":6,"name":"Starez, TC Lužánky malý fotbal","address":{"street":"Sportovní 347/2"},"contact":{"web":{"value":"https://fotbal.starez.cz/tc-luzanky-maly-fotbal","note":""},"mail":{"value":null,"note":""},"phone":{"value":null,"note":""}}}],"categories7_list":["hřiště"],"categories7":[{"_id":"667a6a4dcd8066064ba60122","category":7,"name":"hřiště","categorization":{"category0":"sport ground","category1":["fotbal"],"category2":"Brno","category3":"hřiště placené","category4":"district","category5":"Královo pole","category6":"Starez, TC Lužánky malý fotbal"},"gps":{"latitude":16.6090231,"longitude":49.2107625,"accurate":true},"dimension":{"width":28,"length":48},"surface":{"value":"umělá tráva","note":""},"price":{"value":480,"date":2024,"note":"(+455 Kč/h s osvětlením)(osvětlení se platí po 30 minutách)"},"note":"","createdAt":"2024-06-25T06:57:16.325Z"}]}],"retrievedAt":"2024-06-25T07:06:26.927Z"},{"category4":"district","category":5,"name":"Líšeň","category5_data":[],"categories6_list":["Salesko","ubytovna při SOU strojírenská a elektrotechnická"],"categories6":[{"category":6,"name":"Salesko","category6_data":[{"_id":"667a6a4dcd8066064ba6015d","category":6,"name":"Salesko","address":{"street":"Kotlanova 2660/13"}}],"categories7_list":["hřiště 1","hřiště 1+2","hřiště 2"],"categories7":[{"_id":"667a6a4dcd8066064ba6012a","category":7,"name":"hřiště 1","categorization":{"category0":"sport ground","category1":["fotbal"],"category2":"Brno","category3":"hřiště placené","category4":"district","category5":"Líšeň","category6":"Salesko"},"gps":{"latitude":16.6819222,"longitude":49.2109942,"accurate":true},"dimension":{"width":20,"length":30},"surface":{"value":"umělý povrch s pískem","note":""},"price":{"value":200,"date":null,"note":""},"note":"","createdAt":"2024-06-25T06:57:16.325Z"},{"_id":"667a6a4dcd8066064ba6012c","category":7,"name":"hřiště 1+2","categorization":{"category0":"sport ground","category1":["fotbal"],"category2":"Brno","category3":"hřiště placené","category4":"district","category5":"Líšeň","category6":"Salesko"},"gps":{"latitude":16.6821072,"longitude":49.2109933,"accurate":true},"dimension":{"width":30,"length":48},"surface":{"value":"umělý povrch s pískem","note":""},"price":{"value":400,"date":null,"note":""},"note":"","createdAt":"2024-06-25T06:57:16.325Z"},{"_id":"667a6a4dcd8066064ba6012b","category":7,"name":"hřiště 2","categorization":{"category0":"sport ground","category1":["fotbal"],"category2":"Brno","category3":"hřiště placené","category4":"district","category5":"Líšeň","category6":"Salesko"},"gps":{"latitude":16.6822936,"longitude":49.2109942,"accurate":true},"dimension":{"width":20,"length":30},"surface":{"value":"umělý povrch s pískem","note":""},"price":{"value":200,"date":null,"note":""},"note":"","createdAt":"2024-06-25T06:57:16.325Z"}]},{"category":6,"name":"ubytovna při SOU strojírenská a elektrotechnická","category6_data":[{"_id":"667a6a4dcd8066064ba6015f","category":6,"name":"ubytovna při SOU strojírenská a elektrotechnická","address":{"street":"Jedovnická 2348/10"},"contact":{"web":{"value":"https://www.ubytovna-hotel.cz/kontakty","note":""},"mail":{"value":"recepce@sssebrno.cz","note":""},"phone":{"value":774990783,"note":""}}}],"categories7_list":["víceúčelové hřiště"],"categories7":[{"_id":"667a6a4dcd8066064ba6012d","category":7,"name":"víceúčelové hřiště","categorization":{"category0":"sport ground","category1":["fotbal"],"category2":"Brno","category3":"hřiště placené","category4":"district","category5":"Líšeň","category6":"ubytovna při SOU strojírenská a elektrotechnická"},"gps":{"latitude":16.6686217,"longitude":49.2001597,"accurate":true},"dimension":{"width":20,"length":40},"surface":{"value":"umělý povrch s pískem","note":""},"price":{"value":300,"date":2024,"note":"(+50 Kč/h zapůjčení míče)"},"note":"","createdAt":"2024-06-25T06:57:16.325Z"}]}],"retrievedAt":"2024-06-25T07:06:26.927Z"},{"category4":"district","category":5,"name":"Maloměřice a Obřany","category5_data":[],"categories6_list":["SK Obřany"],"categories6":[{"category":6,"name":"SK Obřany","category6_data":[{"_id":"667a6a4dcd8066064ba60161","category":6,"name":"SK Obřany","address":{"street":"Zlatníky 656/1a"},"contact":{"web":{"value":"http://skobrany.cz","note":""},"mail":{"value":null,"note":""},"phone":{"value":null,"note":""}}}],"categories7_list":["hřiště"],"categories7":[{"_id":"667a6a4dcd8066064ba6012e","category":7,"name":"hřiště","categorization":{"category0":"sport ground","category1":["fotbal"],"category2":"Brno","category3":"hřiště placené","category4":"district","category5":"Maloměřice a Obřany","category6":"SK Obřany"},"gps":{"latitude":16.6396922,"longitude":49.2271639,"accurate":true},"dimension":{"width":24,"length":42},"surface":{"value":"umělá tráva","note":""},"price":{"value":600,"date":2024,"note":"(+150 Kč/h s osvětlením)"},"note":"","createdAt":"2024-06-25T06:57:16.325Z"}]}],"retrievedAt":"2024-06-25T07:06:26.927Z"},{"category4":"district","category":5,"name":"Nový Lískovec","category5_data":[],"categories6_list":["Brněnská Asociace Futsalu","ZŠ Kamínky","ZŠ Svážná"],"categories6":[{"category":6,"name":"Brněnská Asociace Futsalu","category6_data":[{"_id":"667a6a4dcd8066064ba60158","category":6,"name":"Brněnská Asociace Futsalu","address":{"street":"Rybnická 60/75"},"contact":{"web":{"value":"http://www.futsalbrno.cz/kontakty/","note":""},"mail":{"value":"bamako.polak@volny.cz","note":""},"phone":{"value":777652077,"note":""}}}],"categories7_list":["hřiště"],"categories7":[{"_id":"667a6a4dcd8066064ba60123","category":7,"name":"hřiště","categorization":{"category0":"sport ground","category1":["fotbal"],"category2":"Brno","category3":"hřiště placené","category4":"district","category5":"Nový Lískovec","category6":"Brněnská Asociace Futsalu"},"gps":{"latitude":16.5631431,"longitude":49.1803239,"accurate":true},"dimension":{"width":20,"length":38},"surface":{"value":"umělý povrch s pískem","note":""},"price":{"value":null,"date":null,"note":"(při delším pronájmu možné sjednat sleva)"},"note":"(přes zimu předěláno na nafukovací halu - pronájem je dražší)","createdAt":"2024-06-25T06:57:16.325Z"}]},{"category":6,"name":"ZŠ Kamínky","category6_data":[{"_id":"667a6a4dcd8066064ba60159","category":6,"name":"ZŠ Kamínky","address":{"street":"Kamínky 368/5"},"contact":{"web":{"value":"https://www.zskaminky.cz/pronajem_prostor/","note":""},"mail":{"value":null,"note":""},"phone":{"value":null,"note":""}}}],"categories7_list":["hřiště 1","hřiště 2"],"categories7":[{"_id":"667a6a4dcd8066064ba60124","category":7,"name":"hřiště 1","categorization":{"category0":"sport ground","category1":["fotbal"],"category2":"Brno","category3":"hřiště placené","category4":"district","category5":"Nový Lískovec","category6":"ZŠ Kamínky"},"gps":{"latitude":16.5580947,"longitude":49.1772736,"accurate":true},"dimension":{"width":18.5,"length":36},"surface":{"value":"umělý povrch s pískem","note":""},"price":{"value":350,"date":2024,"note":"(+50 Kč/h s osvětlením)"},"note":"","createdAt":"2024-06-25T06:57:16.325Z"},{"_id":"667a6a4dcd8066064ba60125","category":7,"name":"hřiště 2","categorization":{"category0":"sport ground","category1":["fotbal"],"category2":"Brno","category3":"hřiště placené","category4":"district","category5":"Nový Lískovec","category6":"ZŠ Kamínky"},"gps":{"latitude":16.5573503,"longitude":49.1773972,"accurate":true},"dimension":{"width":20,"length":40},"surface":{"value":"umělý povrch s pískem","note":""},"price":{"value":400,"date":2024,"note":"(+50 Kč/h s osvětlením)"},"note":"(v listopadu až březnu je předěláno na přetlakovou halu - pronájem je dražší)","createdAt":"2024-06-25T06:57:16.325Z"}]},{"category":6,"name":"ZŠ Svážná","category6_data":[{"_id":"667a6a4dcd8066064ba6015a","category":6,"name":"ZŠ Svážná","address":{"street":"Svážná 438/9"},"contact":{"web":{"value":"https://www.zssvazna.cz/hriste/d-1207","note":""},"mail":{"value":"skola@zssvazna.cz","note":""},"phone":{"value":null,"note":""}},"indoor":{"note1":"skupiny prac. s mládeží mohou mít cenu pro pracovní dny do 17:00 zvýhodněnu na 200 Kč/h"}}],"categories7_list":["hřiště 1","hřiště 2"],"categories7":[{"_id":"667a6a4dcd8066064ba60126","category":7,"name":"hřiště 1","categorization":{"category0":"sport ground","category1":["fotbal"],"category2":"Brno","category3":"hřiště placené","category4":"district","category5":"Nový Lískovec","category6":"ZŠ Svážná"},"gps":{"latitude":16.5544533,"longitude":49.1740756,"accurate":true},"dimension":{"width":20,"length":40},"surface":{"value":"tartan","note":""},"price":{"value":null,"date":null,"note":""},"note":"","createdAt":"2024-06-25T06:57:16.325Z"},{"_id":"667a6a4dcd8066064ba60127","category":7,"name":"hřiště 2","categorization":{"category0":"sport ground","category1":["fotbal"],"category2":"Brno","category3":"hřiště placené","category4":"district","category5":"Nový Lískovec","category6":"ZŠ Svážná"},"gps":{"latitude":16.55341,"longitude":49.1740053,"accurate":true},"dimension":{"width":20,"length":40},"surface":{"value":"umělý povrch s pískem","note":""},"price":{"value":null,"date":null,"note":""},"note":"","createdAt":"2024-06-25T06:57:16.325Z"}]}],"retrievedAt":"2024-06-25T07:06:26.927Z"},{"category4":"district","category":5,"name":"Starý Lískovec","category5_data":[],"categories6_list":["ZŠ Labská"],"categories6":[{"category":6,"name":"ZŠ Labská","category6_data":[{"_id":"667a6a4dcd8066064ba6015b","category":6,"name":"ZŠ Labská","address":{"street":"Labská 269/27"},"contact":{"web":{"value":"https://www.zslabska.cz/pronajem-prostor","note":""},"mail":{"value":"skola@zslabska.cz","note":""},"phone":{"value":547218165,"note":""}}}],"categories7_list":["hřiště 1","hřiště 2"],"categories7":[{"_id":"667a6a4dcd8066064ba60128","category":7,"name":"hřiště 1","categorization":{"category0":"sport ground","category1":["fotbal"],"category2":"Brno","category3":"hřiště placené","category4":"district","category5":"Starý Lískovec","category6":"ZŠ Labská"},"gps":{"latitude":16.5594442,"longitude":49.1697583,"accurate":true},"dimension":{"width":32,"length":53},"surface":{"value":"tráva","note":""},"price":{"value":null,"date":null,"note":""},"note":"(dlouhodobý pronájem; jednorázový jen pro velké sportovní akce)","createdAt":"2024-06-25T06:57:16.325Z"},{"_id":"667a6a4dcd8066064ba60129","category":7,"name":"hřiště 2","categorization":{"category0":"sport ground","category1":["fotbal"],"category2":"Brno","category3":"hřiště placené","category4":"district","category5":"Starý Lískovec","category6":"ZŠ Labská"},"gps":{"latitude":16.5599378,"longitude":49.1697619,"accurate":true},"dimension":{"width":15.5,"length":34},"surface":{"value":"umělý povrch s pískem","note":""},"price":{"value":null,"date":null,"note":""},"note":"(dlouhodobý pronájem; jednorázový jen pro velké sportovní akce)","createdAt":"2024-06-25T06:57:16.325Z"}]}],"retrievedAt":"2024-06-25T07:06:26.927Z"},{"category4":"district","category":5,"name":"Tuřany","category5_data":[],"categories6_list":["Colatransport"],"categories6":[{"category":6,"name":"Colatransport","category6_data":[{"_id":"667a6a4dcd8066064ba60177","category":6,"name":"Colatransport","address":{"street":"Písníky 409/18"},"contact":{"web":{"value":"https://www.colatransport.cz/sport","note":""},"mail":{"value":null,"note":""},"phone":{"value":null,"note":""}}}],"categories7_list":["tenisové hřiště 1","tenisové hřiště 2"],"categories7":[{"_id":"667a6a4dcd8066064ba60133","category":7,"name":"tenisové hřiště 1","categorization":{"category0":"sport ground","category1":["tenis"],"category2":"Brno","category3":"hřiště placené","category4":"district","category5":"Tuřany","category6":"Colatransport"},"gps":{"latitude":16.6551169,"longitude":49.1427689,"accurate":true},"dimension":{"width":11,"length":24},"surface":{"value":"umělý povrch s pískem","note":""},"price":{"value":100,"date":2024,"note":""},"note":"","createdAt":"2024-06-25T06:57:16.325Z"},{"_id":"667a6a4dcd8066064ba60134","category":7,"name":"tenisové hřiště 2","categorization":{"category0":"sport ground","category1":["tenis"],"category2":"Brno","category3":"hřiště placené","category4":"district","category5":"Tuřany","category6":"Colatransport"},"gps":{"latitude":16.6550808,"longitude":49.1430961,"accurate":true},"dimension":{"width":11,"length":24},"surface":{"value":"umělý povrch s pískem","note":""},"price":{"value":100,"date":2024,"note":""},"note":"","createdAt":"2024-06-25T06:57:16.325Z"}]}],"retrievedAt":"2024-06-25T07:06:26.927Z"},{"category4":"district","category":5,"name":"Židenice","category5_data":[],"categories6_list":["ZŠ Čejkovická"],"categories6":[{"category":6,"name":"ZŠ Čejkovická","category6_data":[{"_id":"667a6a4dcd8066064ba6017f","category":6,"name":"ZŠ Čejkovická","address":{"street":"Čejkovická 4339/10"}}],"categories7_list":["hřiště"],"categories7":[{"_id":"667a6a4dcd8066064ba60135","category":7,"name":"hřiště","categorization":{"category0":"sport ground","category1":["fotbal"],"category2":"Brno","category3":"hřiště placené","category4":"district","category5":"Židenice","category6":"ZŠ Čejkovická"},"gps":{"latitude":16.6636667,"longitude":49.2007261,"accurate":true},"dimension":{"width":20,"length":38},"surface":{"value":"umělý povrch s pískem","note":""},"price":{"value":null,"date":null,"note":""},"note":"","createdAt":"2024-06-25T06:57:16.325Z"}]}],"retrievedAt":"2024-06-25T07:06:26.927Z"},{"category4":"university","category":5,"name":"MU","category5_data":[{"_id":"667a6a4dcd8066064ba6018a","category":5,"name":"MU","contact":{"web":{"value":"https://www.fsps.muni.cz/pronajmy/sportoviste","note":""}},"note1":"rezervace možné i o víkendu"}],"categories6_list":["Areál Veslařská"],"categories6":[{"category":6,"name":"Areál Veslařská","category6_data":[{"_id":"667a6a4dcd8066064ba60181","category":6,"name":"Areál Veslařská","address":{"street":"Veslařská 434/183","district":"Jundrov"}}],"categories7_list":["hřiště"],"categories7":[{"_id":"667a6a4dcd8066064ba60136","category":7,"name":"hřiště","categorization":{"category0":"sport ground","category1":["fotbal","nohejbal","volejbal","tenis"],"category2":"Brno","category3":"hřiště placené","category4":"university","category5":"MU","category6":"Areál Veslařská"},"gps":{"latitude":16.5667372,"longitude":49.1998703,"accurate":true},"dimension":{"width":16,"length":33},"surface":{"value":"umělý povrch s pískem","note":"?"},"price":{"value":500,"date":2024,"note":""},"note":"(fotbal, nohejbal, volejbal, tenis)","createdAt":"2024-06-25T06:57:16.325Z"}]}],"retrievedAt":"2024-06-25T07:06:26.927Z"},{"category4":"university","category":5,"name":"VUT","category5_data":[{"_id":"667a6a4dcd8066064ba6018b","category":5,"name":"VUT","contact":{"web":{"value":"https://www.cesa.vut.cz/verejnost/arealy","note":""},"web2":{"value":"https://www.cesa.vut.cz/cesa/info/normy/pokyn-c-4-2022-cenik-najmu-a-telovychovnych-sluzeb-ve-sportovnich-zarizenich-vut-v-brne-d235222","note":""}}}],"categories6_list":["areál Purkyňových kolejí","Sportovní areál Pod Palackého vrchem"],"categories6":[{"category":6,"name":"areál Purkyňových kolejí","category6_data":[{"_id":"667a6a4dcd8066064ba60188","category":6,"name":"areál Purkyňových kolejí","address":{"street":"Purkyňova 2640/93","district":"Královo Pole"},"contact":{"web":{"value":"https://www.kam.vutbr.cz/21default.aspx?p=doku","note":"ceník"},"mail":{"value":null,"note":""},"phone":{"value":null,"note":""}},"note1":"provoz zajišťuje vrátnice B06"}],"categories7_list":["hřiště"],"categories7":[{"_id":"667a6a4dcd8066064ba6013c","category":7,"name":"hřiště","categorization":{"category0":"sport ground","category1":["fotbal"],"category2":"Brno","category3":"hřiště placené","category4":"university","category5":"VUT","category6":"areál Purkyňových kolejí"},"gps":{"latitude":16.5824961,"longitude":49.223685,"accurate":true},"dimension":{"width":19,"length":33},"surface":{"value":"umělý povrch s pískem","note":""},"price":{"value":220,"date":2024,"note":"(studenti a zaměstnanci VUT)(+80 Kč/h ostatní, +90 Kč/h osvětlení)"},"note":"","createdAt":"2024-06-25T06:57:16.325Z"}]},{"category":6,"name":"Sportovní areál Pod Palackého vrchem","category6_data":[{"_id":"667a6a4dcd8066064ba60186","category":6,"name":"Sportovní areál Pod Palackého vrchem","address":{"street":"Technická 3013/14","district":"Královo Pole"},"contact":{"web":{"value":"https://www.cesa.vut.cz/verejnost/arealy/ppv","note":""},"mail":{"value":"sappv@vut.cz","note":""},"phone":{"value":null,"note":""}}}],"categories7_list":["fotbalové hřiště (malá kopaná) 1","fotbalové hřiště (malá kopaná) 2","víceúčelové hřiště 1","víceúčelové hřiště 2","víceúčelový stadion (sa ppv vs)"],"categories7":[{"_id":"667a6a4dcd8066064ba60138","category":7,"name":"fotbalové hřiště (malá kopaná) 1","categorization":{"category0":"sport ground","category1":["fotbal"],"category2":"Brno","category3":"hřiště placené","category4":"university","category5":"VUT","category6":"Sportovní areál Pod Palackého vrchem"},"gps":{"latitude":16.5712019,"longitude":49.2271711,"accurate":true},"dimension":{"width":26,"length":50},"surface":{"value":"umělá tráva","note":"s černými gumovými kuličkami"},"price":{"value":null,"date":null,"note":""},"note":"(část celého stadionu sa ppv vs)","createdAt":"2024-06-25T06:57:16.325Z"},{"_id":"667a6a4dcd8066064ba60139","category":7,"name":"fotbalové hřiště (malá kopaná) 2","categorization":{"category0":"sport ground","category1":["fotbal"],"category2":"Brno","category3":"hřiště placené","category4":"university","category5":"VUT","category6":"Sportovní areál Pod Palackého vrchem"},"gps":{"latitude":16.5709872,"longitude":49.2274592,"accurate":true},"dimension":{"width":26,"length":50},"surface":{"value":"umělá tráva","note":"s černými gumovými kuličkami"},"price":{"value":null,"date":null,"note":""},"note":"(část celého stadionu sa ppv vs)","createdAt":"2024-06-25T06:57:16.325Z"},{"_id":"667a6a4dcd8066064ba6013a","category":7,"name":"víceúčelové hřiště 1","categorization":{"category0":"sport ground","category1":["fotbal","basketbal"],"category2":"Brno","category3":"hřiště placené","category4":"university","category5":"VUT","category6":"Sportovní areál Pod Palackého vrchem"},"gps":{"latitude":16.5714903,"longitude":49.2267742,"accurate":true},"dimension":{"width":15,"length":28},"surface":{"value":"mondo","note":""},"price":{"value":null,"date":null,"note":""},"note":"(za bránou stadionu sa ppv vs)(asi není na fotbal, ale basketbal)","createdAt":"2024-06-25T06:57:16.325Z"},{"_id":"667a6a4dcd8066064ba6013b","category":7,"name":"víceúčelové hřiště 2","categorization":{"category0":"sport ground","category1":["fotbal","basketbal"],"category2":"Brno","category3":"hřiště placené","category4":"university","category5":"VUT","category6":"Sportovní areál Pod Palackého vrchem"},"gps":{"latitude":16.5706897,"longitude":49.2278533,"accurate":true},"dimension":{"width":15,"length":28},"surface":{"value":"mondo","note":""},"price":{"value":null,"date":null,"note":""},"note":"(za bránou stadionu sa ppv vs)(asi není na fotbal, ale basketbal)","createdAt":"2024-06-25T06:57:16.325Z"},{"_id":"667a6a4dcd8066064ba60137","category":7,"name":"víceúčelový stadion (sa ppv vs)","categorization":{"category0":"sport ground","category1":["fotbal"],"category2":"Brno","category3":"hřiště placené","category4":"university","category5":"VUT","category6":"Sportovní areál Pod Palackého vrchem"},"gps":{"latitude":16.5710961,"longitude":49.2273156,"accurate":true},"dimension":{"width":65,"length":105},"surface":{"value":"umělá tráva","note":"s černými gumovými kuličkami"},"price":{"value":null,"date":null,"note":""},"note":"","createdAt":"2024-06-25T06:57:16.325Z"}]}],"retrievedAt":"2024-06-25T07:06:26.927Z"}]

 return DATA;
}

*/

export {submit, directEnterPage, reset}




/* for setCheckboxes.js and setLogic.js */

// function "initialCheck" is used by "letOnlyOneCheckboxBeSelected_of" (which is imported and used by "setCheckboxes.js") and function "reset" (which is imported and used by "setLogic.js") (because of usage in "reset" and of this one in "setLogic.js" its code "checkbox.checked=true" have to be in "setTimeout()", because "reset" is event function of html element "<input type='reset'>", while triggered form via default behaviour will be reset, including its checkboxes, at that time code "checkbox.checked=true" doesn't work in usual manner)
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







