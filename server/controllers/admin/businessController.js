import BusinessSetting from "../../models/admin/BusinessConfig.js";
import AppError from "../../utils/AppError.js";
import asyncHandler from "../../utils/asyncHandler.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../../utils/uploader.js";

export const upsertBusinessDetails = asyncHandler(async (req, res) => {
  let { businessName, gstNumber, companyNumber, address, email, phone } =
    req.body;

  // parse address
  if (address && typeof address === "string") {
    address = JSON.parse(address);
  }

  // ALWAYS find existing business (only one allowed)
  let business = await BusinessSetting.findOne();

  if (!req.file && !business) {
    throw AppError.badRequest("Logo is required", "FILE_REQUIRED");
  }

  let uploadedImage;

  try {
    // IMAGE UPLOAD (OPTIONAL FOR UPDATE)
    if (req.file) {
      uploadedImage = await uploadToCloudinary(
        req.file.buffer,
        req.fileType,
        req.fileType === "image" ? "images" : "videos",
        req.file.originalname,
      );
    }

    // CREATE (ONLY FIRST TIME)
    if (!business) {
      business = await BusinessSetting.create({
        businessName,
        gstNumber,
        companyNumber,
        address,
        email,
        phone,
        logo: {
          url: uploadedImage?.url || "",
          publicId: uploadedImage?.publicId || "",
        },
        isActive: true,
      });

      return res.status(201).json({
        success: true,
        message: "Business created successfully",
        data: business,
      });
    }

    // UPDATE EXISTING
    // 🔥 delete old image if new uploaded
    if (uploadedImage && business.logo?.publicId) {
      await deleteFromCloudinary(business.logo.publicId);
    }

    business.businessName = businessName ?? business.businessName;
    business.gstNumber = gstNumber ?? business.gstNumber;
    business.companyNumber = companyNumber ?? business.companyNumber;
    business.address = address ?? business.address;
    business.email = email ?? business.email;
    business.phone = phone ?? business.phone;

    if (uploadedImage) {
      business.logo = {
        url: uploadedImage.url,
        publicId: uploadedImage.publicId,
      };
    }

    await business.save();

    return res.status(200).json({
      success: true,
      message: "Business updated successfully",
      data: business,
    });
  } catch (error) {
    // 🔥 rollback image if DB fail
    if (uploadedImage?.publicId) {
      await deleteFromCloudinary(uploadedImage.publicId);
    }
    throw error;
  }
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
