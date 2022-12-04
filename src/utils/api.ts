import { UserLocationItem } from './storage';

const MAPS_API_KEY = process.env.MAPS_API_KEY!;

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
): Promise<MapsData | undefined> {
  const userLocationsToString = userLocations
    .map((item) => item.userLocation)
    .join('|');
  const listingLocationsToString = listingLocations.join('|');
  try {
    // const res = await fetch(
    //   `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=
    //   ${userLocationsToString}&destinations=${listingLocationsToString}&key=${MAPS_API_KEY}`
    // );
    const url = new URL(
      'https://maps.googleapis.com/maps/api/distancematrix/json'
    );
    url.searchParams.append('units', 'metric');
    url.searchParams.append('origins', userLocationsToString);
    url.searchParams.append('destinations', listingLocationsToString);
    url.searchParams.append('key', MAPS_API_KEY);
    const res = await fetch(url.toString());

    if (!res.ok) {
      return;
    }
    const data: MapsData = await res.json();
    if (data.status === 'OK') {
      return data;
    }
  } catch (e) {
    return;
  }
}

export async function checkForValidAddress(address: string) {
  let isValidAddress: boolean = false;
  let addressFromResponse: string = address;
  try {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=
      ${address}&destinations=auckland%20newzealand&key=${MAPS_API_KEY}`
    );
    if (res.ok) {
      const data: MapsData = await res.json();
      if (data.rows[0].elements[0].status === 'OK') {
        isValidAddress = true;
        addressFromResponse = data.origin_addresses[0];
      }
    }

    return { isValidAddress, addressFromResponse };
  } catch (e) {
    return { isValidAddress, addressFromResponse };
  }
}
