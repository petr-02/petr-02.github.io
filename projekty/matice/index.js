// lze vždy a.aa i a["aa"]?
// případně by se dala přidat korekce vstupu do textové pole (do matice jen čísla, ne řetězec; do A, B čísla 1 až n)

const n=AA()		// počáteční fce, vytvoří část html, načte "n"
function AA(){
 let a = ""
 let nn = 0
 // třídí vstupní hodnotu "nn"
 while(true){
  nn = 1*prompt("zadej rozmer matice, napr. 2 nebo 3, 4 ...","")
  if(nn>=2){nn=Math.floor(nn);break}
 }
 // zapíše do html textového pole rozměr matice "n * n" a "disabled"ne pole proti zápisu
 document.f1.f11.value=nn+" * "+nn
 document.f1.f11.disabled=true
 // začátek zápisu do html - formulář s textovými poli ve tvaru čtvercové matice
 document.open()
 a+='<form style="margin: 32px 0px 0px 70px" name="a1"><label for="a00">Zadejte hodnoty matice</label><br><br>'
 for(let i=0;i<nn;i++){				// vytvoření textových polí html
   for(let j=0;j<nn;j++){
     a+='<input name="a'+i+j+'" type="text" size="5"> &nbsp;&nbsp;'
   }
   a+='<br><br>'
 }
 a+='</form><br><br>'
 // buttony startující výpočet
 a+='<button id="soucet">soucet matice na hlavni a vedlejsi diagonale</button> &nbsp;'
 a+='<button id="preklopeni">preklopeni podle hlavni diagonaly</button><br><br>'
 a+='<button id="ABradek">prehozeni radku A a B</button> &nbsp;'
 a+='<button id="ABsloupec">prehozeni sloupce A a B</button><br>'
 // zadání "A" a "B" pro překlopení řádků/sloupců matice
 a+='<br><form name="b1">'
 a+='<label for="b1A">zadejte "A" --> </label><input name="b1A" type="text" size="3">&nbsp;'
 a+='<input name="b1B" type="text" size="3"><label for="b1B"> <-- zadejte "B" (tj. 1 nebo 2, 3 atd.) </label>'
 a+='</form>'
 // zápis do html
 document.write(a)
 document.close()
return(nn)
}

// buttony pro výpočty (přidání eventu a odkaz na fci)
document.getElementById("R").addEventListener("click", AA1);	// random button
document.getElementById("soucet").addEventListener("click", soucet1);
document.getElementById("preklopeni").addEventListener("click", preklopeni1);
document.getElementById("ABradek").addEventListener("click", ABradek1);
document.getElementById("ABsloupec").addEventListener("click", ABsloupec1);
// barvení buněk pro početní operace (.cssText)
let blue="border:1px solid blue;padding:2px 3px";
let red="border:1px solid red;padding:2px 3px";
let grey="border:1px solid #767676;padding:2px 3px";	// návrat na default před začátkem (nového) barvení

/*
// definování události u všech elementů <input>
QQ()
function QQ(){
 let qq1=document.querySelectorAll("input")
 for(let i=0;i<qq1.length;i++){
   qq1[i].addEventListener("focus", function QQ1(){this.select()}
 }
}
*/


AA0()			// předvyplnění počátečních hodnot do html textových polí (hlavně kvůli zkoušení, aby se nemuselo vyplňovat)
function AA0(){
 for(let i=0;i<n;i++){
   for(let j=0;j<n;j++){
     document.a1['a'+i+j].value=i+j	// pole matice
   }
 }
 document.b1.b1A.value=1		// pole A (prohození řádků/sloupců matice)
 document.b1.b1B.value=2		// pole B
}


function AA1(){			// vyplnění random hodnot do html textových polí
 for(let i=0;i<n;i++){
   for(let j=0;j<n;j++){
     document.a1['a'+i+j].value=Math.floor( Math.random()*10 )		// hodnoty matice
   }
 }
 let a = Math.floor( Math.random()*n +1 )	// náhodná hodnota "A"  <0,n-1 > +1 = <1,n>
 let b = 1					// hodnota "B", má být odlišná od "A" (prohazované řádky/sloupce)
  while(true){
   b=Math.floor( Math.random()*n +1 );
   if(b!==a){break}
  }
 document.b1.b1A.value=a
 document.b1.b1B.value=b
}


