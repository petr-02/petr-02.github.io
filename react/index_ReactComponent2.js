
'use strict';

 // import buttonKlikFce from '!import_fce.js'

function buttonKlikFce2 () {
  const [klik2, nastavKliknuti2] = React.useState(false);

  if (klik2) {return 'klikl jsi na button'}

  // return without JSX
  return React.createElement( 'button', {onClick: () => nastavKliknuti2(true)}, 'Like' );
}


const btn2 = document.getElementById('ReactComponent2_root');
ReactDOM.createRoot( btn2 ).render(React.createElement( buttonKlikFce2 ));





