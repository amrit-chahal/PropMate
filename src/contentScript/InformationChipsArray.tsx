/**
 * array of individual chips to display  tnd information
 */
import React, { useEffect, useState } from 'react';
import { Box } from '@material-ui/core';
import {
  getIsExtensionEnabledInStorage,
  getUserLocationsInStorage,
  UserLocationItems
} from '../utils/storage';
import { MapsData } from '../utils/api';
import InformationChip from './InformationChip';
const InformationChipsArray: React.FC<{
  listingLocations: (string | null)[];
}> = ({ listingLocations }) => {
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
                setTimeAndDistanceInfoArray((prevTimeAndDistanceInfoArray) => [
                  ...prevTimeAndDistanceInfoArray,
                  ...TimeAndDistanceInfoArrayFromResponse(
                    userLocations,
                    response
                  )
                ]);
              } else {
                setTimeAndDistanceInfoArray(['Error: Daily Quota Exceeded']);
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
export default InformationChipsArray;
