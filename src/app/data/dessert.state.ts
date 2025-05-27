import { Dessert } from "./dessert";

export type DessertState = {
  filter: {
    originalName: string;
    englishName: string;
  };
  loading: boolean;
  desserts: Dessert[];
  error: string;
};
