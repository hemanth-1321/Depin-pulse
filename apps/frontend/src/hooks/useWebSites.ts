"use client";
import { BACKEND_URL } from "@/lib/config";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { useEffect, useState } from "react";

export interface Tick {
  id: string;
  createdAt: string;
  status: "up" | "down";
  latency: string;
}

export interface Website {
  id: string;
  url: string;
  ticks: Tick[];
}

export function useWebSites() {
  const { getToken } = useAuth();
  const [websites, setWebsites] = useState<Website[]>([]);

  async function refreshWebsites() {
    try {
      const token = await getToken();
      const response = await axios.get(`${BACKEND_URL}/websites`, {
        headers: {
          Authorization: token,
        },
      });
      setWebsites(response.data);
      console.log("Fetched websites:", response.data);
    } catch (error) {
      console.error("Error fetching websites:", error);
    }
  }

  useEffect(() => {
    refreshWebsites();
    const interval = setInterval(refreshWebsites, 1000 * 60); // Refresh every 1 min
    return () => clearInterval(interval);
  }, []);

  return { websites, refreshWebsites };
}
