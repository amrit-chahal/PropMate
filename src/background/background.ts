/**
 * listens to messages from content script that includes userdefined address and address from webpage and returns time and distance information back to content script via message
 */
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
