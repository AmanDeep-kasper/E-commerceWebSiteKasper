import axiosInstance from "../api/axiosInstance";

// Add a new product (Admin only)
const addProduct = async (formData) => {
  const res = await axiosInstance.post("/products/add-product", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// Get all products
// const getAllProducts = async () => {
//   const res = await axiosInstance.get("/products/all");
//   return res.data?.data || res.data;
// };

// Get product by category
const getProductsByCategory = async (categoryName) => {
  const res = await axiosInstance.get(`/products/category/${categoryName}`);
  return res.data;
};

// Get product by category + subcategory
const getProductsByCategoryAndSubcategory = async (
  categoryName,
  subcategoryName,
) => {
  const res = await axiosInstance.get(
    `/products/category/${categoryName}/${subcategoryName}`,
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

// ✅ Update an existing product (Admin only)
const updateProduct = async (id, formData) => {
  const res = await axiosInstance.put(
    `/products/update-product/${id}`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );
  return res.data;
};

// category service and sub category service can be added here in future if needed
const categoryService = async (formData) => {
  const res = await axiosInstance.post("/category/add-category", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};
// ////////////////////////////////////////////////////
// Get all categories at catgory service
const getAllCategories = async (page = 1, limit = 10) => {
  const res = await axiosInstance.get(
    `/category/admin/all-categories?page=${page}&limit=${limit}`,
  ); // Add pagination parameters
  return {
    data: res?.data?.category || res?.data?.data || [],
    pagination: res?.data?.pagination || {},
  };
};

const productService = {
  // getAllProducts,
  getAllCategories,
  getProductsByCategory,
  getProductsByCategoryAndSubcategory,
  getProductById,
  getProductBySlug,
  addProduct,
  updateProduct,
  categoryService,
};

export default productService;
