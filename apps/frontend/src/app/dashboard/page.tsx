"use client";
import React, { useState } from "react";
import { Plus, ChevronDown, ChevronUp } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { BACKEND_URL } from "@/lib/config";
import { toast } from "sonner"
import { useWebSites } from "@/hooks/useWebSites";



function Page() {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [newWebsiteUrl, setNewWebsiteUrl] = useState("");
  const { websites, refreshWebsites } = useWebSites()
  console.log("websites",websites)
  const toggleExpanded = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleAddWebsite = async() => {
    if (!newWebsiteUrl.trim()) return;
    console.log("New Website URL:", newWebsiteUrl);
    const response = await axios.post(`${BACKEND_URL}/website`, {
      url:newWebsiteUrl
      
    })
    if (response.status === 201) {
      refreshWebsites();
      toast("website added sucessfully")
    }

    setNewWebsiteUrl("");
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Uptime Monitor
          </h1>
          <Dialog>
  <DialogTrigger asChild>
    <button className="flex items-center gap-2 px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700">
      <Plus size={20} /> Add Website
    </button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Add a New Website</DialogTitle>
    </DialogHeader>
    <Input
      placeholder="Enter website URL"
      value={newWebsiteUrl}
      onChange={(e) => setNewWebsiteUrl(e.target.value)}
    />
    <Button onClick={handleAddWebsite} className="w-full mt-4 bg-blue-600 text-white hover:bg-blue-700">
      Add Website
    </Button>
  </DialogContent>
</Dialog>

        </div>

        <div className="grid gap-4">
          {websites.map((website:any) => (
            <div
              key={website.id}
              className="rounded-lg bg-white dark:bg-gray-800 shadow-lg overflow-hidden"
            >
              <button
                onClick={() => toggleExpanded(website.id)}
                className="w-full p-4 flex items-center justify-between text-gray-900 dark:text-white hover:bg-gray-600 dark:hover:bg-gray-700"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      website.status === "up" ? "bg-green-500" : "bg-red-500"
                    }`}
                  />
                  <span className="text-sm text-gray-500 dark:text-gray-400">{website.url}</span>
                </div>
                {expandedId === website.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>

              {expandedId === website.id && (
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-sm font-medium mb-2 text-gray-600 dark:text-gray-300">
                    Last 30 minutes status
                  </h3>
                  <div className="flex gap-1">
                    {website.ticks.map((status:any, index:any) => (
                      <div
                        key={index}
                        className={`flex-1 h-8 rounded ${status ? "bg-green-500" : "bg-red-500"}`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Page;
