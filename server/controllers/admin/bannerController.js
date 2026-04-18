import Banner from "../../models/admin/BannerConfig.js";
import AppError from "../../utils/AppError.js";
import asyncHandler from "../../utils/asyncHandler.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../../utils/uploader.js";
import { buildMediaUrls } from "../../utils/urlBuilder.js";

export const uploadBanner = asyncHandler(async (req, res) => {
  const { title, description, bannerType } = req.body;

  if (!req.file) {
    throw AppError.badRequest("Media file is required", "FILE_REQUIRED");
  }

  // upload to cloudinary
  const uploaded = await uploadToCloudinary(
    req.file.buffer,
    req.fileType,
    req.fileType === "image" ? "images" : "videos",
    req.file.originalname,
  );

  const banner = await Banner.create({
    title,
    description,
    bannerType,
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
    await deleteFromCloudinary(existing.imageOrVideo.publicId);

    const uploaded = await uploadToCloudinary(
      req.file.buffer,
      req.fileType,
      req.fileType === "image" ? "images" : "videos",
      req.file.originalname,
    );

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

  // 🔥 transform media here
  const formattedBanners = banners.map((banner) => {
    const type = banner.imageOrVideo?.url?.includes("/video/")
      ? "video"
      : "image";

    return {
      ...banner,
      media: buildMediaUrls(banner.imageOrVideo.publicId, type),
    };
  });

  res.status(200).json({
    success: true,
    data: formattedBanners,
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
  await deleteFromCloudinary(banner.imageOrVideo.publicId);

  // adjust serialNumber
  await Banner.updateMany(
    { serialNumber: { $gt: banner.serialNumber } },
    { $inc: { serialNumber: -1 } },
  );

  // delete from db
  await banner.deleteOne();

  res.status(200).json({
    success: true,
    message: "Banner deleted successfully",
  });
});
