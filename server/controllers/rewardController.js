import Reward from "../models/Reward.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";

export const addOrUpdateReward = asyncHandler(async (req, res) => {
  const { name, earn, redeem, validity, isActive = true } = req.body;

  // 🔒 basic validation
  if (!earn?.rules || earn.rules.length === 0) {
    throw AppError.badRequest("Earn rules are required");
  }

  if (!redeem?.pointValue) {
    throw AppError.badRequest("Redeem config invalid");
  }

  // 🔥 sanitize rules (remove duplicates)
  const uniqueRulesMap = new Map();

  for (const rule of earn.rules) {
    if (!rule.minOrder || !rule.points) continue;

    uniqueRulesMap.set(rule.minOrder, rule.points);
  }

  const cleanedRules = Array.from(uniqueRulesMap.entries()).map(
    ([minOrder, points]) => ({
      minOrder,
      points,
    }),
  );

  // 🔥 sort rules (important for calculation)
  cleanedRules.sort((a, b) => a.minOrder - b.minOrder);

  // 🔥 check existing reward
  let reward = await Reward.findOne();

  // =========================
  // 🆕 CREATE
  // =========================
  if (!reward) {
    reward = await Reward.create({
      name: name || "Default Reward",
      earn: {
        minOrderValue: earn.minOrderValue || 0,
        rules: cleanedRules,
      },
      redeem,
      validity,
      isActive,
    });

    return res.status(201).json({
      success: true,
      message: "Reward created",
      data: reward,
    });
  }

  // =========================
  // 🔄 UPDATE
  // =========================

  // merge rules
  const existingMap = new Map();

  for (const rule of reward.earn.rules) {
    existingMap.set(rule.minOrder, rule.points);
  }

  for (const rule of cleanedRules) {
    existingMap.set(rule.minOrder, rule.points); // overwrite if exists
  }

  const mergedRules = Array.from(existingMap.entries()).map(
    ([minOrder, points]) => ({
      minOrder,
      points,
    }),
  );

  mergedRules.sort((a, b) => a.minOrder - b.minOrder);

  // update fields
  reward.name = name || reward.name;

  reward.earn = {
    minOrderValue: earn.minOrderValue ?? reward.earn.minOrderValue,
    rules: mergedRules,
  };

  reward.redeem = {
    ...reward.redeem,
    ...redeem,
  };

  reward.validity = {
    ...reward.validity,
    ...validity,
  };

  reward.isActive = isActive;

  await reward.save();

  return res.json({
    success: true,
    message: "Reward updated",
    data: reward,
  });
});

export const getReward = asyncHandler(async (req, res) => {
  // 🔥 fast query (only active reward + lean)
  const reward = await Reward.findOne({ isActive: true })
    .select("name earn redeem validity isActive")
    .lean();

  // ❗ no reward case (safe fallback)
  if (!reward) {
    return res.status(200).json({
      success: true,
      data: null,
      message: "No active reward found",
    });
  }

  // 🔥 ensure rules are sorted (extra safety)
  if (reward?.earn?.rules?.length) {
    reward.earn.rules.sort((a, b) => a.minOrder - b.minOrder);
  }

  // 🔥 response
  return res.status(200).json({
    success: true,
    data: reward,
  });
});

export const toggleRewardStatus = asyncHandler(async (req, res) => {
  // 🔥 atomic toggle (no payload needed)
  const updated = await Reward.findOneAndUpdate(
    {},
    [
      {
        $set: {
          isActive: { $not: "$isActive" },
        },
      },
    ],
    {
      new: true,
    },
  ).lean();

  if (!updated) {
    throw AppError.notFound("Reward not found");
  }

  return res.json({
    success: true,
    message: `Reward ${updated.isActive ? "enabled" : "disabled"}`,
    data: updated,
  });
});
