import { GoogleGenAI, Type } from "@google/genai";
import { Recipe, GeminiRecipeResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

const RECIPE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    recipes: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          ingredients: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          instructions: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          difficulty: { 
            type: Type.STRING,
            enum: ['Beginner', 'Intermediate', 'Advanced']
          },
          timeEstimate: { type: Type.STRING },
          imageKeyword: { type: Type.STRING },
          cookingConcept: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              whyItMatters: { type: Type.STRING },
            },
            required: ['title', 'description', 'whyItMatters'],
          },
        },
        required: ['id', 'title', 'description', 'ingredients', 'instructions', 'difficulty', 'timeEstimate', 'cookingConcept'],
      },
    },
  },
  required: ['recipes'],
};

export async function generateRecipes(ingredients: string[]): Promise<Recipe[]> {
  if (ingredients.length === 0) return [];

  const prompt = `Generate 3 creative recipes using these ingredients: ${ingredients.join(", ")}. 
  Each recipe must also include:
  1. A "Cooking Concept" - a professional technique or food science principle (e.g. Maillard reaction).
  2. An "imageKeyword" - a 2-3 word specific descriptive keyword for high-quality food photography of this dish.
  Adapt the instructions to be clear and educational.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: RECIPE_SCHEMA,
      },
    });

    const result = JSON.parse(response.text) as GeminiRecipeResponse;
    return result.recipes;
  } catch (error) {
    console.error("Error generating recipes:", error);
    throw new Error("Failed to cook up some recipes. Please try again.");
  }
}
