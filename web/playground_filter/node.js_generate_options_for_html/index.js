
/////////////
// node.js //
/////////////

import {fetchData, createJS} from './function.js';


const data= await fetchData().catch(console.error);

createJS( JSON.stringify(...data) );



