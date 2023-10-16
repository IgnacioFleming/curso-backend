const PM = new ProductManager();
const CM = new CartManager();
const renderHome = (req, res) => {
  res.render("home", {});
};

const renderRealTimeProducts = (req, res) => {
  res.render("realTimeProducts", { style: "realTimeProducts.css" });
};

const renderChat = (req, res) => {
  res.render("chat", {});
};

const renderProducts = async (req, res) => {
  const { limit, page, sort, query } = req.query;
  const result = await PM.getProducts(limit, page, sort, query);
  const products = result.payload.map((product) => {
    return {
      title: product.title,
      stock: product.stock,
      code: product.code,
      status: product.status,
      _id: product._id,
      price: product.price,
      category: product.category,
    };
  });

  const { first_name, last_name, role } = req.user;
  const isAdmin = role === "admin";

  res.render("products", {
    products,
    style: "products.css",
    totalPages: result.totalPages,
    prevPage: result.prevPage,
    nextPage: result.nextPage,
    page: result.page,
    hasPrevPage: result.hasPrevPage,
    hasNextPage: result.hasNextPage,
    prevLink: result.prevLink,
    nextLink: result.nextLink,
    limit,
    sort,
    query,
    first_name,
    last_name,
    isAdmin,
    role,
  });
};

const renderProductDetail = async (req, res) => {
  const { pid } = req.params;
  const product = await PM.getProductById(pid);
  const { title, description, price, category, code, stock, status, _id } = product.payload;

  res.render("productDetail", {
    title,
    description,
    price,
    category,
    code,
    stock,
    status,
    _id,
    style: "productDetail.css",
  });
};

const renderCart = async (req, res) => {
  const { cid } = req.params;
  const result = await CM.getCartById(cid);
  const products = result.payload.products.map((element) => {
    return {
      product: element.product.title,
      price: element.product.price,
      code: element.product.code,
      quantity: element.quantity,
    };
  });
  res.render("cart", { style: "cart.css", products });
};

const renderRegister = (req, res) => {
  res.render("register");
};

const renderLogin = (req, res) => {
  res.render("login");
};

const renderProfile = async (req, res) => {
  const user = req.session.user;
  res.render("profile", user);
};

export default {
  renderCart,
  renderChat,
  renderHome,
  renderLogin,
  renderProductDetail,
  renderProducts,
  renderProfile,
  renderRealTimeProducts,
  renderRealTimeProducts,
  renderRegister,
};
