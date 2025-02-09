import express from "express";
import mongoose from "mongoose";
import Recipe from "../models/Recipe.js";

const router = express.Router();

// Create a new recipe
router.post("/", async (req, res) => {
    try {
        const newRecipe = new Recipe(req.body);
        await newRecipe.save();

        console.log("🔥 Recipe Added to Database:", newRecipe);
        return res.status(201).json({ success: true, recipe: newRecipe });
    } catch (error) {
        console.error("❌ Validation Error:", error.message);
        if (!res.headersSent) {
            return res.status(400).json({ success: false, error: error.message });
        }
    }
});

// Get all recipes
router.get("/", async (req, res) => {
    try {
        const recipes = await Recipe.find();
        res.json({ success: true, recipes });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Filter Recipes by Multiple Cuisines and Dietary Requirements
router.get("/filter", async (req, res) => {
    try {
        const { dietary, cuisine, maxCost } = req.query;
        const filter = {};

        // Allow multiple cuisines (OR condition)
        if (cuisine) {
            const cuisineArray = cuisine.split(",").map(item => item.trim());
            filter.cuisine_type = { $in: cuisineArray };
        }

        // Allow multiple dietary requirements (AND condition)
        if (dietary) {
            const dietaryArray = dietary.split(",").map(item => item.trim());
            filter.dietary_requirements = { $all: dietaryArray }; 
        }

        // Budget filter
        if (maxCost) filter.cost_per_serving = { $lte: Number(maxCost) };

        const recipes = await Recipe.find(filter);
        res.json({ success: true, recipes });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Weekly Budget Calculation - Fetch All Costs and Sum Up
router.get("/weekly-budget", async (req, res) => {
    try {
        const recipes = await Recipe.find({}, "cost_per_serving");
        const totalCost = recipes.reduce((sum, recipe) => sum + (recipe.cost_per_serving || 0), 0);
        res.json({ success: true, totalWeeklyCost: totalCost });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get Recipe by ID
router.get("/:id", async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) return res.status(404).json({ success: false, message: "Recipe not found" });
        res.json({ success: true, recipe });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Delete Recipe
router.delete("/:id", async (req, res) => {
    try {
        await Recipe.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Recipe deleted" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
