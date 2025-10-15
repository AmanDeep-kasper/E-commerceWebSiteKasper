import axiosInstance from "../api/axiosInstance";

// ✅ Get all reviews for a product
const getProductReviews = async (productId) => {
  const res = await axiosInstance.get(`/reviews/product/${productId}`);
  return res.data;
};

// ✅ Get a single review
const getReview = async (id) => {
  const res = await axiosInstance.get(`/reviews/${id}`);
  return res.data;
};

// ✅ Add a review (requires authentication)
const addReview = async (reviewData) => {
  const res = await axiosInstance.post("/reviews", reviewData);
  return res.data;
};

// ✅ Update review
const updateReview = async (id, reviewData) => {
  const res = await axiosInstance.put(`/reviews/${id}`, reviewData);
  return res.data;
};

// ✅ Delete review
const deleteReview = async (id) => {
  const res = await axiosInstance.delete(`/reviews/${id}`);
  return res.data;
};

// ✅ Like review
const likeReview = async (id) => {
  const res = await axiosInstance.put(`/reviews/${id}/like`);
  return res.data;
};

// ✅ Dislike review
const dislikeReview = async (id) => {
  const res = await axiosInstance.put(`/reviews/${id}/dislike`);
  return res.data;
};

const reviewService = {
  getProductReviews,
  getReview,
  addReview,
  updateReview,
  deleteReview,
  likeReview,
  dislikeReview,
};

export default reviewService;
