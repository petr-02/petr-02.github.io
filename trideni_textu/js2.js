
document.getElementById("start").onclick=del_z_html;			// provádí samotnou úpravu
document.getElementById("button_vysledku1").onclick= bt_vysledku1;	// umožňuje znovu načíst již upravený text do vstupu k další úpravě
document.getElementById("button_vysledku2").onclick= bt_vysledku2;	// umožňuje odložit již upravený text do textarea "hotového textu"
document.getElementById("button_upravovanehotextu1").onclick= bt_upravovanehotextu1;	// umožňuje upravovaný text načíst k úpravě, text ale ve zdroji nemaže
document.getElementById("button_upravovanehotextu2").onclick= bt_upravovanehotextu2;	// totéž, maže
document.getElementById("button_upravovanehotextu_delete").onclick= function(){document.f0p.f0pss.value= ""};
document.getElementById("button_hotovehotextu1").onclick= bt_hotovehotextu1;		// 
document.getElementById("button_hotovehotextu2").onclick= bt_hotovehotextu2;		// 
document.getElementById("button_hotovehotextu_delete").onclick= function(){document.f1p.f1photovytext.value= ""};

function bt_vysledku1(){ document.f0.f0ss.value=document.f1.f1vysledek.value };
function bt_vysledku2(){ document.f1p.f1photovytext.value+=document.f1.f1vysledek.value };
function bt_upravovanehotextu1(){
 var a = window.getSelection().toString();	// getSelection() vytvoří objekt obsahující "string", metoda "toString()" získá z objektu jeho "string"
 if(a.length>0) {				// je-li nějaký text označen
  document.f0.f0ss.value = a;			// načtení označeného textu do textarea pro úpravy
 } else {					// není-li text označen
  document.f0.f0ss.value = document.f0p.f0pss.value;
 }
}
function bt_upravovanehotextu2(){		// tatáž fce, ale maže text načítaný k úpravě
 var a = window.getSelection().toString();
 if(a.length>0) {
  document.f0.f0ss.value= a;
  var i1 = document.f0p.f0pss.selectionStart;	// index označeného řetězce v řetězci, prvního znaku zleva (i když se označuje zprava)
  var i2 = document.f0p.f0pss.selectionEnd;	// index posledního zprava +1
  var txt= document.f0p.f0pss.value;
  document.f0p.f0pss.value= txt.substring(0,i1) + txt.substring(i2);
 } else {
  document.f0.f0ss.value= document.f0p.f0pss.value;
  document.f0p.f0pss.value= "";
 }
}
function bt_hotovehotextu1(){
 var a = window.getSelection().toString();
 if(a.length>0) {
  navigator.clipboard.writeText(a);
 } else {
  navigator.clipboard.writeText(document.f1p.f1photovytext.value);
 }
}
function bt_hotovehotextu2(){				// tatáž fce, ale maže kopírovaný text
 var a = window.getSelection().toString();
 if(a.length>0) {
  navigator.clipboard.writeText(a);
  var i1 = document.f1p.f1photovytext.selectionStart;	// index označeného řetězce v řetězci, prvního znaku zleva (i když se označuje zprava)
  var i2 = document.f1p.f1photovytext.selectionEnd;	// index posledního zprava +1
  var txt= document.f1p.f1photovytext.value;
  document.f1p.f1photovytext.value= txt.substring(0,i1) + txt.substring(i2);
 } else {
  navigator.clipboard.writeText(document.f1p.f1photovytext.value);
  document.f1p.f1photovytext.value= "";
 }
}

function del_z_html(){
var ss=document.f0.f0ss.value;			// vstupní string
var sb=document.f0.f0sb.value;			// mazaný substring
var sbn=document.f0.f0sbn.value;		// přidávaný substring
var start=1*document.f0.f0start.value;		// od kterého znaku začít
var end=1*document.f0.f0end.value;		// kterým znakem skončit
var rp=1*document.f0.f0rp.value;		// kolikrát mazat
var oc1=1*document.f0.f0oc1.value;		// kolik prvních výskytů "sb" vynechat - výskyty až od "start"u
document.f1.f1vysledek.value=delStart(ss,sb,sbn,start,end,rp,oc1);	// vysledek
}


// fce.1 (je třeba vybrat jen tuto nebo tu níže) - ke zpracování pošle, fci "del", "ss" začínající znakem za posledním "oc1"


