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
    try {
      if (filePath) {
        const absolutePath = path.resolve(filePath);

        console.log("DELETE PATH:", absolutePath);

        if (fs.existsSync(absolutePath)) {
          fs.unlinkSync(absolutePath);
          console.log("File deleted ✅");
        } else {
          console.log("File not found ❌");
        }
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  }
});

export const updateBusinessDetails = asyncHandler(async (req, res) => {
  const { businessName, gstNumber, companyNumber, address, email, phone } =
    req.body || {};

  const filePath = req.file?.path;
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
  if (filePath) {
    if (business.logo?.publicId) {
      await deleteImageFromCloudinary(business.logo.publicId);
    }

    const uploaded = await uploadImageToCloudinary(filePath);

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
