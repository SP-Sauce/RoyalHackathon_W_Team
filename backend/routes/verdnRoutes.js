import express from "express";
import { createPledgeTransaction } from "../controllers/verdnController.js";

const router = express.Router();

// ✅ Route to pledge sustainability impact
router.post("/pledge", createPledgeTransaction);

export default router;
