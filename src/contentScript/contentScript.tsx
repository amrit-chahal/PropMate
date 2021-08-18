import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { Box } from '@material-ui/core';

import './contentScript.css';
import {
  getIsExtensionEnabledInStorage,
  getUserLocationsInStorage,
  UserLocationItems
} from '../utils/storage';
import { InformationChip } from './InformationChip/InformationChip';
import { MapsData } from '../utils/api';

const App: React.FC<{ listingLocations: (string | null)[] }> = ({
  listingLocations
}) => {
  const [isExtensionEnabled, setIsExtensionEnabled] = useState<boolean>(true);

  const [timeAndDistanceInfoArray, setTimeAndDistanceInfoArray] = useState<
    string[]
  >([]);
  useEffect(() => {
    getIsExtensionEnabledInStorage().then((isExtensionEnabled) => {
      setIsExtensionEnabled(isExtensionEnabled);
      console.log(isExtensionEnabled);
      if (isExtensionEnabled) {
        getUserLocationsInStorage().then((userLocations) => {
          console.log(userLocations);
          console.log(listingLocations);
          chrome.runtime.sendMessage(
            {
              userLocations: userLocations,
              listingLocations: listingLocations
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
      }
    });
  }, []);

  const TimeAndDistanceInfoArrayFromResponse = (
    userLocations: UserLocationItems,
    data: MapsData
  ): string[] => {
    const infoArray: string[] = [];
    for (var i = 0; i < data.rows.length; i++) {
      if (data.rows[i].elements[0].status === 'OK') {
        for (var j = 0; j < data.rows[i].elements.length; j++) {
          infoArray.push(
            `${userLocations[i].locationTitle}: ${data.rows[i].elements[j].distance.text}, ${data.rows[i].elements[j].duration.text}`
          );
        }
      } else
        infoArray.push(`${userLocations[i].locationTitle}: Address not found`);
    }

    return infoArray;
  };

  return (
    <div>
      <Box display='flex' mb='5px' flexWrap='wrap'>
        {timeAndDistanceInfoArray.map((item, index) => (
          <InformationChip timeAndDistanceInformaton={item} key={index} />
        ))}
      </Box>
    </div>
  );
};

if (document.readyState !== 'complete') {
  document.addEventListener('readystatechange', function (event) {
    console.log('event listner loaded');

    if (this.readyState === 'complete') {
      const observer = new MutationObserver(() => {
        let url = window.location.toString();
        const isRentalUrl = /.*residential\/rent\/(?!.*listing).*/.test(url);
        const isSaleUrl = /.*residential\/sale\/(?!.*listing).*/.test(url);
        const isListingUrl = /.*(rent|sale).*listing.*/.test(url);
        let propertyAddresses = null;
        console.log(
          `Listing page: ${isListingUrl} Sale page:${isSaleUrl} Rental page: ${isRentalUrl}`
        );
        const listingContainers = Array.from(
          document.getElementsByClassName(
            'tm-property-premium-listing-card__details-container'
          ) as HTMLCollectionOf<HTMLElement>
        );
        if (listingContainers && listingContainers.length > 0) {
          listingContainers.forEach((element) => {
            element.style.height = 'fit-content';
            console.log('container changed');
          });
        }

        if (isRentalUrl) {
          propertyAddresses = document.querySelectorAll(
            'tm-property-search-card-listing-title'
          );
          if (propertyAddresses && propertyAddresses.length > 0) {
            propertyAddresses!.forEach((element) => {
              if (!document.querySelector('.MuiChip-label')) {
                observer.disconnect();
                const listingLocations = [element.textContent];
                const root = document.createElement('div');
                console.log('root injected');
                element.appendChild(root);
                ReactDOM.render(
                  <App listingLocations={listingLocations} />,
                  root
                );
                setTimeout(() => {
                  observe();
                }, 3000);
              }
            });
          }
        } else if (isSaleUrl) {
          propertyAddresses = document.querySelectorAll(
            'tm-property-search-card-address-subtitle'
          );
          if (propertyAddresses && propertyAddresses.length > 0) {
            propertyAddresses!.forEach((element) => {
              if (!document.querySelector('.MuiChip-label')) {
                observer.disconnect();
                const listingLocations = [element.textContent];
                const root = document.createElement('div');
                console.log('root injected');
                element.appendChild(root);
                ReactDOM.render(
                  <App listingLocations={listingLocations} />,
                  root
                );
                setTimeout(() => {
                  observe();
                }, 3000);
              }
            });
          }
        } else if (isListingUrl) {
          const listingLocation: HTMLElement | null = document.querySelector(
            '.tm-property-listing-body__location'
          );

          if (!document.querySelector('.MuiChip-label') && listingLocation) {
            console.log('listingLocation found');
            observer.disconnect();
            const listingLocations = [listingLocation.textContent];
            const root = document.createElement('div');
            console.log('root injected');
            console.log(listingLocation);
            listingLocation.appendChild(root);
            ReactDOM.render(<App listingLocations={listingLocations} />, root);
            setTimeout(() => {
              observe();
            }, 3000);
          }
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
