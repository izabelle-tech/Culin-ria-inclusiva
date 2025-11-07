export interface DailyValues {
  [key: string]: string;
}

export interface Recipe {
  name: string;
  description: string;
  ingredients: string[];
  preparation: string[];
  yield: string;
  dailyValues: DailyValues;
  imageUrl: string;
}
