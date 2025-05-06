
import axios from 'axios';

const API_URL = 'https://respizenmedical.com/tazart/track_visitors.php';
const MAX_RETRIES = 2;
const RETRY_DELAY = 40000; // 40 seconds

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

interface VisitorData {
  page_visitors: string;
}

interface ApiResponse {
  status: string;
  message: string;
  data?: {
    ip: string;
    city: string;
    country: string;
    page: string;
    date: string;
  };
}

/**
 * Tracks a page visit by sending data to the tracking API
 * @param pageName Name of the page being visited
 * @param retryCount Current retry attempt (used internally)
 */
export const trackVisitor = async (pageName: string, retryCount = 0): Promise<void> => {
  try {
    console.log(`Tracking visit to: ${pageName}`);
    
    const visitorData: VisitorData = {
      page_visitors: pageName
    };

    const response = await axios.post<ApiResponse>(API_URL, visitorData, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: 5000
    });

    if (response.data.status === 'success') {
      console.log(`Visit tracked successfully: ${pageName}`);
    } else {
      throw new Error(response.data.message || 'Unknown error occurred');
    }
  } catch (error) {
    console.error(`Error tracking visit to ${pageName}:`, error);
    
    if (retryCount < MAX_RETRIES) {
      console.log(`Retrying tracking (${retryCount + 1}/${MAX_RETRIES}) after delay...`);
      await delay(RETRY_DELAY * (retryCount + 1));
      return trackVisitor(pageName, retryCount + 1);
    }
  }
};
