class TicketManager {
  #precioBasedeGanancia = 0.15;

  constructor() {
    this.eventos = [];
  }
  getEventos() {
    return this.eventos;
  }
  agregarEvento(
    nombre,
    lugar,
    precio,
    capacidad = 50,
    fecha = new Date().toLocaleDateString()
  ) {
    const evento = {
      nombre,
      lugar,
      precio,
      capacidad,
      fecha,
      participantes: [],
    };
    if (this.eventos.length === 0) {
      evento.id = 1;
    } else {
      evento.id = this.eventos[this.eventos.length - 1].id + 1;
    }
    this.eventos.push(evento);
  }

  agregarUsuario(idEvento, idUsuario) {
    const indiceEvento = this.eventos.findIndex((e) => e.id === idEvento);
    const participantesEvento =
      this.eventos[indiceEvento].participantes.includes(idUsuario);
    if (indiceEvento === -1) {
      console.log("El evento que quiere referenciar no existe");
      return;
    }
    if (participantesEvento) {
      console.log("El usuario ya está registrado en este evento");
      return;
    }
    this.eventos[indiceEvento].participantes.push(idUsuario);
  }

  ponerEventoEnGira(idEvento, nuevaLocalidad, nuevaFecha) {
    const evento = this.eventos.find((e) => e.id === idEvento);
    const eventoEnGira = {
      ...evento,
      lugar: nuevaLocalidad,
      fecha: nuevaFecha,
      participantes: [],
      id: this.eventos[this.eventos.length - 1].id + 1,
    };
    this.eventos.push(eventoEnGira);
  }
}

const manejadorDeEventos = new TicketManager();
manejadorDeEventos.agregarEvento("Guns&Roses", "Buenos Aires", 10000);
manejadorDeEventos.agregarEvento("Ricardo Arjona", "Cordoba", 45000);
manejadorDeEventos.agregarEvento("Adele", "Salta", 80000);

manejadorDeEventos.agregarUsuario(1, "A22");
manejadorDeEventos.agregarUsuario(2, "B22");
manejadorDeEventos.agregarUsuario(3, "C22");
manejadorDeEventos.agregarUsuario(1, "A24");
manejadorDeEventos.agregarUsuario(1, "A25");

manejadorDeEventos.ponerEventoEnGira(3, "Paris", "22/10/2024");

console.log(manejadorDeEventos.getEventos());
