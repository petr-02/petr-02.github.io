
/////////////
// node.js //
/////////////

/* fetch data from database (array with object with cat1, cat3, cat5 and surface data)  */

import {MongoClient} from 'mongodb';                    // do "package.json" vnějšího objektu se přidá prvek "type":"module"

const uri = "<connection string>";                      // <-- doplnit connection string
const client = new MongoClient(uri);

export async function fetchData() {
  try {
    await client.connect();
    const Brno = client.db('Brno')
    const SportGround = Brno.collection('sport_ground');

    // array with distinct values, each for: category1, category3, category5
    return await SportGround.aggregate([
      {$match:{

      }},
      {$unwind:
        "$categorization.category1"
      },
      {$group:{
        _id:"$categorization.category3",
        category3:{$first:"$categorization.category3"},
        category1:{$addToSet:{$ifNull:["$categorization.category1","$$REMOVE"]}},
        category5_district:{$addToSet:{$cond:{ if:{$eq:["$categorization.category4","district"]}, then:"$categorization.category5", else:"$$REMOVE" }}},
        category5_university:{$addToSet:{$cond:{ if:{$eq:["$categorization.category4","university"]}, then:"$categorization.category5", else:"$$REMOVE" }}},
        surface:{$addToSet:{$ifNull:["$surface.value","$$REMOVE"]}}
      }},
      {$project:{
        _id:0,
        category3:1,
        category1:{$sortArray:{input:"$category1", sortBy:1}},
        category5_district:{$sortArray:{input:"$category5_district", sortBy:1}},
        category5_university:{$sortArray:{input:"$category5_university", sortBy:1}},
        category5:{$concatArrays:[ {$sortArray:{input:"$category5_district", sortBy:1}}, {$sortArray:{input:"$category5_university", sortBy:1}} ]},
        surface:{$sortArray:{input:"$surface", sortBy:1}}
      }},

      {$group:{
        _id:null,
        category1:{$addToSet:"$category1"},
        category3:{$addToSet:"$category3"},
        category5_district:{$addToSet:"$category5_district"},
        category5_university:{$addToSet:"$category5_university"},
        surface:{$addToSet:"$surface"},
        groupedByCategory3:{$push:{category3:"$category3",category1:"$category1",category5:"$category5",surface:"$surface"}}
      }},
      {$project:{
        _id:0,
        category1:{$reduce:{input:"$category1", initialValue:[], in:{$setUnion:["$$value","$$this"]}}},
        category3:1,
        category5_district:{$reduce:{input:"$category5_district", initialValue:[], in:{$setUnion:["$$value","$$this"]}}},
        category5_university:{$reduce:{input:"$category5_university", initialValue:[], in:{$setUnion:["$$value","$$this"]}}},
        surface:{$reduce:{input:"$surface", initialValue:[], in:{$setUnion:["$$value","$$this"]}}},
        groupedByCategory3:1
      }},
      {$project:{
        category1:{$sortArray:{input:"$category1", sortBy:1}},
        category3:{$sortArray:{input:"$category3", sortBy:1}},
        category5:{$concatArrays:[ {$sortArray:{input:"$category5_district", sortBy:1}}, {$sortArray:{input:"$category5_university", sortBy:1}} ]},
        surface:{$sortArray:{input:"$surface", sortBy:1}},
        groupedByCategory3:"$groupedByCategory3",
        timestamp:new Date()
      }}
    ]).toArray()

  } finally {
    await client.close();
  }

}




/* create JS file (exporting fetched data) */

import fs from 'fs';

export function createJS(data) {
 let fileContent=`export const categoriesOptions= ${data};`

 fs.writeFile('./categoriesOptions.js', fileContent, function(err){
   if(err) throw err;
   console.log('js file with cat1 cat3 cat5 surface options created');
 });

}




