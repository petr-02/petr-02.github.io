
/////////////
// node.js //
/////////////

/* fetch data from database */

import {MongoClient} from 'mongodb';			// do "package.json" vnějšího objektu se přidá prvek "type":"module"

const uri = "<connection string>";                      // <-- doplnit connection string; (na vercel/glitch serveru je pod environmental variable "mongodb_uri", tj. celým odkazem "const uri = process.env.mongodb_uri" )
const client = new MongoClient(uri);

export async function fetchData(mongoQueryObj) {
  try {
    await client.connect();
    const Brno = client.db('Brno');
    const SportGround = Brno.collection('sport_ground');

    // sport grounds (=categories 7), only ones that fit user query, grouped into categories 6 (category above particular sport ground), that are in turn grouped into categories 5 (particular districts or universities), that are documents in array  (with added data of category 5 and 6 ...)
    return await SportGround.aggregate([
      {$match:
        mongoQueryObj
      },
      {$sort:{
        name:1                  /* každý dokument má (před jménem) prvek "category:7" */
      }},
      {$group:{
        _id:"$categorization.category6",
        category:{$first:6},
        name:{ $first: "$categorization.category6" },
        category6_data:{$first:null},
        categories7_list:{$push: "$name" },
        categories7:{$push:"$$ROOT"}
      }},
      {$project:{
        _id:0
      }},
      {$sort:{
        name:1
      }},
      {$lookup:{
        from:"category6_data",
        localField:"name",
        foreignField:"name",
        as:"category6_data"
      }},
      {$group:{
        _id:{ $arrayElemAt:  ["$categories7.categorization.category5", 0]  },
        category4:{ $first: { $arrayElemAt:  ["$categories7.categorization.category4", 0]  } },
        category:{$first:5},
        name:{ $first: { $arrayElemAt:  ["$categories7.categorization.category5", 0]  } },
        category5_data:{$first:null},
        categories6_list:{$push: "$name" },
        categories6:{$push:"$$ROOT"},
        retrievedAt:{$first:new Date()}
      }},
      {$project:{
        _id:0
      }},
      {$sort:{
        category4:1, name:1
      }},
      {$lookup:{
        from:"category5_data",
        localField:"name",
        foreignField:"name",
        as:"category5_data"
      }}
    ] , {collation:{locale:"cs",strength:1}} ).toArray()

  } finally {
    await client.close();
  }

}




/* from url create mongo query object */

import {URL} from 'url';

export function createMongoQueryObject(url) {
  const URLObj = new URL(url);                                                   // URLObj.searchParams --> URLSearchParams{"param_name" => "param_val1,param_val2,param_val3, ...", "param_name2" => "param_val1,param_val2,...", ...}
  const URLParamObj={};

  URLObj.searchParams.forEach(function(val,key){                                 // fill "URLParamObj" with key/value: "param_name=['param_val1','param_val2','param_val3',...]" (serie of non empty non numerical string values; namely one key/value for each of "category3", "category1", "surface", "category5")(these are from fe search form, that in turn load options from database, if db filled ok, there should be not empty value for them (mongodb code remove cat1 and surface options, "$ifNull", not cat3 and cat5), and if, something wrong will be visible in search form) or again "param_name=['param_min_value','param_max_value']" (min and max numerical string value, at least one of two non empty ""; namely one key/value for each of "width", "length", "depth", "price")( <input type='number'>, if left unfilled, bear empty string, but fe code will not let pass param with all values empty like "param=,,," so maximally one of the value could be empty string)
    URLParamObj[key]=val.split(",");
  })

  const mongoQueryObj={};

  addRulesToMongoQueryObj(URLParamObj,mongoQueryObj);

  return mongoQueryObj;
}

  function addRulesToMongoQueryObj(URLParamObj,mongoQueryObj){                   // accepting to parameter1: "URLParamObj" with two kinds of key/value pairs, "param_name=['param_val1','param_val2','param_val3',...]" (serie of non empty non numerical string values), "param_name=['param_min_value','param_max_value']" (min and max numerical string value, at least one of two non empty ""); to parameter2: empty "mongoQueryObj" "{}"
    if( Object.keys(URLParamObj).length===0 ) return;                            // if there are no query parameters, mongo query obj will be left empty "{}"
    else mongoQueryObj.$and=[];

    for(const paramName in URLParamObj){
      const paramVal=URLParamObj[paramName];                                     // paramVal is: "['param_val1','param_val2','param_val3',...]" or "['param_min_value','param_max_value']"

      const length=paramVal.length;
      const paramValPart0ToNumber=paramVal[0]*1;
      const paramValPart1ToNumber=paramVal[1]*1;

      if( length===2 && !isNaN(paramValPart0ToNumber) && !isNaN(paramValPart1ToNumber) ) {   // will be true for "param_name=['min','max']", if nothing gone wrong, only for
        fillMongoQueryObjWithMinMaxRule(paramVal,paramName,mongoQueryObj);
      } else {                                                                               // will be true for rest, i.e. "param_name=['param_val1','param_val2','param_val3',...]", as this parameter, if nothing gone wrong, has non empty non numerical string values "param_val1","param_val2",...
        fillMongoQueryObjWithOneOfValuesRule(paramVal,paramName,mongoQueryObj);
      }
    }

  }

    function fillMongoQueryObjWithMinMaxRule(paramVal,paramName,mongoQueryObj){            // accepting "paramVal" array with min and max numerical string value, at least one of two non empty ""; mongoQueryObj "{$and:[ ]}"
      const $and=[];                                                                       // $and = [ {fieldName:{$gte:minVal}} , {fieldName:{$lte:maxVal}} ]
        const fieldName= (paramName==="price" ? "price.value" : `dimension.${paramName}`); // "dimension.width", "dimension.length", "dimension.depth", "price.value"
        paramVal.forEach((val,index)=>{                                                    // for "min value" index is 0 (type number), for "max value" is 1
          if(val==="") return;                                                             // if user didnt't fill any value to "<input type='number'>"
          val=val*1;
          if(index) $and.push( {$or:[  {[fieldName]:{$lte:val}}, {[fieldName]:null}, {[fieldName]:{$exists:false}}  ]} );
          else $and.push( {$or:[  {[fieldName]:{$gte:val}}, {[fieldName]:{$eq:null}}, {[fieldName]:{$exists:false}}  ]} );
        })
      mongoQueryObj.$and.push( {$and} );                                                   // mongoQueryObj: {$and:[  ...  ,  {$and:[...]}  ,  ...  ]}    <-- code "{$and:[...]}" added
    }

    function fillMongoQueryObjWithOneOfValuesRule(paramVal,paramName,mongoQueryObj){       // accepting "paramVal" array with serie of non empty non numerical string values; mongoQueryObj "{ $and:[] }"
      const $or=[];                                                                        // $or = [ {fieldName:{$eq:"val1"}} , {fieldName:{$eq:"val2"}} , {fieldName:{$eq:"val3"}} , ... ]
        const fieldName= (paramName==="surface" ? "surface.value" : `categorization.${paramName}`);  // "categorization.category3", "categorization.category1", "categorization.category5", "surface.value"
        paramVal.forEach((val)=>{
          $or.push( {[fieldName]:{$eq:val}} );
        })
      mongoQueryObj.$and.push( {$or} );                                                    // mongoQueryObj: {$and:[  ...  ,  {$or:[...]}  ,  ...  ]}    <-- code "{$or:[...]}" added
    }







