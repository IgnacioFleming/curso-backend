const objetos = [
  {
    manzanas: 3,
    peras: 2,
    carne: 1,
    jugos: 5,
    dulces: 2,
  },
  {
    manzanas: 1,
    sandias: 1,
    huevos: 6,
    jugos: 1,
    panes: 4,
  },
];

const listaProductos = [];
objetos.map((element) => {
  const keys = Object.keys(element);

  keys.map((key) => {
    if (!listaProductos.includes(key)) {
      listaProductos.push(key);
    }
  });
});
console.log(listaProductos);

const totalVendido = objetos.reduce((acc, objeto) => {
  for (const propiedad in objeto) {
    acc += objeto[propiedad];
    console.log(objeto[propiedad]);
  }
  return acc;
}, 0);

console.log(totalVendido);
