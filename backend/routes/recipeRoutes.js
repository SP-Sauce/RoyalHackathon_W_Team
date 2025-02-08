import express from "express";
import mongoose from "mongoose";  // ✅ Ensure mongoose is imported
import Recipe from "../models/Recipe.js";

const router = express.Router();


// ✅ Fix: Ensure Only One Response is Sent
router.post("/", async (req, res) => {
    try {
        const newRecipe = new Recipe(req.body);
        await newRecipe.save();

        console.log("🔥 Recipe Added to Database:", newRecipe);

        // ✅ Send only one response
        return res.status(201).json({ success: true, recipe: newRecipe });

    } catch (error) {
        console.error("❌ Validation Error:", error.message);

        // ✅ Ensure error response is only sent when needed
        if (!res.headersSent) {
            return res.status(400).json({ success: false, error: error.message });
        }
    }
});




// ✅ Get Recipes by Dietary Requirement (GET)
router.get("/", async (req, res) => {
    try {
        const { dietary, cuisine, budget } = req.query;
        const filter = {};
        
        if (dietary) filter.dietary_requirements = dietary;
        if (cuisine) filter.cuisine_type = cuisine;
        if (budget) filter.cost_per_serving = { $lte: Number(budget) }; // Budget filter (under x amount)

        const recipes = await Recipe.find(filter);
        res.json({ success: true, recipes });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ✅ Get Single Recipe (GET)
router.get("/:id", async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) return res.status(404).json({ success: false, message: "Recipe not found" });
        res.json({ success: true, recipe });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ✅ Delete Recipe (DELETE)
router.delete("/:id", async (req, res) => {
    try {
        await Recipe.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Recipe deleted" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
