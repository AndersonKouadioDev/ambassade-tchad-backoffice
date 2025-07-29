// Define the DataProps interface based on the data structure in data.ts
export interface DataProps {
  id: number;
  titre: string;
  description: string;
  date: string;
  image: string;
  user: string;
  status: string;
  action: string | null;
  // Add other properties that might be in your data array
}
