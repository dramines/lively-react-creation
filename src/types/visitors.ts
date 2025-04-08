
/**
 * Represents a single visitor record from the API
 */
export interface Visitor {
  id: string;
  page_visitors: string;
  city_visitors: string;
  country_visitors: string;
  ip_visitors: string;
  date_visitors: string;
  created_at: string;
}

// API response is an array of visitor records
export type VisitorApiResponse = Visitor[];
