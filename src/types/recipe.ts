
export interface Recipe {
  id: string;
  title: string;
  description: string;
  time: string;
  servings: number;
  difficulty: string;
  category: string;
  image: string;
  gallery: string[];
  ingredients: string[];
  instructions: string[];
  nutrition?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  tags?: string[];
  prepTime?: string;
  cookTime?: string;
  totalTime?: string;
  author?: string;
  tips?: string[];
}
