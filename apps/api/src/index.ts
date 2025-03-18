import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";

import webSiteRoute from "./routes/websiteRoute";
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/v1", webSiteRoute);
app.listen(8080, () => {
  console.log("server is up at 8080");
});
