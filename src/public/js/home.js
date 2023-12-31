const list = document.getElementById("list");
list.classList.add("products");

const products = [
  {
    title: "mouse",
    description: "mouse óptico",
    price: 500,
    category: "hardware",
    code: "a002",
    stock: 15,
    status: true,
    thumbnails: [],
    id: 1,
  },
  {
    title: "monitor",
    description: "monitor LED HD",
    price: 5000,
    category: "hardware",
    code: "b001",
    stock: 10,
    status: true,
    thumbnails: [],
    id: 2,
  },
  {
    title: "auriculares",
    description: "auriculares bluetooth",
    price: 10000,
    category: "audio",
    code: "c001",
    stock: 10,
    status: true,
    thumbnails: [],
    id: 3,
  },
  {
    title: "cámara",
    description: "cámara digital 4K",
    price: 6000,
    category: "electrónica",
    code: "d001",
    stock: 5,
    status: true,
    thumbnails: [],
    id: 4,
  },
  {
    title: "silla",
    description: "silla ergonómica",
    price: 2500,
    category: "mobiliario",
    code: "e001",
    stock: 30,
    status: true,
    thumbnails: [],
    id: 5,
  },
  {
    title: "teclado mecánico",
    description: "teclado mecánico RGB",
    price: 2000,
    category: "hardware",
    code: "f001",
    stock: 8,
    status: true,
    thumbnails: [],
    id: 6,
  },
  {
    title: "impresora",
    description: "impresora multifunción",
    price: 3000,
    category: "hardware",
    code: "g001",
    stock: 12,
    status: true,
    thumbnails: [],
    id: 7,
  },
  {
    title: "altavoz inteligente",
    description: "altavoz con asistente virtual",
    price: 1500,
    category: "audio",
    code: "h001",
    stock: 18,
    status: true,
    thumbnails: [],
    id: 8,
  },
  {
    title: "disco duro externo",
    description: "disco duro portátil 1TB",
    price: 800,
    category: "hardware",
    code: "i001",
    stock: 22,
    status: true,
    thumbnails: [],
    id: 9,
  },
  {
    title: "proyector",
    description: "proyector de alta definición",
    price: 7000,
    category: "electrónica",
    code: "j001",
    stock: 3,
    status: true,
    thumbnails: [],
    id: 10,
  },
  {
    title: "con imagen",
    description: "proyector de alta definición",
    price: "7000",
    category: "electrónica",
    code: "i0012",
    stock: "3",
    status: "false",
    thumbnails: [
      "C:\\Users\\Ignacio\\OneDrive\\Escritorio\\backend\\curso-coder\\src\\public\\images\\dock.jpg",
    ],
    id: 11,
  },
  {
    title: "con imagen",
    description: "proyector de alta definición",
    price: "7000",
    category: "electrónica",
    code: "i0012223",
    stock: "3",
    status: "false",
    thumbnails: [
      "C:\\Users\\Ignacio\\OneDrive\\Escritorio\\backend\\curso-coder\\src\\public\\images\\dock.jpg",
      "C:\\Users\\Ignacio\\OneDrive\\Escritorio\\backend\\curso-coder\\src\\public\\images\\dragon-stone.jpeg",
      "C:\\Users\\Ignacio\\OneDrive\\Escritorio\\backend\\curso-coder\\src\\public\\images\\epic-castle.jpg",
    ],
    id: 12,
  },
  {
    title: "con imagen",
    description: "proyector de alta definición",
    price: 7000,
    category: "electrónica",
    code: "i00zz1",
    stock: 3,
    status: true,
    thumbnails: [],
    id: 13,
  },
  {
    title: "con imagen",
    description: "proyector de alta definición",
    price: 7000,
    category: "electrónica",
    code: "i00zssz1",
    stock: 3,
    status: true,
    thumbnails: [],
    id: 14,
  },
];

products.forEach((element) => {
  if (element.thumbnails.length === 0) {
    element.thumbnails = "Sin imagen";
  }
  list.innerHTML += `
    <div>
        <h2>Producto ID: ${element.id}</h2>
        <p>Titulo: ${element.title}</p>
        <p>Descripción: ${element.description}</p>
        <p>Precio: $${element.price}</p>
        <p>Categoría: ${element.category}</p>
        <p>Código: ${element.code}</p>
        <p>Stock: ${element.stock}</p>
        <p>Status: ${element.status}</p>
        <p>Imagenes: ${element.thumbnails}</p>
    </div>
    `;
});
