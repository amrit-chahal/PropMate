import React from 'react';
import ReactDOM from 'react-dom';
import './popup.css';
import LocationCard from './LocationCard';

const App: React.FC<{}> = () => {
  return (
    <div>
      <LocationCard userLocation='pipitea' listingLocation='porirua' />
    </div>
  );
};
const root = document.createElement('div');
document.body.appendChild(root);
ReactDOM.render(<App />, root);
