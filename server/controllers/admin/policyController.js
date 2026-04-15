import Policy from "../../models/admin/PolicyConfig.js";
import AppError from "../../utils/AppError.js";
import asyncHandler from "../../utils/asyncHandler.js";

const allowedType = [
  "return_refund",
  "shipping",
  "terms",
  "faq",
  "about",
  "privacy",
];

export const createPolicy = asyncHandler(async (req, res) => {
  const { type, title, content } = req.body;
  const userId = req.user?.userId;

  if (!allowedType.includes(type)) {
    throw AppError.badRequest("Invalid policy type", "INVALID_TYPE");
  }

  // Better duplicate check
  const existing = await Policy.findOne({
    userId,
    type,
  });

  if (existing) {
    throw AppError.conflict("Policy already exists", "ALREADY_EXISTS");
  }

  const policy = await Policy.create({
    userId,
    type,
    title,
    content,
    isActive: true,
  });

  res.status(201).json({
    success: true,
    message: "Policy created successfully",
    policy,
  });
});

export const updatePolicy = asyncHandler(async (req, res) => {
  const { type, title, content } = req.body;
  const userId = req.user?.userId;

  if (type !== undefined && !allowedType.includes(type)) {
    throw AppError.badRequest("Invalid policy type", "INVALID_TYPE");
  }

  const policy = await Policy.findOne({
    userId,
    isActive: true,
  });

  if (!policy) {
    throw AppError.notFound("Policy not found", "NOT_FOUND");
  }

  if (type !== undefined) policy.type = type;
  if (title !== undefined) policy.title = title;
  if (content !== undefined) policy.content = content;

  await policy.save();

  res.status(200).json({
    success: true,
    message: "Policy updated successfully",
    policy,
  });
});

export const getPolicy = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;

  const policy = await Policy.findOne({
    userId,
    isActive: true,
  }).lean();

  if (!policy) {
    throw AppError.notFound("Policy not found", "NOT_FOUND");
  }

  res.status(200).json({
    success: true,
    message: "Policy fetched successfully",
    policy,
  });
});
