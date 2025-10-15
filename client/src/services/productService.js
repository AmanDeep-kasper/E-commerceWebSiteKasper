import axiosInstance from "../api/axiosInstance";

// Add a new product (Admin only)
const addProduct = async (formData) => {
  const res = await axiosInstance.post("/products/add-product", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// Get all products
const getAllProducts = async () => {
  const res = await axiosInstance.get("/products/all");
  return res.data;
};

// Get product by category
const getProductsByCategory = async (categoryName) => {
  const res = await axiosInstance.get(`/products/category/${categoryName}`);
  return res.data;
};

// Get product by category + subcategory
const getProductsByCategoryAndSubcategory = async (
  categoryName,
  subcategoryName
) => {
  const res = await axiosInstance.get(
    `/products/category/${categoryName}/${subcategoryName}`
  );
  return res.data;
};

// Get product details by Mongo _id
const getProductById = async (id) => {
  const res = await axiosInstance.get(`/products/${id}`);
  return res.data;
};

// Get product details by slug
const getProductBySlug = async (route) => {
  const res = await axiosInstance.get(`/products/slug/${route}`);
  return res.data;
};

const productService = {
  getAllProducts,
  getProductsByCategory,
  getProductsByCategoryAndSubcategory,
  getProductById,
  getProductBySlug,
  addProduct,
};

export default productService;
