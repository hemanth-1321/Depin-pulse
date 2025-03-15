import express from "express";
import webSiteRoute from "./routes/websiteRoute";
const app = express();
app.use(express.json());
app.use("/api/v1", webSiteRoute);
app.listen(3000, () => {
  console.log("server is up at 3000");
});
