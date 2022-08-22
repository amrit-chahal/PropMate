const url =
  'https://www.trademe.co.nz/a/property/residential/sale/listing/search?bedrooms_min=2';
const regex = {
  trademeRegex: /^(?!.*listing).*trademe.co.nz.*\/residential\/sale.*/
};
console.log(regex.trademeRegex.test(url));
