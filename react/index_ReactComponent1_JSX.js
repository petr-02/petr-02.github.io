
'use strict';

 // import buttonKlikFce from '!import_fce.js'

function buttonKlikFce1 () {
  const [klik1, nastavKliknuti1] = React.useState(false);

  if (klik1) {return 'klikl jsi na button'}

  // return with JSX
  return ( <button onClick={() => nastavKliknuti1(true)}>klikni</button> );
}


const btn1 = document.getElementById('ReactComponent1_root_JSX');
ReactDOM.createRoot( btn1 ).render(React.createElement( buttonKlikFce1 ));





