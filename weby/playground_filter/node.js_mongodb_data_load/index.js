
/////////////
// node.js //
/////////////

import {MongoClient} from 'mongodb';                    // do "package.json" vnějšího objektu se přidá prvek "type":"module"

const uri = "<connection string>";                      // <-- doplnit connection string
const client = new MongoClient(uri);

// viz samostatné soubory
import {indoor} from "./indoor.js"
import {outdoorFree} from "./outdoorFree.js"
import {outdoorPaid} from "./outdoorPaid.js"
import {category6_data} from "./category6_data.js"
import {category5_data} from "./category5_data.js"

const sportGround=[...indoor, ...outdoorFree, ...outdoorPaid]

async function run() {
  try {
    await client.connect();
    const Brno = client.db('Brno');

    const SportGround = Brno.collection('sport_ground');
    const Category6_Data = Brno.collection('category6_data');
    const Category5_Data = Brno.collection('category5_data');

    await SportGround.drop(); await Category6_Data.drop(); await Category5_Data.drop()

    await SportGround.insertMany(sportGround);
    await Category6_Data.insertMany(category6_data);
    await Category5_Data.insertMany(category5_data);

    console.log("data loaded successfully")

  } finally {
    await client.close();
  }
}
run().catch(console.error);



