import Collection from "../models/collection.js";
import Product from "../models/Product.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";

// Admin controller
export const addCollection = asyncHandler(async (req, res) => {
  const { collectionName, products, isActive } = req.body;

  if (!products || !Array.isArray(products) || products.length === 0) {
    throw AppError.badRequest(
      "Products array is required",
      "PRODUCTS_REQUIRED",
    );
  }

  // Check duplicate collection
  const existingCollection = await Collection.findOne({ collectionName });
  if (existingCollection) {
    throw AppError.conflict("Collection already exists", "COLLECTION_EXISTS");
  }

  // Validate product IDs exist
  const validProducts = await Product.find({
    _id: { $in: products },
  }).select("_id");

  if (validProducts.length !== products.length) {
    throw AppError.badRequest("Some products are invalid", "INVALID_PRODUCTS");
  }

  // Create collection
  const collection = await Collection.create({
    collectionName,
    products,
    isActive: isActive ?? true,
  });

  res.status(201).json({
    success: true,
    message: "Collection created successfully",
    data: collection,
  });
});

export const getCollection = asyncHandler(async (req, res) => {
  const { collectionId } = req.params;

  const collection = await Collection.findById(collectionId)
    .populate("products")
    .lean();

  if (!collection) {
    throw AppError.notFound("Collection not found", "NOT_FOUND");
  }

  return res.status(200).json({
    success: true,
    message: "Collection fetched successfully",
    data: collection,
  });
});

export const getAllCollections = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, search = "", status } = req.query;

  const query = {};

  if (status) {
    query.isActive = status === "true";
  }

  if (search) {
    query.collectionName = { $regex: search, $options: "i" };
  }

  const skip = (Number(page) - 1) * Number(limit);

  const collections = await Collection.find(query)
    .populate("products")
    .sort({
      createdAt: -1,
    })
    .skip(skip)
    .limit(limit)
    .lean();

  const total = await Collection.countDocuments();

  return res.status(200).json({
    success: true,
    message: "Collections fetched successfully",
    data: {
      collections,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    },
  });
});

export const updateCollection = asyncHandler(async (req, res) => {
  const { collectionId } = req.params;
  const { collectionName, isActive, addProducts } = req.body;

  const collection = await Collection.findById(collectionId);

  if (!collection) {
    throw AppError.notFound("Collection not found", "NOT_FOUND");
  }

  // Basic updates
  if (collectionName) collection.collectionName = collectionName;
  if (isActive !== undefined) collection.isActive = isActive;

  // ADD PRODUCTS
  if (addProducts && Array.isArray(addProducts)) {
    const uniqueToAdd = addProducts.filter(
      (id) => !collection.products.includes(id),
    );

    collection.products.push(...uniqueToAdd);
  }

  await collection.save();

  res.status(200).json({
    success: true,
    message: "Collection updated successfully",
    data: collection,
  });
});

export const deleteCollection = asyncHandler(async (req, res) => {
  const { collectionId } = req.params;

  const collection = await Collection.findById(collectionId);

  if (!collection) {
    throw AppError.notFound("Collection not found", "NOT_FOUND");
  }

  await collection.deleteOne();

  res.status(200).json({
    success: true,
    message: "Collection deleted successfully",
  });
});

export const addProductToCollection = asyncHandler(async (req, res) => {
  const { collectionId } = req.params;
  const { products } = req.body;

  const collection = await Collection.findById(collectionId);

  if (!collection) {
    throw AppError.notFound("Collection not found", "NOT_FOUND");
  }

  const product = await Product.findById(products);

  if (!product) {
    throw AppError.notFound("Product not found", "NOT_FOUND");
  }

  if (!collection.products.includes(products)) {
    collection.products.push(products);
    await collection.save();
  }
});

export const removeProductFromCollection = asyncHandler(async (req, res) => {
  const { collectionId } = req.params;
  const { productId } = req.body;

  // Atomic update
  const updatedCollection = await Collection.findByIdAndUpdate(
    collectionId,
    {
      $pull: { products: productId },
    },
    { new: true },
  );

  if (!updatedCollection) {
    throw AppError.notFound("Collection not found", "NOT_FOUND");
  }

  res.status(200).json({
    success: true,
    message: "Product removed from collection successfully",
  });
});

export const toggleCollectionStatus = asyncHandler(async (req, res) => {
  const { collectionId } = req.params;

  const collection = await Collection.findById(collectionId);

  if (!collection) {
    throw AppError.notFound("Collection not found", "NOT_FOUND");
  }

  collection.isActive = !collection.isActive;
  await collection.save();

  res.status(200).json({
    success: true,
    message: `Collection ${
      collection.isActive ? "activated" : "deactivated"
    } successfully`,
    data: collection,
  });
});

// users controllers
export const getAllCollectionsController = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, search = "", status } = req.query;

  const query = {
    isActive: true,
  };

  if (status) {
    query.isActive = status === "true";
  }

  if (search) {
    query.collectionName = { $regex: search, $options: "i" };
  }

  const skip = (Number(page) - 1) * Number(limit);

  const collections = await Collection.find(query)
    .populate("products")
    .sort({
      createdAt: -1,
    })
    .skip(skip)
    .limit(limit)
    .lean();

  const total = await Collection.countDocuments();

  return res.status(200).json({
    success: true,
    message: "Collections fetched successfully",
    data: {
      collections,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    },
  });
});
