const MAPS_API_KEY = 'AIzaSyBpFP18AqDjajnKCUAZDLhIAMKErjy6HuA';

export interface MapsData {
  destination_addresses: string[];
  origin_addresses: string[];
  rows: {
    elements: {
      distance: {
        text: string;
        value: number;
      };
      duration: {
        text: string;
        value: number;
      };
      status: string;
    }[];
  }[];
  status: string;
}

export async function fetchTimeAndDistance(
  userLocation: string,
  listingLocation: string
): Promise<MapsData> {
  const res = await fetch(
    `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=
    ${userLocation}&destinations=${listingLocation}&key=${MAPS_API_KEY}`
  );

  if (!res.ok) {
    throw new Error('Invalid Address');
  }

  const data: MapsData = await res.json();
  return data;
}
