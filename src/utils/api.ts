import { UserLocationItem } from './storage';

const MAPS_API_KEY = process.env.MAPS_API_KEY;

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
  userLocations: UserLocationItem[],
  listingLocations: string[]
): Promise<MapsData> {
  const userLocationsToString = userLocations
    .map((item) => item.userLocation)
    .join('|');
  const listingLocationsToString = listingLocations
    .map((item) => item)
    .join('|');
  const res = await fetch(
    `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=
    ${userLocationsToString}&destinations=${listingLocationsToString}&key=${MAPS_API_KEY}`
  );

  if (!res.ok) {
    throw new Error('Sorry something went wrong :(');
  }

  const data: MapsData = await res.json();

  return data;
}

export async function checkForValidAddress(address: string): Promise<boolean> {
  const res = await fetch(
    `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=
    ${address}&destinations=auckland%20newzealand&key=${MAPS_API_KEY}`
  );
  if (res.ok) {
    const data: MapsData = await res.json();
    return data.rows[0].elements[0].status !== 'ZERO_RESULTS';
  }
  return false;
}
