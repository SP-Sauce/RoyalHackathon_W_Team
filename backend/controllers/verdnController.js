import axios from "axios";
import { VERDN_API_URL, VERDN_API_KEY, VERDN_IMPACT_OFFERINGS } from "../config/verdnConfig.js";
import Sustainability from "../models/Sustainability.js";
import Recipe from "../models/Recipe.js";
import { v4 as uuidv4 } from "uuid"; // Generates unique reference IDs

export const createPledgeTransaction = async (req, res) => {
    try {
        const { recipeId, impactType, impactAmount } = req.body;

        // Validate input
        if (!recipeId || !impactType || !impactAmount) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        // Find the recipe
        const recipe = await Recipe.findById(recipeId);
        if (!recipe) return res.status(404).json({ success: false, message: "Recipe not found" });

        // Get impact offering details
        const impactOffering = VERDN_IMPACT_OFFERINGS[impactType];
        if (!impactOffering) {
            return res.status(400).json({ success: false, message: "Invalid impact type" });
        }

        // Calculate correct impact amount based on Verdn's unit conversion
        const adjustedAmount = impactAmount * impactOffering.unit_conversion;

        // Generate a unique reference ID
        const reference = `mealgenie-${uuidv4()}`;

        // Construct correct Verdn API payload
        const payload = {
            reference: reference,
            recipient: {
                name: "MealGenie User",
                email: "user@example.com"
            },
            pledges: [
                {
                    impact: {
                        offeringId: impactOffering.id,
                        amount: adjustedAmount
                    }
                }
            ]
        };

        console.log("🔍 Sending payload to Verdn:", JSON.stringify(payload, null, 2));

        // Call Verdn API
        const response = await axios.post(
            VERDN_API_URL,
            payload,
            {
                headers: {
                    Authorization: `Bearer ${VERDN_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        console.log("✅ Verdn API Response:", response.data);

        // Extract relevant impact data
        const sustainabilityData = new Sustainability({
            recipe_id: recipe._id,
            carbon_impact: response.data.pledges?.[0]?.impact?.carbon_impact || 0,
            water_usage: response.data.pledges?.[0]?.impact?.water_usage || 0,
            sustainability_score: response.data.pledges?.[0]?.impact?.sustainability_score || 0,
            rating: response.data.pledges?.[0]?.impact?.rating || 5,  // 🔥 Default to 5 if missing
            name: impactType  // 🔥 Use the impact type name (e.g., "plant_trees")
        });

        await sustainabilityData.save();

        res.json({ success: true, data: sustainabilityData, message: "Pledge transaction successful!" });
    } catch (error) {
        console.error("❌ Verdn API Error:", error.response ? error.response.data : error.message);
        res.status(500).json({ success: false, error: error.response?.data || error.message });
    }
};
