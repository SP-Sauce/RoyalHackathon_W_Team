const BASE_URL = '/api';

export const api = {
  // Get all recipes
  getRecipes: async () => {
    const response = await fetch(`${BASE_URL}/recipes`);
    return response.json();
  },

  // Filter recipes
  filterRecipes: async (dietary, cuisine, maxCost) => {
    const params = new URLSearchParams({ dietary, cuisine, maxCost });
    const response = await fetch(`${BASE_URL}/recipes/filter?${params}`);
    return response.json();
  },

  // Create sustainability pledge
  createPledge: async (data) => {
    const response = await fetch(`${BASE_URL}/verdn/pledge`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });
    return response.json();
  }
};