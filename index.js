class ProductManager {
  constructor() {
    this.products = [];
  }
  addProduct(title, description, price, thumbnail, code, stock) {
    for (const product of this.products) {
      if (product.code === code) {
        console.log(
          `El codigo del producto ${product.title} ya existe en la base, por favor corregir`
        );
        return;
      }
    }
    const newproduct = {
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };

    newproduct.id =
      this.products.length === 0
        ? 1
        : this.products[this.products.length - 1].id + 1;

    this.products.push(newproduct);
  }
}

const PM1 = new ProductManager();

const discos = [
  "Discos",
  "Discos de Vinilo de las bandas más iconicas de la Historia",
  50000,
  "https://keepthemspinning.com/es/wp-content/uploads/sites/2/2023/02/experiencia-pink-floyd-discos-de-vinilo-Keep-Them-Spinning.png",
  "A0001",
  10,
];

const guitarrasElectricas = [
  "Guitarras Electricas",
  "Guitarras Yamaha con equipamiento completo",
  120000,
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_NKkdIicRYoZHoF5OFBYSIQdSu4lxmiGBTA&usqp=CAU",
  "A0002",
  22,
];

const parlantes = [
  "Parlantes Profesionales",
  "Parlantes profesionales para instalar en complejos de recreamiento",
  75000,
  "https://www.ecelectronica.com.ar/6965-large_default/parlante-bluetooth-portatil-etheos-usb-radio-fm-aux-20-watts.jpg",
  "A0002",
  5,
];

PM1.addProduct(...discos);
PM1.addProduct(...guitarrasElectricas);
PM1.addProduct(...parlantes);

console.log(PM1);
