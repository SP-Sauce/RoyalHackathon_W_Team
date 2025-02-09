import express from "express";
import { createPledgeForShoppingList } from "../controllers/verdnController.js";

const router = express.Router();

// ✅ Route to pledge sustainability impact
router.post("/pledge-shopping", createPledgeForShoppingList);

export default router;
