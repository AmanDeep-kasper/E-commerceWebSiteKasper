import Banner from "../../models/admin/BannerConfig.js";
import AppError from "../../utils/AppError.js";
import asyncHandler from "../../utils/asyncHandler.js";
import {
  uploadImageToCloudinary,
  deleteImageFromCloudinary,
} from "../../utils/cloudinary.js";

export const createBanner = asyncHandler(async (req, res) => {
  const { title, description, bannerType, serialNumber } = req.body;

  if (!req.file) {
    throw AppError.badRequest("Media file is required", "FILE_REQUIRED");
  }

  // upload to cloudinary
  const uploaded = await uploadImageToCloudinary(req.file.path);

  const banner = await Banner.create({
    title,
    description,
    bannerType,
    serialNumber,
    imageOrVideo: {
      url: uploaded.url,
      publicId: uploaded.publicId,
    },
    isActive: true,
  });

  res.status(201).json({
    success: true,
    message: "Banner created successfully",
    data: banner,
  });
});

export const updateBanner = asyncHandler(async (req, res) => {
  const { bannerId } = req.params;

  const existing = await Banner.findById(bannerId);

  if (!existing) {
    throw AppError.notFound("Banner not found", "NOT_FOUND");
  }

  let media = existing.imageOrVideo;

  // if new file uploaded
  if (req.file) {
    // delete old
    await deleteImageFromCloudinary(existing.imageOrVideo.publicId);

    const uploaded = await uploadImageToCloudinary(req.file.path);

    media = {
      url: uploaded.url,
      publicId: uploaded.publicId,
    };
  }

  const updated = await Banner.findByIdAndUpdate(
    bannerId,
    {
      $set: {
        title: req.body.title ?? existing.title,
        description: req.body.description ?? existing.description,
        bannerType: req.body.bannerType ?? existing.bannerType,
        serialNumber: req.body.serialNumber ?? existing.serialNumber,
        isActive: req.body.isActive ?? existing.isActive,
        imageOrVideo: media,
      },
    },
    { new: true, runValidators: true },
  ).lean();

  res.status(200).json({
    success: true,
    message: "Banner updated successfully",
    data: updated,
  });
});

export const getActiveBanners = asyncHandler(async (req, res) => {
  const banners = await Banner.find(
    { isActive: true },
    {
      title: 1,
      description: 1,
      bannerType: 1,
      imageOrVideo: 1,
      serialNumber: 1,
    },
  )
    .sort({ serialNumber: 1 })
    .lean();

  res.status(200).json({
    success: true,
    data: banners,
  });
});

export const getAllBanners = asyncHandler(async (req, res) => {
  const banners = await Banner.find({}).sort({ serialNumber: 1 }).lean();

  res.status(200).json({
    success: true,
    data: banners,
  });
});

export const deleteBanner = asyncHandler(async (req, res) => {
  const { bannerId } = req.params;

  const banner = await Banner.findById(bannerId);

  if (!banner) {
    throw AppError.notFound("Banner not found", "NOT_FOUND");
  }

  // delete from cloudinary
  await deleteImageFromCloudinary(banner.imageOrVideo.publicId);

  await banner.deleteOne();

  res.status(200).json({
    success: true,
    message: "Banner deleted successfully",
  });
});
