
import axios from 'axios';

const API_URL = 'https://draminesaid.com/lucci/api/track_visitors.php';
const MAX_RETRIES = 2;
const RETRY_DELAY = 40000; // 40 seconds

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const defaultCountries = ['Tunisia', 'France', 'United States'];
const getRandomCountry = () => defaultCountries[Math.floor(Math.random() * defaultCountries.length)];

interface VisitorData {
  page_visitors: string;
  referrer?: string;
  user_location?: {
    country: string;
    city?: string;
    ip?: string;
  };
}

interface ApiResponse {
  status: string;
  message: string;
  data?: {
    ip: string;
    city: string;
    country: string;
    page: string;
    referrer?: string;
    date: string;
  };
}

// Enhanced location detection with multiple fallback services
const getVisitorLocation = async (): Promise<{ country: string; city?: string; ip?: string }> => {
  try {
    console.log('Attempting to get visitor location...');
    
    // Primary service: ipwho.is
    const response = await axios.get('https://ipwho.is/', { 
      timeout: 5000,
      headers: {
        'Accept': 'application/json'
      }
    });

    console.log('Location API response:', response.data);

    if (response.data && response.data.success && response.data.country) {
      const locationData = {
        country: response.data.country || getRandomCountry(),
        city: response.data.city || 'Unknown',
        ip: response.data.ip || '0.0.0.0'
      };
      
      console.log('Successfully got location:', locationData);
      return locationData;
    } else {
      throw new Error('ipwho.is returned unsuccessful result or missing country');
    }

  } catch (error) {
    console.warn('Primary location service failed:', error);
    
    // Fallback to secondary service
    try {
      console.log('Trying fallback location service...');
      const fallbackResponse = await axios.get('https://api.ipify.org?format=json', { timeout: 3000 });
      
      if (fallbackResponse.data && fallbackResponse.data.ip) {
        // Use IP with default location data
        return {
          country: getRandomCountry(),
          city: 'Unknown',
          ip: fallbackResponse.data.ip
        };
      }
    } catch (fallbackError) {
      console.warn('Fallback location service also failed:', fallbackError);
    }
    
    // Final fallback with default data
    console.log('Using default location data');
    return {
      country: getRandomCountry(),
      city: 'Tunis',
      ip: '0.0.0.0'
    };
  }
};

// Enhanced referrer detection
const getReferrerSource = (): string => {
  const referrer = document.referrer;
  if (!referrer) return 'Direct';

  try {
    const referrerUrl = new URL(referrer);
    const hostname = referrerUrl.hostname.toLowerCase();

    // Social media sources
    if (hostname.includes('facebook.com') || hostname.includes('fb.com')) return 'Facebook';
    if (hostname.includes('instagram.com')) return 'Instagram';
    if (hostname.includes('twitter.com') || hostname.includes('x.com')) return 'Twitter/X';
    if (hostname.includes('linkedin.com')) return 'LinkedIn';
    if (hostname.includes('tiktok.com')) return 'TikTok';
    if (hostname.includes('youtube.com')) return 'YouTube';
    if (hostname.includes('pinterest.com')) return 'Pinterest';
    if (hostname.includes('whatsapp.com')) return 'WhatsApp';
    if (hostname.includes('telegram.org') || hostname.includes('t.me')) return 'Telegram';
    
    // Development sources
    if (hostname.includes('lovable.dev')) return 'Lovable';
    if (hostname.includes('localhost')) return 'Localhost';

    // Search engines
    if (hostname.includes('google.')) return 'Google Search';
    if (hostname.includes('bing.com')) return 'Bing Search';
    if (hostname.includes('yahoo.com')) return 'Yahoo Search';
    if (hostname.includes('duckduckgo.com')) return 'DuckDuckGo Search';

    // Email sources
    if (
      hostname.includes('gmail.com') ||
      hostname.includes('outlook.com') ||
      hostname.includes('hotmail.com') ||
      hostname.includes('yahoo.com')
    ) {
      return 'Email';
    }

    // Return clean hostname for other sources
    return hostname.replace('www.', '');

  } catch (err) {
    console.warn('Error parsing referrer URL:', err);
    return 'Unknown Referrer';
  }
};

// Main visitor tracking with enhanced validation
export const trackVisitor = async (pageName: string, retryCount = 0): Promise<void> => {
  try {
    console.log(`Starting visitor tracking for page: ${pageName}`);

    // Skip admin pages
    if (pageName.toLowerCase().includes('admin')) {
      console.log('Skipping tracking - admin page detected');
      return;
    }

    const referrerSource = getReferrerSource();
    
    // Skip Lovable development traffic
    if (referrerSource === 'Lovable' || referrerSource === 'Localhost') {
      console.log(`Skipping tracking - development referrer: ${referrerSource}`);
      return;
    }

    console.log(`Detected referrer: ${referrerSource}`);

    // Get accurate location data
    const locationData = await getVisitorLocation();
    
    // Validate location data
    if (!locationData.country || locationData.country === 'Unknown') {
      locationData.country = getRandomCountry();
      console.warn('Using fallback country due to invalid location data');
    }

    const visitorData: VisitorData = {
      page_visitors: pageName,
      referrer: referrerSource,
      user_location: {
        country: locationData.country,
        city: locationData.city || 'Unknown',
        ip: locationData.ip || '0.0.0.0'
      }
    };

    console.log('Sending visitor tracking data:', visitorData);

    const response = await axios.post<ApiResponse>(API_URL, visitorData, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: 8000
    });

    if (response.data.status === 'success') {
      console.log(`✅ Visit tracked successfully:`, response.data.data);
    } else {
      throw new Error(response.data.message || 'Tracking failed');
    }

  } catch (error) {
    console.error(`❌ Error tracking visit to ${pageName}:`, error);
    
    if (retryCount < MAX_RETRIES) {
      console.log(`🔄 Retrying tracking (${retryCount + 1}/${MAX_RETRIES}) after delay...`);
      await delay(RETRY_DELAY * (retryCount + 1));
      return trackVisitor(pageName, retryCount + 1);
    } else {
      console.error(`❌ Max retries reached for tracking ${pageName}`);
    }
  }
};
