import express from "express";
import { authMiddleWare } from "../middlewares/authMiddleware";
import { prismaClient } from "db/client";
const router = express.Router();

router.post("/website", authMiddleWare, async (req, res) => {
  const userId = req.userId!;
  const { url } = req.body;
  try {
    const website = await prismaClient.webSite.create({
      data: {
        userId,
        url,
      },
    });

    res.status(201).json({
      id: website.id,
    });
  } catch (error) {
    console.error("Error while creating ", error);
    res.status(411).json({
      message: "Failed to create",
    });
  }
});

router.get("/website/status", authMiddleWare, async (req, res) => {
  const websiteId = req.query.websiteId as unknown as string;

  const userId = req.userId;
  try {
    const data = await prismaClient.webSite.findFirst({
      where: {
        id: websiteId,
        userId: userId,
        disabled: false,
      },
      include: {
        ticks: true,
      },
    });
    res.status(201).json(data);
  } catch (error) {
    console.error("Error gettig status ", error);
    res.status(411).json({
      message: "Failed to fetch status",
    });
  }
});

router.get("/websites", authMiddleWare, async (req, res) => {
  const userId = req.userId;
  try {
    const websites = await prismaClient.webSite.findMany({
      where: {
        userId: userId,
        disabled: false,
      },
    });

    res.status(200).json(websites);
  } catch (error) {
    console.error("Error gettig websites ", error);
    res.status(411).json({
      message: "Failed to fetch websites",
    });
  }
});

router.delete("/website", authMiddleWare, async (req, res) => {
  const { websiteId } = req.body;
  const userId = req.userId;
  try {
    await prismaClient.webSite.update({
      where: {
        id: websiteId,
        userId: userId,
      },
      data: {
        disabled: false,
      },
    });

    res.status(201).json({
      message: "Deleted website successfully",
    });
  } catch (error) {
    console.error("Error deleteing website ", error);
    res.status(411).json({
      message: "Failed to delete website",
    });
  }
});
export default router;
