import { fetchTimeAndDistance } from '../utils/api';

chrome.runtime.onMessage.addListener((message, sender, response) => {
  if (message.userLocations && message.listingLocations) {
    fetchTimeAndDistance(message.userLocations, message.listingLocations)
      .then((data) => {
        console.log(data);
        response(data);
      })
      .catch((err) => console.log(err));
  }

  return true;
});

