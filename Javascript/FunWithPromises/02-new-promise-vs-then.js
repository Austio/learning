function add(xPromise,yPromise) {
  return Promise.all( [xPromise, yPromise] )
    .then( function(values){
      return values[0] + values[1];
    } );
}

function fetcha1() {
  Promise.resolve(1)
}

function fetcha2() {
  Promise.resolve(2)
}

add( fetcha1(), fetcha2() )
  .then( function(sum){
    console.log( 'return nan', sum ); // that was easier!
  } );


function fetchb1() {
  Promise.resolve(1)
}

function fetchb2() {
  Promise.resolve(2)
}

add( fetchb1(), fetchb2() )
  .then( function(sum){
    console.log( 'return 3', sum ); // that was easier!
  } );