import ytdl from "@distube/ytdl-core";
import dotenv from "dotenv";
dotenv.config();
export const agent = ytdl.createAgent(JSON.parse(process.env.COOKIES ?? ""));
