import Banner from "../../models/admin/BannerConfig.js";
import AppError from "../../utils/AppError.js";
import asyncHandler from "../../utils/asyncHandler.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../../utils/uploader.js";

export const uploadBanner = asyncHandler(async (req, res) => {
  const { sectionType, title, redirectUrl, order } = req.body;

  if (!req.file) {
    throw AppError.badRequest("Media file is required");
  }

  // STEP 1: find existing banner FIRST
  let banner = await Banner.findOne({ sectionType });

  // STEP 2: limit check BEFORE upload
  if (banner) {
    if (sectionType === "hero" && banner.items.length >= 6) {
      throw AppError.badRequest("Hero max 6 items", "HERO_LIMIT_REACHED");
    }

    if (sectionType === "carousel" && banner.items.length >= 8) {
      throw AppError.badRequest(
        "Carousel max 8 items",
        "CAROUSEL_LIMIT_REACHED",
      );
    }
  }

  // STEP 3: now upload (safe)
  const uploaded = await uploadToCloudinary(
    req.file.buffer,
    req.fileType,
    "banners",
    req.file.originalname,
  );

  const newItem = {
    url: uploaded.url,
    publicId: uploaded.publicId,
    redirectUrl: redirectUrl || "",
    order: order ?? null,
    isActive: true,
  };

  // STEP 4: create or update
  if (!banner) {
    banner = await Banner.create({
      sectionType,
      title: title || "",
      items: [newItem],
    });
  } else {
    banner.items.push(newItem);
    await banner.save();
  }

  res.status(200).json({
    success: true,
    message: "Banner uploaded successfully",
    data: banner,
  });
});

export const updateBannerItem = asyncHandler(async (req, res) => {
  const { bannerId } = req.params;
  const { redirectUrl, order, publicId, isActive } = req.body;

  const parsedIsActive = isActive === "true" || isActive === true;

  const banner = await Banner.findById(bannerId);

  if (!banner) {
    throw AppError.notFound("Banner not found", "NOT_FOUND");
  }

  const itemIndex = banner.items.findIndex(
    (item) => item.publicId === publicId,
  );

  if (itemIndex === -1) {
    throw AppError.notFound("Item not found", "ITEM_NOT_FOUND");
  }

  // update fields
  if (redirectUrl !== undefined) {
    banner.items[itemIndex].redirectUrl = redirectUrl;
  }

  if (order !== undefined) {
    banner.items[itemIndex].order = order;
  }

  // update isActive independently
  if (isActive !== undefined) {
    banner.items[itemIndex].isActive = parsedIsActive;
  }

  // replace image if new file
  if (req.file) {
    await deleteFromCloudinary(banner.items[itemIndex].publicId);

    const uploaded = await uploadToCloudinary(
      req.file.buffer,
      req.fileType,
      "banners",
      req.file.originalname,
    );

    banner.items[itemIndex].url = uploaded.url;
    banner.items[itemIndex].publicId = uploaded.publicId;
    if (isActive !== undefined) {
      banner.items[itemIndex].isActive = parsedIsActive;
    }
  }

  await banner.save();

  res.status(200).json({
    success: true,
    message: "Banner item updated successfully",
    data: banner,
  });
});

export const deleteBannerItem = asyncHandler(async (req, res) => {
  const { bannerId } = req.params;
  const { publicId } = req.body;

  const banner = await Banner.findById(bannerId);

  if (!banner) {
    throw AppError.notFound("Banner not found", "NOT_FOUND");
  }

  const item = banner.items.find((i) => i.publicId === publicId);

  if (!item) {
    throw AppError.notFound("Item not found", "ITEM_NOT_FOUND");
  }

  await deleteFromCloudinary(item.publicId);

  banner.items = banner.items.filter((i) => i.publicId !== publicId);

  await banner.save();

  res.status(200).json({
    success: true,
    message: "Banner item deleted successfully",
  });
});

export const getAllBanners = asyncHandler(async (req, res) => {
  const { sectionType } = req.query;
  const userRole = req.user?.role;

  const filter = {
    // if not admin → only active items
    ...(userRole !== "admin" && { "items.isActive": true }),
  };

  if (sectionType && !["hero", "carousel"].includes(sectionType)) {
    throw AppError.badRequest("Invalid sectionType filter", "INVALID_FILTER");
  }

  if (sectionType) {
    filter.sectionType = sectionType;
  }

  const banners = await Banner.find(filter).lean();

  // transform data
  const formatted = banners.map((banner) => {
    let items = banner.items || [];

    // hero → sort by order
    if (banner.sectionType === "hero") {
      items = items.sort((a, b) => a.order - b.order);
    }

    // carousel → no strict order (but optional sort if exists)
    if (banner.sectionType === "carousel") {
      items = items.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    }

    return {
      _id: banner._id,
      sectionType: banner.sectionType,
      title: banner.title,
      items,
    };
  });

  res.status(200).json({
    success: true,
    message: "Banners fetched successfully",
    data: formatted,
  });
});

export const getActiveBanners = asyncHandler(async (req, res) => {
  const { sectionType } = req.query;

  const filter = {
    "items.isActive": true,
  };

  if (sectionType && !["hero", "carousel"].includes(sectionType)) {
    throw AppError.badRequest("Invalid sectionType filter", "INVALID_FILTER");
  }

  if (sectionType) {
    filter.sectionType = sectionType;
  }

  const banners = await Banner.find(filter).lean();

  // transform data
  const formatted = banners.map((banner) => {
    let items = banner.items || [];

    // hero → sort by order
    if (banner.sectionType === "hero") {
      items = items.sort((a, b) => a.order - b.order);
    }

    // carousel → no strict order (but optional sort if exists)
    if (banner.sectionType === "carousel") {
      items = items.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    }

    return {
      _id: banner._id,
      sectionType: banner.sectionType,
      title: banner.title,
      items,
    };
  });

  res.status(200).json({
    success: true,
    message: "Banners fetched successfully",
    data: formatted,
  });
});

export const toggleBannerStatus = asyncHandler(async (req, res) => {
  const { bannerId } = req.params;
  const { publicId } = req.body;

  const banner = await Banner.findById(bannerId);

  if (!banner) {
    throw AppError.notFound("Banner not found", "NOT_FOUND");
  }

  const itemIndex = banner.items.findIndex(
    (item) => item.publicId === publicId,
  );

  if (itemIndex === -1) {
    throw AppError.notFound("Item not found", "ITEM_NOT_FOUND");
  }

  banner.items[itemIndex].isActive = !banner.items[itemIndex].isActive;
  await banner.save();

  res.status(200).json({
    success: true,
    message: `Banner ${banner.items[itemIndex]?.isActive ? "activated" : "deactivated"} successfully`,
  });
});
