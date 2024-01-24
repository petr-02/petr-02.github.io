
document.getElementById("f3").onclick = AA	// po kliknutí na button id="f3" spusť fci AA

let z = true
function BB(){
 var y = document.getElementById("hrr2")
 if (z){
  y.style.backgroundColor = "blue"
 } else {
  y.style.backgroundColor = "red"
 }
 z=!z
}

function AA(){
 BB()

 let y=""					// v "y" je uložen výstup
 let q=1					// v "q" je uložen počet nalezených prvočísel (smyčka níže začíná již s nalezenou "2kou", proto "q=1")
 let x=1*document.f1.f2.value			// "x" načítá vstupní hodnotu od uživatele z textového pole html

 if (x >= 2) {					// je-li vstup x >= "2", musí zde být alespoň prvočíslo "2"; není-li, naopak zde žádné není a fce končí
  y="2"
 } else {
  y+="neco se nepovedlo :/";
  document.getElementById("f4").innerHTML=y;
  return
 }

 for(i=3;i<=x;i++){		// hledá další prvočísla mimo "2", která jsou <= x; dosazuje tedy postupně "i" = 3, 4, 5 ... až po "x" (tedy bez "2", které bylo již přidáno v předchozím kódu)
    let z=0			// kontrolní hodnota, pokud zůstane "0", dané číslo "i" je prvočíslo
    for(j=2;j<i;j++){		// pokouší se dělit bezezbytku z předchozí smyčky přišlé "i" postupně "j" = 2, 3, 4 ... až po celé číslo menší než "i" (tj. zda se v "i" opakuje nějaké jiné číslo)
        if(i%j==0){		// pokud se bude nějaké takové "j" opakovat, není "i" prvočíslo; kontrolní hodnota "z" se nastaví na "1" a smyčka končí
          z=1;
          break
        }
    }
    if(z==0){			// pokud z=0, tj. nebylo nalezeno číslo, které by se v "i" opakovalo, přidej tedy prvočíslo "i" do seznamu "y"
      y+=", "+i
      q++;			// a započítej nalezené prvočíslo do počtu nalezených "q"
    }
 }

document.getElementById("f4").innerHTML=y	// zobrazí "y" v elementu id="f4" html
document.getElementById("f5").innerHTML="celkovy pocet prvocisel: " + q		// zobrazí "q" v elementu id="f5" html
}

