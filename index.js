class Contador {
  constructor(nombre) {
    this.nombre = nombre;
    this.contador = 0;
  }
  static contadorGlobal = 0;
  getResponsable() {
    return this.nombre;
  }
  contar() {
    this.contador++;
    Contador.contadorGlobal++;
  }
  getCuentaIndividual() {
    return this.contador;
  }
  getCuentaGlobal() {
    return Contador.contadorGlobal;
  }
}

const persona1 = new Contador("pepito");
const persona2 = new Contador("Lautaro");
const persona3 = new Contador("Fermin");
const persona4 = new Contador("Antonio");
const persona5 = new Contador("Carlos");

persona1.contar();
persona1.contar();
persona1.contar();
persona2.contar();
persona2.contar();
persona3.contar();
persona3.contar();
persona3.contar();
persona3.contar();
persona3.contar();
persona3.contar();
persona3.contar();
persona4.contar();
persona4.contar();
persona4.contar();
persona4.contar();
persona4.contar();
persona5.contar();
persona1.contar();
persona3.contar();

console.log(`El responsable es ${persona1.getResponsable()}`);
console.log(`El contador individual es ${persona1.getCuentaIndividual()}`);
console.log(`La cuenta global al momento es ${persona1.getCuentaGlobal()}`);

console.log(`El responsable es ${persona2.getResponsable()}`);
console.log(`El contador individual es ${persona2.getCuentaIndividual()}`);
console.log(`La cuenta global al momento es ${persona2.getCuentaGlobal()}`);

console.log(`El responsable es ${persona3.getResponsable()}`);
console.log(`El contador individual es ${persona3.getCuentaIndividual()}`);
console.log(`La cuenta global al momento es ${persona3.getCuentaGlobal()}`);

console.log(`El responsable es ${persona4.getResponsable()}`);
console.log(`El contador individual es ${persona4.getCuentaIndividual()}`);
console.log(`La cuenta global al momento es ${persona4.getCuentaGlobal()}`);

console.log(`El responsable es ${persona5.getResponsable()}`);
console.log(`El contador individual es ${persona5.getCuentaIndividual()}`);
console.log(`La cuenta global al momento es ${persona5.getCuentaGlobal()}`);
