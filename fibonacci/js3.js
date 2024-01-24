
document.getElementById("btn1").addEventListener("click", Fibonacci)

function Fibonacci() {
 let n = document.n1.n2.value			// načítá vstup od uživatele
 if (n >= 1 && n <= 1000 && n % 1 === 0) {	// fce pokračuje jen pro celé n = <1,1000> 
 } else return
 n = 1*n

 let a=0
 let b=1			// "a" a "b" zpočátku tedy "0" a "1"; po první smyčce "1" "1"; obecně dva předchozí členy před počítaným
 let c=0			// "c" člen posloupnosti následující za "a" a "b"; pro n>=2 vzniká součtem předchozích dvou
 let q="1"			// tj. je-li n=1, smyčka se nespustí a posloupnosti po "n" q="1", tj. obsahuje jen člen a1; je-li n>=2, spustí a ke q="1", tj. k a1, jsou přidány členy a2 a3... až po "an"
 for(let nn=2;nn<=n;nn++) {
   c=a+b
   a=b				// další smyčka bude počítat další člen, opět z předchozích dvou, tj. "a" a "b" je potřeba přenastavit a dát jim hodnoty "b" a "c" ("a" získá hodnotu "b", "b" "c")
   b=c				// tj. neužívá vzorec pro "n"tý a "n-1"vní člen posloupnosti, ale počítá člen po členu, až dojde k "n-1 : n"
   q+=" | "+c
 }
 let TTq = ''
 let inpt = '<input type="text" value="'
 let hr = '<br><hr color="#767676" size="1px"><br>'
 let dec = 10**document.n1.n3.value		// tj. pro "2" je 10^2=100

 TTq += hr
 TTq += '<form>'
 TTq += 'zadáno bylo '+n+', vezmeme tedy poměr '+n+'. a předchozího členu<br><br>'
 TTq += 'poměr '+(n-1)+'. : '+n+'. členu<br>'
 TTq += inpt + a + ' : ' + b + '"><br><br>'
 TTq += 'poměr 1 : ... (upravený poměr výše)<br>'
 TTq += inpt + '1 : ' + Math.round(b/a*dec)/dec + '"><br><br>'	// poměr ~1 : zlomku (např. 1 : 1.5)  (*dec/dec protože JS zaokrouhluje na celá čísla)
 TTq += 'poměr 1 : ... (zlatého řezu, neměnný; přesněji 1 : (1+odmocnina z 5ti)/2)<br>'
 TTq += inpt + 1 + " : " + Math.round( (1 + Math.sqrt(5)) / 2 *dec)/dec + '"><br><br><br>'
 TTq += '</form>'

 TTq += hr
 TTq += q + '<br><br><br><br>'
 TTq += '(poměr je určitý typ vztahu mezi dvěma množstvími stejného druhu; Euklid z Alexandrie, 323 - 285 př.n.l.)'

 document.getElementById("TT").innerHTML=TTq
 document.forms[1].elements[0].size = 60
 document.forms[1].elements[1].size = 37
 document.forms[1].elements[2].size = 37
}



