export interface Recipe {
  id: number;
  name: string;
  type: 'drink' | 'food';
  ingredients: {
    name: string;
    amount: number;
    unit: string;
  }[];
  instructions: string;
} 