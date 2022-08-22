# Propmate beta

Enhancing Trademe property (and other NZ realty websites) browsing experience

## Use:

Propmate is a chrome extension that adds time and distance information to property listings listed on New Zealand's most popular website TradeMe using google places api. It displays infromation based on list of addresses provided by the user and the address extracted from the listing.

## Features:

- store upto five addresses(limit imposed due to limited number of api calls)
- toggle on/off extension
- display time and distance information on each listing based on user defined locations
- update or delete stored addresses

## Installation:
Chromium based browsers: This extension is compatible with chromium based web browsers i.e. Chrome, Brave, Edge, Vivaldi, Opera etc. To install on these browser you can visit [Chrome webstore](https://chrome.google.com/webstore/category/extensions) and search for "Propmate" and click on the first result.Then click the blue 'Add to Chrome' button and click 'add extension' on the popup. Alternatively you can click this direct [Chrome Webstore Link](https://chrome.google.com/webstore/detail/propmate/oodjdpgcgaoblokiamiiahbacijaeaab) nd use the same installation process described earlier.
Mozilla firefox: This extension is also compatible with Mozilla firefox browser and in theory should be compatible with any browser based on Mozilla(Gecko) engine. To install you can visit [Mozilla addon store](https://addons.mozilla.org/en-US/firefox/) and search for "Propmate" and click on first result. Then click the blue 'Add to firefox' button and click 'add' on the popup. Alternatively you can click direct [Mozilla addon store link](https://addons.mozilla.org/en-US/firefox/addon/propmate/) and use the same installation process described earlier.

## Future Roadmap:

- Allow users to copy address from webpage and save to addresses using context menu
- fetch property valuation from valuation websties and rental stats for rental listings
- feedback and feature request landing page


## Attributes:

- [Propmate store Icon](https://www.flaticon.com/)
- [Automating Chrome webstore deployment](https://blog.ganeshjaiwal.dev/automate-chrome-extension-publish-using-an-automated-script#lets-change-our-extension-folder-structure)

## Developer Notes:
The code is free to use and modify. To get the code running in your editor
- Fork the repo
- run:   ```npm install```
- run: ```npm run start ```  for development build
- run ``` npm run build ``` for production build

You will need your own google api key in order for the app to make api calls. 
For automatic publishing to chrome store you will need your own refresh token.




