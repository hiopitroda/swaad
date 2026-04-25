# Culinary Mentor AI (PantryChef)

An intelligent kitchen assistant designed for the **2nd Innings Challenge**. This application helps users discover creative recipes based on the ingredients they already have, while teaching professional cooking concepts to help them master the craft of cooking.

## 🌟 Key Features

- **Ingredient-Based Discovery**: Add any number of ingredients from your pantry to generate personalized recipe suggestions.
- **Mastery Concepts**: Every recipe comes with a "Mastery Concept" (e.g., The Maillard Reaction, Osmosis, Deglazing). The AI acts as a mentor, explaining the culinary science behind the dish.
- **Kitchen Stash**: Save your favorite recipes to your personal "Kitchen" for easy access.
- **Technique Library**: A centralized place to review all the professional cooking techniques you've encountered.
- **AI-Powered**: Utilizes Google's Gemini models for high-quality, structured recipe generation and educational content.
- **Premium Design**: Features the "Natural Tones" aesthetic with a responsive, elegant UI.

## 🚀 How to Use

1. **Add Ingredients**: On the "Discover" tab, use the left panel to input ingredients you have at home. You can type them manually or click common staples to add them quickly.
2. **Discover Recipes**: Click **"Discover Recipes"** once you've added at least one ingredient (3+ recommended for better results).
3. **Learn as You Cook**: Click on any recipe card to open the mentorship view. Here you can see:
   - The **Mastery Concept** explained.
   - Why that specific technique matters.
   - Step-by-step method and required ingredients.
4. **Save Favorites**: Click the heart icon on any recipe to save it to your **"Kitchen"**.
5. **Review Library**: Navigate to the **"Library"** tab to see a collection of all the cooking concepts from your saved recipes.

## 🛠️ Technical Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS 4
- **Animations**: Motion (formerly Framer Motion)
- **AI Integration**: `@google/genai` (Gemini 3 Flash Preview)
- **Icons**: Lucide React

## 📦 Local Development

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Environment Setup**:
   Create a `.env` file and add your Gemini API Key:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

3. **Run Dev Server**:
   ```bash
   npm run dev
   ```

## 🏆 2nd Innings Challenge
This project was built to demonstrate how AI can be an active mentor rather than a passive tool, adapting professional-grade culinary education to the user's current pace and inventory.
