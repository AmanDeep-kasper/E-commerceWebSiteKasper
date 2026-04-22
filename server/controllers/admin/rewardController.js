import Reward from "../../models/admin/RewardConfig.js";
import AppError from "../../utils/AppError.js";
import asyncHandler from "../../utils/asyncHandler.js";

export const addOrUpdateReward = asyncHandler(async (req, res) => {
  let { name, earn, minOrderValueForRedeem, validity, isActive, pointValue } = req.body;

  // basic validation
  if (earn && typeof earn === "string") {
    earn = JSON.parse(earn);
  }

  // check existing reward
  let reward = await Reward.findOne();

  // CREATE
  if (!reward) {
    reward = await Reward.create({
      name,
      earn,
      minOrderValueForRedeem,
      validity,
      pointValue,
      isActive: isActive === undefined ? true : isActive,
    });

    return res.status(201).json({
      success: true,
      message: "Reward created successfully",
      data: reward,
    });
  }

  // update fields
  reward.name = name || reward.name;
  reward.earn = earn || reward.earn;
  reward.minOrderValueForRedeem =
    minOrderValueForRedeem || reward.minOrderValueForRedeem;
  reward.validity = validity || reward.validity;
  reward.pointValue = pointValue !== undefined ? pointValue : reward.pointValue;
  reward.isActive = isActive;

  await reward.save();

  return res.json({
    success: true,
    message: "Reward updated successfully",
    data: reward,
  });
});

export const getReward = asyncHandler(async (req, res) => {
  const reward = await Reward.findOne().lean();

  if (!reward) {
    throw AppError.notFound("Reward not found", "NOT_FOUND");
  }

  return res.status(200).json({
    success: true,
    data: reward,
  });
});

export const toggleRewardStatus = asyncHandler(async (req, res) => {
  const reward = await Reward.findOne();

  if (!reward) {
    throw AppError.notFound("Reward not found", "NOT_FOUND");
  }

  reward.isActive = !reward.isActive;
  await reward.save();

  return res.json({
    success: true,
    message: `Reward ${reward.isActive ? "activated" : "diactivated"} successfully`,
  });
});
