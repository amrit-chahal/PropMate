import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { fetchTimeAndDistance } from '../../utils/api';

export const LocationCard: React.FC<{
  userLocation: string;
  listingLocation: string;
}> = ({ userLocation, listingLocation }) => {
  useEffect(() => {
    fetchTimeAndDistance(userLocation, listingLocation)
      .then((data) => {
        console.log(data.rows[0].elements[0].distance.text);
      })
      .catch((error) => console.log(error));
  }, [userLocation,listingLocation]);
  return <div></div>;
};
