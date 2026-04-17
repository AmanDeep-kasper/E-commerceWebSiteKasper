import BusinessSetting from "../../models/admin/BusinessConfig.js";
import AppError from "../../utils/AppError.js";
import asyncHandler from "../../utils/asyncHandler.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../../utils/uploader.js";

export const createBusinessDetails = asyncHandler(async (req, res) => {
  let { businessName, gstNumber, companyNumber, address, email, phone } =
    req.body;
  const userId = req.user?.userId;

  // parse address string to object
  if (address) {
    address = JSON.parse(address);
  }

  // Better duplicate check
  const existing = await BusinessSetting.findOne({
    userId,
  });

  if (existing) {
    throw AppError.conflict("Business already exists", "ALREADY_EXISTS");
  }

  if (!req.file) {
    throw AppError.badRequest("Logo is required", "FILE_REQUIRED");
  }

  let uploadedImage;

  try {
    // ✅ Upload first
    uploadedImage = await uploadToCloudinary(
      req.file.buffer,
      req.fileType,
      req.fileType === "image" ? "images" : "videos",
      req.file.originalname,
    );

    // ✅ Create document with image
    const business = await BusinessSetting.create({
      userId,
      businessName,
      gstNumber,
      companyNumber,
      address,
      email,
      phone,
      logo: {
        url: uploadedImage.url,
        publicId: uploadedImage.publicId,
      },
      isActive: true,
    });

    return res.status(201).json({
      success: true,
      message: "Business created successfully",
      business,
    });
  } catch (error) {
    // 🔥 rollback cloudinary if DB fails
    if (uploadedImage?.publicId) {
      await deleteFromCloudinary(uploadedImage.publicId);
    }
    throw error;
  }
});

export const updateBusinessDetails = asyncHandler(async (req, res) => {
  const { businessName, gstNumber, companyNumber, address, email, phone } =
    req.body || {};

  const userId = req.user?.userId;

  // SAFE PARSE
  let parsedAddress;
  try {
    parsedAddress = typeof address === "string" ? JSON.parse(address) : address;
  } catch {
    throw AppError.badRequest("Invalid address JSON format", "INVALID_JSON");
  }

  const business = await BusinessSetting.findOne({
    userId,
    isActive: true,
  });

  if (!business) {
    throw AppError.notFound("Business not found");
  }

  // PROPER DUPLICATE CHECK
  if (email || phone) {
    const existing = await BusinessSetting.findOne({
      $or: [{ email }, { phone }],
      _id: { $ne: business._id },
    });

    if (existing) {
      throw AppError.conflict(
        "Email or phone already exists",
        "ALREADY_EXISTS",
      );
    }
  }

  // UPDATE FIELDS
  if (businessName !== undefined) business.businessName = businessName;
  if (gstNumber !== undefined) business.gstNumber = gstNumber;
  if (companyNumber !== undefined) business.companyNumber = companyNumber;
  if (parsedAddress !== undefined) business.address = parsedAddress;
  if (email !== undefined) business.email = email;
  if (phone !== undefined) business.phone = phone;

  // IMAGE UPDATE
  if (req.file) {
    if (business.logo?.publicId) {
      await deleteFromCloudinary(business.logo.publicId);
    }

    const uploaded = await uploadToCloudinary(
      req.file.buffer,
      req.fileType,
      req.fileType === "image" ? "images" : "videos",
      req.file.originalname,
    );

    business.logo = {
      url: uploaded.url,
      publicId: uploaded.publicId,
    };
  }

  await business.save();

  res.status(200).json({
    success: true,
    message: "Business updated successfully",
    business,
  });
});

export const getBusinessDetails = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;

  const business = await BusinessSetting.findOne({
    userId,
    isActive: true,
  }).lean();

  if (!business) {
    throw AppError.notFound("Business not found", "NOT_FOUND");
  }

  res.status(200).json({
    success: true,
    message: "Business details fetched successfully",
    business,
  });
});