BB(n)			// vytvoření Array "T" jako matice "n×n", s hodnotami "0" ve všech prvcích
function BB(n){
 T=new Array()
 for(let i=0;i<n;i++){
   T[i]=new Array()
   for(let j=0;j<n;j++){
     T[i][j]=0
   }
 }
}


function BB0(){		// nacteni aktualnich hodnot z textového pole html do Array "T", tvořícího matici
 for(let i=0;i<n;i++){
   for(let j=0;j<n;j++){
     T[i][j]=1*document.a1['a'+i+j].value
     document.a1['a'+i+j].style.cssText=grey		// nastavení stylu na defaultní hodnotu před začátkem (nového) barvení
   }
 }
}


function soucet1(){		// součet prvků matice na hlavní a vedlejší diagonále
 BB0()
 let jj=0			// součet na vedlejší diagonále, tj. [0][3]+[0+1][3-1]...
 let j=n-1			// prý Linter, program na hledání chyb kódu, nemá rád for(let i=0, j=3...)
 for(let i=0;i<n;i++,j--){
  jj+=T[i][j]
  document.a1['a'+i+j].style.cssText=red
 }
 let ii=0			// součet na hlavní diagonále, tj. [0][0]+[1][1]+...
 for(let i=0;i<n;i++){
  ii+=T[i][i]
  document.a1['a'+i+i].style.cssText=blue
 }

 document.f1.f12.value='Soucet na hlavni diagonale '+ii+', na vedlejsi '+jj+`.

hlavni diagonala: jakoby uhlopricka, z leve_horni hrany po opacnou
vedlejsi diagonala: z prave_horni hrany`
}


function preklopeni1(){		// překlopení podle hlavní diagonály, tj. přehození všech T[i][j] v prvky T[j][i]
 BB0()
 Tm=0
 for(let i=0;i<n-1;i++){	// vybírá prvky matice, počínaje v pravém horním rohu, všechny po hlavní diagonálu, tuto nikoliv (kódem pak jde po řádku na konec doprava, vlevo začíná postupně na [0][1] [1][2] ... [n-1][n] )
   for(let j=i+1;j<n;j++){	// hodnotu každého vybraného přehodí místem (souměrně, zrcadlově) podle hlavní diagonály s hodnotou prvku, který tam je, vzájemně ( hodnotu T[i][j] a T[j][i] )
     Tm=T[j][i]
     T[j][i]=T[i][j]
     T[i][j]=Tm
     document.a1['a'+i+j].value=T[i][j]			// dosazení hodnoty změněného Array "T" do html 
     document.a1['a'+i+j].style.cssText=blue		// rámeček na prvcích od hlavní diagonály vpravo nahoře
     document.a1['a'+j+i].value=T[j][i]
     document.a1['a'+j+i].style.cssText=red		// na prvcích od hlavní diagonály dole vlevo
   }
 }
 document.f1.f12.value='prehozeni hodnot zrcadlove soumerne pres hlavni diagonalu na protilehle misto (tj. prvek T[i][j] a T[j][i] si prohodi hodnoty )'
}

function ABradek1(){		// přehození řádku A a B
 BB0()
 let A = 1*document.b1.b1A.value -1
 let B = 1*document.b1.b1B.value -1
 let Tm = 0				// pomocná proměnná "memory" pro zapamatování prohazovaných hodnot
 for(let j=0;j<n;j++){
   Tm=T[B][j]
   T[B][j]=T[A][j]
   T[A][j]=Tm
   document.a1["a"+B+j].value=T[B][j]
   document.a1["a"+B+j].style.cssText=red
   document.a1["a"+A+j].value=T[A][j]
   document.a1["a"+A+j].style.cssText=blue
 }
 document.f1.f12.value=''	// komentář do pomocného pole; alespoň '', aby přemazal předchozí
}

function ABsloupec1(){		// přehození sloupce A a B
 BB0()
 let A = 1*document.b1.b1A.value -1	// textové pole html, kde uživatel vybírá "A"
 let B = 1*document.b1.b1B.value -1	// "B"
 let Tm = 0				// pomocná proměnná "memory" pro zapamatování prohazovaných hodnot
 for(let i=0;i<n;i++){
   Tm=T[i][B]
   T[i][B]=T[i][A]
   T[i][A]=Tm
   document.a1["a"+i+B].value=T[i][B]
   document.a1["a"+i+B].style.cssText=red
   document.a1["a"+i+A].value=T[i][A]
   document.a1["a"+i+A].style.cssText=blue
 }
 document.f1.f12.value=''	// komentář do pomocného pole; alespoň '', aby přemazal předchozí
}