function xxdelStart(ss,sb,sbn="",start=0,end=0,rp=0,oc1=0){
 if(sb==="") return ss;				// pro sb="" není co mazat (také by se smyčka následující fce neuzavřela, poněvadž by bylo "" vždy nalezeno na pozici c=0, místo nenalezeno c=-1)
 (end===0) ? end=ss.length : end-=1;		// je-li nula, bez omezení, nastaví end mimo podmínky ukončení (1 znak za "ss", pro kód ale stejné); vstup fce čísluje 1 2... string metody 0 1...
 if(start>end) {return ss;} else {start-=1;}	// je-li počáteční pozice větší, než konečná (je-li start=end, je tu stále 1 znak); vstup fce čísluje 1 2... string metody 0 1...

 const sbl=sb.length;

 for(;oc1>0;oc1--){				// smyčka najde nový "start", první znak za "sb", tolikátého, kolik udává "oc1"
  start=ss.indexOf(sb,start) + sbl;		// nový start znak za nálezem "sb"
  if(start===(sbl-1) || (start-1)>end) return ss;	// start=sbl-1 znamená "-1" pro "indexOf" (indexOf vrátí -1 při nenalezení), tj. není zde již "sb", který by šlo umazat; (start-1) nebo se "sb" svým posledním znakem dostalo za "end"
 }

 let sstart=ss.substring(0,start);		// odřízne začátek "ss" před novým "start"em
 let ssend=ss.substring(end+1);			// odřízne řetězec za "end"
 ss=ss.substring(start,end+1);			// vytvoří nové "ss" pouze od "start" po "end"

 ss=del(ss,sb,sbl,sbn,rp);			// pošle "ss" ke zpracování

 ss=sstart+ss+ssend;
 return ss
}

function xxdel(ss,sb,sbl,sbn,rp){		// "ss" začíná 1 znak za posledním "oc1"
 var start=0;
 const sbnl=sbn.length;
 while(true){
  start=ss.indexOf(sb,start);			// start umístěný do prvního znaku "sb"  (jsou zde ve skutečnosti dva, start, kde má začít hledání prvního znaku "sb" (start za "=") a start tj. kde byl tento první znak nalezen (před "=") )
  if(start===-1) return ss;			// nenajde-li "sb"
  ss=ss.substring(0,start)+sbn+ss.substring(start+sbl);
  start+=sbnl;					// pro následující kód přeměňuje start umístění 1. znaku "sb" na start, kde má začít hledání tohoto; po odstranění "sb" je na místě 1. znaku "sb" právě pokračování řetězce za, přidáním "sbn" se ale konec řetězce posune ... kde má zrovna začít další hledání)
  rp-=1;
  if(rp===0) return ss;				// vyčerpají-li se opakování rp
 }
}


// fce .2  (je třeba vybrat jen tuto nebo tu výše) - ke zpracování pošle, fci "del", "ss" začínající prvním znakem "sb" za posledním "oc1" (tj. přímo tam, kde má začít měnění řetězce), díky tomu odřezává širší start a také kontroluje, zda je zde za "oc1" nějaký řetězec a před "end" ke zpracování - liší se kódem smyčky "oc1", prvním příkazem za touto, fcí "del"


function delStart(ss,sb,sbn="",start=0,end=0,rp=0,oc1=0){
 if(sb==="") return ss;				// pro sb="" není co mazat (také by se smyčka následující fce neuzavřela, poněvadž by bylo "" vždy nalezeno na pozici c=0, místo nenalezeno c=-1)
 (end===0) ? end=ss.length : end-=1;		// je-li nula, bez omezení, nastaví end mimo podmínky ukončení (1 znak za "ss", pro kód ale stejné); vstup fce čísluje 1 2... string metody 0 1...
 if(start>end) {return ss;} else {start-=1;}	// je-li počáteční pozice větší, než konečná (je-li start=end, je tu stále 1 znak); vstup fce čísluje 1 2... string metody 0 1...

 const sbl=sb.length;

 for(;oc1>-1;oc1--){				// smyčka najde nový "start", první znak za "sb"; končí ještě jedním "sb" za posledním "oc1", že podmínka je -1 místo 0
  start=ss.indexOf(sb,start) + sbl;		// nový start 1 znak za nálezem "sb"
  if(start===(sbl-1) || (start-1)>end) return ss;	// start=sbl-1 znamená "-1" pro "indexOf" (indexOf vrátí -1 při nenalezení), tj. není zde již "sb", který by šlo umazat; (start-1) nebo se "sb" svým posledním znakem dostalo za "end"
 }
 start=start-sbl				// vrácení startu k prvnímu znaku "sb", které už má být měněno (nebyla-li fce ukončena, je start zatím 1 znak za takovým "sb")

 let sstart=ss.substring(0,start);		// odřízne začátek "ss" před novým "start"em
 let ssend=ss.substring(end+1);			// odřízne řetězec za "end"
 ss=ss.substring(start,end+1);			// vytvoří nové "ss" pouze od "start" po "end"

 ss=del(ss,sb,sbl,sbn,rp);			// pošle "ss" ke zpracování

 ss=sstart+ss+ssend;
 return ss
}

