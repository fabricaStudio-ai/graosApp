
export interface PexelsPhoto {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  photographer_url: string;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
  };
}

export async function searchPexelsPhotos(query: string, perPage: number = 10): Promise<PexelsPhoto[]> {
  // Use VITE_ prefix for client-side env vars in Vite
  const apiKey = (import.meta as any).env.VITE_PEXELS_API_KEY;
  
  if (!apiKey) {
    console.warn('PEXELS_API_KEY not found in environment variables.');
    return [];
  }

  try {
    const response = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${perPage}`, {
      headers: {
        Authorization: apiKey,
      },
    });

    if (!response.ok) {
      throw new Error(`Pexels API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.photos || [];
  } catch (error) {
    console.error('Error fetching from Pexels:', error);
    return [];
  }
}
