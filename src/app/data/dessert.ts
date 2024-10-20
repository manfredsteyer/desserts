export type Dessert = {
  id: number;
  originalName: string;
  englishName: string;
  description: string;
  kcal: number;
  rating: number;
  image: string;
};

export const initDessert: Dessert = {
  id: 0,
  originalName: '',
  englishName: '',
  description: '',
  kcal: 0,
  rating: 0,
  image: '',
};
