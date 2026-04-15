import BusinessSetting from "../../models/admin/BusinessConfig.js";
import AppError from "../../utils/AppError.js";
import asyncHandler from "../../utils/asyncHandler.js";
import {
  uploadImageToCloudinary,
  deleteImageFromCloudinary,
} from "../../utils/cloudinary.js";

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

  const filePath = req.file?.path;
  if (!filePath) {
    throw AppError.badRequest("Logo is required", "FILE_REQUIRED");
  }

  let uploadedImage;

  try {
    // ✅ Upload first
    uploadedImage = await uploadImageToCloudinary(filePath);

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
      await deleteImageFromCloudinary(uploadedImage.publicId);
    }
    throw error;
  } finally {
    // cleanup local file
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
});

export const updateBusinessDetails = asyncHandler(async (req, res) => {
  const { businessName, gstNumber, companyNumber, address, email, phone } =
    req.body;
  const filePath = req.file?.path;
  const userId = req.user?.userId;

  if (typeof address === "string") {
    address = JSON.parse(address);
  }

  const business = await BusinessSetting.findOne({
    userId,
    isActive: true,
  });

  if (
    (email !== undefined && email !== business.email) ||
    (phone !== undefined && phone !== business.phone)
  ) {
    throw AppError.conflict(
      "Business already exists with this email or phone",
      "ALREADY_EXISTS",
    );
  }

  if (businessName !== undefined) business.businessName = businessName;
  if (gstNumber !== undefined) business.gstNumber = gstNumber;
  if (companyNumber !== undefined) business.companyNumber = companyNumber;
  if (address !== undefined) business.address = address;
  if (email !== undefined) business.email = email;
  if (phone !== undefined) business.phone = phone;

  if (filePath) {
    if (business.logo?.publicId) {
      await deleteImageFromCloudinary(business.logo.publicId);
    }
    const uploadedImage = await uploadImageToCloudinary(filePath);
    business.logo = {
      url: uploadedImage.url,
      publicId: uploadedImage.publicId,
    };
  }

  await business.save();

  res.status(200).json({
    success: true,
    message: "Business details updated successfully",
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
