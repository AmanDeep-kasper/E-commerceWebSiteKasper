import express from "express";
import { authenticate, authorize } from "../middlewares/authMiddleware.js";
import {
    createReward,
    getAllRewards,
    getRewardById,
    updateReward,
    deleteReward,
} from "../controllers/rewardController.js";

const rewardRouter = express.Router();

rewardRouter.post("/create", createReward);
rewardRouter.get("/", getAllRewards);
rewardRouter.get("/:id", getRewardById);
rewardRouter.put("/:id",  updateReward);  
rewardRouter.delete("/:id",  deleteReward);

export default rewardRouter;
