export const generateProductsError = (product) => {
  return `Una o mas propiedades del producto no son validas.
    * title: debe recibir un String y recibió ${product.title}.
    * description: debe recibir un String y recibió ${product.description}.
    * price: debe recibir un Number y recibió ${product.price}.
    * category: debe recibir un String y recibió ${product.category}.
    * code: debe recibir un String y recibió ${product.code}.
    * stock: debe recibir un Number y recibió ${product.stock}.
    * status: debe recibir un Boolean y recibió ${product.status}.
    `;
};

export const generateCartsError = (cartId, productId) => {
  return `Uno o todos los parametros enviados fueron numericos.
    Se esperaba:
    * :cid: debe recibir un ObjectId. cid es un ObjectId? :  ${cartId}.
    * :pid: debe recibir un ObjectId. pid es un ObjectId? :  ${productId}.
    `;
};
