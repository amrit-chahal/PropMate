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
import { MapsData } from '../utils/api';
import { ChildCareOutlined } from '@material-ui/icons';

const App: React.FC<{}> = () => {
  const [userLocations, setUserLocations] = useState<UserLocationItems>([]);
  const listingLocation = useRef<string | null | undefined>('');

  const [timeAndDistanceInfoArray, setTimeAndDistanceInfoArray] = useState<
    string[]
  >([]);
  useEffect(() => {
    getUserLocationsInStorage().then((userLocations) => {
      console.log(userLocations);
      setUserLocations(userLocations);
      listingLocation.current = document.querySelector(
        '.tm-property-listing-body__location'
      )?.textContent;
      console.log(listingLocation.current);
      chrome.runtime.sendMessage(
        {
          userLocations: userLocations,
          listingLocations: [listingLocation.current]
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

if (document.readyState !== 'complete') {
  document.addEventListener('readystatechange', function (event) {
    console.log('event listner loaded');

    if (this.readyState === 'complete') {
      const observer = new MutationObserver(() => {
        const element: HTMLElement | null = document.querySelector(
          '.tm-property-listing-body__location'
        );
        const chipLabel: HTMLElement | null =
          document.querySelector('.MuiChip-label');
        if (!chipLabel && element) {
          console.log('element found');
          observer.disconnect();

          const root = document.createElement('div');
          console.log('root injected');
          element.appendChild(root);
          ReactDOM.render(<App />, root);
          setTimeout(() => {
            observe();
          }, 3000);
        }
      });
      observe();
      function observe() {
        observer.observe(document, {
          childList: true,
          subtree: true,
          characterData: true,
          attributes: true
        });
      }
    }
  });
}
