"use client";
import React, { useState, useMemo } from 'react';
import { Globe, Plus, Moon, Sun } from 'lucide-react';
import { useWebSites } from '@/hooks/useWebSites';
import axios from 'axios';
import { BACKEND_URL} from '@/lib/config';
import { useAuth } from '@clerk/nextjs';
import { WebsiteCard } from '@/components/WebsiteCard';
import { CreateWebSiteModal } from '@/components/CreateWebsiteModal';

function page() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { websites, refreshWebsites } = useWebSites();
  const { getToken } = useAuth();

  // Process websites to calculate uptime metrics
  const processedWebsites = useMemo(() => {
    return websites.map(website => {
      const sortedTicks = [...website.ticks].sort((a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      const thirtyMinutesAgo = Date.now() - 30 * 60 * 1000;
      const recentTicks = sortedTicks.filter(tick =>
        new Date(tick.createdAt) > thirtyMinutesAgo
      );

      const windows = [];
      for (let i = 0; i < 10; i++) {
        const windowStart = Date.now() - (i + 1) * 3 * 60 * 1000;
        const windowEnd = Date.now() - i * 3 * 60 * 1000;
        const windowTicks = recentTicks.filter(tick => {
          const tickTime = new Date(tick.createdAt).getTime();
          return tickTime >= windowStart && tickTime < windowEnd;
        });
        const upCount = windowTicks.filter(tick => tick.status === 'Good').length;
        windows[9 - i] =
          windowTicks.length === 0
            ? "unknown"
            : upCount / windowTicks.length >= 0.5
            ? "good"
            : "bad";
      }

      const totalTicks = sortedTicks.length;
      const upTicks = sortedTicks.filter(tick => tick.status === 'Good').length;
      const uptimePercentage = totalTicks === 0 ? 100 : (upTicks / totalTicks) * 100;
      const currentStatus = windows[windows.length - 1];
      const lastChecked = sortedTicks[0]
        ? new Date(sortedTicks[0].createdAt).toLocaleTimeString()
        : 'Never';

      return {
        id: website.id,
        url: website.url,
        status: currentStatus,
        uptimePercentage,
        lastChecked,
        uptimeTicks: windows,
      };
    });
  }, [websites]);

  //
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-2">
            <Globe className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Uptime Monitor</h1>
          </div>
          <div className="flex items-center space-x-4">
          
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <Plus className="w-4 h-4" />
              <span>Add Website</span>
            </button>
          </div>
        </div>
        
        <div className="space-y-4">
          {processedWebsites.map(website => (
            <WebsiteCard key={website.id} website={website} />
          ))}
        </div>
      </div>
      
      <CreateWebSiteModal
        isOpen={isModalOpen}
        onClose={async (url) => {
          if (url === null) {
            setIsModalOpen(false);
            return;
          }
          const token = await getToken();
          console.log(token)
          setIsModalOpen(false);
          axios
            .post(
              `${BACKEND_URL}/website`,
              { url },
              {
                headers: {
                Authorization:token
                }
              }
        
            )
            .then(refreshWebsites);
        }}
      />
    </div>
  );
}

export default page;
