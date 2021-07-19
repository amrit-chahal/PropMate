import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { Box, Grid, InputBase, IconButton, Paper } from '@material-ui/core';
import './contentScript.css';
import {
  getUserLocationsInStorage,
  UserLocationItem,
  UserLocationItems
} from '../utils/storage';
import { InformationChip } from './InformationChip/InformationChip';
import { fetchTimeAndDistance, MapsData } from '../utils/api';

const App: React.FC<{}> = () => {
  const [userLocations, setUserLocations] = useState<UserLocationItems>([]);

  const [timeAndDistanceInfoArray, setTimeAndDistanceInfoArray] = useState<
    string[]
  >([]);
  useEffect(() => {
    getUserLocationsInStorage().then((userLocations) => {
      console.log(userLocations);
      setUserLocations(userLocations);
      chrome.runtime.sendMessage(
        {
          userLocations: userLocations,
          listingLocations: ['porirua']
        },
        (response) => {
          console.log(response);
          setTimeAndDistanceInfoArray((prevTimeAndDistanceInfoArray) => [
            ...prevTimeAndDistanceInfoArray,
            ...TimeAndDistanceInfoArrayFromResponse(userLocations, response)
          ]);
        }
      );
    });
  }, []);

  const TimeAndDistanceInfoArrayFromResponse = (
    userLocations: UserLocationItems,
    data: MapsData
  ): string[] => {
    const infoArray: string[] = [];
    for (var i = 0; i < data.rows.length; i++) {
      const title = userLocations[i];
      for (var j = 0; j < data.rows[i].elements.length; j++) {
        infoArray.push(
          `${userLocations[i].locationTitle}: ${data.rows[i].elements[j].distance.text}, ${data.rows[i].elements[j].duration.text}`
        );
      }
    }

    return infoArray;
  };

  return (
    <div>
      {timeAndDistanceInfoArray.map((item, index) => (
        <InformationChip timeAndDistanceInformaton={item} key={index} />
      ))}
    </div>
  );
};

window.addEventListener('load', () => {
  const root = document.createElement('div');
  const element: HTMLElement | null = document.querySelector(
    '.tm-property-listing-body__location'
  );
  element!.appendChild(root);
  ReactDOM.render(<App />, root);
});
