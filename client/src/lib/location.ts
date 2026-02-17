export interface Location {
  lat: number;
  lng: number;
  address?: string;
}

export const getCurrentLocation = (): Promise<Location> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        // Fallback to dummy location if permission denied
        resolve({
          lat: 28.6139, // Delhi coordinates as fallback
          lng: 77.2090,
          address: 'Delhi, India'
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  });
};

export const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
  // Dummy implementation - in real app, use Google Maps API
  const dummyAddresses = [
    'Connaught Place, New Delhi',
    'Karol Bagh, New Delhi',
    'Lajpat Nagar, New Delhi',
    'Rajouri Garden, New Delhi',
    'Dwarka, New Delhi'
  ];
  
  return dummyAddresses[Math.floor(Math.random() * dummyAddresses.length)];
};