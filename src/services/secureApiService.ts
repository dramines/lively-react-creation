// API Proxy Layer - masks actual endpoint URLs
const API_ENDPOINTS = {
  // Encoded/obfuscated endpoint mappings
  'products': 'aHR0cHM6Ly9kcmFtaW5lc2FpZC5jb20vbHVjY2kvYXBpL2dldF9hbGxfcHJvZHVjdHMucGhw',
  'product-detail': 'aHR0cHM6Ly9kcmFtaW5lc2FpZC5jb20vbHVjY2kvYXBpL2dldF9zaW5nbGVfcHJvZHVjdC5waHA=',
  'products-category': 'aHR0cHM6Ly9kcmFtaW5lc2FpZC5jb20vbHVjY2kvYXBpL2dldF9wcm9kdWN0c19ieV9jYXRlZ29yeS5waHA=',
  'related-products': 'aHR0cHM6Ly9kcmFtaW5lc2FpZC5jb20vbHVjY2kvYXBpL2dldF9yZWxhdGVkX3Byb2R1Y3RzLnBocA==',
  'featured-products': 'aHR0cHM6Ly9kcmFtaW5lc2FpZC5jb20vbHVjY2kvYXBpL2dldF9mZWF0dXJlZF9wcm9kdWN0cy5waHA=',
  'exclusive-collection': 'aHR0cHM6Ly9kcmFtaW5lc2FpZC5jb20vbHVjY2kvYXBpL2dldF9leGNsdXNpdmVfY29sbGVjdGlvbi5waHA=',
  'submit-order': 'aHR0cHM6Ly9kcmFtaW5lc2FpZC5jb20vbHVjY2kvYXBpL2luc2VydF9jb21wbGV0ZV9vcmRlci5waHA=',
  'order-detail': 'aHR0cHM6Ly9kcmFtaW5lc2FpZC5jb20vbHVjY2kvYXBpL2dldF9zaW5nbGVfb3JkZXIucGhw',
  'newsletter': 'aHR0cHM6Ly9kcmFtaW5lc2FpZC5jb20vbHVjY2kvYXBpL2luc2VydF9uZXdzbGV0dGVyLnBocA==',
  'message': 'aHR0cHM6Ly9kcmFtaW5lc2FpZC5jb20vbHVjY2kvYXBpL2luc2VydF9tZXNzYWdlLnBocA==',
  'reservation': 'aHR0cHM6Ly9kcmFtaW5lc2FpZC5jb20vbHVjY2kvYXBpL2luc2VydF9yZXNlcnZhdGlvbi5waHA=',
  'track-visitor': 'aHR0cHM6Ly9kcmFtaW5lc2FpZC5jb20vbHVjY2kvYXBpL3RyYWNrX3Zpc2l0b3JzLnBocA=='
};

// Decode base64 encoded URLs
const decodeEndpoint = (key: string): string => {
  try {
    return atob(API_ENDPOINTS[key as keyof typeof API_ENDPOINTS] || '');
  } catch {
    throw new Error('Invalid endpoint key');
  }
};

// Add random delay and obfuscation to make requests less predictable
const addRequestObfuscation = () => {
  return new Promise(resolve => {
    const delay = Math.random() * 100 + 50; // 50-150ms random delay
    setTimeout(resolve, delay);
  });
};

// Proxy fetch function that hides actual URLs
export const secureApiCall = async (
  endpointKey: string, 
  options: RequestInit = {},
  params?: Record<string, string>
): Promise<Response> => {
  await addRequestObfuscation();
  
  const baseUrl = decodeEndpoint(endpointKey);
  if (!baseUrl) {
    throw new Error('Endpoint not found');
  }

  // Build URL with parameters
  let finalUrl = baseUrl;
  if (params && Object.keys(params).length > 0) {
    const searchParams = new URLSearchParams(params);
    finalUrl += '?' + searchParams.toString();
  }

  // Add some request headers obfuscation
  const headers = {
    'Content-Type': 'application/json',
    'X-Client-Version': '2.1.0',
    'X-Request-ID': Math.random().toString(36).substr(2, 9),
    ...options.headers,
  };

  return fetch(finalUrl, {
    ...options,
    headers,
  });
};

// Wrapper for GET requests
export const secureGet = async (
  endpointKey: string, 
  params?: Record<string, string>
): Promise<any> => {
  const response = await secureApiCall(endpointKey, { method: 'GET' }, params);
  
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  
  return response.json();
};

// Wrapper for POST requests
export const securePost = async (
  endpointKey: string, 
  data?: any
): Promise<any> => {
  const response = await secureApiCall(endpointKey, {
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  });
  
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  
  return response.json();
};