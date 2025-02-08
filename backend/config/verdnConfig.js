import dotenv from "dotenv";

dotenv.config();

const VERDN_API_URL = "https://api.verdn.com/v2/pledge-transaction";
const VERDN_API_KEY = process.env.VERDN_API_KEY;

const VERDN_IMPACT_OFFERINGS = {
    plant_trees: { id: "io_01J4RSBX6KPQ4RYCRZ8C4QWRHF", unit_conversion: 1 },
    recover_plastic: { id: "io_01J4RSBX6QX3K9HYX1Z67DSS1Y", unit_conversion: 1000 },
    restore_coral: { id: "io_01J4RSBX6F6CT7J4JZS14NVQWV", unit_conversion: 25 }
};

export { VERDN_API_URL, VERDN_API_KEY, VERDN_IMPACT_OFFERINGS };
