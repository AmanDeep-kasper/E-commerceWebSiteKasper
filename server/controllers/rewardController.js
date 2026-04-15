import Reward from "../models/Reward.js";

/* ================= CREATE REWARD ================= */
export const createReward = async (req, res) => {
  try {
    const {
      name,
      amount,
      minPurchase,
      deadline,
      redeemPoints,
      redeemPercent,
      redeemAmount,
    } = req.body;

    // Status logic (same as your frontend)
    const today = new Date();
    const selectedDate = new Date(deadline);

    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    const isActive = selectedDate >= today;

    const reward = await Reward.create({
      name,
      amount,
      minPurchase,
      deadline,
      redeemPoints,
      redeemPercent,
      redeemAmount,
      isActive,
    });

    res.status(201).json({
      success: true,
      message: "Reward created successfully",
      data: reward,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= GET ALL ================= */
export const getAllRewards = async (req, res) => {
  try {
    const rewards = await Reward.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: rewards,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= GET SINGLE ================= */
export const getRewardById = async (req, res) => {
  try {
    const reward = await Reward.findById(req.params.id);

    if (!reward) {
      return res.status(404).json({
        success: false,
        message: "Reward not found",
      });
    }

    res.status(200).json({
      success: true,
      data: reward,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= UPDATE ================= */
export const updateReward = async (req, res) => {
  try {
    const { deadline } = req.body;

    let isActive;

    // recalculate status if deadline updated
    if (deadline) {
      const today = new Date();
      const selectedDate = new Date(deadline);

      today.setHours(0, 0, 0, 0);
      selectedDate.setHours(0, 0, 0, 0);

      isActive = selectedDate >= today;
    }

    const updatedReward = await Reward.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        ...(isActive !== undefined && { isActive }),
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: updatedReward,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= DELETE ================= */
export const deleteReward = async (req, res) => {
  try {
    await Reward.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Reward deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};