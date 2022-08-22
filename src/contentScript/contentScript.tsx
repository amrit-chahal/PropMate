/**
 * waits for page load to complete and then adds mutation observers to watch for relevant elements
 * or attributes to get addresses, then sends the addresses to background script
 *  and recieves time and distance information and display below the listing/s
 */
import React from 'react';
import ReactDOM from 'react-dom';

import './contentScript.css';
import { getIsExtensionEnabledInStorage } from '../utils/storage';

import {
  changeElementStyleToFitContent,
  propertyAddressIdentifierFromUrl
} from '../utils/contentScriptHelper';
import InformationChipsArray from './InformationChipsArray';

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
        ReactDOM.render(
          <InformationChipsArray listingLocations={listingLocations} />,
          root
        );
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
