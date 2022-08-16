import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { Box } from '@material-ui/core';

import './contentScript.css';
import {
  getIsExtensionEnabledInStorage,
  getUserLocationsInStorage,
  UserLocationItems
} from '../utils/storage';

import { MapsData } from '../utils/api';
import InformationChip from './InformationChip';

const App: React.FC<{ listingLocations: (string | null)[] }> = ({
  listingLocations
}) => {
  const [timeAndDistanceInfoArray, setTimeAndDistanceInfoArray] = useState<
    string[]
  >([]);
  useEffect(() => {
    getIsExtensionEnabledInStorage().then((isExtensionEnabled) => {
      if (isExtensionEnabled) {
        getUserLocationsInStorage().then((userLocations) => {
          chrome.runtime.sendMessage(
            {
              userLocations: userLocations,
              listingLocations: listingLocations
            },
            (response) => {
              if (response) {
                console.log(response);
                setTimeAndDistanceInfoArray((prevTimeAndDistanceInfoArray) => [
                  ...prevTimeAndDistanceInfoArray,
                  ...TimeAndDistanceInfoArrayFromResponse(
                    userLocations,
                    response
                  )
                ]);
              } else {
                setTimeAndDistanceInfoArray(['Error: Unable to retrieve info']);
              }
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
        infoArray.push(
          `Error: Address not found for ${userLocations[i].locationTitle} `
        );
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

let isExtensionEnabled = true;
getIsExtensionEnabledInStorage().then((res) => {
  isExtensionEnabled = res;
  console.log('extension enabled');
});

if (isExtensionEnabled && document.readyState !== 'complete') {
  document.addEventListener('readystatechange', function (event) {
    if (this.readyState === 'complete') {
      const observer = new MutationObserver(() => {
        const listingContainers = Array.from(
          document.getElementsByClassName(
            'tm-property-premium-listing-card__details-container'
          ) as HTMLCollectionOf<HTMLElement>
        );
        if (listingContainers && listingContainers.length > 0) {
          listingContainers.forEach((element) => {
            element.style.height = 'fit-content';
          });
        }
        let url: string = window.location.toString();
        console.log(url);
        // const isRentalUrl = /.*trademe.co.nz.*\/residential\/rent\/.*/.test(
        //   url
        // );
        const isTmRentalSearchUrl =
          /.*trademe.co.nz.*\/residential\/rent.*search.*/.test(url);
        const isTmSaleSearchUrl =
          /.*trademe.co.nz.*\/residential\/sale.*search.*/.test(url);
        const isListingUrl = /.*\/(rent|sale)\/.*listing.*/.test(url);
        const isWatchlistUrl = /.*watchlist/.test(url);
        const isMyRentUrl = /.*myrent.co.nz.*/.test(url);
        const isOneRoofUrl = /.*oneroof.co.nz\/[^search].*/.test(url);
        const isRealestateListingUrl = /.*realestate.co.nz\/\d{3,9}\/.*/.test(
          url
        );
        const isRealestateUrl = /.*realestate.co.nz\/residential.*/.test(url);

        let propertyAddresses = null;

        if (isWatchlistUrl || isTmRentalSearchUrl) {
          propertyAddresses = document.querySelectorAll(
            'tm-property-search-card-listing-title'
          );
          console.log('watchlist or tmsearchurl');
        } else if (isTmSaleSearchUrl) {
          propertyAddresses = document.querySelectorAll(
            'tm-property-search-card-address-subtitle'
          );
        } else if (isListingUrl) {
          propertyAddresses = document.querySelectorAll(
            '.tm-property-listing-body__location'
          );
          console.log('tm listing url');
        } else if (isMyRentUrl) {
          propertyAddresses = document.querySelectorAll(
            'div.listing__header-title'
          );
          console.log('my rent url');
        } else if (isOneRoofUrl) {
          propertyAddresses = document.querySelectorAll(
            'div.house-info > div.address'
          );
          console.log('oneroof url');
        } else if (isRealestateListingUrl) {
          propertyAddresses = document.querySelectorAll(
            "[data-test='listing-title']"
          );
          console.log('real estate listing');
        } else if (isRealestateUrl) {
          propertyAddresses = document.querySelectorAll(
            "[data-test='tile__search-result__content__description'] > h3"
          );
          console.log(' real estate search url');
        }

        if (propertyAddresses && propertyAddresses.length > 0) {
          propertyAddresses!.forEach((element) => {
            if (!document.querySelector('.MuiChip-label')) {
              observer.disconnect();

              const listingLocations = [element.textContent];
              const root = document.createElement('div');
              element.appendChild(root);
              console.log('hello from content script');
              console.log(element.textContent);
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
