import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import './popup.css';
import LocationCard from './LocationCard';
import { Box, Grid, InputBase, IconButton, Paper } from '@material-ui/core';
import { AddCircle as AddIcon } from '@material-ui/icons';
import {
  setUserLocationsInStorage,
  getUserLocationsInStorage
} from '../utils/storage';
import GoogleMaps from '../utils/autoComplete';

const App: React.FC<{}> = () => {
  const listingLocationRef = useRef('Auckland');
  const [userLocations, setUserLocations] = useState<string[]>([]);
  const [locationInput, setLocationInput] = useState<string>('');
  useEffect(() => {
    getUserLocationsInStorage().then((userLocations) =>
      setUserLocations(userLocations)
    );
  }, []);
  const handleAddLocationBtnClick = () => {
    if (locationInput === '') {
      return;
    }
    setUserLocations((previousUserLocations) => [
      ...previousUserLocations,
      locationInput
    ]);
    setLocationInput((previousLocationInput) => (previousLocationInput = ''));

    setUserLocationsInStorage([...userLocations, locationInput]);

    console.log(userLocations);
  };
  const handleLocationDeleteBtnClick = (index: number) => {
    userLocations.splice(index, 1);
    setUserLocations((prevUserlocations) => [...prevUserlocations]);
    setUserLocationsInStorage(userLocations);
  };
  return (
    <div>
      <Box mx='4px' my='8px'>
        <Paper>
          <Box px='16px' py='4px'>
            <Grid
              container
              direction='row'
              justifyContent='center'
              alignItems='center'
            >
              <Grid item xs={8}>
                <InputBase
                  placeholder='enter address here...'
                  value={locationInput}
                  onChange={(event) =>
                    setLocationInput((input) => (input = event.target.value))
                  }
                  onKeyUp={(event) => {
                    if (event.key === 'Enter') {
                      handleAddLocationBtnClick();
                    }
                  }}
                />
              </Grid>
              <Grid item xs={2}></Grid>
              <Grid item xs={2}>
                <IconButton onClick={handleAddLocationBtnClick}>
                  <AddIcon color='primary' />
                </IconButton>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>
      {userLocations.map((location, index) => (
        <LocationCard
          userLocation={location}
          listingLocation={listingLocationRef.current}
          key={index}
          onDelete={() => handleLocationDeleteBtnClick(index)}
          onEdit={() => {}}
        />
      ))}
      <Box height='8px'></Box>
    </div>
  );
};
const root = document.createElement('div');
document.body.appendChild(root);
ReactDOM.render(<App />, root);
