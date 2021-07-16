import { setUserLocationsInStorage } from '../utils/storage';

chrome.runtime.onInstalled.addListener(() => {
  setUserLocationsInStorage([]);
});
