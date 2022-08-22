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
import {
  changeElementStyleToFitContent,
  propertyAddressIdentifierFromUrl
} from '../utils/contentScriptHelper';

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
const observerConfig = {
  childList: true,
  subtree: true,
  characterData: true,
  attributes: true
};
const mutationObserver = new MutationObserver(
  getAddressesFromPageAndInsertTimeAndDistanceInformation
);
function observeMutationsAndAddInformation() {
  mutationObserver.observe(document, observerConfig);
}
function getAddressesFromPageAndInsertTimeAndDistanceInformation() {
  const url: string = window.location.href;
  const propertyAddressIdentifierObject = propertyAddressIdentifierFromUrl(url);

  const propertyAddressIdentifier =
    propertyAddressIdentifierObject?.propertyAddressIdentifier as keyof HTMLElementTagNameMap;
  if (
    propertyAddressIdentifierObject?.name === 'TmSaleUrl' ||
    propertyAddressIdentifierObject?.name === 'TmRentalUrl'
  ) {
    const listingContainers = Array.from(
      document.getElementsByClassName(
        'tm-property-premium-listing-card__details-container'
      ) as HTMLCollectionOf<HTMLElement>
    );
    changeElementStyleToFitContent(listingContainers);
  }

  const propertyAddresses: NodeListOf<Element> = document.querySelectorAll(
    propertyAddressIdentifier
  );
  const isAddressNotInserted = !document.querySelector('.MuiChip-label');

  if (propertyAddresses && propertyAddresses.length > 0) {
    propertyAddresses!.forEach((element) => {
      if (isAddressNotInserted) {
        mutationObserver.disconnect();

        const listingLocations = [element.textContent];
        const root = document.createElement('div');
        element.appendChild(root);
        console.log('hello from content script');
        console.log(element.textContent);
        ReactDOM.render(<App listingLocations={listingLocations} />, root);
        setTimeout(() => {
          observeMutationsAndAddInformation();
        }, 3000);
      }
    });
  }
}

if (isExtensionEnabled && document.readyState !== 'complete') {
  document.addEventListener('readystatechange', function (event) {
    if (this.readyState === 'complete') {
      observeMutationsAndAddInformation();
    }
  });
}