function del(ss,sb,sbl,sbn,rp){			// "ss" začíná 1 znakem "sb" za posledním "oc1", tj. při první smyčce právě tam, kde se má začít měnit řetězec, tj. počáteční start=0 je právě také skutečným startem (díky tomu další start určuje (smyčka) až po prvním měnění řetězce)
 var start=0;					// start umístěný do prvního znaku "sb"; stejně tak poté níže u "start=ss.indexOf..."  (podobný kód na "start=ss.indexOf(sb,start)" proběhl již ve smyčce "oc1"; jsou zde tedy ve skutečnosti dva starty, start, kde má začít hledání prvního znaku "sb" (start za "=", u "indexOf") a start tj. kde byl tento první znak nalezen (před "=") )
 const sbnl=sbn.length;
 while(true){
  ss=ss.substring(0,start)+sbn+ss.substring(start+sbl);		// první opakování ve skutečnosti začíná přímo na prvním znaku měněného "sb"
  start+=sbnl;							// pro následující kód přeměňuje start umístění 1. znaku "sb" na start, kde má začít hledání tohoto; po odstranění "sb" je na místě 1. znaku "sb" právě pokračování řetězce za, přidáním "sbn" se ale konec řetězce posune ... kde má zrovna začít další hledání)
  start=ss.indexOf(sb,start);					// start umístěný do prvního znaku "sb"
  rp-=1;
  if(rp===0 || start===-1) return ss;				// nenajde-li "sb" || vyčerpají-li se opakování rp
 }
}


// fce .3 - užívá replace(/RegExp/g,sbn)


function XXdelStart(ss,sb,sbn="",start=0,end=0,rp=0,oc1=0){
 if(sb==="") return ss;				// pro sb="" není co mazat (také by se smyčka následující fce neuzavřela, poněvadž by bylo "" vždy nalezeno na pozici c=0, místo nenalezeno c=-1)
 (end===0) ? end=ss.length : end-=1;		// je-li nula, bez omezení, nastaví end mimo podmínky ukončení (1 znak za "ss", pro kód ale stejné); vstup fce čísluje 1 2... string metody 0 1...
 if(start>end) {return ss;} else {start-=1;}	// je-li počáteční pozice větší, než konečná (je-li start=end, je tu stále 1 znak); vstup fce čísluje 1 2... string metody 0 1...

 const sbl=sb.length;

 for(;oc1>0;oc1--){				// smyčka najde nový "start", první znak za "sb", tolikátého, kolik udává "oc1"
  start=ss.indexOf(sb,start) + sbl;		// nový start znak za nálezem "sb"
  if(start===(sbl-1) || (start-1)>end) return ss;	// start=sbl-1 znamená "-1" pro "indexOf" (indexOf vrátí -1 při nenalezení), tj. není zde již "sb", který by šlo umazat; (start-1) nebo se "sb" svým posledním znakem dostalo za "end"
 }

 let sstart=ss.substring(0,start);		// odřízne začátek "ss" před novým "start"em
 let ssend=ss.substring(end+1);			// odřízne řetězec za "end"
 ss=ss.substring(start,end+1);			// vytvoří nové "ss" pouze od "start" po "end"

 ss=del(ss,sb,sbl,sbn,rp);			// pošle "ss" ke zpracování

 ss=sstart+ss+ssend;
 return ss
}

function XXdel(ss,sb,sbl,sbn,rp){			// hledá jen výřez, kde se má nahrazovat "sb", aby šlo použít /sb/g regular expression
 var start=0;
 var startt=0;					// pomocná hodnota; aby smyčka ukončená před "rp", nenalezením "sb", vrátivši "-1", nepřemazala předchozí hodnotu "start"u (v tom případě předchozí "rp" bylo poslední)
 while(true){					// hledá první znak, start, řetězce, který se již nemá měnit, tj. 1 znak za posledním opakováním "rp" (nemusí zde být dostatek "sb" pro všechna opakování)
  startt=ss.indexOf(sb,start);
  if(startt===-1) break;
  start=startt+sbl;
  rp--;
  if(rp===0) break;
 }						// smyčka nalezla onen start odloučeného řetězce, znak před je zároveň poslední znak řetězce, který se měnit má
 var sbnRgE=new RegExp(sb,"g");			// vytvoří /sbn/g regular expression
 ss=ss.substring(0,start).replace(sbnRgE,sbn)+ss.substring(start);
 return ss
}





