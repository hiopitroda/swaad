export type View = 'discover' | 'kitchen' | 'library';

export type Filter = 'all' | 'Beginner' | 'Intermediate' | 'Advanced';

export interface Ingredient {
  id: string;
  name: string;
}

export interface CookingConcept {
  title: string;
  description: string;
  whyItMatters: string;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  timeEstimate: string;
  imageKeyword: string;
  cookingConcept: CookingConcept;
}

export interface GeminiRecipeResponse {
  recipes: Recipe[];
}
