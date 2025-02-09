import axios from "axios";
import { VERDN_API_URL, VERDN_API_KEY, VERDN_IMPACT_OFFERINGS } from "../config/verdnConfig.js";
import Sustainability from "../models/Sustainability.js";
import { v4 as uuidv4 } from "uuid"; // Generates unique reference IDs

export const createPledgeForShoppingList = async (req, res) => {
    try {
        // 🔥 **Dynamic total cost - Can be updated later to be passed from frontend**
        const totalCost = 120;  // <-- Keep this dynamic if needed

        // 🌍 **Always Pledge 'plant_trees' & Calculate Impact**
        const impactType = "plant_trees";
        let impactAmount = Math.floor(totalCost / 30); // 🔥 1 tree per £30 spent
        if (impactAmount < 1) impactAmount = 1; // Ensure at least 1 pledge

        const impactOffering = VERDN_IMPACT_OFFERINGS[impactType];
        if (!impactOffering) {
            return res.status(400).json({ success: false, message: "Invalid impact type" });
        }

        const adjustedAmount = impactAmount * impactOffering.unit_conversion;
        const reference = `mealgenie-${uuidv4()}`;

        // 🌱 **Verdn API Payload**
        const payload = {
            reference: reference,
            recipient: {
                name: "BitWise User",
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

        // 🚀 **Assign Estimated Sustainability Metrics**
        const estimatedCarbon = impactAmount * 21;  // 21kg CO₂ absorbed per tree
        const estimatedWater = impactAmount * 50;  // Estimated 50 liters water benefit per tree
        const estimatedScore = 90;  // High sustainability impact

        // Store pledged impact in MongoDB
        const sustainabilityData = new Sustainability({
            carbon_impact: estimatedCarbon,  
            water_usage: estimatedWater,  
            sustainability_score: estimatedScore,  
            rating: 5,
            name: impactType
        });

        await sustainabilityData.save();

        // ✅ **Include totalCost in the response**
        res.json({
            success: true,
            data: {
                carbon_impact: estimatedCarbon,  
                water_usage: estimatedWater,  
                sustainability_score: estimatedScore,  
                rating: 5,
                name: impactType,
                totalCost: totalCost  // ✅ Now included in response
            },
            message: "Pledge transaction successful!"
        });
    } catch (error) {
        console.error("❌ Verdn API Error:", error.response ? error.response.data : error.message);
        res.status(500).json({ success: false, error: error.response?.data || error.message });
    }
};
