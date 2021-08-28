import { fetchTimeAndDistance } from '../utils/api';

chrome.runtime.onMessage.addListener((message, sender, response) => {
  if (message.userLocations && message.listingLocations) {
    fetchTimeAndDistance(message.userLocations, message.listingLocations)
      .then((data) => {
        response(data);
      })
      .catch((err) => response());
  }

  return true;
});
