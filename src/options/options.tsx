import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import PlacesAutoComplete, {
  geocodeByAddress
} from 'react-places-autocomplete';

const MAPS_API_KEY = process.env.MAPS_API_KEY;

const App: React.FC<{}> = () => {
  const [address, setAddress] = useState('');
  const handleSelect = async (value: string) => {
    setAddress(value);
  };
  return (
    <div>
      <PlacesAutoComplete
        value={address}
        onChange={setAddress}
        onSelect={handleSelect}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div>
            <input {...getInputProps({ placeholder: 'Type address' })} />

            <div>
              {loading ? <div>...loading</div> : null}

              {suggestions.map((suggestion) => {
                const style = {
                  backgroundColor: suggestion.active ? '#41b6e6' : '#fff'
                };

                return (
                  <div {...getSuggestionItemProps(suggestion, { style })}>
                    {suggestion.description}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </PlacesAutoComplete>
    </div>
  );
};

const googleScript = `https://maps.googleapis.com/maps/api/js?key=${MAPS_API_KEY}&libraries=places`;
const script = document.createElement('script');
script.textContent = googleScript;
(document.head || document.documentElement).appendChild(script);
script.remove();
const root = document.createElement('div');
document.body.appendChild(root);
ReactDOM.render(<App />, root);
