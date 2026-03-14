
const vysledek= document.getElementById("flexInCenter")		// prostřední flex item - zobrazuje výsledek

pripravaNaHru = ()=>{
 document.fplayer.kamen.style.backgroundColor= "blue";		// html button "kámen" hráče - obarvuje na počáteční hodnotu (pro případ, že byla barva v předchozí hře změněna)
 document.fplayer.nuzky.style.backgroundColor= "blue";		// button "nůžky" hráče
 document.fplayer.papir.style.backgroundColor= "blue";
 document.fpc.kamen.style.backgroundColor= "green";		// button "kámen" počítače
 document.fpc.nuzky.style.backgroundColor= "green";
 document.fpc.papir.style.backgroundColor= "green";
 vysledek.innerHTML="chvíle napětí..."				// zobrazí do pole výsledku "chvíle napětí..."
 }

document.fplayer.kamen.onclick= ()=>{
  pripravaNaHru();
  document.fplayer.kamen.style.backgroundColor= "red";		// html button kámen hráče - obarví na červeno
  setTimeout("fce_hra(document.fplayer.kamen.value)", 1500);	// počká 1.5 sekundy a spustí funkci, v parametru ji poskytne "kámen"
 }
document.fplayer.nuzky.onclick= ()=>{
  pripravaNaHru();
  document.fplayer.nuzky.style.backgroundColor= "red";
  setTimeout("fce_hra(document.fplayer.nuzky.value)", 1500);
 }
document.fplayer.papir.onclick= ()=>{
  pripravaNaHru();
  document.fplayer.papir.style.backgroundColor= "red";
  setTimeout("fce_hra(document.fplayer.papir.value)", 1500);
 }


const fce_hra = (player)=>{				// player = kámen | nůžky | papír
 var pc=Math.floor ( Math.random()*3 )			// pc = ~náhodná hodnota 0 | 1 | 2 --> 0 = kámen; 1 = nůžky; 2 = papír (zvoleno podle pořadí buttonů počítače v html)

 document.fpc.elements[pc].style.backgroundColor= "red";	// obarví button počítače; tj. např. document.fpc.elements[0] --> html element <form name="fpc">, první jeho element, tj. <input name="kamen"> atd.

 var pl_pc = player + pc;				// tj. např. kámen0 --> znamená hráč "kámen" počítač "kámen"

 if(pl_pc === "kámen0" || pl_pc === "nůžky1" || pl_pc === "papír2"){vysledek.innerHTML="remíza"; return}	// ověřuje remízu
 if(pl_pc === "kámen1" || pl_pc === "nůžky2" || pl_pc === "papír0"){vysledek.innerHTML="výhral jsi"; return}	// ověřuje výhru
 vysledek.innerHTML="prohrál jsi";	// zbývá prohra
}


