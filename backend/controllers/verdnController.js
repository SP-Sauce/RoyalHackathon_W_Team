import axios from "axios";
import { VERDN_API_URL, VERDN_API_KEY, VERDN_IMPACT_OFFERINGS } from "../config/verdnConfig.js";
import Sustainability from "../models/Sustainability.js";
import Recipe from "../models/Recipe.js";
import { v4 as uuidv4 } from "uuid"; // Generates unique reference IDs

export const createPledgeTransaction = async (req, res) => {
    try {
        const { recipeId, impactType, impactAmount } = req.body;

        if (!recipeId || !impactType || !impactAmount) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        const recipe = await Recipe.findById(recipeId);
        if (!recipe) return res.status(404).json({ success: false, message: "Recipe not found" });

        const impactOffering = VERDN_IMPACT_OFFERINGS[impactType];
        if (!impactOffering) {
            return res.status(400).json({ success: false, message: "Invalid impact type" });
        }

        const adjustedAmount = impactAmount * impactOffering.unit_conversion;
        const reference = `mealgenie-${uuidv4()}`;

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

        console.log("🔥 FULL VERDN API RESPONSE:", JSON.stringify(response.data, null, 2));

        const pledge = response.data.pledges[0] || {};
        const impactDetails = pledge.detail || {};  

        // 🚀 Assign estimated sustainability metrics if missing
        let estimatedCarbon = 0, estimatedWater = 0, estimatedScore = 50;  

        if (impactType === "plant_trees") {
            estimatedCarbon = impactAmount * 21;  // 21kg CO₂ absorbed per tree
            estimatedWater = impactAmount * 50;  // Estimated 50 liters water usage for tree planting
            estimatedScore = 90;  // High sustainability impact
        } else if (impactType === "recover_plastic") {
            estimatedCarbon = impactAmount * 3;  // 3kg CO₂ per kg of plastic collected
            estimatedWater = impactAmount * 10;  // Estimated 10 liters water saved per kg plastic
            estimatedScore = 80;
        } else if (impactType === "restore_coral") {
            estimatedCarbon = impactAmount * 5;
            estimatedWater = impactAmount * 30;
            estimatedScore = 85;
        }

        // Store pledged impact in MongoDB
        const sustainabilityData = new Sustainability({
            recipe_id: recipe._id,
            carbon_impact: estimatedCarbon,  // ✅ Assigned manually
            water_usage: estimatedWater,  // ✅ Assigned manually
            sustainability_score: estimatedScore,  // ✅ Assigned manually
            rating: 5,
            name: impactType
        });

        await sustainabilityData.save();

        res.json({ success: true, data: sustainabilityData, message: "Pledge transaction successful!" });
    } catch (error) {
        console.error("❌ Verdn API Error:", error.response ? error.response.data : error.message);
        res.status(500).json({ success: false, error: error.response?.data || error.message });
    }
};
