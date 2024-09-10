import { config } from "dotenv";
config();

export const PORT = process.env.PORT || 8080;
export const MONGODB_URI = process.env.MONGODB_URI;