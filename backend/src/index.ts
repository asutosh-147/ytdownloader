
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { youtubeRouter } from "./routes";
dotenv.config();

const app = express();
app.use(express.json());

const allowedHosts = process.env.HOSTS ? process.env.HOSTS.split(",") : [];
app.use(
  cors({
    origin: allowedHosts,
    methods: "GET,PUT,POST,DELETE",
    credentials: true,
  })
);
app.use("/",youtubeRouter);

app.listen(3000, () => {
  console.log("listening port 3000");
});