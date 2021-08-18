/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/utils/api.ts":
/*!**************************!*\
  !*** ./src/utils/api.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "fetchTimeAndDistance": () => (/* binding */ fetchTimeAndDistance),
/* harmony export */   "checkForValidAddress": () => (/* binding */ checkForValidAddress)
/* harmony export */ });
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const MAPS_API_KEY = "AIzaSyAdOskc_QLpLZ9xrV-mv1Er3Da1jDtFuqI";
function fetchTimeAndDistance(userLocations, listingLocations) {
    return __awaiter(this, void 0, void 0, function* () {
        const userLocationsToString = userLocations
            .map((item) => item.userLocation)
            .join('|');
        const listingLocationsToString = listingLocations
            .map((item) => item)
            .join('|');
        const res = yield fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=
    ${userLocationsToString}&destinations=${listingLocationsToString}&key=${MAPS_API_KEY}`);
        if (!res.ok) {
            throw new Error('Sorry something went wrong :(');
        }
        const data = yield res.json();
        return data;
    });
}
function checkForValidAddress(address) {
    return __awaiter(this, void 0, void 0, function* () {
        let isValidAddress = false;
        let addressFromResponse = address;
        const res = yield fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=
    ${address}&destinations=auckland%20newzealand&key=${MAPS_API_KEY}`);
        if (res.ok) {
            const data = yield res.json();
            if (data.rows[0].elements[0].status === 'OK') {
                isValidAddress = true;
                addressFromResponse = data.origin_addresses[0];
                return { isValidAddress, addressFromResponse };
            }
        }
        return { isValidAddress, addressFromResponse };
    });
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**************************************!*\
  !*** ./src/background/background.ts ***!
  \**************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils_api__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/api */ "./src/utils/api.ts");

chrome.runtime.onMessage.addListener((message, sender, response) => {
    if (message.userLocations && message.listingLocations) {
        console.log(message.userLocations, message.listingLocation);
        (0,_utils_api__WEBPACK_IMPORTED_MODULE_0__.fetchTimeAndDistance)(message.userLocations, message.listingLocations)
            .then((data) => {
            response(data);
        })
            .catch((err) => console.log(err));
    }
    return true;
});

})();

/******/ })()
;
//# sourceMappingURL=background.js.map