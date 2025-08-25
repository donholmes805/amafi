import { mockApi } from '../data/mockData';
import { AMA } from '../types';
import { processAMA } from '../utils/data';

const liveApi = {
  fetchAmas: async (): Promise<AMA[] | null> => {
    try {
      // Fetch from the new Vercel Function endpoint
      const response = await fetch('/api/amas');
      if (!response.ok) {
        console.error("Server responded with error:", response.status);
        return mockApi.fetchAmas(); // Fallback to mock data on server error
      }
      const amasData = await response.json();
      // Process data to ensure consistency (e.g., creating Date objects)
      return (amasData || []).map(processAMA);
    } catch (error) {
      console.error("Error fetching live AMAs, falling back to mock data:", error);
      // If the API endpoint fails entirely (e.g., network error), use the mock data
      return mockApi.fetchAmas();
    }
  },
};

// Combine mock and live APIs, with the live `fetchAmas` overriding the mock version.
// This allows for an incremental migration to a live backend.
const api = {
  ...mockApi,
  ...liveApi,
};

export default api;
