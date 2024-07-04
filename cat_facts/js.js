
const section=document.querySelector("section");
const button=document.querySelector("button");
const span=document.querySelector("span")

const pp=[];                                       // array of "p" elements
let n=span.innerText*1;                            // number of facts, each in one "p" element


span.addEventListener("click", function(){
 n++; if(n===11) n=1;
 span.innerText=n;
})


fillHTML();                                        // first html fill is done automatically with page load
document.querySelector("h2").addEventListener("click", fillHTML)


async function fillHTML () {
 pp.forEach( p => p.remove() );
 for(let i=n;i;i--) {
   const factObj= await fetchCatFact();
   const p=document.createElement("p");
   p.innerText=factObj.fact;
   pp.push(p);
   section.appendChild(p);
 }
}

  async function fetchCatFact (url='https://catfact.ninja/fact') {
   try {
     const res = await fetch(url);    if (!res.ok) { throw new Error("network response wasn't 'ok'") }
     return await res.json();
   }
   catch (error) { console.error("problem with fetch operation:", error) }
  }





