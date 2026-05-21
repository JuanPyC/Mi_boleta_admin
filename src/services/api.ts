export const API_URL = 'https://mi-boleta-api-y9dv.onrender.com/api/v1';

export const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export class ApiError extends Error {
  public status: number;
  public data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

export const fetchApi = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const url = `${API_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  });

  const contentType = response.headers.get('content-type');
  const isJson = contentType && contentType.includes('application/json');
  
  let data;
  if (isJson) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    let errorMessage = 'An error occurred';
    if (data && typeof data === 'object' && data.error) {
      errorMessage = data.error;
    } else if (typeof data === 'string' && data) {
      errorMessage = data;
    }
    throw new ApiError(errorMessage, response.status, data);
  }

  // The API returns responses in the format { data: T, meta?: any }
  // We'll return the full object so callers can access meta if needed,
  // or just return the data property if meta isn't present.
  return data;
};
