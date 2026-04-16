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

export const upsertPolicies = asyncHandler(async (req, res) => {
  const { policies } = req.body;

  if (!Array.isArray(policies) || policies.length === 0) {
    throw AppError.badRequest("Policies array required", "EMPTY_PAYLOAD");
  }

  const operations = [];

  for (const policy of policies) {
    const { type, title, content } = policy;

    if (!allowedType.includes(type)) {
      throw AppError.badRequest(`Invalid type: ${type}`, "INVALID_TYPE");
    }

    operations.push({
      updateOne: {
        filter: { type },
        update: {
          $set: {
            title,
            content,
            isActive: true,
          },
        },
        upsert: true,
      },
    });
  }

  await Policy.bulkWrite(operations);

  // optional: fetch updated policies
  const updatedPolicies = await Policy.find({
    type: { $in: policies.map((p) => p.type) },
  }).lean();

  res.status(200).json({
    success: true,
    message: "Policies saved successfully",
    policies: updatedPolicies,
  });
});

export const getPolicy = asyncHandler(async (req, res) => {
  const policy = await Policy.find({
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
