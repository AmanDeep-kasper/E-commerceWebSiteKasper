import axiosInstance from "../api/axiosInstance";

// Get all reviews for a product
const getProductReviews = async (productId) => {
  const res = await axiosInstance.get(`/reviews/product/${productId}`);
  return res.data;
};

// Get a single review
const getReview = async (id) => {
  const res = await axiosInstance.get(`/get-review/${id}`);
  return res.data;
};

// Add a review (requires authentication)
const addReview = async (reviewData) => {
  const res = await axiosInstance.post("/reviews", reviewData);
  return res.data;
};

// Update review
const updateReview = async (reviewId, reviewData) => {
  const res = await axiosInstance.patch(`/review/update-review/${reviewId}`, reviewData);
  return res.data;
};

// Delete review
const deleteReview = async (reviewId) => {
  const res = await axiosInstance.delete(`/review/delete-review/${reviewId}`);
  return res.data;
};

// get user's reviews
const getUserReviews = async () => {
  const res = await axiosInstance.get("/review/get-user-reviews");
  return res.data;
};

const reviewService = {
  getProductReviews,
  getReview,
  addReview,
  updateReview,
  deleteReview,
  getUserReviews
};

export default reviewService;
