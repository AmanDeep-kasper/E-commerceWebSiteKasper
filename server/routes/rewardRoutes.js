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

rewardRouter.post("/create", authenticate, authorize("admin"),  createReward);
rewardRouter.get("/", authenticate, authorize("admin"), getAllRewards);
rewardRouter.get("/:id", authenticate, authorize("admin"), getRewardById);
rewardRouter.put("/:id", authenticate, authorize("admin"),  updateReward);  
rewardRouter.delete("/:id", authenticate, authorize("admin"),  deleteReward);

export default rewardRouter;
