import fetch from 'node-fetch';

const BASE_URL = 'https://provinces.open-api.vn/api/';

export async function fetchOpenApiData(endpoint) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`);
    if (!response.ok) {
      throw new Error('Failed to fetch data from Open API');
    }
    return await response.json();
  } catch (error) {
    throw new Error(error.message || 'Error fetching data from Open API');
  }
}
