/**
 *
 *
 */

interface UrlPatternAndElementIdentifier {
  name: string;
  regex: RegExp;
  propertyAddressIdentifier: string;
}

const urlObjects: UrlPatternAndElementIdentifier[] = [
  // {
  //   name: 'TmSaleUrl',
  //   regex: /^(?!.*listing).*trademe.co.nz.*\/residential\/sale.*/,
  //   propertyAddressIdentifier: 'tm-property-search-card-address-subtitle'
  // },
  // {
  //   name: 'TmRentalUrl',
  //   regex: /^(?!.*listing).*trademe.co.nz.*\/residential\/rent.*/,
  //   propertyAddressIdentifier: 'tm-property-search-card-listing-title'
  // },
  {
    name: 'TmWatchlistUrl',
    regex: /.*trademe.co.nz.*watchlist/,
    propertyAddressIdentifier: 'tm-property-search-card-listing-title'
  },
  {
    name: 'TmListingUrl',
    regex: /.*trademe.co.nz\/a\/property.*listing.*/,
    propertyAddressIdentifier: '.tm-property-listing-body__location'
  },
  {
    name: 'MyRentUrl',
    regex: /.*myrent.co.nz.*/,
    propertyAddressIdentifier: 'div.listing__header-title'
  },
  {
    name: 'OneroofUrl',
    regex: /.*oneroof.co.nz\/[^search].*/,
    propertyAddressIdentifier: 'div.house-info > div.address'
  },
  {
    name: 'RealestateNzListingUrl',
    regex: /.*realestate.co.nz\/\d{3,9}\/.*/,
    propertyAddressIdentifier: "[data-test='listing-title']"
  },
  {
    name: 'RealestateNzUrl',
    regex: /.*realestate.co.nz\/residential.*/,
    propertyAddressIdentifier:
      "[data-test='tile__search-result__content__description'] > h3"
  }
];
export function propertyAddressIdentifierFromUrl(
  url: string
): UrlPatternAndElementIdentifier | undefined {
  const identifierObject = urlObjects.find(
    (element) => element.regex.test(url) === true
  );

  return identifierObject;
}

export function changeElementStyleToFitContent(elements: HTMLElement[]) {
  if (elements && elements.length > 0) {
    elements.forEach((element) => {
      element.style.height = 'fit-content';
    });
  }
}
// export function propertyAddressesFromUrl(
//   url: string
// ): NodeListOf<Element> | null {
//   const isTmRentalUrl = /.*trademe.co.nz.*\/residential\/rent.*/.test(url);
//   const isTmSaleUrl = /.*trademe.co.nz.*\/residential\/sale.*/.test(url);
//   const isTmListingUrl = /.*\/(rent|sale)\/.*listing.*/.test(url);
//   const isTmWatchlistUrl = /.*trademe.co.nz.*watchlist/.test(url);
//   const isMyRentUrl = /.*myrent.co.nz.*/.test(url);
//   const isOneRoofUrl = /.*oneroof.co.nz\/[^search].*/.test(url);
//   const isRealestateListingUrl = /.*realestate.co.nz\/\d{3,9}\/.*/.test(url);
//   const isRealestateUrl = /.*realestate.co.nz\/residential.*/.test(url);

//   let propertyAddresses: NodeListOf<Element> | null = null;

//   if (isTmWatchlistUrl || isTmRentalUrl) {
//     propertyAddresses = document.querySelectorAll(
//       'tm-property-search-card-listing-title'
//     );
//   } else if (isTmSaleUrl) {
//     propertyAddresses = document.querySelectorAll(
//       'tm-property-search-card-address-subtitle'
//     );
//   } else if (isTmListingUrl) {
//     propertyAddresses = document.querySelectorAll(
//       '.tm-property-listing-body__location'
//     );
//   } else if (isMyRentUrl) {
//     propertyAddresses = document.querySelectorAll('div.listing__header-title');
//   } else if (isOneRoofUrl) {
//     propertyAddresses = document.querySelectorAll(
//       'div.house-info > div.address'
//     );
//   } else if (isRealestateListingUrl) {
//     propertyAddresses = document.querySelectorAll(
//       "[data-test='listing-title']"
//     );
//   } else if (isRealestateUrl) {
//     propertyAddresses = document.querySelectorAll(
//       "[data-test='tile__search-result__content__description'] > h3"
//     );
//   }
//   return propertyAddresses;
// }
