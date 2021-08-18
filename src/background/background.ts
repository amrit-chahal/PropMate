import { fetchTimeAndDistance } from '../utils/api';

chrome.runtime.onMessage.addListener((message, sender, response) => {
  if (message.userLocations && message.listingLocations) {
    console.log(message.userLocations, message.listingLocation);
    fetchTimeAndDistance(message.userLocations, message.listingLocations)
      .then((data) => {
        response(data);
      })
      .catch((err) => console.log(err));
  }

  return true;
});

